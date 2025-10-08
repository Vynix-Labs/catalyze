
export type CryptoCurrency = "usdt" | "usdc" | "strk" | "weth" | "wbtc";
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