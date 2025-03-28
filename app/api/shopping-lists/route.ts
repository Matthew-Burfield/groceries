import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET all shopping lists for the user's family
export async function GET(request: NextRequest) {
  return requireAuth(request, async (user, req) => {
    try {
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
          { error: 'User is not a member of any family' },
          { status: 403 }
        );
      }

      // Fetch shopping lists for the family
      const shoppingLists = await prisma.shoppingList.findMany({
        where: {
          familyId: familyMember.familyId,
        },
        include: {
          mealPlan: {
            select: {
              weekStart: true,
            },
          },
          items: {
            include: {
              ingredient: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json(shoppingLists);
    } catch (error) {
      console.error('Get shopping lists error:', error);
      return NextResponse.json(
        { error: 'An error occurred while fetching shopping lists' },
        { status: 500 }
      );
    }
  });
}

// POST to create a new shopping list
export async function POST(request: NextRequest) {
  return requireAuth(request, async (user, req) => {
    try {
      const formData = await req.formData();
      const mealPlanId = formData.get('mealPlanId');

      if (!mealPlanId) {
        return NextResponse.json(
          { error: 'Meal plan ID is required' },
          { status: 400 }
        );
      }

      // Get the meal plan
      const mealPlan = await prisma.mealPlan.findUnique({
        where: { id: Number(mealPlanId) },
        include: {
          entries: {
            include: {
              meal: {
                include: {
                  ingredients: {
                    include: {
                      ingredient: true,
                    },
                  },
                },
              },
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

      // Check if a shopping list already exists for this meal plan
      const existingShoppingList = await prisma.shoppingList.findUnique({
        where: { mealPlanId: Number(mealPlanId) },
      });

      if (existingShoppingList) {
        return NextResponse.json(
          { 
            message: 'Shopping list already exists for this meal plan',
            shoppingList: existingShoppingList,
          },
          { status: 200 }
        );
      }

      // Combine all ingredients from the meal plan entries
      const ingredientMap = new Map<number, { ingredientId: number; quantity: number }>();

      mealPlan.entries.forEach((entry) => {
        entry.meal.ingredients.forEach((mealIngredient) => {
          const ingredientId = mealIngredient.ingredientId;
          const quantity = mealIngredient.quantity;

          if (ingredientMap.has(ingredientId)) {
            const currentQuantity = ingredientMap.get(ingredientId)!.quantity;
            ingredientMap.set(ingredientId, {
              ingredientId,
              quantity: currentQuantity + quantity,
            });
          } else {
            ingredientMap.set(ingredientId, {
              ingredientId,
              quantity,
            });
          }
        });
      });

      // Create a new shopping list
      const shoppingList = await prisma.$transaction(async (tx) => {
        // Create the shopping list
        const newShoppingList = await tx.shoppingList.create({
          data: {
            familyId: mealPlan.familyId,
            mealPlanId: Number(mealPlanId),
            status: 'draft',
          },
        });

        // Create shopping list items
        const shoppingListItems = Array.from(ingredientMap.values()).map((item) => ({
          shoppingListId: newShoppingList.id,
          ingredientId: item.ingredientId,
          quantity: item.quantity,
          checked: false,
        }));

        await tx.shoppingListItem.createMany({
          data: shoppingListItems,
        });

        return newShoppingList;
      });

      // Check if this is a form submission
      const contentType = req.headers.get('content-type') || '';
      const acceptHeader = req.headers.get('accept') || '';

      // For form submissions or if the client prefers HTML, redirect to the shopping list page
      if (contentType.includes('application/x-www-form-urlencoded') || 
          contentType.includes('multipart/form-data') || 
          acceptHeader.includes('text/html')) {
        return NextResponse.redirect(new URL(`/shopping-lists/${shoppingList.id}`, req.url));
      }

      return NextResponse.json(
        {
          message: 'Shopping list created successfully',
          shoppingList,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Create shopping list error:', error);
      return NextResponse.json(
        { error: 'An error occurred while creating the shopping list' },
        { status: 500 }
      );
    }
  });
} 