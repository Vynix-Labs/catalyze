import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../plugins/requireAuth";
import { initiateFiatDepositSchema, FiatDepositResponse, SuccessResponse, ErrorResponse, initiateFiatTransferSchema, FiatTransferResponse, TransferStatusResponse, AuthorizeTransferSchema } from "./fiat.schema";
import { MonnifyClient, handleMonnifyWebhook, syncTransferStatus } from "./fiat.service";
import { monnify } from "./fiat.service";

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
      } catch (err) {
        fastify.log.error(err);
        return reply.code(400).send(ErrorResponse.parse({ error: (err as Error).message }));
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
        await handleMonnifyWebhook(fastify, request);
        return reply.code(200).send(SuccessResponse.parse({ success: true }));
      } catch (err) {
        fastify.log.error(err);
        return reply.code(400).send(ErrorResponse.parse({ error: (err as Error).message }));
      }
    }
  );

  fastify.post(
    "/transfer/initiate",
    {
      preHandler: requireAuth(fastify),
      schema: {
        description: "Initiate fiat withdrawal",
        tags: ["Fiat"],
        body: initiateFiatTransferSchema,
        response: {
          201: FiatTransferResponse,
          400: ErrorResponse,
        },
      },
    },
    async (req, reply) => {
      try {
        const userId = req.currentUserId as string;
        const input = initiateFiatTransferSchema.parse(req.body);
        const result = await monnify.createTransferIntent(fastify, userId, input);
        return reply.code(201).send(FiatTransferResponse.parse(result));
      } catch (err: any) {
        fastify.log.error(err);
        return reply.code(400).send({ error: err.message });
      }
    }
  );


  // ---------------- GET TRANSFER STATUS ----------------
  fastify.get(
    "/transfer/:reference/status",
    {
      preHandler: requireAuth(fastify),
      schema: {
        description: "Get (and refresh) Monnify transfer status",
        tags: ["Fiat"],
        params: z.object({ reference: z.string() }),
        response: {
          200: TransferStatusResponse,
          400: ErrorResponse,
        },
      },
    },
    async (req, reply) => {
      try {
        const { reference } = req.params as { reference: string };
        const result = await syncTransferStatus(fastify, reference);
        return reply.code(200).send(result);
      } catch (err: any) {
        return reply.code(400).send({ error: err.message });
      }
    }
  );

  fastify.post(
    "/transfer/confirm",
    {
      preHandler: requireAuth(fastify),
      schema: {
        description: "Confirm Monnify transfer with OTP",
        tags: ["Fiat"],
        body: AuthorizeTransferSchema,
        response: {
          200: SuccessResponse,
          400: ErrorResponse,
        },
      },
    },
    async (req, reply) => {
      try {
        const { reference, authorizationCode } = AuthorizeTransferSchema.parse(req.body);

        const resp = await monnify.authorizeDisbursement(reference, authorizationCode);

        if (!resp.requestSuccessful) throw new Error(resp.responseMessage);

        // enqueue status checks after OTP is confirmed
        await fastify.queues.withdraw.add(
          "check_withdraw_status",
          { reference },
          { delay: 60_000 } // first check after 1min
        );

        return reply.code(200).send({ success: true, monnifyResponse: resp });
      } catch (err: any) {
        return reply.code(400).send({ error: err.message });
      }
    }
  );

};

export default fiatRoutes;
