import { FastifyPluginAsync } from "fastify";
import { requireAuth } from "../../plugins/requireAuth";
import { initiateFiatDepositSchema } from "./fiat.schema";
import { MonnifyClient, handleMonnifyWebhook } from "./fiat.service";

const monnify = new MonnifyClient();

const fiatRoutes: FastifyPluginAsync = async (fastify) => {
  // ------------------- INITIATE FIAT DEPOSIT -------------------
  fastify.post(
    "/deposit/initiate",
    {
      preHandler: requireAuth(fastify),
      schema: {
        body: initiateFiatDepositSchema,
      },
    },
    async (request, reply) => {
      try {
        const userId = (request as any).currentUserId as string;
        const input = initiateFiatDepositSchema.parse(request.body);
        const deposit = await monnify.createDepositIntent(fastify, userId, input);

        return reply.code(201).send({
          id: deposit.id,
          amountFiat: deposit.amountFiat,
          amountToken: deposit.amountToken,
          status: deposit.status,
          provider: deposit.provider,
          providerRef: deposit.providerRef,
          paymentInstructions: deposit.paymentInstructions, // Monnify account details
        });
      } catch (err: any) {
        fastify.log.error(err);
        return reply.code(400).send({ error: err.message });
      }
    }
  );

  // ------------------- CONFIRM FIAT DEPOSIT (WEBHOOK) -------------------
  fastify.post(
    "/deposit/confirm",
    async (request, reply) => {
      try {
        await handleMonnifyWebhook(fastify, request, reply);
        return reply.code(200).send({ success: true });
      } catch (err: any) {
        fastify.log.error(err);
        return reply.code(400).send({ error: err.message });
      }
    }
  );
};

export default fiatRoutes;
