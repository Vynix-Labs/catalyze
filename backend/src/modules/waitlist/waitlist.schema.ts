import { z } from 'zod';

export const joinWaitlistSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type JoinWaitlistInput = z.infer<typeof joinWaitlistSchema>;
