import {
  pgTableCreator,
  uuid,
  varchar,
  timestamp,
  integer,
  decimal,
  boolean,
  jsonb,
  pgEnum,
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

export const withdrawStatusEnum = pgEnum('withdraw_status', [
  'pending',
  'processing',
  'completed',
  'failed',
]);

// ----------------- USERS -----------------
export const users = createTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  betterAuthId: varchar('better_auth_id', { length: 255 }),
  walletAddress: varchar('wallet_address', { length: 255 }),
  pinHash: varchar('pin_hash', { length: 255 }),
  pinSalt: varchar('pin_salt', { length: 255 }),
  pinFailedAttempts: integer('pin_failed_attempts').default(0),
  pinLockedUntil: timestamp('pin_locked_until', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ----------------- BALANCES -----------------
export const balances = createTable('balances', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  tokenSymbol: varchar('token_symbol', { length: 10 }).notNull(),
  balance: decimal('balance', { precision: 38, scale: 18 }).default('0'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ----------------- TRANSACTIONS -----------------
export const transactions = createTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
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
  userId: uuid('user_id').references(() => users.id).notNull(),
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
  userId: uuid('user_id').references(() => users.id).notNull(),
  tokenSymbol: varchar('token_symbol', { length: 10 }).notNull(),
  amountFiat: decimal('amount_fiat', { precision: 38, scale: 2 }).notNull(),
  amountToken: decimal('amount_token', { precision: 38, scale: 18 }).notNull(),
  status: fiatDepositStatusEnum('status').notNull(),
  provider: varchar('provider', { length: 255 }),
  providerRef: varchar('provider_ref', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ----------------- CRYPTO DEPOSITS -----------------
export const cryptoDeposits = createTable('crypto_deposits', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  tokenSymbol: varchar('token_symbol', { length: 10 }).notNull(),
  amountToken: decimal('amount_token', { precision: 38, scale: 18 }).notNull(),
  network: varchar('network', { length: 50 }).notNull(),
  depositAddress: varchar('deposit_address', { length: 255 }).notNull(),
  txHash: varchar('tx_hash', { length: 255 }).unique(),
  status: cryptoDepositStatusEnum('status').notNull(),
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
export const stakes = createTable('stakes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  poolId: uuid('pool_id').references(() => pools.id).notNull(),
  amountStaked: decimal('amount_staked', { precision: 38, scale: 18 }).notNull(),
  startDate: timestamp('start_date', { withTimezone: true }).defaultNow(),
  lockPeriodDays: integer('lock_period_days').notNull(),
  apy: decimal('apy', { precision: 5, scale: 2 }).notNull(),
  status: stakeStatusEnum('status').notNull(),
  lastRewardCalcAt: timestamp('last_reward_calc_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ----------------- REWARD CLAIMS -----------------
export const rewardClaims = createTable('reward_claims', {
  id: uuid('id').defaultRandom().primaryKey(),
  stakeId: uuid('stake_id').references(() => stakes.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  amountToken: decimal('amount_token', { precision: 38, scale: 18 }).notNull(),
  claimedAt: timestamp('claimed_at', { withTimezone: true }).defaultNow(),
  txHash: varchar('tx_hash', { length: 255 }),
});

// ----------------- AUDIT LOGS -----------------
export const auditLogs = createTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 255 }).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ----------------- PRICE FEEDS -----------------
export const priceFeeds = createTable('price_feeds', {
  id: uuid('id').defaultRandom().primaryKey(),
  tokenSymbol: varchar('token_symbol', { length: 10 }).notNull(),
  priceNgn: decimal('price_ngn', { precision: 38, scale: 2 }).notNull(),
  source: varchar('source', { length: 255 }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
