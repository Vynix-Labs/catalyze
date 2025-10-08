import type { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import env from "../../config/env";
import { userWallets, cryptoDeposits, balances, transactions } from "../../db/schema";
// import { fromTokenUnits, getTokenDecimals } from "../../utils/wallet/tokens";
import { createWallet } from "../../utils/wallet/chipi";
// import { WebhookBody } from "./deposit.schema";

export class CryptoDepositService {
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

    const wallet = await createWallet(userId);
    const row = {
      id: randomUUID(),
      userId,
      network,
      publicKey: wallet.publicKey,
      encryptedPrivateKey: wallet.encryptedPrivateKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.fastify.db.insert(userWallets).values(row);
    return row;
  }

  async createDepositIntent({
    userId,
    tokenSymbol,
    network = "starknet",
    addressType,
  }: {
    userId: string;
    tokenSymbol: string;
    network?: string;
    addressType?: string;
  }) {
    // Get user wallet
    const wallet = await this.getOrCreateUserWallet(userId, "", network);

    // Create a pending deposit record
    const depositId = randomUUID();
    const now = new Date();
    await this.fastify.db.insert(cryptoDeposits).values({
      id: depositId,
      userId,
      tokenSymbol,
      network: wallet.network,
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
}
