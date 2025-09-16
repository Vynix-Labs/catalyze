import { FastifyPluginAsync } from "fastify";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  // Configure postgres.js pool
  const client = postgres(process.env.DATABASE_URL, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 30,
    ssl: process.env.NODE_ENV === "production" ? "require" : false,
  });

  const db = drizzle(client, { schema });

  fastify.decorate("db", db);

  // Gracefully close pool on shutdown
  fastify.addHook("onClose", async () => {
    await client.end({ timeout: 5 }); // waits up to 5s for pool to close
  });
};

export default dbPlugin;

declare module "fastify" {
  interface FastifyInstance {
    db: ReturnType<typeof drizzle<typeof schema>>;
  }
}
