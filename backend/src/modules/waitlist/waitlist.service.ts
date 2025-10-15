import type { FastifyInstance } from 'fastify';
import { eq } from 'drizzle-orm';
import { waitlist } from '../../db/schema';
import type { JoinWaitlistInput } from './waitlist.schema';

export async function joinWaitlist(
  fastify: FastifyInstance,
  input: JoinWaitlistInput
) {
  const { email } = input;

  // Check if email already exists in waitlist table
  const existing = await fastify.db
    .select()
    .from(waitlist)
    .where(eq(waitlist.email, email))
    .limit(1);

  if (existing.length > 0) {
    return {
      success: true,
      message: 'You are already on the waitlist',
      alreadyExists: true,
    };
  }

  // Insert new waitlist entry
  await fastify.db.insert(waitlist).values({
    email,
  });

  return {
    success: true,
    message: 'Successfully joined the waitlist',
    alreadyExists: false,
  };
}
