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
};


