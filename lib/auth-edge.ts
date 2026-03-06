import { jwtVerify, SignJWT } from "jose";

export const COOKIE_NAME = "campus_nest_session";

function getSecret(): Uint8Array {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-dev-secret-change-in-production"
  );
}

/** Verify JWT only (no DB). Safe to use in Edge middleware. */
export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const userId = payload.userId as string;
    return userId ? { userId } : null;
  } catch {
    return null;
  }
}

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getSecret());
}
