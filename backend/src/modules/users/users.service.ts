import { eq } from "drizzle-orm";
import { balances, priceFeeds } from "../../db/schema";

export class BalancesService {
  db: any;
  constructor(db: any) {
    this.db = db;
  }

  /**
   * List all balances for a user with fiat equivalent using price_feeds
   */
  async listUserBalances(userId: string) {
    // Fetch user balances
    const rows = await this.db
        .select()
        .from(balances)
        .where(eq(balances.userId, userId));

    // Fetch all price feeds
    const prices = await this.db.select().from(priceFeeds);

    // Map balances to include fiat equivalent
    let totalFiat = 0;
    const items = rows.map((r: any) => {
        const price = Number(prices.find((p: any) => p.tokenSymbol === r.tokenSymbol)?.priceNgn ?? 0);
        const fiatEquivalent = Number(r.balance) * price;
        totalFiat += fiatEquivalent;

        return {
            tokenSymbol: r.tokenSymbol,
            balance: r.balance.toString(),
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
  async getUserBalance(userId: string, token: string) {
    const [row] = await this.db
      .select()
      .from(balances)
      .where(eq(balances.userId, userId))
      .where(eq(balances.tokenSymbol, token));

    if (!row) return null;

    const [price] = await this.db
      .select()
      .from(priceFeeds)
      .where(eq(priceFeeds.tokenSymbol, token));

    const fiatEquivalent = price ? Number(row.balance) * Number(price.priceNgn) : 0;

    return {
      tokenSymbol: row.tokenSymbol,
      balance: row.balance.toString(),
      fiatEquivalent: fiatEquivalent.toFixed(2),
    };
  }
}
