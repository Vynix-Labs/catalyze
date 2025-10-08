import type { FastifyPluginAsync } from "fastify";
import { requireAuth } from "../../plugins/requireAuth";
import { BalancesService } from "./users.service";
import {
  BalancesResponse,
  BalanceParam,
  BalanceResponse,
  BalanceQuery,
} from "./users.schema";
import { getNormalizedBalance } from "../../utils/wallet/tokens";
import { ensureUserWallet } from "../../utils/wallet/chipi";
import { z } from "zod";
import type { CryptoCurrency } from "../../config";

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

  // ------------------- User: GET /onchain-balance -------------------
  fastify.get(
    "/onchain-balance",
    {
      preHandler: requireAuth(fastify),
      schema: {
        response: {
          200: z.object({
            items: z.array(
              z.object({ tokenSymbol: z.string(), balance: z.number(), decimals: z.number(), rawBalance: z.string() })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const wallet = await ensureUserWallet(fastify, userId);
      const tokens: CryptoCurrency[] = ["usdt", "usdc", "strk", "eth", "weth", "wbtc"];
      const results = await Promise.all(
        tokens.map(async (t) => {
          const b = await getNormalizedBalance(wallet.publicKey, t);
          return { tokenSymbol: t, balance: b?.balance ?? 0, decimals: b?.decimals ?? 0, rawBalance: b?.rawBalance ?? "0" };
        })
      );
      return reply.code(200).send({ items: results });
    }
  );

  // ------------------- User: GET /onchain-balance/:token -------------------
  fastify.get(
    "/onchain-balance/:token",
    {
      preHandler: requireAuth(fastify),
      schema: {
        params: z.object({ token: z.string() }),
        response: {
          200: z.object({ tokenSymbol: z.string(), balance: z.number(), decimals: z.number(), rawBalance: z.string() }),
          404: z.object({ error: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const { token } = request.params as { token: string };
      const symbol = token.toLowerCase();
      const wallet = await ensureUserWallet(fastify, userId);
      const b = await getNormalizedBalance(wallet.publicKey, symbol as CryptoCurrency);
      if (!b) return reply.code(404).send({ error: "Balance not found" });
      return reply.code(200).send({ tokenSymbol: symbol, balance: b.balance, decimals: b.decimals, rawBalance: b.rawBalance });
    }
  );

  // ------------------- User: GET /balances/:token -------------------
  fastify.get(
    "/balances/:token",
    {
      preHandler: requireAuth(fastify),
      schema: {
        params: BalanceParam,
        response: {
          200: BalanceResponse,
          404: { type: "object", properties: { error: { type: "string" } } },
        },
      },
    },
    async (request, reply) => {
      const userId = request.currentUserId as string;
      const { token } = BalanceParam.parse(request.params);
      const normalizedToken = token.toLowerCase();

      const { quote } = BalanceQuery.parse(request.query ?? {});
      const result = await svc.getUserBalance(userId, normalizedToken, quote);
      if (!result) return reply.code(404).send({ error: "Balance not found" });

      return reply.code(200).send(BalanceResponse.parse(result));
    }
  );
};

export default userRoutes;
