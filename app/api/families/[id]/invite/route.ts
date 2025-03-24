import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

const inviteSchema = z.object({
  email: z.string().email(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (user, req) => {
    try {
      const familyId = parseInt(params.id);
      
      if (isNaN(familyId)) {
        return NextResponse.json(
          { error: 'Invalid family ID' },
          { status: 400 }
        );
      }
      
      // Check if user is an admin of the family
      const membership = await prisma.familyMember.findFirst({
        where: {
          familyId,
          userId: user.id,
          isAdmin: true,
        },
      });
      
      if (!membership) {
        return NextResponse.json(
          { error: 'You do not have permission to invite users to this family' },
          { status: 403 }
        );
      }
      
      const body = await req.json();
      
      const validation = inviteSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.format() },
          { status: 400 }
        );
      }
      
      const { email } = validation.data;
      
      // Find invited user
      const invitedUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (!invitedUser) {
        return NextResponse.json(
          { error: 'User with this email not found' },
          { status: 404 }
        );
      }
      
      // Check if user is already a member
      const existingMembership = await prisma.familyMember.findFirst({
        where: {
          familyId,
          userId: invitedUser.id,
        },
      });
      
      if (existingMembership) {
        return NextResponse.json(
          { error: 'User is already a member of this family' },
          { status: 409 }
        );
      }
      
      // Add user to family
      await prisma.familyMember.create({
        data: {
          familyId,
          userId: invitedUser.id,
          isAdmin: false,
        },
      });
      
      return NextResponse.json({
        message: 'User invited successfully',
      });
    } catch (error) {
      console.error('Invite user error:', error);
      return NextResponse.json(
        { error: 'An error occurred while inviting the user' },
        { status: 500 }
      );
    }
  });
} 