import { NextResponse } from 'next/server';
import { clearTokenCookie } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ message: 'Token cleared' });
  clearTokenCookie(response);
  return response;
} 