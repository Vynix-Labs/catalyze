import { eq, and, gt } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { depositIntents, reserves, userWallets, balances } from "../db/schema";
import { getSystemTokenBalance } from "./wallet/system";
import { createWallet } from "./wallet/chipi";
import type { CryptoCurrency } from "../config";


//
// --- STATUS MAPPER ---
//
export function mapMonnifyStatus(
  status: string
): "pending" | "processing" | "completed" | "failed" {
  switch (status) {
    case "SUCCESS":
      return "completed";
    case "FAILED":
      return "failed";
    case "PROCESSING":
      return "processing";
    default:
      return "pending";
  }
}

//
// --- RAW BODY HELPERS ---
//
export function getRawBodyString(request: FastifyRequest): string {
  const maybeRaw = (request as any).rawBody;
  if (typeof maybeRaw === "string") return maybeRaw;
  if (Buffer.isBuffer(maybeRaw)) return maybeRaw.toString("utf8");
  if (typeof request.body === "string") return request.body;
  return JSON.stringify(request.body);
}

//
// --- DB HELPERS ---
//
export async function markDepositStatus(
  fastify: FastifyInstance,
  depositId: string,
  status: "awaiting_payment" | "processing" | "completed" | "failed"
) {
  await fastify.db
    .update(depositIntents)
    .set({ status, updatedAt: new Date() })
    .where(eq(depositIntents.id, depositId));
}

export async function hasSufficientLiquidity(
  fastify: FastifyInstance,
  symbol: CryptoCurrency,
  amountNeeded: number
): Promise<boolean> {
  const systemBal = await getSystemTokenBalance(symbol);
  const now = new Date();

  const activeRes = await fastify.db
    .select()
    .from(reserves)
    .where(and(eq(reserves.tokenSymbol, symbol), eq(reserves.status, "pending"), gt(reserves.expiresAt, now)));

  const reserved = activeRes.reduce((acc, r) => acc + Number(r.amountToken ?? 0), 0);
  return systemBal - reserved >= amountNeeded;
}

export async function flagReserveNeedsAdmin(fastify: FastifyInstance, reserveId?: string | null) {
  if (!reserveId) return;
  await fastify.db
    .update(reserves)
    .set({ status: "needs_admin", updatedAt: new Date() })
    .where(eq(reserves.id, reserveId));
}

export async function ensureUserWallet(fastify: FastifyInstance, userId: string) {
  const [existing] = await fastify.db.select().from(userWallets).where(eq(userWallets.userId, userId));
  if (existing) return existing;

  const newWallet = await createWallet(userId);
  const record = {
    id: randomUUID(),
    userId,
    network: "starknet",
    publicKey: newWallet.publicKey,
    encryptedPrivateKey: newWallet.encryptedPrivateKey,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await fastify.db.insert(userWallets).values(record);
  return record;
}

export async function creditUserBalance(
  fastify: FastifyInstance,
  userId: string,
  tokenSymbol: string,
  amountToken: string
) {
  const [balance] = await fastify.db
    .select()
    .from(balances)
    .where(and(eq(balances.userId, userId), eq(balances.tokenSymbol, tokenSymbol)));

  if (balance) {
    const newBalance = (Number(balance.balance) + Number(amountToken)).toString();
    await fastify.db
      .update(balances)
      .set({ balance: newBalance, updatedAt: new Date() })
      .where(eq(balances.id, balance.id));
  } else {
    await fastify.db.insert(balances).values({
      id: randomUUID(),
      userId,
      tokenSymbol,
      balance: amountToken,
      updatedAt: new Date(),
    });
  }
}
