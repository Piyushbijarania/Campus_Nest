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
