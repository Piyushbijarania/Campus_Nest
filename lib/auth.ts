import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface User {
  id: string;
  email: string;
  name?: string;
  college?: string;
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) return null;

    const decoded = jwt.verify(sessionToken, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, college: true }
    });

    return user;
  } catch (error) {
    return null;
  }
}

export async function getSession(request?: Request): Promise<User | null> {
  return getCurrentUser();
}
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

export { COOKIE_NAME, createToken, verifyToken } from "./auth-edge";
