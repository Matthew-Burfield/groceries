import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// Validation schema for updating a meal plan
const updateMealPlanSchema = z.object({
  weekStart: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format for weekStart',
  }).optional(),
});

// GET a specific meal plan
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (user, req) => {
    try {
      const id = Number(params.id);
      
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid meal plan ID' },
          { status: 400 }
        );
      }
      
      // Get the meal plan
      const mealPlan = await prisma.mealPlan.findUnique({
        where: { id },
        include: {
          entries: {
            include: {
              meal: true,
            },
          },
          family: true,
        },
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
      
      return NextResponse.json({ mealPlan });
    } catch (error) {
      console.error('Get meal plan error:', error);
      return NextResponse.json(
        { error: 'An error occurred while fetching the meal plan' },
        { status: 500 }
      );
    }
  });
}

// Update a meal plan
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (user, req) => {
    try {
      const id = Number(params.id);
      
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid meal plan ID' },
          { status: 400 }
        );
      }
      
      const body = await req.json();
      
      const validation = updateMealPlanSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.format() },
          { status: 400 }
        );
      }
      
      // Get the current meal plan
      const existingMealPlan = await prisma.mealPlan.findUnique({
        where: { id },
      });
      
      if (!existingMealPlan) {
        return NextResponse.json(
          { error: 'Meal plan not found' },
          { status: 404 }
        );
      }
      
      // Check if user is a member of the family
      const familyMember = await prisma.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: existingMealPlan.familyId,
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
      
      // Update the meal plan
      const { weekStart } = validation.data;
      
      const updatedMealPlan = await prisma.mealPlan.update({
        where: { id },
        data: {
          ...(weekStart && { weekStart: new Date(weekStart) }),
        },
      });
      
      return NextResponse.json({ 
        message: 'Meal plan updated successfully',
        mealPlan: updatedMealPlan,
      });
    } catch (error) {
      console.error('Update meal plan error:', error);
      return NextResponse.json(
        { error: 'An error occurred while updating the meal plan' },
        { status: 500 }
      );
    }
  });
}

// Delete a meal plan
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (user, req) => {
    try {
      const id = Number(params.id);
      
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid meal plan ID' },
          { status: 400 }
        );
      }
      
      // Get the current meal plan
      const existingMealPlan = await prisma.mealPlan.findUnique({
        where: { id },
      });
      
      if (!existingMealPlan) {
        return NextResponse.json(
          { error: 'Meal plan not found' },
          { status: 404 }
        );
      }
      
      // Check if user is a member of the family
      const familyMember = await prisma.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: existingMealPlan.familyId,
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
      
      // Delete the meal plan and its entries (cascade is defined in the schema)
      await prisma.mealPlan.delete({
        where: { id },
      });
      
      // Check if this is a form submission
      const contentType = req.headers.get('content-type') || '';
      const acceptHeader = req.headers.get('accept') || '';
      
      // For form submissions or if the client prefers HTML, redirect to the meal plans list
      if (contentType.includes('application/x-www-form-urlencoded') || 
          contentType.includes('multipart/form-data') || 
          acceptHeader.includes('text/html')) {
        return NextResponse.redirect(new URL('/meal-plans', req.url));
      }
      
      return NextResponse.json({ 
        message: 'Meal plan deleted successfully' 
      });
    } catch (error) {
      console.error('Delete meal plan error:', error);
      return NextResponse.json(
        { error: 'An error occurred while deleting the meal plan' },
        { status: 500 }
      );
    }
  });
} 