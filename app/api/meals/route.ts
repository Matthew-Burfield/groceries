import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// Validation schema for creating a meal
const createMealSchema = z.object({
  familyId: z.number().int().positive(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  ingredients: z.array(z.object({
    ingredientId: z.number().int().positive(),
    quantity: z.number().positive(),
  })).min(1, 'At least one ingredient is required'),
});

// POST to create a new meal
export async function POST(request: NextRequest) {
  return requireAuth(request, async (user, req) => {
    try {
      // Check content type to determine how to parse the request body
      const contentType = req.headers.get('content-type') || '';
      
      let formData;
      
      if (contentType.includes('application/json')) {
        // Parse JSON data
        formData = await req.json();
      } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
        // Parse form data
        const formDataObj = await req.formData();
        
        // Extract ingredients array from form data
        const ingredients = [];
        let i = 0;
        while (formDataObj.has(`ingredients[${i}][ingredientId]`)) {
          ingredients.push({
            ingredientId: Number(formDataObj.get(`ingredients[${i}][ingredientId]`)),
            quantity: Number(formDataObj.get(`ingredients[${i}][quantity]`)),
          });
          i++;
        }
        
        formData = {
          familyId: Number(formDataObj.get('familyId')),
          name: formDataObj.get('name'),
          description: formDataObj.get('description'),
          ingredients,
        };
      } else {
        return NextResponse.json(
          { error: 'Unsupported content type' },
          { status: 400 }
        );
      }
      
      const validation = createMealSchema.safeParse(formData);
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.format() },
          { status: 400 }
        );
      }
      
      const { familyId, name, description, ingredients } = validation.data;
      
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
      if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
        return NextResponse.redirect(new URL(`/meals/${meal.id}`, req.url));
      }
      
      // For API requests, return JSON
      return NextResponse.json(
        {
          message: 'Meal created successfully',
          meal,
        },
        { status: 201 }
      );
      
    } catch (error) {
      console.error('Create meal error:', error);
      return NextResponse.json(
        { error: 'An error occurred while creating the meal' },
        { status: 500 }
      );
    }
  });
} 