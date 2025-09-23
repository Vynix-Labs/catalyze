import { z } from "zod";

export const initiateFiatDepositSchema = z.object({
  amountFiat: z.number().positive().min(20).max(10_000_000),
  tokenSymbol: z.enum(["USDT", "USDC", "STRK"]),
});

export type InitiateFiatDepositInput = z.infer<typeof initiateFiatDepositSchema>;
