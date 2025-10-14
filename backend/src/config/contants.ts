import { type CryptoCurrency } from "./types";

export const USDT = "0x68f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8";
export const USDC = "0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8";
export const STRK = "0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
// export const ETH = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
export const WETH = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
export const WBTC =  "0x3fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac";

export const VESU_CONTRACT = "0x037ae3f583c8d644b7556c93a04b83b52fa96159b2b0cbd83c14d3122aef80a2";

export const TOKEN_MAP: Record<CryptoCurrency, string> = {
  usdt: USDT,
  usdc: USDC,
  strk: STRK,
  weth: WETH,
  wbtc: WBTC,
};

export const COINGECKO_IDS: Record<CryptoCurrency, string> = {
  usdt: "tether",
  usdc: "usd-coin",
  strk: "starknet",
  weth: "ethereum",
  wbtc: "bitcoin",
};

export const SPREAD = {
  buy: 15,
  sell: -5
};

export const TRADING_FEES = {
  buyPercent: 1,
  sellPercent: 1,
};

