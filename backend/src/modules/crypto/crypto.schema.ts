import { z } from "zod";

export const initiateCryptoDepositBody = z.object({
  tokenSymbol: z.enum(["USDT", "USDC", "STRK"]),
  network: z.string().default("starknet"), // extendable
  // optional: request per-user address or shared-address-with-memo
  addressType: z.enum(["per_user", "shared"]).default("per_user"),
});

export const InitiateCryptoDepositResponse = z.object({
  id: z.string().uuid(),
  userId: z.string().optional(),
  tokenSymbol: z.string().optional(),
  depositAddress: z.string(),
  memo: z.string().nullable().optional(),
  status: z.enum(["pending", "confirmed", "failed"]).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
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

// New: address response
export const CryptoAddressResponse = z.object({
  address: z.string(),
  network: z.string(),
});

// New: withdraw
export const cryptoWithdrawBody = z.object({
  tokenSymbol: z.enum(["USDT", "USDC", "STRK", "ETH", "WETH", "WBTC"]),
  amount: z.number().positive(),
  toAddress: z.string(),
  pinToken: z.string().uuid(),
});

export const CryptoWithdrawResponse = z.object({
  reference: z.string(),
  status: z.enum(["pending", "processing", "completed", "failed"]).default("processing"),
  txHash: z.string().optional(),
});
