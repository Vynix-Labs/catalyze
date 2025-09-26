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

// ---------------- TRANSFER (Withdraw) ----------------
export const initiateFiatTransferSchema = z.object({
  amountFiat: z.number().positive().min(100).max(10_000_000),
  tokenSymbol: z.enum(["USDT", "USDC", "STRK"]),
  bankName: z.string().min(2).max(255),
  bankCode: z.string().min(3).max(10),
  accountNumber: z.string().min(6).max(20),
  narration: z.string().max(120).optional(),
});

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

export type InitiateFiatTransferInput = z.infer<typeof initiateFiatTransferSchema>;
export type AuthorizeTransferInput = z.infer<typeof AuthorizeTransferSchema>;