import { FastifyPluginAsync } from 'fastify';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  // Create a Postgres client
  const sql = postgres(process.env.DATABASE_URL!);

  // Create Drizzle instance with the schema
  const db = drizzle(sql, { schema });

  // Make db available on Fastify instance
  fastify.decorate('db', db);
};

export default dbPlugin;
