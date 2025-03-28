import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { createMealSchema } from '@/lib/validation';
import { createApiResponse, createApiError, parseFormData, isFormSubmission, redirectTo, checkFamilyAccess } from '@/lib/api';
import { Meal } from '@/lib/types';

export async function POST(request: NextRequest) {
  return requireAuth(request, async (user, req) => {
    try {
      const formData = await parseFormData(req);
      const validation = createMealSchema.safeParse(formData);
      
      if (!validation.success) {
        return createApiError('Invalid input', 400);
      }
      
      const { familyId, name, description, ingredients } = validation.data;
      
      // Check if user is a member of the family
      const hasAccess = await checkFamilyAccess(user, familyId);
      if (!hasAccess) {
        return createApiError('You do not have access to this family', 403);
      }
      
      // Create the meal and its ingredients in a transaction
      const meal = await prisma.$transaction(async (tx) => {
        // Create the meal
        const newMeal = await tx.meal.create({
          data: {
            familyId,
            name,
            description,
          },
        });
        
        // Create the meal ingredients
        const mealIngredients = ingredients.map((ingredient) => ({
          mealId: newMeal.id,
          ingredientId: ingredient.ingredientId,
          quantity: ingredient.quantity,
        }));
        
        await tx.mealIngredient.createMany({
          data: mealIngredients,
        });
        
        return newMeal;
      });
      
      // For form submissions, redirect to the meal detail page
      if (isFormSubmission(req.headers.get('content-type') || '')) {
        return redirectTo(`/meals/${meal.id}`, req);
      }
      
      // For API requests, return JSON with ingredients
      const mealWithIngredients: Meal = {
        id: meal.id,
        familyId: meal.familyId,
        name: meal.name,
        description: meal.description || undefined,
        ingredients,
      };
      
      return createApiResponse<{ message: string; meal: Meal }>(
        {
          message: 'Meal created successfully',
          meal: mealWithIngredients,
        },
        201
      );
      
    } catch (error) {
      console.error('Create meal error:', error);
      return createApiError('An error occurred while creating the meal', 500);
    }
  });
} 