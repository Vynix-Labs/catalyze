import type { CryptoCurrency, FiatCurrency } from "../../config";
import { TOKEN_MAP } from "../../config";
import { TOKEN_DECIMALS } from "../../utils/wallet/tokens";
import type { AssetsResponse, CryptoAsset, FiatAsset } from "./assets.schema";

const STARKNET_NETWORK = "starknet";

const FIAT_DECIMALS: Record<FiatCurrency, number> = {
  ngn: 2,
};

export class AssetsService {
  private buildCryptoAssets(): CryptoAsset[] {
    return (Object.entries(TOKEN_MAP) as [CryptoCurrency, string][]) 
      .map(([symbol, contractAddress]) => ({
        symbol,
        contractAddress,
        decimals: TOKEN_DECIMALS[symbol],
        network: STARKNET_NETWORK,
      }));
  }

  private buildFiatAssets(): FiatAsset[] {
    return (Object.entries(FIAT_DECIMALS) as [FiatCurrency, number][])
      .map(([currency, decimals]) => ({
        currency,
        decimals,
      }));
  }

  supportedAssets(): AssetsResponse {
    return {
      crypto: this.buildCryptoAssets(),
      fiat: this.buildFiatAssets(),
    };
  }
}
