import type { ChainToken } from "@chipi-stack/backend";

const CHAIN_TOKEN_MAP = {
  usdt: "USDT",
  usdc: "USDC",
  strk: "STRK",
  weth: "ETH",
  wbtc: "WBTC",
} as const;

type ChainTokenMap = typeof CHAIN_TOKEN_MAP;
type ChainTokenValues = ChainTokenMap[keyof ChainTokenMap];

export type CryptoCurrency = keyof ChainTokenMap;
export type SupportedChainToken = Extract<ChainToken, ChainTokenValues>;

const REVERSE_CHAIN_TOKEN_MAP = Object.fromEntries(
  Object.entries(CHAIN_TOKEN_MAP).map(([lower, upper]) => [upper, lower])
) as Record<SupportedChainToken, CryptoCurrency>;

export function toChainToken(token: CryptoCurrency): SupportedChainToken {
  const chainToken = CHAIN_TOKEN_MAP[token];
  if (!chainToken) {
    throw new Error(`Unsupported crypto currency: ${token}`);
  }
  return chainToken as SupportedChainToken;
}

export function fromChainToken(token: ChainToken): CryptoCurrency {
  if (token in REVERSE_CHAIN_TOKEN_MAP) {
    return REVERSE_CHAIN_TOKEN_MAP[token as SupportedChainToken];
  }
  throw new Error(`Unsupported chain token: ${token}`);
}

export type FiatCurrency = "ngn";
export type Action = "buy" | "sell";
export type PriceQuoteType = "base" | Action;

export interface BalanceInfo {
  currency: CryptoCurrency;
  balance: number;
  balanceInNGN: number;
}

export interface PriceNGN {
  base: number;
  buy: number;
  sell: number;
}

export interface RateInfo {
  currency: CryptoCurrency;
  price: PriceNGN;
  source: string;
  lastUpdated: Date;
}

export interface TransferRequest {
  amount: number;
  currency: CryptoCurrency;
  toAddress?: string;
  toEmail?: string;
  beneficiaryId?: number;
}