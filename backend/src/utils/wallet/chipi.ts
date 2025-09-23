import type { WalletData } from "@chipi-pay/chipi-sdk";
import { ChipiSDK } from "@chipi-pay/chipi-sdk";
import env from "../../config/env";
import { TOKEN_MAP, type CryptoCurrency } from "../../config";
import { getTokenDecimals } from "./tokens";

// Initialize ChipiSDK
const chipiSDK = new ChipiSDK({
    apiPublicKey: env.CHIPI_API_PUBLIC_KEY,
});

/**
 * Create a new wallet using ChipiSDK
 */
export async function createWallet(bearerToken: string): Promise<WalletData> {
    const chipiWallet = await chipiSDK.createWallet({
        encryptKey: env.CHIPI_ENCRYPT_KEY,
        bearerToken,
    });

    // Return the WalletData from ChipiSDK
    return chipiWallet.wallet;
}

export async function transferWithChipi(from: WalletData, to: string, amount: number, currency: CryptoCurrency, bearerToken: string) {
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