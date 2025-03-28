import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requireAuth(request, async (user, req) => {
    try {
      const formData = await req.formData();
      const status = formData.get('status');

      if (!status || !['draft', 'active', 'completed'].includes(status as string)) {
        return NextResponse.json(
          { error: 'Invalid status' },
          { status: 400 }
        );
      }

      // Get the shopping list
      const shoppingList = await prisma.shoppingList.findUnique({
        where: { id: Number(params.id) },
      });

      if (!shoppingList) {
        return NextResponse.json(
          { error: 'Shopping list not found' },
          { status: 404 }
        );
      }

      // Check if user is a member of the family
      const familyMember = await prisma.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: shoppingList.familyId,
            userId: user.id,
          },
        },
      });

      if (!familyMember) {
        return NextResponse.json(
          { error: 'You do not have access to this shopping list' },
          { status: 403 }
        );
      }

      // Update the shopping list status
      const updatedShoppingList = await prisma.shoppingList.update({
        where: { id: Number(params.id) },
        data: { status: status as string },
      });

      // Check if this is a form submission
      const contentType = req.headers.get('content-type') || '';
      const acceptHeader = req.headers.get('accept') || '';

      // For form submissions or if the client prefers HTML, redirect back to the shopping list page
      if (contentType.includes('application/x-www-form-urlencoded') || 
          contentType.includes('multipart/form-data') || 
          acceptHeader.includes('text/html')) {
        return NextResponse.redirect(new URL(`/shopping-lists/${params.id}`, req.url));
      }

      return NextResponse.json(
        {
          message: 'Shopping list status updated successfully',
          shoppingList: updatedShoppingList,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Toggle shopping list status error:', error);
      return NextResponse.json(
        { error: 'An error occurred while updating the shopping list status' },
        { status: 500 }
      );
    }
  });
} 