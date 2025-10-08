
// Auth and Auth pin hook
export type authPin = {
  pin: number;
};


// transaction hook
export type transactions = {
  items: [
    {
      id: string;
      userId: string;
      type: string;
      subtype: string;
      tokenSymbol: string;
      amountToken: string;
      amountFiat: string;
      status: string;
      reference: string;
      txHash: string;
      metadata: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
  meta: {
    page: 0;
    limit: 0;
    total: 0;
    totalPages: 0;
  };
};

export type balances = {
  items: [
    {
      tokenSymbol: string;
      balance: string;
      fiatEquivalent: string;
    }
  ];
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
