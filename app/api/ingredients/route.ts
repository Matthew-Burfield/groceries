import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// Validation schema for creating an ingredient
const createIngredientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  unit: z.string().min(1, 'Unit is required'),
  categoryId: z.number().int().positive(),
  familyId: z.number().int().positive(),
});

// GET all ingredients
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
          { error: 'No family found' },
          { status: 404 }
        );
      }

      const ingredients = await prisma.ingredient.findMany({
        where: {
          familyId: familyMember.familyId,
        },
        include: {
          category: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return NextResponse.json(ingredients);
    } catch (error) {
      console.error('Get ingredients error:', error);
      return NextResponse.json(
        { error: 'An error occurred while fetching ingredients' },
        { status: 500 }
      );
    }
  });
}

// POST to create a new ingredient
export async function POST(request: NextRequest) {
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
          { error: 'No family found' },
          { status: 404 }
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
          name: formDataObj.get('name'),
          unit: formDataObj.get('unit'),
          categoryId: Number(formDataObj.get('categoryId')),
          familyId: familyMember.familyId,
        };
      } else {
        return NextResponse.json(
          { error: 'Unsupported content type' },
          { status: 400 }
        );
      }
      
      const validation = createIngredientSchema.safeParse(formData);

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid input', details: validation.error.format() },
          { status: 400 }
        );
      }

      const { name, unit, categoryId, familyId } = validation.data;

      // Check if ingredient already exists for this family
      const existingIngredient = await prisma.ingredient.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
          familyId,
        },
      });

      if (existingIngredient) {
        return NextResponse.json(
          { error: 'An ingredient with this name already exists in your family' },
          { status: 400 }
        );
      }

      // Check if category exists
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }

      const ingredient = await prisma.ingredient.create({
        data: {
          name,
          unit,
          category: {
            connect: {
              id: categoryId,
            },
          },
          family: {
            connect: {
              id: familyId,
            },
          },
        },
        include: {
          category: true,
        },
      });

      // For form submissions, redirect to the ingredients page
      if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
        return NextResponse.redirect(new URL('/ingredients', req.url));
      }

      return NextResponse.json(
        {
          message: 'Ingredient created successfully',
          ingredient,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('Create ingredient error:', error);
      return NextResponse.json(
        { error: 'An error occurred while creating the ingredient' },
        { status: 500 }
      );
    }
  });
} 