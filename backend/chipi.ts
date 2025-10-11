import type { WalletData } from "@chipi-pay/chipi-sdk";
// import { ChipiSDK } from "@chipi-pay/chipi-sdk";
import { ChipiSDK} from "@chipi-stack/backend"


// Initialize ChipiSDK
const chipiSDK = new ChipiSDK({
  apiPublicKey: process.env.CHIPI_API_PUBLIC_KEY!,
  environment: "production",
  nodeUrl: "https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_9/eiHr-ebgMAnAdQHXIcH6wTxkjNm7jwak"
});

/**
 * Create a new wallet using ChipiSDK
 * @param bearerToken - A valid BetterAuth bearer token (from fastify.auth.api.getToken)
 */
export async function createWallet(bearerToken: string): Promise<WalletData> {
  try {
    const chipiWallet = await chipiSDK.createWallet({
      params: {
        encryptKey: process.env.CHIPI_ENCRYPT_KEY!,
        externalUserId: "IvpyPLhPYgW9sfjJQvG4H22vueEcg1Lo",
      },
      bearerToken,
    });

    console.log("Wallet created:", chipiWallet);
    return chipiWallet.wallet;

  } catch (err: unknown) {
    console.error("createWallet failed:", err);
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Wallet creation failed: ${message}`);
  }
}

createWallet("Secret key here")