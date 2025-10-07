import type { WalletData } from "@chipi-pay/chipi-sdk";
import { ChipiSDK } from "@chipi-pay/chipi-sdk";
import env from "../../config/env";
import { TOKEN_MAP, type CryptoCurrency } from "../../config";
import { type Call } from "starknet";
import { getTokenDecimals } from "./tokens";
import { generateUserJWT } from "../auth/jwt";

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
    
    const chipiWallet = await chipiSDK.createWallet({
        encryptKey: env.CHIPI_ENCRYPT_KEY,
        bearerToken,
    });

    // Return the WalletData from ChipiSDK
    return chipiWallet.wallet;
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
