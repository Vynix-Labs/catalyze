import { FastifyPluginAsync } from "fastify";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"
import * as schema from "../db/schema"
import { emailOTP } from 'better-auth/plugins';
import { sendOtp } from "../utils/email/otp";
import fp from "fastify-plugin";

export const auth = betterAuth({
  secret: process.env.JWT_SECRET!,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 60,
      sendVerificationOnSignUp: true,
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp }) {
        console.log('Sending verification OTP to', email, otp);
        await sendOtp(email, otp);
      },
    }),
  ],
});

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate("auth", auth);
};

declare module "fastify" {
  interface FastifyInstance {
    auth: typeof auth;
  }
}

export default fp(authPlugin);
