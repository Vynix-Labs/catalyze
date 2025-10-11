import type { FastifyPluginAsync } from "fastify";
import { requireAuth } from "../../plugins/requireAuth";
import {
  initiateCryptoDepositBody,
  InitiateCryptoDepositResponse,
  webhookBodySchema,
  CryptoAddressResponse,
  cryptoWithdrawBody,
  CryptoWithdrawResponse,
} from "./crypto.schema";
import { CryptoService } from "./crypto.service";
import { z } from "zod";

const depositRoutes: FastifyPluginAsync = async (fastify) => {
  const svc = new CryptoService(fastify);

  fastify.post(
    "/deposit/initiate",
    {
      preHandler: requireAuth(fastify),
      schema: { body: initiateCryptoDepositBody, response: { 200: InitiateCryptoDepositResponse } },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const body = initiateCryptoDepositBody.parse(request.body);
      const headers = new Headers();
      Object.entries(request.headers).forEach(([k, v]) => { if (v) headers.append(k, v.toString()); });
      const bearToken = await request.server.auth.api.getToken({ headers });

      const intent = await svc.createDepositIntent({
        userId,
        tokenSymbol: body.tokenSymbol,
        network: body.network,
        bearerToken: bearToken.token,
      });

      return reply.code(200).send(InitiateCryptoDepositResponse.parse(intent));
    }
  );

  // ------------------- GET /crypto/address -------------------
  fastify.get(
    "/address",
    {
      preHandler: requireAuth(fastify),
      schema: { response: { 200: CryptoAddressResponse } },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const headers = new Headers();
      Object.entries(request.headers).forEach(([k, v]) => { if (v) headers.append(k, v.toString()); });
      const bearToken = await request.server.auth.api.getToken({ headers });
      const addr = await svc.getAddress(userId, bearToken.token);
      return reply.code(200).send(CryptoAddressResponse.parse(addr));
    }
  );

  // ------------------- POST /crypto/withdraw -------------------
  fastify.post(
    "/withdraw",
    {
      preHandler: requireAuth(fastify),
      schema: { body: cryptoWithdrawBody, response: { 200: CryptoWithdrawResponse, 400: z.object({ error: z.string() }) } },
    },
    async (request, reply) => {
      try {
        const userId = request.currentUserId as string;
        const body = cryptoWithdrawBody.parse(request.body);
        const headers = new Headers();
        Object.entries(request.headers).forEach(([k, v]) => { if (v) headers.append(k, v.toString()); });
        const bearToken = await request.server.auth.api.getToken({ headers });
        const res = await svc.withdraw(userId, body, bearToken.token);
        return reply.code(200).send(CryptoWithdrawResponse.parse(res));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        return reply.code(400).send({ error: msg });
      }
    }
  );

  // ------------------- POST /crypto/deposit/webhook -------------------
  fastify.post(
    "/deposit/webhook",
    {
      schema: { body: webhookBodySchema, response: { 200: z.object({ success: z.boolean() }) } },
    },
    async (request, reply) => {
      const payload = webhookBodySchema.parse(request.body);
      await svc.processDepositWebhook(payload);
      return reply.code(200).send({ success: true });
    }
  );
};

export default depositRoutes;
