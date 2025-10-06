import { COINGECKO_IDS, SPREAD, type CryptoCurrency, type Action, type RateInfo } from "../../config";

/**
 * Get current exchange rates for all cryptocurrencies at once
 */
export async function getExchangeRate(action: Action): Promise<RateInfo[]> {
  try {
    const coinIds = Object.values(COINGECKO_IDS).join(","); // join all CoinGecko IDs
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=ngn`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch rates for all currencies");
    }

    const data = await response.json();

    // Map each currency to RateInfo
    const rates: RateInfo[] = Object.entries(COINGECKO_IDS).map(([currency, coinId]) => {
      // @ts-expect-error - CoinGecko API response type
      const baseRate = data[coinId]?.ngn || 0;
      const spreadRate = Math.max(0, baseRate + SPREAD[action]);

      return {
        currency: currency as CryptoCurrency,
        rateInNGN: spreadRate,
        source: "coingecko",
        lastUpdated: new Date(),
      };
    });

    console.log("Fetched all exchange rates:", rates);

    return rates;
  } catch (error) {
    console.error("Error fetching all exchange rates:", error);
    return [];
  }
}
