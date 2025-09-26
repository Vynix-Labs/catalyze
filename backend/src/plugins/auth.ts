import type { FastifyPluginAsync } from "fastify";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"
import * as schema from "../db/schema"
import { emailOTP, openAPI, jwt } from 'better-auth/plugins';
import { sendOtp } from "../utils/email/otp";
import fp from "fastify-plugin";
import env from "../config/env";
import { sendEmail } from "../utils/email/resend";
import { RedisSecondaryStorage } from "./redisSecondaryStorage";

export const auth = betterAuth({
  secret: env.JWT_SECRET!,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false, // don't allow user to set role
      },
    },
  },

  secondaryStorage: new RedisSecondaryStorage(),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail(user.email, "Reset your password", `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reset your password</h2>
            <p>Hi ${user.name},</p>
            <p>Please click the button below to reset your password:</p>
            <a href="${url}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
              Reset Password
            </a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${url}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              This email was sent from Catalyze. Please do not reply to this email.
            </p>
          </div>
        `);
    },
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  basePath: "/api/auth",
  trustedOrigins: ["http://localhost:3000", `${env.APP_URL}`],

  advanced: {
    cookies: {
      session_token: {
        name: "catalyze_session",
        attributes: {
          sameSite: "none",
          httpOnly: false,
          secure: true,
        },
      },
    },
    defaultCookieAttributes: {
      sameSite: "none",
      httpOnly: false,
      secure: true,
    },
    cookiePrefix: "catalyze",
    // crossSubDomainCookies: {
    //   enabled: true,
    // },
  },
  
  plugins: [
    openAPI(),
    jwt(),
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

export type User = typeof auth.$Infer.Session.user

export default fp(authPlugin);
