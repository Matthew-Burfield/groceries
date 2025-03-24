import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  return requireAuth(request, async (user) => {
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        families: user.familyMembers.map((member: any) => ({
          id: member.family.id,
          name: member.family.name,
          isAdmin: member.isAdmin,
        })),
      },
    });
  });
} 