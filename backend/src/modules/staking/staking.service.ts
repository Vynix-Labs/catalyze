import { getStrategies } from "../../utils/troves/strategies";
import { approveWithChipi, withdrawVesuUsdc, callContractWithChipi, stakeVesuUsdc } from "../../utils/wallet/chipi";
import { validateSufficientBalance } from "../../utils/wallet/tokens";
import { TransactionsService } from "../transactions/transactions.service";
import { db } from "../../plugins/db";
import type { WalletData } from "@chipi-pay/chipi-sdk";
import type { CryptoCurrency } from "../../config";
import { transactions, userWallets } from "../../db";
import { eq } from "drizzle-orm";
import { buildErc4626DepositCalls, buildErc4626WithdrawCalls, parseUnits } from "../../utils/troves/calls";
import { toTokenUnits } from "../../utils/wallet/tokens";

type Database = typeof db;

export class StakingService {
  db: Database;
  txSvc: TransactionsService;
  constructor(db: Database) {
    this.db = db;
    this.txSvc = new TransactionsService(db);
  }

  async listStrategies(opts: { page?: number; limit?: number; tokenSymbol?: string; sortBy?: string; sortDir?: "asc" | "desc"; }) {
    const page = Math.max(1, opts.page ?? 1);
    const limit = Math.max(1, Math.min(opts.limit ?? 10, 50));

    const strategies = await getStrategies();

    // Optionally filter by token
    let filtered = strategies;
    if (opts.tokenSymbol) {
        filtered = strategies.filter((s) =>
            s.depositToken?.some((t) => t.symbol.toLowerCase() === opts.tokenSymbol!.toLowerCase())
        );
    }

    // Sorting
    filtered.sort((a, b) => {
        const dir = opts.sortDir === "asc" ? 1 : -1;
        const key = opts.sortBy || "tvlUsd";
        return key === "apy"
            ? dir * (a.apy - b.apy)
            : key === "name"
            ? dir * a.name.localeCompare(b.name)
            : dir * (a.tvlUsd - b.tvlUsd);
    });

    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return {
        status: true,
        strategies: paginated.map((s) => ({
            id: s.id,
            name: s.name,
            apy: s.apy,
            tokenSymbol: s.depositToken?.[0]?.symbol || "UNKNOWN",
            tvlUsd: s.tvlUsd,
            contractAddress: s.contract?.[0]?.address || "",
            isAudited: s.isAudited,
        })),
        meta: { page, limit, total, totalPages },
    };
  }


  async stake(userId: string, strategyId: string, amount: number) {
    // Get user wallet
    const wallet = await this.db.query.userWallets.findFirst({
        where: eq(userWallets.userId, userId),
    });
    if (!wallet) throw new Error("User wallet not found");
    
    // Fetch and validate the staking strategy
    const strategies = await getStrategies();
    const strategy = strategies.find((s) => s.id === strategyId);
    if (!strategy) throw new Error("Invalid strategy selected");

    const lower = strategy.depositToken?.[0]?.symbol?.toLowerCase() || "";
    const allowed: ReadonlyArray<CryptoCurrency> = ["usdt", "usdc", "strk", "weth", "wbtc"];
    if (!allowed.includes(lower as CryptoCurrency)) {
      throw new Error("Unsupported token for strategy");
    }
    const tokenSymbol = lower as CryptoCurrency;
    const contractAddress = strategy.contract?.[0]?.address;
    if (!contractAddress) throw new Error("Strategy contract not found");

    // Validate user’s on-chain balance
    const { isValid, message } = await validateSufficientBalance(wallet.publicKey, amount, tokenSymbol);
    if (!isValid) throw new Error(message);

    // Record pending transaction before staking
    const txRow = await this.txSvc.createTransaction({
        userId,
        type: "stake",
        subtype: "crypto",
        tokenSymbol,
        amountToken: amount,
        status: "pending",
        metadata: { strategyId },
    });

    try {
      // Special-case: Vesu Fusion USDC — use Chipi specialized route for deposit
      if (tokenSymbol === "usdc" && strategy.id.toLowerCase().includes("vesu_fusion")) {
        const tx = await stakeVesuUsdc(wallet as unknown as WalletData, amount, userId);
        const txHash = typeof tx === "string"
          ? tx
          : (tx as { transaction_hash?: string; hash?: string }).transaction_hash ?? (tx as { hash?: string }).hash ?? "";
        await this.db.update(transactions).set({ status: "completed", txHash }).where(eq(transactions.id, txRow.id));
        return { status: true, message: "Stake successful", txHash };
      }

      // Generic ERC4626: attempt batched approve + deposit in a single Chipi call
      const token0 = strategy.depositToken?.[0];
      if (!token0) throw new Error("Strategy deposit token missing");
      const tokenAddr = token0.address;
      const decimals = token0.decimals;
      const amountWei = await toTokenUnits(amount, tokenSymbol, decimals);
      const calls = buildErc4626DepositCalls({
        vault: contractAddress,
        tokenAddr,
        receiver: wallet.publicKey,
        amountWei,
      });

      const tx = await callContractWithChipi(wallet as unknown as WalletData, contractAddress, calls, userId);
      const txHash = typeof tx === "string"
        ? tx
        : (tx as { transaction_hash?: string; hash?: string }).transaction_hash ?? (tx as { hash?: string }).hash ?? "";

      await this.db
        .update(transactions)
        .set({ status: "completed", txHash })
        .where(eq(transactions.id, txRow.id));

      return { status: true, message: "Stake successful", txHash };
    } catch (err: unknown) {
      console.warn("Batched approve+deposit failed, falling back to two-step:", err);
      // Fallback path: if batched multi-address call is not supported, do two-step
      try {
        const token0 = strategy.depositToken?.[0];
        if (!token0) throw new Error("Strategy deposit token missing");
        const tokenAddr = token0.address;
        const decimals = token0.decimals;
        const amountWei = await toTokenUnits(amount, tokenSymbol, decimals);

        // Approve via Chipi helper
        await approveWithChipi(wallet as unknown as WalletData, contractAddress, amount, tokenSymbol, userId);

        // Then deposit only (construct call directly to avoid array index)
        const depositOnly = buildErc4626DepositCalls({
          vault: contractAddress,
          tokenAddr,
          receiver: wallet.publicKey,
          amountWei,
        })
        .find(c => c.entrypoint === "deposit");
        if (!depositOnly) throw new Error("Failed to build deposit call");

        const tx = await callContractWithChipi(wallet as unknown as WalletData, contractAddress, [depositOnly], userId);
        const txHash = typeof tx === "string"
          ? tx
          : (tx as { transaction_hash?: string; hash?: string }).transaction_hash ?? (tx as { hash?: string }).hash ?? "";

        await this.db
          .update(transactions)
          .set({ status: "completed", txHash })
          .where(eq(transactions.id, txRow.id));

        return { status: true, message: "Stake successful", txHash };
      } catch (fallbackErr: unknown) {
        await this.db
          .update(transactions)
          .set({ status: "failed", metadata: { error: fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr) } })
          .where(eq(transactions.id, txRow.id));

        const msg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
        throw new Error(`Stake failed: ${msg}`);
      }
    }
  }


  async unstake(userId: string, strategyId: string, amount: number) {
    // Get user wallet
    const wallet = await this.db.query.userWallets.findFirst({ where: eq(userWallets.userId, userId) });
    if (!wallet) throw new Error("User wallet not found");

    // Fetch strategy
    const strategies = await getStrategies();
    const strategy = strategies.find((s) => s.id === strategyId);
    if (!strategy) throw new Error("Invalid strategy selected");

    const lower = strategy.depositToken?.[0]?.symbol?.toLowerCase() || "";
    const allowed: ReadonlyArray<CryptoCurrency> = ["usdt", "usdc", "strk", "weth", "wbtc"] as const;
    if (!allowed.includes(lower as CryptoCurrency)) {
      throw new Error("Unsupported token for strategy");
    }
    const tokenSymbol = lower as CryptoCurrency;
    const contractAddress = strategy.contract?.[0]?.address;
    if (!contractAddress) throw new Error("Strategy contract not found");

    // Record pending tx
    const txRow = await this.txSvc.createTransaction({
      userId,
      type: "unstake",
      subtype: "crypto",
      tokenSymbol,
      amountToken: amount,
      status: "pending",
      metadata: { strategyId },
    });

    try {
      // Special-case: Vesu USDC
      if (tokenSymbol === "usdc" && strategy.id.toLowerCase().includes("vesu_fusion")) {
        const tx = await withdrawVesuUsdc(wallet as unknown as WalletData, amount, userId);
        const txHash = typeof tx === "string" ? tx : (tx as { transaction_hash?: string; hash?: string }).transaction_hash ?? (tx as { hash?: string }).hash ?? "";
        await this.db.update(transactions).set({ status: "completed", txHash }).where(eq(transactions.id, txRow.id));
        return { status: true, message: "Unstake successful", txHash };
      }

      // Generic ERC4626 withdraw
      const token0 = strategy.depositToken?.[0];
      if (!token0) throw new Error("Strategy deposit token missing");
      const decimals = token0.decimals;
      const amountWei = parseUnits(amount, decimals);
      const calls = buildErc4626WithdrawCalls({
        vault: contractAddress,
        receiver: wallet.publicKey,
        owner: wallet.publicKey,
        amountWei,
      });
      const tx = await callContractWithChipi(wallet as unknown as WalletData, contractAddress, calls, userId);
      const txHash = typeof tx === "string" ? tx : (tx as { transaction_hash?: string; hash?: string }).transaction_hash ?? (tx as { hash?: string }).hash ?? "";

      await this.db.update(transactions).set({ status: "completed", txHash }).where(eq(transactions.id, txRow.id));
      return { status: true, message: "Unstake successful", txHash };
    } catch (err: unknown) {
      await this.db
        .update(transactions)
        .set({ status: "failed", metadata: { error: err instanceof Error ? err.message : String(err) } })
        .where(eq(transactions.id, txRow.id));
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Unstake failed: ${msg}`);
    }
  }
}
