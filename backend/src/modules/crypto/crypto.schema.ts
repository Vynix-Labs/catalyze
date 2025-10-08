import { z } from "zod";

export const initiateCryptoDepositBody = z.object({
  tokenSymbol: z.enum(["USDT", "USDC", "STRK"]),
  network: z.string().default("starknet"), // extendable
  // optional: request per-user address or shared-address-with-memo
  addressType: z.enum(["per_user", "shared"]).default("per_user"),
});

export const InitiateCryptoDepositResponse = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  tokenSymbol: z.string(),
  depositAddress: z.string(),
  memo: z.string().nullable(),
  status: z.enum(["pending", "confirmed", "failed"]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const depositIdParam = z.object({
  id: z.string().uuid(),
});

export const webhookBodySchema = z.object({
  // example generic webhook shape; you may adapt to provider
  txHash: z.string(),
  tokenSymbol: z.string(),
  network: z.string(),
  from: z.string(),
  to: z.string(),
  amount: z.string(), // raw token units (string) OR human amount depending on provider
  decimals: z.number().optional(),
  confirmations: z.number().optional(),
  event: z.enum(["transfer", "mint", "confirmed"]).optional(),
});

export type InitiateCryptoDepositBody = z.infer<typeof initiateCryptoDepositBody>;
export type WebhookBody = z.infer<typeof webhookBodySchema>;
