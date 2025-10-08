import { getStrategies } from "../../utils/troves/strategies";
import { approveWithChipi, withdrawVesuUsdc, stakeWithChipi } from "../../utils/wallet/chipi";
import { validateSufficientBalance } from "../../utils/wallet/tokens";
import { TransactionsService } from "../transactions/transactions.service";
import { db } from "../../plugins/db";
import type { WalletData } from "@chipi-pay/chipi-sdk";
import type { CryptoCurrency } from "../../config";
import { transactions, userWallets } from "../../db";
import { eq } from "drizzle-orm";

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
    const allowed: ReadonlyArray<CryptoCurrency> = ["usdt", "usdc", "strk", "eth", "weth", "wbtc"] as const;
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
        // Approve tokens for contract to spend
        await approveWithChipi(wallet as unknown as WalletData, contractAddress, amount, tokenSymbol, userId);

        // Perform staking using Chipi SDK
        const tx = await stakeWithChipi(wallet as unknown as WalletData, amount, userId, tokenSymbol, contractAddress, strategyId);
        const txHash = typeof tx === "string"
          ? tx
          : (tx as { transaction_hash?: string; hash?: string }).transaction_hash ?? (tx as { hash?: string }).hash ?? "";

        // Update transaction as completed
        await this.db
            .update(transactions)
            .set({ status: "completed", txHash })
            .where(eq(transactions.id, txRow.id));

        return {
            status: true,
            message: "Stake successful",
            txHash,
        };
    } catch (err: unknown) {
        // Handle failures gracefully
        await this.db
            .update(transactions)
            .set({ status: "failed", metadata: { error: err instanceof Error ? err.message : String(err) } })
            .where(eq(transactions.id, txRow.id));

        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`Stake failed: ${msg}`);
    }
  }


  async unstake(userId: string, wallet: WalletData, strategyId: string, amount: number) {
    const tx = await withdrawVesuUsdc(wallet, amount, userId);
    const txHash = typeof tx === "string"
      ? tx
      : (tx as { transaction_hash?: string; hash?: string }).transaction_hash ?? (tx as { hash?: string }).hash ?? "";
    await this.txSvc.createTransaction({
      userId,
      type: "unstake",
      subtype: "crypto",
      tokenSymbol: "usdc",
      amountToken: amount,
      status: "completed",
      txHash,
      metadata: { strategyId },
    });
    return { status: true, message: "Unstake successful", txHash };
  }
}
