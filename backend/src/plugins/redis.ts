import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { redis } from "../config/redis";

const redisPlugin: FastifyPluginAsync = async (fastify) => {
  // Decorate fastify with redis instance
  fastify.decorate("redis", redis);

  // Test Redis connection on plugin load
  try {
    const pong = await redis.ping();
    fastify.log.info(`Redis connection established successfully: ${pong}`);
  } catch (error: unknown) {
    fastify.log.error(error);
    throw error;
  }

  // Graceful shutdown
  fastify.addHook("onClose", async () => {
    fastify.log.info("Closing Redis connection...");
    await redis.quit();
  });
};

declare module "fastify" {
  interface FastifyInstance {
    redis: typeof redis;
  }
}

export default fp(redisPlugin);
