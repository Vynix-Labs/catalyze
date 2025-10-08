import { db } from "../src/plugins/db";
import { priceFeeds } from "../src/db/schema";
import { desc, eq } from "drizzle-orm";

async function run() {
  try {
    console.log("Starting price_feeds tokenSymbol lowercase migration...");

    // Fetch all rows ordered by updatedAt desc so newer values win in upserts
    const rows = await db.select().from(priceFeeds).orderBy(desc(priceFeeds.updatedAt));

    let upserts = 0;
    for (const r of rows) {
      const lower = r.tokenSymbol.toLowerCase();
      if (r.tokenSymbol === lower) continue;

      // Upsert a lowercase row with the latest values
      await db
        .insert(priceFeeds)
        .values({
          tokenSymbol: lower,
          priceNgnBase: r.priceNgnBase,
          priceNgnBuy: r.priceNgnBuy,
          priceNgnSell: r.priceNgnSell,
          source: r.source,
        })
        .onConflictDoUpdate({
          target: priceFeeds.tokenSymbol,
          set: {
            priceNgnBase: r.priceNgnBase,
            priceNgnBuy: r.priceNgnBuy,
            priceNgnSell: r.priceNgnSell,
            source: r.source,
            updatedAt: new Date(),
          },
        });

      upserts++;
    }

    // Delete any rows with uppercase (tokenSymbol != lower(tokenSymbol))
    // We cannot use SQL lower() easily via Drizzle conditions, so filter client-side for safety
    const allAfter = await db.select().from(priceFeeds);
    const toDelete = allAfter.filter((r) => r.tokenSymbol !== r.tokenSymbol.toLowerCase());
    for (const r of toDelete) {
      await db.delete(priceFeeds).where(eq(priceFeeds.tokenSymbol, r.tokenSymbol));
    }

    console.log(`Upserts performed: ${upserts}`);
    console.log(`Deleted uppercase rows: ${toDelete.length}`);
    console.log("Migration complete.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exitCode = 1;
  } finally {
    // Let Fastify db plugin close connection on process exit if needed
    // For postgres-js, there's not a direct close here via db, plugin handles onClose in app.
    process.exit();
  }
}

run();
