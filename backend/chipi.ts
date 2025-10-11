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

createWallet("eyJhbGciOiJFZERTQSIsImtpZCI6IloxeTBxN3BWbGtBZU5ZcnltaVVjVHpUM0xTT0NjU01kIn0.eyJpYXQiOjE3NjAxNjMzMjAsIm5hbWUiOiJJa2VtIFBldGVyIiwiZW1haWwiOiJpa2VtcGV0ZXIyMDIwQGdtYWlsLmNvbSIsImVtYWlsVmVyaWZpZWQiOnRydWUsImNyZWF0ZWRBdCI6IjIwMjUtMTAtMDlUMDQ6NTE6MDAuOTEwWiIsInVwZGF0ZWRBdCI6IjIwMjUtMTAtMDlUMDQ6NTQ6MTguOTY5WiIsInJvbGUiOiJ1c2VyIiwiaWQiOiJJdnB5UExoUFlnVzlzZmpKUXZHNEgyMnZ1ZUVjZzFMbyIsInN1YiI6Ikl2cHlQTGhQWWdXOXNmakpRdkc0SDIydnVlRWNnMUxvIiwiZXhwIjoxNzYwMTY0MjIwLCJpc3MiOiJodHRwczovL2NhdGFseXplLWFwaS5hcHBzLmlrZW0uZGV2IiwiYXVkIjoiaHR0cHM6Ly9jYXRhbHl6ZS1hcGkuYXBwcy5pa2VtLmRldiJ9.b_jqxNG7MZE4dndpjyWMeTAj__WDrzwuWN35-YxPAJXV0j-kPyQEdPjj3Kcrahb4IJabfaC4j9CboxYbQ8WeAQ");