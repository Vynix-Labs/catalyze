export const RoutePath = {
  ROOT: "/",

  // app routes (children of Layout)
  DASHBOARD: "/dashboard",
  INVESTMENT: "/dashboard/investment",
  REWARD: "/dashboard/reward",
  MORE: "/dashboard/more",

  // nested
  TRANSFER: "/dashboard/transfer",
  STAKING: "/dashboard/more/staking",
  ENTERAMOUNT: "/dashboard/more/enter-amount",
  SETTINGS: "/dashboard/more/settings",

  // nested under settings
  PERSONAL_INFO: "/dashboard/more/settings/personal-info",
  TRANSACTION_PIN: "/dashboard/more/settings/transaction-pin",
  UPDATE_PASSWORD: "/dashboard/more/settings/update-password",

  // auth routes (standalone, can keep absolute or move under "auth")
  CREATE_ACCOUNT: "/auth/create-account",
  CREATE_TRANSACTION_PIN: "/auth/create-pin",
  SIGNIN: "/auth/signin",
  RESET_PASSWORD: "/auth/reset-password",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_OTP: "/auth/reset-otp",
  CREATE_PASSWORD: "/auth/create-password",
};
