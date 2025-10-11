import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const KEY_LENGTH = 64;
const scryptAsync = promisify(scrypt);

async function deriveKey(pin: string, salt: string) {
  return (await scryptAsync(pin, salt, KEY_LENGTH)) as Buffer;
}

export async function hashPin(pin: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await deriveKey(pin, salt);
  return { hash: derivedKey.toString("hex"), salt };
}

export async function verifyPinHash(
  pin: string,
  hash: string,
  salt: string
): Promise<boolean> {
  const derivedKey = await deriveKey(pin, salt);
  const storedKey = Buffer.from(hash, "hex");
  if (storedKey.length !== derivedKey.length) {
    return false;
  }
  return timingSafeEqual(derivedKey, storedKey);
}