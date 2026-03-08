import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { COOKIE_NAME, createToken, verifyToken } from "./auth-edge";

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  college: string | null;
};

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const verified = await verifyToken(token);
  if (!verified) return null;

  const user = await prisma.user.findUnique({
    where: { id: verified.userId },
    select: { id: true, email: true, name: true, college: true },
  });
  return user;
}

/** Alias for compatibility with code that uses getCurrentUser */
export async function getCurrentUser(): Promise<SessionUser | null> {
  return getSession();
}

export { COOKIE_NAME, createToken, verifyToken } from "./auth-edge";
