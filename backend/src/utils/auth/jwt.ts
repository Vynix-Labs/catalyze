import { auth } from "../../plugins/auth";

/**
 * Generate a JWT token for an authenticated user
 * This token can be used as a bearer token for ChipiSDK operations
 * 
 * @param userId - The user ID to generate the token for
 * @param expiresIn - Token expiration time in seconds (default: 1 hour)
 * @returns JWT token string
 */
export async function generateUserJWT(
  userId: string,
  expiresIn: number = 3600
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
 
  const result = await auth.api.signJWT({
    body: {
      payload: {
        sub: userId,
        userId,
        iat: now,
        iss: "catalyze-backend",
        exp: now + expiresIn,
      },
    },
  });

  return result.token;
}
