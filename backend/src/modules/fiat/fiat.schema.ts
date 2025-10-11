import { z } from "zod";

export const initiateFiatDepositSchema = z.object({
  amountFiat: z.number().positive().min(20).max(10_000_000),
  tokenSymbol: z.enum(["USDT", "USDC", "STRK", "WETH", "WBTC"]),
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

export const SuccessResponse = z
  .object({
    success: z.boolean(),
  })
  .passthrough(); // allow extra fields

export const ErrorResponse = z.object({ error: z.string() });

export type InitiateFiatDepositInput = z.infer<typeof initiateFiatDepositSchema>;

// Withdraw/Transfer (token -> fiat)
export const initiateFiatTransferSchema = z.object({
  amountFiat: z.number().positive().min(20).max(10_000_000),
  tokenSymbol: z.enum(["USDT", "USDC", "STRK", "WETH", "WBTC"]),
  bankName: z.string().min(1),
  bankCode: z.string().min(1),
  accountNumber: z.string().min(6),
  narration: z.string().max(80).optional(),
  pinToken: z.string().uuid(),
});

export type InitiateFiatTransferInput = z.infer<typeof initiateFiatTransferSchema>;

export const FiatTransferResponse = z.object({
  id: z.string(),
  amountFiat: z.string(),
  amountToken: z.string(),
  status: z.string(),
  provider: z.string(),
  reference: z.string(),
  monnifyResponse: z.object({}).passthrough(),
});

export const AuthorizeTransferSchema = z.object({
  reference: z.string(),
  authorizationCode: z.string().min(4).max(12),
});

export const TransferStatusResponse = z.object({
  reference: z.string(),
  status: z.string(),
  monnifyResponse: z.object({}).passthrough(),
});


export type AuthorizeTransferInput = z.infer<typeof AuthorizeTransferSchema>;