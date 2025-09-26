import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../plugins/requireAuth";
import { initiateFiatDepositSchema, FiatDepositResponse, SuccessResponse, ErrorResponse } from "./fiat.schema";
import { MonnifyClient, handleMonnifyWebhook } from "./fiat.service";

const monnify = new MonnifyClient();

const fiatRoutes: FastifyPluginAsync = async (fastify) => {
  // ------------------- INITIATE FIAT DEPOSIT -------------------
  fastify.post(
    "/deposit/initiate",
    {
      preHandler: requireAuth(fastify),
      schema: {
        description: "Initiate a fiat deposit request",
        tags: ["Fiat"],
        security: [{ sessionCookie: [] }],
        body: initiateFiatDepositSchema,
        response: {
          201: FiatDepositResponse,
          400: ErrorResponse,
          401: ErrorResponse,
        },
      },
    },
    async (request, reply) => {
      try {
        const userId = request.currentUserId as string;
        const input = initiateFiatDepositSchema.parse(request.body);
        const deposit = await monnify.createDepositIntent(fastify, userId, input);

        return reply.code(201).send(FiatDepositResponse.parse(deposit));
      } catch (err: any) {
        fastify.log.error(err);
        return reply.code(400).send(ErrorResponse.parse({ error: err.message }));
      }
    }
  );

  // ------------------- CONFIRM FIAT DEPOSIT (WEBHOOK) -------------------
  fastify.post(
    "/deposit/confirm",
    {
      schema: {
        description: "Webhook endpoint for Monnify deposit confirmation",
        tags: ["Fiat"],
        body: z.object({}).passthrough(), // refine if you know webhook structure
        response: {
          200: SuccessResponse,
          400: ErrorResponse,
        },
      },
    },
    async (request, reply) => {
      try {
        await handleMonnifyWebhook(fastify, request, reply);
        return reply.code(200).send(SuccessResponse.parse({ success: true }));
      } catch (err: any) {
        fastify.log.error(err);
        return reply.code(400).send(ErrorResponse.parse({ error: err.message }));
      }
    }
  );
};

export default fiatRoutes;
