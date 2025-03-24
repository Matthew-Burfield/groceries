import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// DELETE a meal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (user, req) => {
    try {
      const id = Number(params.id);
      
      if (isNaN(id)) {
        return NextResponse.json(
          { error: 'Invalid meal ID' },
          { status: 400 }
        );
      }
      
      // Get the current meal
      const existingMeal = await prisma.meal.findUnique({
        where: { id },
      });
      
      if (!existingMeal) {
        return NextResponse.json(
          { error: 'Meal not found' },
          { status: 404 }
        );
      }
      
      // Check if user is a member of the family
      const familyMember = await prisma.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: existingMeal.familyId,
            userId: user.id,
          },
        },
      });
      
      if (!familyMember) {
        return NextResponse.json(
          { error: 'You do not have access to this meal' },
          { status: 403 }
        );
      }
      
      // Delete the meal and its ingredients (cascade is defined in the schema)
      await prisma.meal.delete({
        where: { id },
      });
      
      // Check if this is a form submission
      const contentType = req.headers.get('content-type') || '';
      const acceptHeader = req.headers.get('accept') || '';
      
      // For form submissions or if the client prefers HTML, redirect to the meals list
      if (contentType.includes('application/x-www-form-urlencoded') || 
          contentType.includes('multipart/form-data') || 
          acceptHeader.includes('text/html')) {
        return NextResponse.redirect(new URL('/meals', req.url));
      }
      
      return NextResponse.json({ 
        message: 'Meal deleted successfully' 
      });
    } catch (error) {
      console.error('Delete meal error:', error);
      return NextResponse.json(
        { error: 'An error occurred while deleting the meal' },
        { status: 500 }
      );
    }
  });
} 