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
    //new endpoints 09/10/2025
    onchainBalance: "/users/onchain-balance",
    onchainBalanceWithToken: (token: string) =>
      `/users/onchain-balance/${token}`,
  },

  rates: {
    all: "/rates",
    single: (token: string) => `/rates/${token}`,
  },

  default: {
    default: "/",

    cryptoDepositInitiate: "/crypto/deposit/initiate",
    cryptoAddress: "/crypto/address",
    cryptoWithdraw: "/crypto/withdraw",
    cryptoDepositWebhook: "/crypto/deposit/webhook",
    stakingStrategies: "/staking/strategies",
    stakingStake: "/staking/staking/stake",
    stakingUnstake: "/staking/staking/unstake",
  },

  staking: {
    strategies: "/staking/strategies",
    stake: "/staking/staking/stake",
    unstake: "/staking/staking/unstake",
    user_stakes: "/staking/user-stakes",
  },
};
