import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateToken(userId: number): string {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  const secret: Secret = process.env.JWT_SECRET;
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export function setTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: 'token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
}

export function clearTokenCookie(response: NextResponse): void {
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

export async function getUserFromToken(request: NextRequest): Promise<any | null> {
  const token = request.cookies.get('token')?.value;
  
  if (!token) return null;
  
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    const secret: Secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { 
        id: true, 
        username: true, 
        email: true,
        familyMembers: {
          include: {
            family: true
          }
        }
      }
    });
    
    return user;
  } catch (_error) {
    console.log('Token verification failed, clearing token...');
    // Clear invalid token using the API route
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/clear-token`, {
      method: 'POST',
      credentials: 'include',
    });
    return null;
  }
}

export async function getServerCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) return null;
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    const secret: Secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { 
        id: true, 
        username: true, 
        email: true,
        familyMembers: {
          include: {
            family: true
          }
        }
      }
    });
    
    // If user doesn't exist, clear the token and return null
    if (!user) {
      console.log('User not found, clearing token...');
      // Clear token using the API route
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/clear-token`, {
        method: 'POST',
        credentials: 'include',
      });
      return null;
    }
    
    return user;
  } catch (_error) {
    console.log('Token verification failed, clearing token...');
    // Clear invalid token using the API route
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/clear-token`, {
      method: 'POST',
      credentials: 'include',
    });
    return null;
  }
}

export async function requireAuth(
  request: NextRequest,
  handler: (user: any, request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await getUserFromToken(request);
  
  console.log('requireAuth', { user })
  
  if (!user) {
    const response = NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
    clearTokenCookie(response);
    return response;
  }
  
  return handler(user, request);
} 