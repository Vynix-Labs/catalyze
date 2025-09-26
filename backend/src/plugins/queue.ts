import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { queues, workers } from "../utils/queue";

const queuePlugin: FastifyPluginAsync = async (fastify) => {
  // Decorate fastify with queue instances
  fastify.decorate("queues", queues);
  fastify.decorate("queueWorkers", workers);

  fastify.log.info("BullMQ queues and workers initialized");

  // Graceful shutdown
  fastify.addHook("onClose", async () => {
    fastify.log.info("Closing BullMQ queues and workers...");
    // Workers and queues handle their own shutdown via process signals
  });
};

declare module "fastify" {
  interface FastifyInstance {
    queues: typeof queues;
    queueWorkers: typeof workers;
  }
}

export default fp(queuePlugin);
