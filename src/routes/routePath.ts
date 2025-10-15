export const RoutePath = {
  ROOT: "/",
  ONBOARDING: "/app",
  // app routes (children of Layout)
  DASHBOARD: "/app/dashboard",
  INVESTMENT: "/app/dashboard/investment",
  REWARD: "/app/dashboard/reward",
  MORE: "/app/dashboard/more",

  // nested
  TRANSFER: "/app/dashboard/transfer",
  STAKING: "/app/dashboard/more/staking",
  TRANSACTIONS: "/app/dashboard/transactions",
  ASSET: "/app/dashboard/asset/:token",
  ENTERAMOUNTPAGE: "/app/dashboard/more/staking/:crypto",
  SETTINGS: "/app/dashboard/more/settings",
  GAMIFICATION: "/app/dashboard/more/gamification",
  HISTORY: "/app/dashboard/more/history",
  LEARNING_HUB: "/app/dashboard/more/learning-hub",

  // nested under settings
  PERSONAL_INFO: "/app/dashboard/more/settings/personal-info",
  TRANSACTION_PIN: "/app/dashboard/more/settings/transaction-pin",
  UPDATE_PASSWORD: "/app/dashboard/more/settings/update-password",
  KYC: "/app/dashboard/more/settings/kyc",
  RECENT_ACTIVITY: "/app/dashboard/more/settings/recent-activity",
  PREFERENCES: "/app/dashboard/more/settings/preferences",
  NOTIFICATIONS: "/app/dashboard/more/settings/notifications",
  HELP_CENTER: "/app/dashboard/more/settings/help-center",
  CONTACT_SUPPORT: "/app/dashboard/more/settings/contact-support",
  PRIVACY_POLICY: "/app/dashboard/more/settings/privacy-policy",
  TERMS_OF_USE: "/app/dashboard/more/settings/terms-of-use",
  CLAIMREWARDPAGE: "/app/dashboard/more/staking/claim-reward",

  // auth routes (standalone, can keep absolute or move under "auth")
  CREATE_ACCOUNT: "/app/auth/create-account",
  CREATE_TRANSACTION_PIN: "/app/auth/create-pin",
  SIGNIN: "/app/auth/signin",
  RESET_PASSWORD: "/app/auth/reset-password",
  FORGOT_PASSWORD: "/app/auth/forgot-password",
  RESET_OTP: "/app/auth/reset-otp/:email",
  CREATE_PASSWORD: "/app/auth/create-password/:email",
};
