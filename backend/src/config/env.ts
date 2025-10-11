import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  APP_URL: z.string().min(1),

  MONNIFY_BASE_URL: z.string().min(1),
  MONNIFY_API_KEY: z.string().min(1),
  MONNIFY_SECRET_KEY: z.string().min(1),
  MONNIFY_CONTRACT_CODE: z.string().min(1),
  MONNIFY_WALLET_ACCOUNT_NUMBER: z.string().min(1),

  SMTP_HOST: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional().default("Catalyze <no-reply@catalyze.com>"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // ChipiPay JWKS Configuration (NEW)
  CHIPI_API_PUBLIC_KEY: z.string().min(1),
  CHIPI_ENCRYPT_KEY: z.string().min(1),
  CHIPI_API_SECRET_KEY: z.string().min(1),
  STARKNET_RPC_URL: z.string().url().optional().default("https://starknet-mainnet.public.blastapi.io"),
  DEPOSIT_CONFIRMATIONS: z.coerce.number().optional().default(12),

  // Redis Configuration
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().optional().default("localhost"),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().optional().default(0),

  SYSTEM_WALLET_ADDRESS: z.string().min(1),
  SYSTEM_WALLET_KEY: z.string().min(1),

  TELEGRAM_TOKEN: z.string().min(1),
  ADMIN_CHAT_ID: z.string().min(1),
});

export type env = z.infer<typeof envSchema>;

const { data: env, error } = envSchema.safeParse(process.env);

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export default env!;