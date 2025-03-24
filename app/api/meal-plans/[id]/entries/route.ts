import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

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
  return requireAuth(request, async (user, req) => {
    try {
      const mealPlanId = Number(params.id);
      
      if (isNaN(mealPlanId)) {
        return NextResponse.json(
          { error: 'Invalid meal plan ID' },
          { status: 400 }
        );
      }
      
      // Check content type to determine how to parse the request body
      const contentType = req.headers.get('content-type') || '';
      
      let formData;
      
      if (contentType.includes('application/json')) {
        // Parse JSON data
        formData = await req.json();
      } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
        // Parse form data
        const formDataObj = await req.formData();
        formData = {
          mealId: Number(formDataObj.get('mealId')),
          dayOfWeek: formDataObj.get('dayOfWeek')
        };
      } else {
        return NextResponse.json(
          { error: 'Unsupported content type' },
          { status: 400 }
        );
      }
      
      const validation = createEntrySchema.safeParse(formData);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.format() },
          { status: 400 }
        );
      }
      
      const { mealId, dayOfWeek } = validation.data;
      
      // Get the meal plan
      const mealPlan = await prisma.mealPlan.findUnique({
        where: { id: mealPlanId },
      });
      
      if (!mealPlan) {
        return NextResponse.json(
          { error: 'Meal plan not found' },
          { status: 404 }
        );
      }
      
      // Check if user is a member of the family
      const familyMember = await prisma.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: mealPlan.familyId,
            userId: user.id,
          },
        },
      });
      
      if (!familyMember) {
        return NextResponse.json(
          { error: 'You do not have access to this meal plan' },
          { status: 403 }
        );
      }
      
      // Check if meal belongs to the family
      const meal = await prisma.meal.findFirst({
        where: {
          id: mealId,
          familyId: mealPlan.familyId,
        },
      });
      
      if (!meal) {
        return NextResponse.json(
          { error: 'Meal not found or does not belong to your family' },
          { status: 404 }
        );
      }
      
      // Check if an entry for this day already exists
      const existingEntry = await prisma.mealPlanEntry.findUnique({
        where: {
          mealPlanId_dayOfWeek: {
            mealPlanId,
            dayOfWeek: dayOfWeek.toLowerCase(),
          },
        },
      });
      
      let entry;
      
      if (existingEntry) {
        // Update the existing entry
        entry = await prisma.mealPlanEntry.update({
          where: {
            id: existingEntry.id,
          },
          data: {
            mealId,
          },
          include: {
            meal: true,
          },
        });
      } else {
        // Create a new entry
        entry = await prisma.mealPlanEntry.create({
          data: {
            mealPlanId,
            mealId,
            dayOfWeek: dayOfWeek.toLowerCase(),
          },
          include: {
            meal: true,
          },
        });
      }
      
      // For form submissions, redirect back to the meal plan page
      if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
        return NextResponse.redirect(new URL(`/meal-plans/${mealPlanId}`, req.url));
      }
      
      return NextResponse.json(
        {
          message: 'Meal plan entry created successfully',
          entry,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Create meal plan entry error:', error);
      return NextResponse.json(
        { error: 'An error occurred while creating the meal plan entry' },
        { status: 500 }
      );
    }
  });
} 