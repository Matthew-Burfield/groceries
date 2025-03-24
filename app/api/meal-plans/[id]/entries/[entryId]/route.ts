import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// DELETE a meal plan entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, entryId: string } }
) {
  return requireAuth(request, async (user, req) => {
    try {
      const mealPlanId = Number(params.id);
      const entryId = Number(params.entryId);
      
      if (isNaN(mealPlanId) || isNaN(entryId)) {
        return NextResponse.json(
          { error: 'Invalid meal plan ID or entry ID' },
          { status: 400 }
        );
      }
      
      // Get the entry to check meal plan relationship
      const entry = await prisma.mealPlanEntry.findUnique({
        where: { id: entryId },
        include: {
          mealPlan: true,
        },
      });
      
      if (!entry) {
        return NextResponse.json(
          { error: 'Meal plan entry not found' },
          { status: 404 }
        );
      }
      
      // Verify entry belongs to the specified meal plan
      if (entry.mealPlanId !== mealPlanId) {
        return NextResponse.json(
          { error: 'Entry does not belong to the specified meal plan' },
          { status: 400 }
        );
      }
      
      // Check if user is a member of the family
      const familyMember = await prisma.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: entry.mealPlan.familyId,
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
      
      // Delete the entry
      await prisma.mealPlanEntry.delete({
        where: { id: entryId },
      });
      
      // Check if this is a form submission by looking at the content type
      const contentType = req.headers.get('content-type') || '';
      const acceptHeader = req.headers.get('accept') || '';
      
      // For form submissions or if the client prefers HTML, redirect back to the meal plan page
      if (contentType.includes('application/x-www-form-urlencoded') || 
          contentType.includes('multipart/form-data') || 
          acceptHeader.includes('text/html')) {
        return NextResponse.redirect(new URL(`/meal-plans/${mealPlanId}`, req.url));
      }
      
      return NextResponse.json({
        message: 'Meal plan entry deleted successfully',
      });
    } catch (error) {
      console.error('Delete meal plan entry error:', error);
      return NextResponse.json(
        { error: 'An error occurred while deleting the meal plan entry' },
        { status: 500 }
      );
    }
  });
} 