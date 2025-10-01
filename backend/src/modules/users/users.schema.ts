import { z } from "zod";

export const BalanceItem = z.object({
  tokenSymbol: z.string(),
  balance: z.string(),         // store as string for precision
  fiatEquivalent: z.string(),  // NGN value
});

export const BalancesResponse = z.object({
  items: z.array(BalanceItem),
  totalFiat: z.string(),
});

export const BalanceParam = z.object({
  token: z.string().max(10),
});

export const BalanceResponse = BalanceItem;
