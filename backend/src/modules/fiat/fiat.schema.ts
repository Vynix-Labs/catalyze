import { z } from "zod";

export const initiateFiatDepositSchema = z.object({
  amountFiat: z.number().positive().min(20).max(10_000_000),
  tokenSymbol: z.enum(["USDT", "USDC", "STRK"]),
});

export const FiatDepositResponse = z.object({
  id: z.string(),
  amountFiat: z.string(),       // changed from number -> string
  amountToken: z.string(),      // changed from number -> string
  status: z.string(),
  provider: z.string(),
  providerRef: z.string(),
  paymentInstructions: z.object({}).passthrough(),
});

export const SuccessResponse = z.object({ success: z.boolean() });
export const ErrorResponse = z.object({ error: z.string() });

export type InitiateFiatDepositInput = z.infer<typeof initiateFiatDepositSchema>;
