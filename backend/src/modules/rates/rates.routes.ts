import type { FastifyPluginAsync } from "fastify";
import { priceFeeds } from "../../db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const RateItem = z.object({
  tokenSymbol: z.string(),
  priceNgnBase: z.string(),
  priceNgnBuy: z.string(),
  priceNgnSell: z.string(),
  source: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

const RateListResponse = z.object({ items: RateItem.array() });

const serializeRate = (row: (typeof priceFeeds)["$inferSelect"]) => ({
  tokenSymbol: row.tokenSymbol,
  priceNgnBase: row.priceNgnBase,
  priceNgnBuy: row.priceNgnBuy,
  priceNgnSell: row.priceNgnSell,
  source: row.source ?? null,
  updatedAt: row.updatedAt ? row.updatedAt.toISOString() : null,
});

const ratesRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /rates - all tokens
  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    tokenSymbol: { type: "string" },
                    priceNgnBase: { type: "string" },
                    priceNgnBuy: { type: "string" },
                    priceNgnSell: { type: "string" },
                    source: { type: ["string", "null"] },
                    updatedAt: { type: ["string", "null"] },
                  },
                  required: [
                    "tokenSymbol",
                    "priceNgnBase",
                    "priceNgnBuy",
                    "priceNgnSell",
                    "source",
                    "updatedAt",
                  ],
                },
              },
            },
            required: ["items"],
          },
        },
      },
    },
    async (_request, reply) => {
      const rows = await fastify.db.select().from(priceFeeds);
      const payload = RateListResponse.parse({
        items: rows.map(serializeRate),
      });
      return reply.code(200).send(payload);
    }
  );

  // GET /rates/:token - single token
  fastify.get<{ Params: { token: string } }>(
    "/:token",
    {
      schema: {
        response: {
          200: {
            type: "object",
            properties: {
              tokenSymbol: { type: "string" },
              priceNgnBase: { type: "string" },
              priceNgnBuy: { type: "string" },
              priceNgnSell: { type: "string" },
              source: { type: ["string", "null"] },
              updatedAt: { type: ["string", "null"] },
            },
            required: [
              "tokenSymbol",
              "priceNgnBase",
              "priceNgnBuy",
              "priceNgnSell",
              "source",
              "updatedAt",
            ],
          },
          404: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
            required: ["error"],
          },
        },
      },
    },
    async (request, reply) => {
      const token = request.params.token.toLowerCase();
      const [row] = await fastify.db
        .select()
        .from(priceFeeds)
        .where(eq(priceFeeds.tokenSymbol, token));

      if (!row) return reply.code(404).send({ error: "Rate not found" });

      const payload = RateItem.parse(serializeRate(row));
      return reply.code(200).send(payload);
    }
  );
};

export default ratesRoutes;
