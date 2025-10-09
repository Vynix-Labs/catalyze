
// Auth and Auth pin hook
export type authPin = {
  pin: number;
};


// Transaction types based on API documentation
export type TransactionType = "deposit" | "withdraw" | "transfer" | "stake" | "unstake" | "claim";
export type TransactionSubtype = "fiat" | "crypto";
export type TransactionStatus = "pending" | "processing" | "completed" | "failed";

export type transactions = {
  items: {
    id: string;
    userId: string;
    type: TransactionType;
    subtype: TransactionSubtype | null;
    tokenSymbol: string;
    amountToken: string;
    amountFiat: string | null;
    status: TransactionStatus;
    reference: string | null;
    txHash: string | null;
    metadata: any;
    createdAt: string;
    updatedAt: string;
  }[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type balances = {
  items: {
    tokenSymbol: string;
    balance: string;
    fiatEquivalent: string;
  }[];
  totalFiat: string;
};



// fiat hook
export type fiatDeposit = {
  amountFiat: number;
  tokenSymbol: string;
};
export type fiatResponse = {
  id: string;
  amountFiat: string;
  amountToken: string;
  status: string;
  provider: string;
  providerRef: string;
  paymentInstructions: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
};

export type conFirmDeposit = {
  additionalProp1: string;
  additionalProp2: string;
  additionalProp3: string;
};
