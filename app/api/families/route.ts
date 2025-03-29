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
      
      // Get the current week's start date (Monday)
      const today = new Date();
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
      const weekStart = new Date(today.setDate(diff));
      weekStart.setHours(0, 0, 0, 0);
      
      // Create family, add the current user as an admin, and create a meal plan
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
        
        // Create a meal plan for the current week
        await tx.mealPlan.create({
          data: {
            familyId: newFamily.id,
            weekStart,
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