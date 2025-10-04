import { z } from "zod";

// Query params for listing
export const listTransactionsQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(20),
  type: z.enum(["deposit", "withdraw", "transfer", "stake", "unstake", "claim"]).optional(),
  subtype: z.enum(["fiat", "crypto"]).optional(),
  status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
  tokenSymbol: z.string().max(10).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(["createdAt", "amountFiat", "amountToken"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export type ListTransactionsQuery = z.infer<typeof listTransactionsQuery>;

// Path param for single transaction
export const transactionIdParam = z.object({
  id: z.string().uuid(),
});

// Transaction response item
export const TransactionItem = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.enum(["deposit","withdraw","transfer","stake","unstake","claim"]),
  subtype: z.enum(["fiat","crypto"]).nullable(),
  tokenSymbol: z.string(),
  amountToken: z.string(),
  amountFiat: z.string().nullable(),
  status: z.enum(["pending","processing","completed","failed"]),
  reference: z.string().nullable(),
  txHash: z.string().nullable(),
  metadata: z.any().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// List response
export const TransactionsListResponse = z.object({
  items: z.array(TransactionItem),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

// Single response
export const TransactionResponse = TransactionItem;
