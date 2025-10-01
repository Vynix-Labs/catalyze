// src/utils/queue/processors/withdraw.ts
import type { Job } from "bullmq";
import { syncTransferStatus } from "../../../modules/fiat/fiat.service";
import { buildApp } from "../../../app";
import { notifyAdminOfWithdrawal } from "../../telegram/bot";

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
      const { reference, amount, bank } = job.data;

      fastify.log.info({ reference }, "Initiating withdrawal");

      // Notify admin via Telegram bot
      notifyAdminOfWithdrawal(reference, amount, bank);

      return { status: "otp_pending" };
    }

    case "check_withdraw_status": {
      const { reference } = job.data;

      fastify.log.info({ reference }, "Processing withdraw status check");

      job.log(`Processing withdraw job for reference=${job.data.reference}`);
      console.log("🔹 Withdraw job received:", job.data);

      const result = await syncTransferStatus(fastify, reference);
      console.log(result);

      if (["pending", "processing"].includes(result.status)) {
        await queues[QUEUE_NAMES.WITHDRAW].add(
          "check_withdraw_status",
          { reference },
          { delay: 2 * 60 * 1000 } // 2 minutes
        );
      }

      return result;
    }

    default:
      fastify.log.warn(`Unknown job type: ${job.name}`);
      return null;
  }
};
