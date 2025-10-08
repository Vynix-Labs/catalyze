import type { Job } from 'bullmq';
import { db } from '../../../plugins/db';
import { priceFeeds, reserves } from '../../../db/schema';
import { getExchangeRates } from '../../ex/rates';
import type { CryptoCurrency } from '../../../config';
import { and, eq, lt } from 'drizzle-orm';

interface BackgroundTaskJobData {
  taskName: string;
  payload: Record<string, unknown>;
  priority?: 'low' | 'medium' | 'high';
}

const TRACKED_TOKENS: CryptoCurrency[] = ['usdt', 'usdc', 'strk', 'eth'];

export const backgroundTaskProcessor = async (job: Job<BackgroundTaskJobData>) => {
  const { taskName, payload, priority = 'medium' } = job.data;

  try {
    console.log(`Processing background task ${job.id}: ${taskName} (priority: ${priority})`);

    switch (taskName) {
      case 'cleanup_expired_sessions':
        console.log('Cleaning up expired sessions...');
        // Implementation here
        break;

      case 'generate_reports':
        console.log('Generating reports...');
        // Implementation here
        break;

      case 'sync_external_data':
        console.log('Syncing external data...');
        // Implementation here
        break;

      case 'update_price_feeds': {
        console.log('Updating price feeds...');

        // Fetch all rates at once (base, buy, sell)
        const allRates = await getExchangeRates();

        // Filter only the tokens we're tracking
        const validRates = allRates.filter(rate => TRACKED_TOKENS.includes(rate.currency));

        if (validRates.length === 0) {
          console.warn('No valid rates fetched; skipping upsert');
          break;
        }

        // Upsert into priceFeeds table (store lowercase token symbols)
        for (const rate of validRates) {
          const token = (rate.currency as string).toLowerCase();
          console.log(`Upserting rates for ${token.toUpperCase()}: base=${rate.price.base} buy=${rate.price.buy} sell=${rate.price.sell}`);
          await db
            .insert(priceFeeds)
            .values({
              tokenSymbol: token,
              priceNgnBase: rate.price.base.toString(),
              priceNgnBuy: rate.price.buy.toString(),
              priceNgnSell: rate.price.sell.toString(),
              source: rate.source,
            })
            .onConflictDoUpdate({
              target: priceFeeds.tokenSymbol,
              set: {
                priceNgnBase: rate.price.base.toString(),
                priceNgnBuy: rate.price.buy.toString(),
                priceNgnSell: rate.price.sell.toString(),
                source: rate.source,
                updatedAt: new Date(),
              },
            });
        }

        console.log('Price feeds updated successfully');
        break;
      }

      case 'expire_reserves': {
        console.log('Expiring stale reserves...');
        const now = new Date();
        const result = await db
          .update(reserves)
          .set({ status: 'expired', updatedAt: new Date() })
          .where(and(eq(reserves.status, 'pending'), lt(reserves.expiresAt, now)));
        console.log('Expired reserves result:', result);
        break;
      }


      default:
        console.log(`Executing generic task: ${taskName} with payload:`, payload);
        break;
    }

    console.log(`Background task completed: ${job.id}`);
    return { success: true, taskId: `task_${job.id}`, result: { processed: true } };
  } catch (error) {
    console.error(`Failed to execute background task ${job.id}:`, error);
    throw error;
  }
};
