import { z } from 'zod';

export const createMealSchema = z.object({
  familyId: z.number().int().positive(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  ingredients: z.array(z.object({
    ingredientId: z.number().int().positive(),
    quantity: z.number().positive(),
  })).min(1, 'At least one ingredient is required'),
});

export const createIngredientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  unit: z.string().min(1, 'Unit is required'),
});

export const createFamilySchema = z.object({
  name: z.string().min(1, 'Family name is required'),
}); 