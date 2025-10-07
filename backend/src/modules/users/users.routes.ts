import type { FastifyPluginAsync } from "fastify";
import { requireAuth } from "../../plugins/requireAuth";
import { BalancesService } from "./users.service";
import {
  BalancesResponse,
  BalanceParam,
  BalanceResponse,
  BalanceQuery,
} from "./users.schema";

const userRoutes: FastifyPluginAsync = async (fastify) => {
  const svc = new BalancesService(fastify.db);

  // ------------------- User: GET /balances -------------------
  fastify.get(
    "/balances",
    {
      preHandler: requireAuth(fastify),
      schema: { response: { 200: BalancesResponse } },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const { quote } = BalanceQuery.parse(request.query ?? {});
      const result = await svc.listUserBalances(userId, quote);
      return reply.code(200).send(BalancesResponse.parse(result));
    }
  );

  // ------------------- User: GET /balances/:token -------------------
  fastify.get(
    "/balances/:token",
    {
      preHandler: requireAuth(fastify),
      schema: { params: BalanceParam, response: { 200: BalanceResponse, 404: { type: "object", properties: { error: { type: "string" } } } } },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const { token } = BalanceParam.parse(request.params);
      const normalizedToken = token.toUpperCase();

      const { quote } = BalanceQuery.parse(request.query ?? {});
      const result = await svc.getUserBalance(userId, normalizedToken, quote);
      if (!result) return reply.code(404).send({ error: "Balance not found" });

      return reply.code(200).send(BalanceResponse.parse(result));
    }
  );
};

export default userRoutes;
