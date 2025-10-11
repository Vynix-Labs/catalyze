import type { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import env from "../../config/env";
import { userWallets, cryptoDeposits, balances, transactions } from "../../db/schema";
import { ensureUserWallet, transferWithChipi } from "../../utils/wallet/chipi";
import { validateSufficientBalance } from "../../utils/wallet/tokens";
import { toChainToken } from "../../config";
import type { CryptoCurrency } from "../../config";
import { validatePinToken } from "../../utils/pinToken";
import type { WalletData } from "@chipi-pay/chipi-sdk";

export class CryptoService {
  fastify: FastifyInstance;
  requiredConfirmations: number;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
    this.requiredConfirmations = Number(env.DEPOSIT_CONFIRMATIONS ?? 12);
  }

  /**
   * Get or create a wallet for a user
   */
  async getOrCreateUserWallet(userId: string, bearerToken: string, network = "starknet") {
    const [existing] = await this.fastify.db
      .select()
      .from(userWallets)
      .where(eq(userWallets.userId, userId));

    if (existing) return existing;

    const wallet = await ensureUserWallet(this.fastify, userId, network, bearerToken);
    return wallet;
  }

  async createDepositIntent({
    userId,
    tokenSymbol,
    network = "starknet",
    bearerToken,
  }: {
    userId: string;
    tokenSymbol: string;
    network?: string;
    bearerToken: string;
  }) {
    // TODO: won't work here
    const wallet = await this.getOrCreateUserWallet(userId, bearerToken, network);

    // Create a pending deposit record
    const depositId = randomUUID();
    const now = new Date();
    await this.fastify.db.insert(cryptoDeposits).values({
      id: depositId,
      userId,
      tokenSymbol,
      network: wallet.network!,
      depositAddress: wallet.publicKey,
      amountToken: "0",
      txHash: null,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    // Return deposit info
    return {
      id: depositId,
      depositAddress: wallet.publicKey,
      network: wallet.network,
      tokenSymbol,
      status: "pending",
    };
  }

  async getAddress(userId: string, bearerToken: string) {
    const w = await ensureUserWallet(this.fastify, userId, "starknet", bearerToken);
    return { address: w.publicKey, network: w.network };
  }

  async withdraw(userId: string, body: { tokenSymbol: string; amount: number; toAddress: string; pinToken: string }, bearerToken: string) {
    const symbol = body.tokenSymbol.toLowerCase() as CryptoCurrency;
    const { amount, toAddress, pinToken } = body;

    const pinValid = await validatePinToken(this.fastify, userId, pinToken, "crypto_withdraw");
    if (!pinValid) throw new Error("Invalid or expired PIN token");

    const wallet = await ensureUserWallet(this.fastify, userId, "starknet", bearerToken);

    const { isValid, message } = await validateSufficientBalance(wallet.publicKey, amount, symbol);
    if (!isValid) throw new Error(message);

    const reference = `CRW-${Date.now()}-${randomUUID()}`;

    // Record pending transaction
    await this.fastify.db.insert(transactions).values({
      id: randomUUID(),
      userId,
      type: "withdraw",
      subtype: "crypto",
      tokenSymbol: symbol,
      amountToken: amount.toString(),
      status: "processing",
      reference,
      metadata: { toAddress },
    });

    const tx = await transferWithChipi(wallet as unknown as WalletData, toAddress, amount, toChainToken(symbol), bearerToken);
    const txHash = typeof tx === "string"
      ? tx
      : (tx as { transaction_hash?: string; hash?: string }).transaction_hash ?? (tx as { hash?: string }).hash ?? "";

    await this.fastify.db
      .update(transactions)
      .set({ status: "completed", txHash, updatedAt: new Date() })
      .where(eq(transactions.reference, reference));

    return { reference, status: "completed", txHash };
  }

  async processDepositWebhook(payload: { txHash: string; tokenSymbol: string; network: string; from: string; to: string; amount: string; decimals?: number }) {
    const symbol = payload.tokenSymbol.toLowerCase() as CryptoCurrency;
    const [w] = await this.fastify.db.select().from(userWallets).where(eq(userWallets.publicKey, payload.to));
    if (!w) return; // address not recognized; ignore

    const amountToken = payload.amount; // assume human-readable already or provider sends adjusted; adapt if needed

    // Insert deposit record if not exists for txHash
    const [existing] = await this.fastify.db.select().from(cryptoDeposits).where(eq(cryptoDeposits.txHash, payload.txHash));
    if (!existing) {
      await this.fastify.db.insert(cryptoDeposits).values({
        id: randomUUID(),
        userId: w.userId,
        tokenSymbol: symbol,
        amountToken,
        network: w.network,
        depositAddress: w.publicKey,
        txHash: payload.txHash,
        status: "confirmed",
      });
    }

    // Credit off-chain balance
    const [bal] = await this.fastify.db.select().from(balances).where(and(eq(balances.userId, w.userId), eq(balances.tokenSymbol, symbol)));
    if (bal) {
      await this.fastify.db.update(balances).set({ balance: (Number(bal.balance) + Number(amountToken)).toString(), updatedAt: new Date() }).where(eq(balances.id, bal.id));
    } else {
      await this.fastify.db.insert(balances).values({ userId: w.userId, tokenSymbol: symbol, balance: amountToken });
    }

    // Record transaction
    await this.fastify.db.insert(transactions).values({
      id: randomUUID(),
      userId: w.userId,
      type: "deposit",
      subtype: "crypto",
      tokenSymbol: symbol,
      amountToken: amountToken,
      status: "completed",
      reference: `CRD-${Date.now()}-${randomUUID()}`,
      txHash: payload.txHash,
      metadata: payload,
    });
  }
}
