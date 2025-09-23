
import { COINGECKO_IDS, SPREAD,  type CryptoCurrency, type Action, type RateInfo } from "../../config";

/**
 * Get current exchange rate from CoinGecko with NGN discount
 * TODO: cache rates for 15-30mins
 */
export async function getExchangeRate(currency: CryptoCurrency, action: Action): Promise<RateInfo | null> {
    try {
      const coinId = COINGECKO_IDS[currency];
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=ngn`,
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch rate for ${currency}`);
      }
  
      const data = await response.json();
      // @ts-expect-error - CoinGecko API response type
      const baseRate = data[coinId]?.ngn || 0;
  
      const spreadRate = Math.max(0, baseRate + SPREAD[action]);
  
      return {
        currency,
        rateInNGN: spreadRate,
        source: "coingecko",
        lastUpdated: new Date(),
      };
    }
    catch (error) {
      console.error(`Error fetching rate for ${currency}:`, error);
      return null
    }
  }