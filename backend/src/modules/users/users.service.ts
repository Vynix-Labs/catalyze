import { and, eq } from "drizzle-orm";
import { balances, priceFeeds } from "../../db/schema";
import type { db } from "../../plugins/db";
import type { PriceQuoteType } from "../../config";

type Database = typeof db;

type PriceFeedRow = (typeof priceFeeds)["$inferSelect"];

const normalizeToken = (symbol: string) => symbol.toUpperCase();

const coalescePrice = (row: PriceFeedRow | undefined, quote: PriceQuoteType) => {
  if (!row) return 0;
  if (quote === "buy") return Number(row.priceNgnBuy ?? 0);
  if (quote === "sell") return Number(row.priceNgnSell ?? 0);
  return Number(row.priceNgnBase ?? 0);
};

const selectPriceRow = (
  prices: PriceFeedRow[],
  tokenSymbol: string
): PriceFeedRow | undefined => {
  return (
    prices.find((p) => p.tokenSymbol === tokenSymbol) ||
    prices.find((p) => normalizeToken(p.tokenSymbol) === normalizeToken(tokenSymbol))
  );
};

export class BalancesService<T extends Database> {
  db: T;
  constructor(db: T) {
    this.db = db;
  }

  /**
   * List all balances for a user with fiat equivalent using price_feeds
   */
  async listUserBalances(userId: string, quote: PriceQuoteType = "base") {
    // Fetch user balances
    const rows = await this.db
        .select()
        .from(balances)
        .where(eq(balances.userId, userId));

    // Fetch all price feeds (base/buy/sell)
    const prices = await this.db.select().from(priceFeeds);

    // Map balances to include fiat equivalent
    let totalFiat = 0;
    const items = rows.map((row) => {
      const priceRow = selectPriceRow(prices, row.tokenSymbol);
      const price = coalescePrice(priceRow, quote);
      const fiatEquivalent = Number(row.balance ?? 0) * price;
      totalFiat += fiatEquivalent;

      return {
        tokenSymbol: row.tokenSymbol,
        balance: row.balance?.toString() ?? "0",
        fiatEquivalent: fiatEquivalent.toFixed(2),
      };
    });

    return {
      items,
      totalFiat: totalFiat.toFixed(2),
    };
  }


  /**
   * Get a specific token balance for a user with fiat equivalent
   */
  async getUserBalance(userId: string, token: string, quote: PriceQuoteType = "base") {
    const [row] = await this.db
      .select()
      .from(balances)
      .where(and(eq(balances.userId, userId), eq(balances.tokenSymbol, token)));

    if (!row) return null;

    const [price] = await this.db
      .select()
      .from(priceFeeds)
      .where(eq(priceFeeds.tokenSymbol, token));

    const fiatEquivalent = coalescePrice(price, quote) * Number(row.balance ?? 0);

    return {
      tokenSymbol: row.tokenSymbol,
      balance: row.balance?.toString() ?? "0",
      fiatEquivalent: fiatEquivalent.toFixed(2),
    };
  }
}
