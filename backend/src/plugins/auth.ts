// src/plugins/auth.ts
import { FastifyPluginAsync } from "fastify";
import { betterAuth } from "better-auth";

// Create the Better Auth instance
export const auth = betterAuth({
  secret: process.env.JWT_SECRET!,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});

// Fastify plugin to decorate instance
const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate("auth", auth);
};

declare module "fastify" {
  interface FastifyInstance {
    auth: typeof auth;
  }
}

export default authPlugin;
