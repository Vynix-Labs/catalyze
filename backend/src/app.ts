import Fastify from "fastify";
import dbPlugin from "./plugins/db";
import authPlugin from "./plugins/auth";
import betterAuthHandler from "./plugins/betterAuthHandler";
import routes from "./routes";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

export const buildApp = async () => {
  const fastify = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

  // Hook in Zod validator & serializer
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  // Register plugins
  await fastify.register(dbPlugin);
  await fastify.register(authPlugin);

  fastify.get("/api/debug-auth", async (request, reply) => {
    const hasAuth = "auth" in fastify;
    const sessionFunc = hasAuth && typeof (fastify as any).auth.getSession === "function";
    return { hasAuth, sessionFunc };
  });


  // Register Better Auth handler
  await fastify.register(betterAuthHandler, { prefix: '/api' });

  // register all other routes
  fastify.register(routes, { prefix: "/api" });

  return fastify;
};
