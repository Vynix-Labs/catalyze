import type { WalletData } from "@chipi-pay/chipi-sdk";
import { ChipiSDK } from "@chipi-pay/chipi-sdk";
import env from "../../config/env";
import { TOKEN_MAP, type CryptoCurrency } from "../../config";
import { type Call } from "starknet";
import { getTokenDecimals } from "./tokens";
import { generateUserJWT } from "../auth/jwt";
import type { FastifyInstance } from "fastify";
import { userWallets } from "../../db/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

function assertChipiEnv() {
  const missing: string[] = [];
  if (!env.CHIPI_API_PUBLIC_KEY) missing.push("CHIPI_API_PUBLIC_KEY"); // used as x-api-key
  if (!env.CHIPI_ENCRYPT_KEY)    missing.push("CHIPI_ENCRYPT_KEY");
  if (!env.CHIPI_API_SECRET_KEY)     missing.push("CHIPI_API_SECRET_KEY");     // used as Bearer in backend
  if (missing.length) throw new Error(`Chipi config missing: ${missing.join(", ")}`);
}
assertChipiEnv();

const chipiSDK = new ChipiSDK({ apiPublicKey: env.CHIPI_API_PUBLIC_KEY! });
const encryptKey = env.CHIPI_ENCRYPT_KEY!;

// Prefer server-side secret; fallback to per-user JWT if SECRET not set.
async function chipiBearer() {
  return env.CHIPI_API_SECRET_KEY
}

/**
 * Create a new wallet using ChipiSDK (Bearer = Chipi secret key)
 */
export async function createWallet(userId: string): Promise<WalletData> {
  const bearerToken = await chipiBearer();

  try {
    const { wallet } = await chipiSDK.createWallet({
      encryptKey,
      bearerToken,
    });
    return wallet;

  } catch (err: unknown) {
    try {
      const resp = await fetch("https://api.chipipay.com/v1/chipi-wallets/prepare-creation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${bearerToken}`,
          "x-api-key": env.CHIPI_API_PUBLIC_KEY!,
        },
        body: JSON.stringify({ publicKey: "debug" }),
      });
      const text = await resp.text();
      console.error("Chipi prepare-creation:", resp.status, text);
    } catch (e) {
      console.error("Chipi debug probe failed:", e);
    }

    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Wallet creation failed: ${message}`);
  }
}

export async function ensureUserWallet(fastify: FastifyInstance, userId: string, network = "starknet") {
  const [existing] = await fastify.db.select().from(userWallets).where(eq(userWallets.userId, userId));
  if (existing) return existing;

  const wallet = await createWallet(userId);
  const row: typeof userWallets.$inferInsert = {
    id: randomUUID(),
    userId,
    network,
    publicKey: wallet.publicKey,
    encryptedPrivateKey: wallet.encryptedPrivateKey,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await fastify.db.insert(userWallets).values(row);
  return row as unknown as typeof userWallets.$inferSelect;
}

// NOTE: keep amounts as number for now (you can switch to strings later per our precision advice).
export async function transferWithChipi(from: WalletData, to: string, amount: number, currency: CryptoCurrency, userId: string) {
  const bearerToken = await chipiBearer();
  const decimals = await getTokenDecimals(currency);
  return chipiSDK.transfer({
    encryptKey,
    wallet: from,
    contractAddress: TOKEN_MAP[currency],
    recipient: to,
    amount,
    decimals,
    bearerToken,
  });
}

export async function approveWithChipi(wallet: WalletData, spender: string, amount: number, currency: CryptoCurrency, userId: string) {
  const bearerToken = await chipiBearer();
  const decimals = await getTokenDecimals(currency);
  return chipiSDK.approve({
    encryptKey,
    wallet,
    contractAddress: TOKEN_MAP[currency],
    spender,
    amount,
    decimals,
    bearerToken,
  });
}

export async function callContractWithChipi(wallet: WalletData, contractAddress: string, calls: Call[], userId: string) {
  const bearerToken = await chipiBearer();
  return chipiSDK.callAnyContract({
    encryptKey,
    wallet,
    contractAddress,
    calls,
    bearerToken,
  });
}

export async function stakeVesuUsdc(wallet: WalletData, amount: number, userId: string) {
  const bearerToken = await chipiBearer();
  return chipiSDK.stakeVesuUsdc({
    encryptKey,
    wallet,
    amount,
    receiverWallet: wallet.publicKey,
    bearerToken,
  });
}

export async function withdrawVesuUsdc(wallet: WalletData, amount: number, userId: string) {
  const bearerToken = await chipiBearer(userId);
  return chipiSDK.withdrawVesuUsdc({
    encryptKey,
    wallet,
    amount,
    recipient: wallet.publicKey,
    bearerToken,
  });
}

export async function stakeWithChipi(
  wallet: WalletData,
  amount: number,
  userId: string,
  tokenSymbol: string,
  contractAddress: string
) {
  const bearerToken = await chipiBearer(userId);
  const symbol = tokenSymbol.toLowerCase() as CryptoCurrency;
  const decimals = await getTokenDecimals(symbol);

  if (symbol === "usdc") {
    return stakeVesuUsdc(wallet, amount, userId);
  }

  const calls: Call[] = [
    {
      contractAddress,
      entrypoint: "deposit",
      calldata: [BigInt(Math.floor(amount * 10 ** decimals))],
    },
  ];

  return callContractWithChipi(wallet, contractAddress, calls, userId);
}
