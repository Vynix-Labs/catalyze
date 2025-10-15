// src/utils/queue/processors/withdraw.ts
import type { Job } from "bullmq";
import { syncTransferStatus } from "../../../modules/fiat/fiat.service";
import { buildApp } from "../../../app";
import { notifyAdminOfWithdrawal } from "../../telegram/bot";
import { eq } from "drizzle-orm";
import { transactions, withdrawRequests, user as users } from "../../../db/schema";

let fastifySingleton: Awaited<ReturnType<typeof buildApp>> | null = null;

async function getFastify() {
  if (!fastifySingleton) {
    fastifySingleton = await buildApp();
  }
  return fastifySingleton;
}

export const withdrawProcessor = async (job: Job) => {
  const fastify = await getFastify();

  switch (job.name) {
    case "initiate_withdrawal": {
      const { reference } = job.data as { reference: string };

      fastify.log.info({ reference }, "Initiating withdrawal");

      // Fetch transaction and withdrawal details
      const [tx] = await fastify.db
        .select()
        .from(transactions)
        .where(eq(transactions.reference, reference));

      const [wr] = await fastify.db
        .select()
        .from(withdrawRequests)
        .where(eq(withdrawRequests.reference, reference));

      if (!tx || !wr) {
        fastify.log.error({ reference }, "Missing transaction or withdraw request for notification");
        return { status: "missing" };
      }

      const meta = ((): { bankCode?: string; narration?: string } => {
        try { return (typeof tx.metadata === 'string' ? JSON.parse(tx.metadata) : tx.metadata) || {}; } catch { return {}; }
      })();

      const [usr] = await fastify.db
        .select({ id: users.id, name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, tx.userId));

      // Notify admin via Telegram bot with full details
      notifyAdminOfWithdrawal({
        reference,
        amountFiat: Number(wr.amountFiat),
        tokenSymbol: tx.tokenSymbol,
        amountToken: String(tx.amountToken),
        bankName: wr.bankName,
        bankCode: meta.bankCode,
        accountNumber: wr.accountNumber,
        narration: meta.narration,
        userId: tx.userId,
        userName: usr?.name ?? null,
        userEmail: usr?.email ?? null,
      });

      return { status: "notified" };
    }

    case "check_withdraw_status": {
      const { reference } = job.data;

      fastify.log.info({ reference }, "Processing withdraw status check");

      job.log(`Processing withdraw job for reference=${job.data.reference}`);
      console.log("🔹 Withdraw job received:", job.data);

      const result = await syncTransferStatus(fastify, reference);
      console.log(result);

      if (["pending", "processing"].includes(result.status)) {
        await fastify.queues.withdraw.add(
          "check_withdraw_status",
          { reference },
          { delay: 2 * 60 * 1000 }
        );
      }

      return result;
    }

    default:
      fastify.log.warn(`Unknown job type: ${job.name}`);
      return null;
  }
};
