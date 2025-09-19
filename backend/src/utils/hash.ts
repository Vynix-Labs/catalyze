import * as argon2 from "argon2";
import { randomBytes } from "crypto";

export async function hashPin(pin: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await argon2.hash(pin + salt, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
  return { hash, salt };
}

export async function verifyPinHash(
  pin: string,
  hash: string,
  salt: string
): Promise<boolean> {
  return argon2.verify(hash, pin + salt);
}