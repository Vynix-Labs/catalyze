import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
  pin: z.string().regex(/^\d{4,6}$/, "PIN must be 4–6 digits"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const setPinSchema = z.object({
  pin: z.string().length(4).regex(/^[0-9]{4}$/),
});

export const verifyPinSchema = z.object({
  pin: z.string().length(4).regex(/^[0-9]{4}$/),
});


export type VerifyPinInput = z.infer<typeof verifyPinSchema>;