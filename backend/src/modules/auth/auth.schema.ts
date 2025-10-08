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

export const pinScopeEnum = z.enum(["any", "fiat_transfer", "crypto_withdraw", "crypto_stake", "crypto_unstake"]);

export const verifyPinSchema = z.object({
  pin: z.string().length(4).regex(/^[0-9]{4}$/),
  scope: pinScopeEnum.optional(),
});

export const verifyPinResponseSchema = z.object({
  success: z.literal(true),
  token: z.string().uuid(),
  expiresIn: z.number().positive(),
  scope: pinScopeEnum,
});

export type VerifyPinInput = z.infer<typeof verifyPinSchema>;
export type PinScope = z.infer<typeof pinScopeEnum>;