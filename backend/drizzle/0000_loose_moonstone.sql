CREATE TYPE "public"."crypto_deposit_status" AS ENUM('pending', 'confirmed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."fiat_deposit_status" AS ENUM('awaiting_payment', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."stake_status" AS ENUM('active', 'completed', 'unstaked', 'claimed');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."transaction_subtype" AS ENUM('fiat', 'crypto');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('deposit', 'withdraw', 'transfer', 'stake', 'unstake', 'claim');--> statement-breakpoint
CREATE TYPE "public"."withdraw_status" AS ENUM('pending', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TABLE "catalyze_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" varchar(255) NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "catalyze_balances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_symbol" varchar(10) NOT NULL,
	"balance" numeric(38, 18) DEFAULT '0',
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "catalyze_crypto_deposits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_symbol" varchar(10) NOT NULL,
	"amount_token" numeric(38, 18) NOT NULL,
	"network" varchar(50) NOT NULL,
	"deposit_address" varchar(255) NOT NULL,
	"tx_hash" varchar(255),
	"status" "crypto_deposit_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "catalyze_crypto_deposits_tx_hash_unique" UNIQUE("tx_hash")
);
--> statement-breakpoint
CREATE TABLE "catalyze_deposit_intents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_symbol" varchar(10) NOT NULL,
	"amount_fiat" numeric(38, 2) NOT NULL,
	"amount_token" numeric(38, 18) NOT NULL,
	"status" "fiat_deposit_status" NOT NULL,
	"provider" varchar(255),
	"provider_ref" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "catalyze_pools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_symbol" varchar(10) NOT NULL,
	"lock_period_days" integer NOT NULL,
	"apy" numeric(5, 2) NOT NULL,
	"active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "catalyze_price_feeds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_symbol" varchar(10) NOT NULL,
	"price_ngn" numeric(38, 2) NOT NULL,
	"source" varchar(255),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "catalyze_reward_claims" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stake_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"amount_token" numeric(38, 18) NOT NULL,
	"claimed_at" timestamp with time zone DEFAULT now(),
	"tx_hash" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "catalyze_stakes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"pool_id" uuid NOT NULL,
	"amount_staked" numeric(38, 18) NOT NULL,
	"start_date" timestamp with time zone DEFAULT now(),
	"lock_period_days" integer NOT NULL,
	"apy" numeric(5, 2) NOT NULL,
	"status" "stake_status" NOT NULL,
	"last_reward_calc_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "catalyze_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "transaction_type" NOT NULL,
	"subtype" "transaction_subtype",
	"token_symbol" varchar(10) NOT NULL,
	"amount_token" numeric(38, 18) NOT NULL,
	"amount_fiat" numeric(38, 2),
	"status" "transaction_status" NOT NULL,
	"reference" varchar(255) NOT NULL,
	"tx_hash" varchar(255),
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "catalyze_transactions_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "catalyze_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"better_auth_id" varchar(255),
	"wallet_address" varchar(255),
	"pin_hash" varchar(255),
	"pin_salt" varchar(255),
	"pin_failed_attempts" integer DEFAULT 0,
	"pin_locked_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "catalyze_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "catalyze_withdraw_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_symbol" varchar(10) NOT NULL,
	"amount_fiat" numeric(38, 2) NOT NULL,
	"amount_token" numeric(38, 18) NOT NULL,
	"bank_name" varchar(255) NOT NULL,
	"account_number" varchar(50) NOT NULL,
	"status" "withdraw_status" NOT NULL,
	"reference" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "catalyze_withdraw_requests_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
ALTER TABLE "catalyze_audit_logs" ADD CONSTRAINT "catalyze_audit_logs_user_id_catalyze_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."catalyze_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalyze_balances" ADD CONSTRAINT "catalyze_balances_user_id_catalyze_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."catalyze_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalyze_crypto_deposits" ADD CONSTRAINT "catalyze_crypto_deposits_user_id_catalyze_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."catalyze_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalyze_deposit_intents" ADD CONSTRAINT "catalyze_deposit_intents_user_id_catalyze_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."catalyze_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalyze_reward_claims" ADD CONSTRAINT "catalyze_reward_claims_stake_id_catalyze_stakes_id_fk" FOREIGN KEY ("stake_id") REFERENCES "public"."catalyze_stakes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalyze_reward_claims" ADD CONSTRAINT "catalyze_reward_claims_user_id_catalyze_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."catalyze_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalyze_stakes" ADD CONSTRAINT "catalyze_stakes_user_id_catalyze_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."catalyze_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalyze_stakes" ADD CONSTRAINT "catalyze_stakes_pool_id_catalyze_pools_id_fk" FOREIGN KEY ("pool_id") REFERENCES "public"."catalyze_pools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalyze_transactions" ADD CONSTRAINT "catalyze_transactions_user_id_catalyze_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."catalyze_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalyze_withdraw_requests" ADD CONSTRAINT "catalyze_withdraw_requests_user_id_catalyze_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."catalyze_users"("id") ON DELETE no action ON UPDATE no action;