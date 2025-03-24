import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// Validation schema for creating a meal plan
const createMealPlanSchema = z.object({
  familyId: z.number().int().positive(),
  weekStart: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for weekStart',
  }),
});

// GET all meal plans for a family
export async function GET(request: NextRequest) {
  return requireAuth(request, async (user, req) => {
    try {
      const { searchParams } = new URL(req.url);
      const familyId = searchParams.get('familyId');
      
      if (!familyId || isNaN(Number(familyId))) {
        return NextResponse.json(
          { error: 'Family ID is required and must be a number' },
          { status: 400 }
        );
      }
      
      // Check if user is a member of the family
      const familyMember = await prisma.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: Number(familyId),
            userId: user.id,
          },
        },
      });
      
      if (!familyMember) {
        return NextResponse.json(
          { error: 'You do not have access to this family' },
          { status: 403 }
        );
      }
      
      // Get meal plans for the family
      const mealPlans = await prisma.mealPlan.findMany({
        where: {
          familyId: Number(familyId),
        },
        include: {
          entries: {
            include: {
              meal: true,
            },
          },
        },
        orderBy: {
          weekStart: 'desc',
        },
      });
      
      return NextResponse.json({ mealPlans });
    } catch (error) {
      console.error('Get meal plans error:', error);
      return NextResponse.json(
        { error: 'An error occurred while fetching meal plans' },
        { status: 500 }
      );
    }
  });
}

// Create a new meal plan
export async function POST(request: NextRequest) {
  return requireAuth(request, async (user, req) => {
    try {
      // Check content type to determine how to parse the request body
      const contentType = req.headers.get('content-type') || '';
      
      let formData;
      
      if (contentType.includes('application/json')) {
        // Parse JSON data
        formData = await req.json();
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        // Parse form data
        const formDataObj = await req.formData();
        formData = {
          familyId: Number(formDataObj.get('familyId')),
          weekStart: formDataObj.get('weekStart')
        };
      } else {
        return NextResponse.json(
          { error: 'Unsupported content type' },
          { status: 400 }
        );
      }
      
      const validation = createMealPlanSchema.safeParse(formData);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.format() },
          { status: 400 }
        );
      }
      
      const { familyId, weekStart } = validation.data;
      
      // Check if user is a member of the family
      const familyMember = await prisma.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: Number(familyId),
            userId: user.id,
          },
        },
      });
      
      if (!familyMember) {
        return NextResponse.json(
          { error: 'You do not have access to this family' },
          { status: 403 }
        );
      }
      
      // Create the meal plan
      const mealPlan = await prisma.mealPlan.create({
        data: {
          familyId,
          weekStart: new Date(weekStart),
        },
      });
      
      // For form submissions, redirect to the meal plan detail page
      if (contentType.includes('application/x-www-form-urlencoded')) {
        return NextResponse.redirect(new URL(`/meal-plans/${mealPlan.id}`, req.url));
      }
      
      // For API requests, return JSON
      return NextResponse.json(
        {
          message: 'Meal plan created successfully',
          mealPlan,
        },
        { status: 201 }
      );
      
    } catch (error) {
      console.error('Create meal plan error:', error);
      return NextResponse.json(
        { error: 'An error occurred while creating the meal plan' },
        { status: 500 }
      );
    }
  });
} 