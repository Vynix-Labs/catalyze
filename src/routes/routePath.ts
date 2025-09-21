export const RoutePath = {
  ROOT: "/",

  // app routes (children of Layout)
  DASHBOARD: "/dashboard",
  INVESTMENT: "investment",
  REWARD: "reward",
  MORE: "more",

  // nested
  TRANSFER: "/dashboard/transfer",
  STAKING: "/dashboard/more/staking",
  SETTINGS: "/dashboard/more/settings",

  // auth routes (standalone, can keep absolute or move under "auth")
  CREATE_ACCOUNT: "/auth/create-account",
  CREATE_TRANSACTION_PIN: "/auth/create-pin",
  SIGNIN: "/auth/signin",
  RESET_PASSWORD: "/auth/reset-password",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_OTP: "/auth/reset-otp",
  CREATE_PASSWORD: "/auth/create-password",
};
