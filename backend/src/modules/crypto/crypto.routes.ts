import type { FastifyPluginAsync } from "fastify";
import { requireAuth } from "../../plugins/requireAuth";
import {
  initiateCryptoDepositBody,
  InitiateCryptoDepositResponse,
  depositIdParam,
  webhookBodySchema,
} from "./crypto.schema";
import { CryptoDepositService } from "./crypto.service";
import { z } from "zod";

const depositRoutes: FastifyPluginAsync = async (fastify) => {
  const svc = new CryptoDepositService(fastify);

  fastify.post(
    "/deposit/initiate",
    {
      preHandler: requireAuth(fastify),
      schema: { body: initiateCryptoDepositBody, response: { 200: InitiateCryptoDepositResponse } },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const body = initiateCryptoDepositBody.parse(request.body);

      const intent = await svc.createDepositIntent({
        userId,
        tokenSymbol: body.tokenSymbol,
        network: body.network,
        addressType: body.addressType,
      });

      return reply.code(200).send(InitiateCryptoDepositResponse.parse(intent));
    }
  );
};

export default depositRoutes;
