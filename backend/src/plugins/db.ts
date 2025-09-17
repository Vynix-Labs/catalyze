import { FastifyPluginAsync } from "fastify";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Create the postgres.js client & drizzle instance once
const client = postgres(process.env.DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 30,
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
});

export const db = drizzle(client, { schema });

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate("db", db);

  // Gracefully close pool on shutdown
  fastify.addHook("onClose", async () => {
    await client.end({ timeout: 5 });
  });
};

export default dbPlugin;

declare module "fastify" {
  interface FastifyInstance {
    db: typeof db;
  }
}
