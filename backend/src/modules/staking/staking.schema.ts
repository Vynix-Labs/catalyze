import { z } from "zod";

// ---------------------- Input Schemas ----------------------
export const StakeBody = z.object({
  strategyId: z.string(),
  amount: z.coerce.number().positive(),
});

export const listStrategiesQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  tokenSymbol: z.string().optional(),
  sortBy: z.enum(["apy", "tvlUsd", "name"]).default("tvlUsd"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export const UnstakeBody = z.object({
  strategyId: z.string(),
  amount: z.coerce.number().positive(),
});

// ---------------------- Response Schemas ----------------------
export const StakingActionResponse = z.object({
  status: z.boolean(),
  message: z.string(),
  txHash: z.string().nullable(),
});

export const StrategyItem = z.object({
  id: z.string(),
  name: z.string(),
  apy: z.number(),
  tokenSymbol: z.string(),
  tvlUsd: z.number(),
  contractAddress: z.string(),
  isAudited: z.boolean(),
});

export const StrategiesResponse = z.object({
  status: z.boolean(),
  strategies: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      apy: z.number(),
      tokenSymbol: z.string(),
      tvlUsd: z.number(),
      contractAddress: z.string(),
      isAudited: z.boolean(),
    })
  ),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export const BalanceResponse = z.object({
  status: z.boolean(),
  tokenSymbol: z.string(),
  stakedAmount: z.number(),
  fiatValue: z.number().optional(),
});

export type StakeBodyType = z.infer<typeof StakeBody>;
export type UnstakeBodyType = z.infer<typeof UnstakeBody>;
