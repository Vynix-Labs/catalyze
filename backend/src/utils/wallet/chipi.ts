import type { WalletData } from "@chipi-pay/chipi-sdk";
// import { ChipiSDK } from "@chipi-pay/chipi-sdk";
import { ChipiSDK, type ChainToken } from "@chipi-stack/backend"
import env from "../../config/env";
import { TOKEN_MAP, type CryptoCurrency } from "../../config";
import { type Call } from "starknet";
import { getTokenDecimals } from "./tokens";
import type { FastifyInstance } from "fastify";
import { userWallets } from "../../db/schema";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";

// Initialize ChipiSDK
const chipiSDK = new ChipiSDK({
  apiPublicKey: env.CHIPI_API_PUBLIC_KEY,
  environment: "production",
});

/**
 * Create a new wallet using ChipiSDK
 * @param bearerToken - A valid BetterAuth bearer token (from fastify.auth.api.getToken)
 */
export async function createWallet(userId: string): Promise<WalletData> {
  try {
    const chipiWallet = await chipiSDK.createWallet({
      params: {
        encryptKey: env.CHIPI_ENCRYPT_KEY!,
        externalUserId: userId,
      },
      bearerToken: env.CHIPI_API_SECRET_KEY!,
    });

    console.log("Wallet created:", chipiWallet);
    return chipiWallet.wallet;

  } catch (err: unknown) {
    console.error("createWallet failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Wallet creation failed: ${message}`);
  }
}


export async function ensureUserWallet(
  fastify: FastifyInstance,
  userId: string,
  network: string = "starknet",
  bearerToken?: string
) {
  const [existing] = await fastify.db
    .select()
    .from(userWallets)
    .where(eq(userWallets.userId, userId));

  if (existing) {
    return existing;
  }

  if (!bearerToken) {
    throw new Error("Missing bearerToken for wallet creation");
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

  return row;
}

export async function transferWithChipi(
  from: WalletData,
  to: string,
  amount: number,
  currency: ChainToken,
) {
  // const decimals = await getTokenDecimals(currency);

  const tx = await chipiSDK.transfer({
    params: {
      /* externalUserId: userId, */
      encryptKey: env.CHIPI_ENCRYPT_KEY!,
      wallet: from,
      token: currency,
      // contractAddress: TOKEN_MAP[currency],
      recipient: to,
      amount: amount.toString(),
    },
    bearerToken: env.CHIPI_API_SECRET_KEY!,
  });
  return tx;
}

export async function approveWithChipi(
  wallet: WalletData,
  spender: string,
  amount: number,
  currency: CryptoCurrency,
) {
  const decimals = await getTokenDecimals(currency);
  return await chipiSDK.approve({
    params: {
      /* externalUserId: userId, */
      encryptKey: env.CHIPI_ENCRYPT_KEY!,
      wallet,
      contractAddress: TOKEN_MAP[currency],
      spender,
      amount,
      decimals,
    },
    bearerToken: env.CHIPI_API_SECRET_KEY!,
  });
}

export async function callContractWithChipi(
  wallet: WalletData,
  contractAddress: string,
  calls: Call[]
) {
  return await chipiSDK.callAnyContract({
    params: {
      /* externalUserId: userId, */
      encryptKey: env.CHIPI_ENCRYPT_KEY!,
      wallet,
      contractAddress,
      calls,
    },
    bearerToken: env.CHIPI_API_SECRET_KEY!,
  });
}

export async function stakeVesuUsdc(wallet: WalletData, amount: number) {
  return await chipiSDK.stakeVesuUsdc({
    params: {
      /* externalUserId: userId, */
      encryptKey: env.CHIPI_ENCRYPT_KEY!,
      wallet,
      amount,
      receiverWallet: wallet.publicKey,
    },
    bearerToken: env.CHIPI_API_SECRET_KEY!,
  });
}

export async function withdrawVesuUsdc(wallet: WalletData, amount: number) {
  return await chipiSDK.withdrawVesuUsdc({
    params: {
      /* externalUserId: userId, */
      encryptKey: env.CHIPI_ENCRYPT_KEY!,
      wallet,
      amount,
      recipient: wallet.publicKey,
    },
    bearerToken: env.CHIPI_API_SECRET_KEY!,
  });
}

export async function stakeWithChipi(
  wallet: WalletData,
  amount: number,
  tokenSymbol: string,
  contractAddress: string,
) {
  const symbol = tokenSymbol.toLowerCase();
  const currency = symbol as CryptoCurrency;
  const decimals = await getTokenDecimals(currency);

  if (symbol === "usdc") {
    return await stakeVesuUsdc(wallet, amount);
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
  return await callContractWithChipi(wallet, contractAddress, calls);
}