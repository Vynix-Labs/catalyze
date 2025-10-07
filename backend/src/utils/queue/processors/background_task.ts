import type { Job } from 'bullmq';
import { db } from '../../../plugins/db';
import { priceFeeds } from '../../../db/schema';
import { getExchangeRate } from '../../ex/rates';
import type { CryptoCurrency, Action } from '../../../config';

interface BackgroundTaskJobData {
  taskName: string;
  payload: Record<string, unknown>;
  priority?: 'low' | 'medium' | 'high';
}

const TRACKED_TOKENS: CryptoCurrency[] = ['usdt', 'usdc', 'strk', 'eth'];
const ACTION: Action = 'buy';

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

        // Fetch all rates at once
        const allRates = await getExchangeRate(ACTION);

        // Filter only the tokens we're tracking
        const validRates = allRates.filter(rate => TRACKED_TOKENS.includes(rate.currency));

        if (validRates.length === 0) {
          console.warn('No valid rates fetched; skipping upsert');
          break;
        }

        // Upsert into priceFeeds table
        for (const rate of validRates) {
          console.log(`Upserting rate for ${rate.currency}: NGN ${rate.rateInNGN}`);
          await db
            .insert(priceFeeds)
            .values({
              tokenSymbol: rate.currency,
              priceNgn: rate.rateInNGN.toString(),
              source: rate.source,
            })
            .onConflictDoUpdate({
              target: priceFeeds.tokenSymbol,
              set: {
                priceNgn: rate.rateInNGN.toString(),
                source: rate.source,
                updatedAt: new Date(),
              },
            });
        }

        console.log('Price feeds updated successfully');
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
