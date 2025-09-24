import {config} from "dotenv";
import {z} from "zod";

config();

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    APP_URL: z.string().min(1),
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
//   CHIPIPAY_JWT_ISSUER: z.string().url(),
  CHIPIPAY_CLIENT_ID: z.string().min(1),
  CHIPI_API_PUBLIC_KEY: z.string().min(1),
  CHIPI_ENCRYPT_KEY: z.string().min(1),
  STARKNET_RPC_URL: z.string().url().optional().default("https://starknet-mainnet.public.blastapi.io"),

  // Redis Configuration
  REDIS_HOST: z.string().optional().default("localhost"),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.coerce.number().optional().default(0),

});

export type env = z.infer<typeof envSchema>;

const { data: env, error } = envSchema.safeParse(process.env);

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export default env!;