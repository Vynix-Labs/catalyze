import {
  pgTableCreator,
  uuid,
  varchar,
  timestamp,
  integer,
  decimal,
  boolean,
  text,
  jsonb,
  pgEnum,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// Prefix all tables with catalyze
export const createTable = pgTableCreator((name) => `catalyze_${name}`);

// ----------------- ENUMS -----------------
export const transactionTypeEnum = pgEnum('transaction_type', [
  'deposit',
  'withdraw',
  'transfer',
  'stake',
  'unstake',
  'claim',
]);

export const transactionSubtypeEnum = pgEnum('transaction_subtype', [
  'fiat',
  'crypto',
]);

export const transactionStatusEnum = pgEnum('transaction_status', [
  'pending',
  'processing',
  'completed',
  'failed',
]);

export const stakeStatusEnum = pgEnum('stake_status', [
  'active',
  'completed',
  'unstaked',
  'claimed',
]);

export const cryptoDepositStatusEnum = pgEnum('crypto_deposit_status', [
  'pending',
  'confirmed',
  'failed',
]);

export const fiatDepositStatusEnum = pgEnum('fiat_deposit_status', [
  'awaiting_payment',
  'processing',
  'completed',
  'failed',
]);

export const reserveStatusEnum = pgEnum('reserve_status', [
  'pending',
  'succeeded',
  'expired',
  'needs_admin',
  'cancelled',
]);

export const withdrawStatusEnum = pgEnum('withdraw_status', [
  'pending',
  'processing',
  'completed',
  'failed',
]);

// ----------------- USERS -----------------
export const user = createTable("user", {
  id: text('id').primaryKey(),
  role: text("role").default("user"),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  betterAuthId: varchar("better_auth_id", { length: 255 }),
  walletAddress: varchar("wallet_address", { length: 255 }),
  pinHash: varchar("pin_hash", { length: 255 }),
  pinSalt: varchar("pin_salt", { length: 255 }),
  pinFailedAttempts: integer("pin_failed_attempts").default(0),
  pinLockedUntil: timestamp("pin_locked_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const wallet = createTable("wallet", {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  walletAddress: varchar("wallet_address", { length: 255 }).notNull(),
  encryptedPrivateKey: varchar("encrypted_private_key", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ----------------- BETTER-AUTH REQUIRED TABLE -----------------
export const session = createTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

// ----------------- BETTER-AUTH REQUIRED TABLE -----------------
export const account = createTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const verification = createTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ----------------- BALANCES -----------------
export const balances = createTable('balances', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  tokenSymbol: varchar('token_symbol', { length: 10 }).notNull(),
  balance: decimal('balance', { precision: 38, scale: 18 }).default('0'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  uniqueIndex("user_token_unique").on(t.userId, t.tokenSymbol)
]);

// ----------------- TRANSACTIONS -----------------
export const transactions = createTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  type: transactionTypeEnum('type').notNull(),
  subtype: transactionSubtypeEnum('subtype'),
  tokenSymbol: varchar('token_symbol', { length: 10 }).notNull(),
  amountToken: decimal('amount_token', { precision: 38, scale: 18 }).notNull(),
  amountFiat: decimal('amount_fiat', { precision: 38, scale: 2 }),
  status: transactionStatusEnum('status').notNull(),
  reference: varchar('reference', { length: 255 }).notNull().unique(),
  txHash: varchar('tx_hash', { length: 255 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ----------------- WITHDRAW REQUESTS -----------------
export const withdrawRequests = createTable('withdraw_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  tokenSymbol: varchar('token_symbol', { length: 10 }).notNull(),
  amountFiat: decimal('amount_fiat', { precision: 38, scale: 2 }).notNull(),
  amountToken: decimal('amount_token', { precision: 38, scale: 18 }).notNull(),
  bankName: varchar('bank_name', { length: 255 }).notNull(),
  accountNumber: varchar('account_number', { length: 50 }).notNull(),
  status: withdrawStatusEnum('status').notNull(),
  reference: varchar('reference', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ----------------- DEPOSIT INTENTS (FIAT) -----------------
export const depositIntents = createTable('deposit_intents', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  tokenSymbol: varchar('token_symbol', { length: 10 }).notNull(),
  amountFiat: decimal('amount_fiat', { precision: 38, scale: 2 }).notNull(),
  amountToken: decimal('amount_token', { precision: 38, scale: 18 }).notNull(),
  status: fiatDepositStatusEnum('status').notNull(),
  provider: varchar('provider', { length: 255 }),
  providerRef: varchar('provider_ref', { length: 255 }),
  // Keep as plain uuid to avoid circular TS references to reserves
  reserveId: uuid('reserve_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  uniqueIndex('deposit_provider_ref_unique').on(t.providerRef),
]);

// ----------------- RESERVES -----------------
export const reserves = createTable('reserves', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  tokenSymbol: varchar('token_symbol', { length: 10 }).notNull(),
  amountToken: decimal('amount_token', { precision: 38, scale: 18 }).notNull(),
  status: reserveStatusEnum('status').notNull(),
  // Keep as plain uuid to avoid circular TS references
  intentId: uuid('intent_id'),
  txHash: varchar('tx_hash', { length: 255 }),
  notes: jsonb('notes'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  uniqueIndex('reserve_intent_unique').on(t.intentId),
]);

// ----------------- CRYPTO DEPOSITS -----------------
export const cryptoDeposits = createTable('crypto_deposits', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => user.id).notNull(),
  tokenSymbol: varchar('token_symbol', { length: 10 }).notNull(),
  amountToken: decimal('amount_token', { precision: 38, scale: 18 }).notNull(),
  network: varchar('network', { length: 50 }).notNull(),
  depositAddress: varchar('deposit_address', { length: 255 }).notNull(),
  txHash: varchar('tx_hash', { length: 255 }).unique(),
  status: cryptoDepositStatusEnum('status').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const userWallets = createTable('user_wallets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => user.id).notNull().unique(),
  network: varchar('network', { length: 50 }).notNull().default('starknet'),
  publicKey: varchar('public_key', { length: 255 }).notNull(),
  encryptedPrivateKey: varchar('encrypted_private_key', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});


// ----------------- STAKING POOLS -----------------
export const pools = createTable('pools', {
  id: uuid('id').defaultRandom().primaryKey(),
  tokenSymbol: varchar('token_symbol', { length: 10 }).notNull(),
  lockPeriodDays: integer('lock_period_days').notNull(),
  apy: decimal('apy', { precision: 5, scale: 2 }).notNull(),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ----------------- STAKES -----------------
export const stakes = createTable("stakes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => user.id).notNull(),

  // From dynamic strategies
  strategyId: text("strategy_id").notNull(),
  strategyName: text("strategy_name").notNull(),
  tokenSymbol: text("token_symbol").notNull(),
  contractAddress: text("contract_address").notNull(),

  // Financial data
  amountStaked: decimal("amount_staked", { precision: 38, scale: 18 }).notNull(),
  apy: decimal("apy", { precision: 20, scale: 16 }).notNull(),

  // Optional status tracking
  status: stakeStatusEnum("status").default("active").notNull(),

  // On-chain metadata
  txHash: text("tx_hash"),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ----------------- REWARD CLAIMS -----------------
export const rewardClaims = createTable('reward_claims', {
  id: uuid('id').defaultRandom().primaryKey(),
  stakeId: uuid('stake_id').references(() => stakes.id).notNull(),
  userId: text('user_id').references(() => user.id).notNull(),
  amountToken: decimal('amount_token', { precision: 38, scale: 18 }).notNull(),
  claimedAt: timestamp('claimed_at', { withTimezone: true }).defaultNow(),
  txHash: varchar('tx_hash', { length: 255 }),
});

// ----------------- AUDIT LOGS -----------------
export const auditLogs = createTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => user.id),
  action: varchar('action', { length: 255 }).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ----------------- PRICE FEEDS -----------------
export const priceFeeds = createTable('price_feeds', {
  id: uuid('id').defaultRandom().primaryKey(),
  tokenSymbol: varchar('token_symbol', { length: 10 }).notNull(),
  // Base NGN price from source (no spread)
  priceNgnBase: decimal('price_ngn_base', { precision: 38, scale: 2 }).notNull(),
  // Buy price = base + spread.buy
  priceNgnBuy: decimal('price_ngn_buy', { precision: 38, scale: 2 }).notNull(),
  // Sell price = base + spread.sell
  priceNgnSell: decimal('price_ngn_sell', { precision: 38, scale: 2 }).notNull(),
  source: varchar('source', { length: 255 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  uniqueIndex("token_unique").on(t.tokenSymbol)
]);

export const jwks = createTable("jwks", {
  id: text("id").primaryKey(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: timestamp("created_at").notNull(),
});