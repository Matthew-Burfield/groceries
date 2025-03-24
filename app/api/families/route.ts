import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const createFamilySchema = z.object({
  name: z.string().min(1).max(100),
});

export async function POST(request: NextRequest) {
  return requireAuth(request, async (user, req) => {
    try {
      const body = await req.json();
      
      const validation = createFamilySchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.format() },
          { status: 400 }
        );
      }
      
      const { name } = validation.data;
      
      // Create family and add the current user as an admin
      const family = await prisma.$transaction(async (tx: PrismaClient) => {
        const newFamily = await tx.family.create({
          data: {
            name,
          },
        });
        
        await tx.familyMember.create({
          data: {
            familyId: newFamily.id,
            userId: user.id,
            isAdmin: true,
          },
        });
        
        return newFamily;
      });
      
      return NextResponse.json(
        {
          message: 'Family created successfully',
          family: {
            id: family.id,
            name: family.name,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Create family error:', error);
      return NextResponse.json(
        { error: 'An error occurred while creating the family' },
        { status: 500 }
      );
    }
  });
} 