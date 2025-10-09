export const endpoints = {
  // auth handled by better-auth
  // Other routes.
  auth: {
    setPin: "/auth/set-pin",
    verifyPin: "/auth/verify-pin",
    uth: "/auth", //(Get, post, put, delete, options)
  },
  assets: {
    all: "/assets",
  },

  fiat: {
    initiateDeposit: "/fiat/deposit/initiate",
    confirmDeposit: "/fiat/deposit/confirm",
    fiat: "/fiat", //(Get, post, put, delete, options)

    fiatMonifyDisbursement: "/fiat/monnify/disbursements/{reference}", //get
    fiatTransferInitiate: "/fiat/transfer/initiate", //post
    fiatTransferConfirm: "/fiat/transfer/confirm", //post
    fiatMonifyBanks: "/fiat/monnify/banks", //get
    fiatMonifyResendOtp: "/fiat/monnify/resend-otp", //post
    fiatValidateMonify: "/fiat/monnify/validate-account", //post
    transferRef: "/fiat/transfer/{reference}/status", //get
  },

  transactions: {
    all: "/transactions",
    singleTransaction: (id: string) => `/transactions/${id}`,
    adminTransactions: "/admin/transactions",
    balance: "/users/balances",
    balanceWithToken: (token: string) => `/users/balances/${token}`,
  },

  rates: {
    all: "/rates",
    single: (token: string) => `/rates/${token}`,
  },
};
