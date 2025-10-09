import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../plugins/requireAuth";
import { initiateFiatDepositSchema, FiatDepositResponse, SuccessResponse, ErrorResponse, initiateFiatTransferSchema, FiatTransferResponse, TransferStatusResponse, AuthorizeTransferSchema } from "./fiat.schema";
import { handleMonnifyWebhook, syncTransferStatus } from "./fiat.service";
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

  // ------------------- MONNIFY OPERATIONAL ENDPOINTS -------------------
  fastify.get(
    "/monnify/banks",
    {
      preHandler: requireAuth(fastify),
      schema: {
        description: "List Nigerian banks from Monnify",
        tags: ["Fiat"],
      },
    },
    async (_req, reply) => {
      const resp = await monnify.getBanks();
      return reply.code(200).send(resp);
    }
  );

  fastify.post(
    "/monnify/validate-account",
    {
      preHandler: requireAuth(fastify),
      schema: {
        description: "Validate account via Monnify",
        tags: ["Fiat"],
        body: z.object({ bankCode: z.string(), accountNumber: z.string() }),
      },
    },
    async (req, reply) => {
      const { bankCode, accountNumber } = (req.body as { bankCode: string; accountNumber: string });
      const resp = await monnify.validateAccount(bankCode, accountNumber);
      return reply.code(200).send(resp);
    }
  );

  fastify.post(
    "/monnify/resend-otp",
    {
      preHandler: requireAuth(fastify),
      schema: {
        description: "Resend Monnify transfer OTP",
        tags: ["Fiat"],
        body: z.object({ reference: z.string() }),
      },
    },
    async (req, reply) => {
      const { reference } = (req.body as { reference: string });
      const resp = await monnify.resendOtp(reference);
      return reply.code(200).send(resp);
    }
  );

  fastify.get(
    "/monnify/disbursements/:reference",
    {
      preHandler: requireAuth(fastify),
      schema: {
        description: "Fetch Monnify disbursement status",
        tags: ["Fiat"],
        params: z.object({ reference: z.string() }),
      },
    },
    async (req, reply) => {
      const { reference } = req.params as { reference: string };
      const resp = await monnify.getDisbursementStatus(reference);
      return reply.code(200).send(resp);
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
        const headers = new Headers();
        Object.entries(req.headers).forEach(([k, v]) => { if (v) headers.append(k, v.toString()); });
        const bearToken = await fastify.auth.api.getToken({ headers });
        const result = await monnify.createTransferIntent(fastify, userId, input, bearToken.token);
        return reply.code(201).send(FiatTransferResponse.parse(result));
      } catch (err: unknown) {
        fastify.log.error(err);
        const msg = err instanceof Error ? err.message : String(err);
        return reply.code(400).send({ error: msg });
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
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return reply.code(400).send({ error: msg });
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
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return reply.code(400).send({ error: msg });
      }
    }
  );

};

export default fiatRoutes;
