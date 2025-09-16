import { users } from "../../db/schema";
import { hashPin, verifyPinHash } from "../../utils/hash";
import { FastifyInstance } from "fastify";

export async function createUserWithPin(
  fastify: FastifyInstance,
  {
    betterAuthId,
    email,
    phone,
    pin,
  }: {
    betterAuthId: string;
    email: string;
    phone?: string;
    pin: string;
  }
) {
  const { hash } = await hashPin(pin);

  await fastify.db.insert(users).values({
    betterAuthId,
    email,
    phone,
    pinHash: hash,
  });
}

export async function verifyUserPin(
  fastify: FastifyInstance,
  {
    userId,
    pin,
  }: {
    userId: string;
    pin: string;
  }
) {
  const [user] = await fastify.db
    .select({
      pinHash: users.pinHash,
      failedAttempts: users.pinFailedAttempts,
      lockedUntil: users.pinLockedUntil,
    })
    .from(users)
    .where(users.id.eq(userId));

  if (!user) throw new Error("User not found");

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new Error("Account locked. Try again later.");
  }

  const isValid = await verifyPinHash(pin, user.pinHash);

  if (!isValid) {
    const attempts = user.failedAttempts + 1;
    const updates: any = { pinFailedAttempts: attempts };

    if (attempts >= 5) {
      updates.pinLockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      updates.pinFailedAttempts = 0;
    }

    await fastify.db.update(users).set(updates).where(users.id.eq(userId));
    throw new Error("Invalid PIN");
  }

  await fastify.db
    .update(users)
    .set({ pinFailedAttempts: 0, pinLockedUntil: null })
    .where(users.id.eq(userId));

  return true;
}
