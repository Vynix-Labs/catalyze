import type { FastifyPluginAsync } from "fastify";
import { requireAuth } from "../../plugins/requireAuth";
import { StakingService } from "./staking.service";
import {
  StakeBody,
  UnstakeBody,
  StakingActionResponse,
  StrategiesResponse,
  BalanceResponse,
  listStrategiesQuery,
} from "./staking.schema";

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
      schema: { body: StakeBody, response: { 200: StakingActionResponse } },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const body = StakeBody.parse(request.body);

      const result = await svc.stake(userId, body.strategyId, body.amount);
      return reply.code(200).send(result);
    }
  );

  /*// ------------------- POST /staking/unstake -------------------
  fastify.post(
    "/staking/unstake",
    {
      preHandler: requireAuth(fastify),
      schema: { body: UnstakeBody, response: { 200: StakingActionResponse } },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const wallet = await fastify.db.query.userWallet.findFirst({ where: { userId } });
      const body = UnstakeBody.parse(request.body);

      const result = await svc.unstake(userId, wallet, body.strategyId, body.amount);
      return reply.code(200).send(result);
    }
  );

  // ------------------- GET /staking/balance -------------------
  fastify.get(
    "/staking/balance",
    {
      preHandler: requireAuth(fastify),
      schema: { response: { 200: BalanceResponse } },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const wallet = await fastify.db.query.userWallet.findFirst({ where: { userId } });
      const { strategyId } = request.query as any;

      const result = await svc.getUserBalance(wallet.publicKey, strategyId);
      return reply.code(200).send(result);
    }
  ); */
};

export default stakingRoutes;
