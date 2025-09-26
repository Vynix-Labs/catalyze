
export type CryptoCurrency = "usdt" | "usdc" | "strk" | "eth";
export type FiatCurrency = "ngn";
export type Action = "buy" | "sell";

export interface BalanceInfo {
    currency: CryptoCurrency;
    balance: number;
    balanceInNGN: number;
  }
  
  export interface RateInfo {
    currency: CryptoCurrency;
    rateInNGN: number;
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