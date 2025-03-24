import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, getServerCurrentUser } from '@/lib/auth';

// Validation schema for creating a meal plan
const createMealPlanSchema = z.object({
  familyId: z.number().int().positive(),
  weekStart: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for weekStart',
  }),
});

// GET all meal plans for a family
export async function GET(request: NextRequest) {
  try {
    const user = await getServerCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user's family
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        family: true,
      },
    });
    
    if (!familyMember) {
      return NextResponse.json(
        { error: 'No family found' },
        { status: 404 }
      );
    }
    
    // Get the current meal plan for the family
    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        familyId: familyMember.familyId,
      },
      orderBy: {
        weekStart: 'desc',
      },
      include: {
        entries: {
          include: {
            meal: true,
          },
        },
      },
    });
    
    return NextResponse.json(mealPlan);
  } catch (error) {
    console.error('Error fetching meal plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new meal plan
export async function POST(request: NextRequest) {
  try {
    const user = await getServerCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { familyId, weekStart } = body;
    
    if (!familyId || !weekStart) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if user has access to this family
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        userId: user.id,
        familyId,
      },
    });
    
    if (!familyMember) {
      return NextResponse.json(
        { error: 'Unauthorized access to family' },
        { status: 403 }
      );
    }
    
    // Check if a meal plan already exists for this week
    const existingMealPlan = await prisma.mealPlan.findFirst({
      where: {
        familyId,
        weekStart: new Date(weekStart),
      },
    });
    
    if (existingMealPlan) {
      return NextResponse.json(
        { error: 'A meal plan already exists for this week' },
        { status: 400 }
      );
    }
    
    // Create the meal plan
    const mealPlan = await prisma.mealPlan.create({
      data: {
        familyId,
        weekStart: new Date(weekStart),
      },
    });
    
    return NextResponse.json(mealPlan);
  } catch (error) {
    console.error('Error creating meal plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 