import type { FastifyPluginAsync } from "fastify";
import { requireAuth } from "../../plugins/requireAuth";
import { StakingService } from "./staking.service";
import {
  StakeBody,
  UnstakeBody,
  StakingActionResponse,
  StrategiesResponse,
  listStrategiesQuery,
} from "./staking.schema";
import { validatePinToken } from "../../utils/pinToken";
import { ErrorResponse } from "../../schemas/common";

const PIN_ERROR_MESSAGE = "Invalid or expired PIN token";

const stakingRoutes: FastifyPluginAsync = async (fastify) => {
  const svc = new StakingService(fastify.db);

  // ------------------- GET /staking/strategies -------------------
  fastify.get(
    "/strategies",
    {
      schema: {
        querystring: listStrategiesQuery,
        response: { 200: StrategiesResponse },
      },
    },
    async (request, reply) => {
      const q = listStrategiesQuery.parse(request.query);
      const result = await svc.listStrategies({
        page: q.page,
        limit: q.limit,
        tokenSymbol: q.tokenSymbol,
        sortBy: q.sortBy,
        sortDir: q.sortDir,
      });
      return reply.code(200).send(result);
    }
  );

  // ------------------- POST /staking/stake -------------------
  fastify.post(
    "/staking/stake",
    {
      preHandler: requireAuth(fastify),
      schema: { body: StakeBody, response: { 200: StakingActionResponse, 400: ErrorResponse } },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const body = StakeBody.parse(request.body);
      const { strategyId, amount, pinToken } = body;
      const pinValid = await validatePinToken(fastify, userId, pinToken, "crypto_stake");
      if (!pinValid) {
        return reply.status(400).send({ error: PIN_ERROR_MESSAGE });
      }

      const result = await svc.stake(userId, strategyId, amount);
      return reply.code(200).send(result);
    }
  );

  // ------------------- POST /staking/unstake -------------------
  fastify.post(
    "/staking/unstake",
    {
      preHandler: requireAuth(fastify),
      schema: { body: UnstakeBody, response: { 200: StakingActionResponse, 400: ErrorResponse } },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const body = UnstakeBody.parse(request.body);
      const { strategyId, amount, pinToken } = body;
      const pinValid = await validatePinToken(fastify, userId, pinToken, "crypto_unstake");
      if (!pinValid) {
        return reply.status(400).send({ error: PIN_ERROR_MESSAGE });
      }

      const result = await svc.unstake(userId, strategyId, amount);
      return reply.code(200).send(result);
    }
  );
}
;

export default stakingRoutes;
