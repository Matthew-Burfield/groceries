import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  return requireAuth(request, async (user, req) => {
    try {
      // Get the shopping list item
      const shoppingListItem = await prisma.shoppingListItem.findUnique({
        where: { id: Number(params.itemId) },
        include: {
          shoppingList: true,
        },
      });

      if (!shoppingListItem) {
        return NextResponse.json(
          { error: 'Shopping list item not found' },
          { status: 404 }
        );
      }

      // Check if user is a member of the family
      const familyMember = await prisma.familyMember.findUnique({
        where: {
          familyId_userId: {
            familyId: shoppingListItem.shoppingList.familyId,
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

      // Toggle the checked status
      const updatedItem = await prisma.shoppingListItem.update({
        where: { id: Number(params.itemId) },
        data: { checked: !shoppingListItem.checked },
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
          message: 'Shopping list item updated successfully',
          item: updatedItem,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Toggle shopping list item error:', error);
      return NextResponse.json(
        { error: 'An error occurred while updating the shopping list item' },
        { status: 500 }
      );
    }
  });
} 