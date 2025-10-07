import { getStrategies } from "../../utils/troves/strategies";
import { approveWithChipi, withdrawVesuUsdc } from "../../utils/wallet/chipi";
import { validateSufficientBalance } from "../../utils/wallet/tokens";
import { TransactionsService } from "../transactions/transactions.service";
import { db } from "../../plugins/db";

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
        where: { userId },
    });
    if (!wallet) throw new Error("User wallet not found");
    
    // Fetch and validate the staking strategy
    const strategies = await getStrategies();
    const strategy = strategies.find((s) => s.id === strategyId);
    if (!strategy) throw new Error("Invalid strategy selected");

    const tokenSymbol = strategy.depositToken?.[0]?.symbol?.toLowerCase() || "unknown";
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
        await approveWithChipi(wallet, contractAddress, amount, tokenSymbol as any, userId);

        // Perform staking using Chipi SDK
        const tx = await stakeWithChipi(wallet, amount, userId, tokenSymbol as any, contractAddress, strategyId);

        // Update transaction as completed
        await this.db
            .update("transactions")
            .set({ status: "completed", txHash: tx.transaction_hash })
            .where({ id: txRow.id });

        return {
            status: true,
            message: "Stake successful",
            txHash: tx.transaction_hash,
        };
    } catch (err: any) {
        // Handle failures gracefully
        await this.db
            .update("transactions")
            .set({ status: "failed", metadata: { error: err.message } })
            .where({ id: txRow.id });

        throw new Error(`Stake failed: ${err.message || err}`);
    }
  }


  async unstake(userId: string, wallet: any, strategyId: string, amount: number) {
    const tx = await withdrawVesuUsdc(wallet, amount, userId);
    await this.txSvc.createTransaction({
      userId,
      type: "unstake",
      subtype: "crypto",
      tokenSymbol: "usdc",
      amountToken: amount,
      status: "completed",
      txHash: tx.transaction_hash,
      metadata: { strategyId },
    });
    return { status: true, message: "Unstake successful", txHash: tx.transaction_hash };
  }

  async getUserBalance(walletAddress: string, strategyId: string) {
    // Placeholder — later  query vault contracts directly
    return { status: true, tokenSymbol: "USDC", stakedAmount: 0 };
  }
}
