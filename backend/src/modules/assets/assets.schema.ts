import { z } from "zod";

export const CryptoAssetSchema = z.object({
  symbol: z.string(),
  contractAddress: z.string(),
  decimals: z.number().int(),
  network: z.string(),
});

export const FiatAssetSchema = z.object({
  currency: z.string(),
  decimals: z.number().int(),
});

export const AssetsResponseSchema = z.object({
  crypto: CryptoAssetSchema.array(),
  fiat: FiatAssetSchema.array(),
});

export type CryptoAsset = z.infer<typeof CryptoAssetSchema>;
export type FiatAsset = z.infer<typeof FiatAssetSchema>;
export type AssetsResponse = z.infer<typeof AssetsResponseSchema>;
