import type { FastifyInstance } from "fastify";
import { randomUUID } from "crypto";

const PREFIX = "pin_token";
const DEFAULT_TTL_SECONDS = 120; // 2 minutes

export async function issuePinToken(
  fastify: FastifyInstance,
  userId: string,
  scope: string = "any",
  ttlSeconds: number = DEFAULT_TTL_SECONDS
) {
  const token = randomUUID();
  const key = `${PREFIX}:${userId}:${token}`;
  const payload = JSON.stringify({ scope, userId });
  await fastify.redis.set(key, payload, "EX", ttlSeconds);
  return { token, expiresIn: ttlSeconds };
}

export async function validatePinToken(
  fastify: FastifyInstance,
  userId: string,
  token: string,
  scope: string = "any",
  consume: boolean = true
) {
  const key = `${PREFIX}:${userId}:${token}`;
  const val = await fastify.redis.get(key);
  if (!val) return false;
  try {
    const parsed = JSON.parse(val) as { scope?: string; userId?: string };
    const ok = (!!parsed?.userId && parsed.userId === userId) && (!!parsed?.scope && (parsed.scope === scope || parsed.scope === "any" || scope === "any"));
    if (ok && consume) {
      await fastify.redis.del(key);
    }
    return ok;
  } catch {
    await fastify.redis.del(key);
    return false;
  }
}
