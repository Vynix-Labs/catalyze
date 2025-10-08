// src/plugins/db.ts
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";
import env from "../config/env";

const client = postgres(env.DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 30,
  ssl: env.NODE_ENV === "development" ? false : "require",
});

export const db = drizzle(client, { schema });

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate("db", db);

  fastify.addHook("onClose", async () => {
    await client.end({ timeout: 5 });
  });
};

export default fp(dbPlugin);

declare module "fastify" {
  interface FastifyInstance {
    db: typeof db;
  }
}
