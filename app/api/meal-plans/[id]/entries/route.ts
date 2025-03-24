import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, getServerCurrentUser } from '@/lib/auth';

// Validation schema for creating a meal plan entry
const createEntrySchema = z.object({
  mealId: z.number().int().positive(),
  dayOfWeek: z.string().refine(
    (val) => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(val.toLowerCase()),
    {
      message: 'Day of week must be a valid day (monday, tuesday, etc.)',
    }
  ),
});

// POST a new entry to a meal plan
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getServerCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { mealId, dayOfWeek } = body;
    
    if (!mealId || !dayOfWeek) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get the meal plan
    const mealPlan = await prisma.mealPlan.findUnique({
      where: {
        id: Number(params.id),
      },
      include: {
        family: {
          include: {
            members: true,
          },
        },
      },
    });
    
    if (!mealPlan) {
      return NextResponse.json(
        { error: 'Meal plan not found' },
        { status: 404 }
      );
    }
    
    // Check if user has access to this meal plan's family
    const hasAccess = mealPlan.family.members.some(
      (member) => member.userId === Number(user.id)
    );
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Unauthorized access to meal plan' },
        { status: 403 }
      );
    }
    
    // Check if meal exists
    const meal = await prisma.meal.findUnique({
      where: {
        id: Number(mealId),
      },
    });
    
    if (!meal) {
      return NextResponse.json(
        { error: 'Meal not found' },
        { status: 404 }
      );
    }
    
    // Check if an entry already exists for this day
    const existingEntry = await prisma.mealPlanEntry.findFirst({
      where: {
        mealPlanId: Number(params.id),
        dayOfWeek,
      },
    });
    
    if (existingEntry) {
      return NextResponse.json(
        { error: 'An entry already exists for this day' },
        { status: 400 }
      );
    }
    
    // Create the entry
    const entry = await prisma.mealPlanEntry.create({
      data: {
        mealPlanId: Number(params.id),
        mealId: Number(mealId),
        dayOfWeek,
      },
      include: {
        meal: true,
      },
    });
    
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error creating meal plan entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getServerCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the meal plan
    const mealPlan = await prisma.mealPlan.findUnique({
      where: {
        id: Number(params.id),
      },
      include: {
        family: {
          include: {
            members: true,
          },
        },
      },
    });
    
    if (!mealPlan) {
      return NextResponse.json(
        { error: 'Meal plan not found' },
        { status: 404 }
      );
    }
    
    // Check if user has access to this meal plan's family
    const hasAccess = mealPlan.family.members.some(
      (member) => member.userId === Number(user.id)
    );
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Unauthorized access to meal plan' },
        { status: 403 }
      );
    }
    
    // Get all entries for the meal plan
    const entries = await prisma.mealPlanEntry.findMany({
      where: {
        mealPlanId: Number(params.id),
      },
      include: {
        meal: true,
      },
      orderBy: {
        dayOfWeek: 'asc',
      },
    });
    
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error fetching meal plan entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 