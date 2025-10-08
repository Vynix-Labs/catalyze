export const endpoints = {
  // auth handled by better-auth
  // Other routes.
  auth: {
    setPin: "/auth/set-pin",
    verifyPin: "/auth/verify-pin",
    uth: "/auth", //(Get, post, put, delete, options)
  },

  fiat: {
    initiateDeposit: "/fiat/deposit/initiate",
    confirmDeposit: "/fiat/deposit/confirm",
    fiat: "/fiat", //(Get, post, put, delete, options)
  },

  transactions: {
    all: "/transactions",
    singleTransaction: (id: string) => `/transactions/${id}`,
    adminTransactions: "/admin/transactions",
    balance: "/users/balances",
    balanceWithToken: (token: string) => `/users/balances/${token}`,
  },
};
