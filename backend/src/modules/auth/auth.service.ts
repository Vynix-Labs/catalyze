import { eq } from "drizzle-orm";
import { user } from "../../db/schema";
import { hashPin, verifyPinHash } from "../../utils/hash";
import { FastifyInstance } from "fastify";

export async function setUserPin(fastify: FastifyInstance, userId: string, pin: string) {
  const { hash, salt } = await hashPin(pin);
  if (!hash || !salt) throw new Error("Failed to generate PIN hash");

  const [updated] = await fastify.db
    .update(user)
    .set({
      pinHash: hash,
      pinSalt: salt,
      pinFailedAttempts: 0,
      pinLockedUntil: null,
    })
    .where(eq(user.id, userId))
    .returning();

  if (!updated) throw new Error("Failed to set PIN");
  return { message: "PIN set successfully" };
}

export async function verifyUserPin(
  fastify: FastifyInstance,
  { userId, pin }: { userId: string; pin: string }
) {
  // Fetch the user
  const rows = await fastify.db
    .select()
    .from(user)
    .where(eq(user.id, userId))

  const existing = rows[0];
  if (!existing) throw new Error("User not found");
  if (!existing.pinHash) throw new Error("User has no PIN set");

  // Check if the PIN is temporarily locked
  if (existing.pinLockedUntil && existing.pinLockedUntil > new Date()) {
    throw new Error("PIN is temporarily locked due to multiple failed attempts");
  }

  // Verify PIN
  const isValid = await verifyPinHash(pin, existing.pinHash, existing.pinSalt);

  if (!isValid) {
    // Increment failed attempts and  lock
    const failedAttempts = (existing.pinFailedAttempts || 0) + 1;
    await fastify.db
      .update(user)
      .set({
        pinFailedAttempts: failedAttempts,
        pinLockedUntil:
          failedAttempts >= 5
            ? new Date(Date.now() + 15 * 60 * 1000) // lock 15 minutes
            : existing.pinLockedUntil,
      })
      .where(eq(user.id, userId));
    throw new Error("Invalid PIN");
  }

  // Reset failed attempts on success
  if (existing.pinFailedAttempts) {
    await fastify.db
      .update(user)
      .set({ pinFailedAttempts: 0, pinLockedUntil: null })
      .where(eq(user.id, userId));
  }

  return true;
}