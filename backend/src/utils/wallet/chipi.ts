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

// Initialize ChipiSDK
const chipiSDK = new ChipiSDK({
    apiPublicKey: env.CHIPI_API_PUBLIC_KEY,
});

/**
 * Create a new wallet using ChipiSDK
 * @param userId - The authenticated user's ID
 */
export async function createWallet(userId: string): Promise<WalletData> {
  const bearerToken = await generateUserJWT(userId);

  try {
    const chipiWallet = await chipiSDK.createWallet({
      encryptKey: process.env.CHIPI_ENCRYPT_KEY!,
      bearerToken,
    });

    console.log("Wallet created:", chipiWallet);
    return chipiWallet.wallet;

  } catch (err: unknown) {
    console.error("createWallet failed:", err);

    // Extra debug logs
    if (err instanceof Error && err.message.includes("typedData")) {
      console.error("Chipi didn't return typeData. inspect manually");

      // fetch to inspect the real API output
      const debugResponse = await fetch("https://api.chipipay.com/v1/chipi-wallets/prepare-creation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${bearerToken}`,
          "x-api-key": process.env.CHIPI_API_PUBLIC_KEY!,
        },
        body: JSON.stringify({ publicKey: "debug" }),
      });

      const debugText = await debugResponse.text();
      console.error("Raw response from Chipi prepare-creation:", debugText);
    }

    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Wallet creation failed: ${message}`);
  }
}


export async function ensureUserWallet(fastify: FastifyInstance, userId: string, network: string = "starknet") {
  const [existing] = await fastify.db
    .select()
    .from(userWallets)
    .where(eq(userWallets.userId, userId));

  if (existing) {
    return existing;
  }

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

export async function transferWithChipi(from: WalletData, to: string, amount: number, currency: CryptoCurrency, userId: string) {
    const bearerToken = await generateUserJWT(userId);
    const decimals = await getTokenDecimals(currency);

    const tx = await chipiSDK.transfer({
        encryptKey: env.CHIPI_ENCRYPT_KEY,
        wallet: from,
        contractAddress: TOKEN_MAP[currency],
        recipient: to,
        amount,
        decimals,
        bearerToken,
    });
    return tx;
}

export async function approveWithChipi(wallet: WalletData, spender: string, amount: number, currency: CryptoCurrency, userId: string) {
    const bearerToken = await generateUserJWT(userId);
    const decimals = await getTokenDecimals(currency);
    return await chipiSDK.approve({
        encryptKey: env.CHIPI_ENCRYPT_KEY,
        wallet,
        contractAddress: TOKEN_MAP[currency],
        spender,
        amount,
        decimals,
        bearerToken,
    });
}

export async function callContractWithChipi(wallet: WalletData, contractAddress: string, calls: Call[], userId: string) {
    const bearerToken = await generateUserJWT(userId);
    return await chipiSDK.callAnyContract({
        encryptKey: env.CHIPI_ENCRYPT_KEY,
        wallet,
        contractAddress,
        calls,
        bearerToken,
    });
}

export async function stakeVesuUsdc(wallet: WalletData, amount: number, userId: string) {
    const bearerToken = await generateUserJWT(userId);
    return await chipiSDK.stakeVesuUsdc({
        encryptKey: env.CHIPI_ENCRYPT_KEY,
        wallet,
        amount,
        receiverWallet: wallet.publicKey,
        bearerToken,
    });
}

export async function withdrawVesuUsdc(wallet: WalletData, amount: number, userId: string) {
    const bearerToken = await generateUserJWT(userId);
    return await chipiSDK.withdrawVesuUsdc({
        encryptKey: env.CHIPI_ENCRYPT_KEY,
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
  const symbol = tokenSymbol.toLowerCase();
  const currency = symbol as CryptoCurrency;
  const decimals = await getTokenDecimals(currency);

  if (symbol === "usdc") {
    return await stakeVesuUsdc(wallet, amount, userId);
  }

  const entrypoint = "deposit";

  const calls: Call[] = [
    {
      contractAddress,
      entrypoint,
      calldata: [BigInt(Math.floor(amount * 10 ** decimals))],
    },
  ];

  // Execute contract call via Chipi
  return await callContractWithChipi(wallet, contractAddress, calls, userId);
}