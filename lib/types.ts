export interface User {
  id: number;
  username: string;
  email: string;
  familyMembers: FamilyMember[];
}

export interface FamilyMember {
  family: Family;
}

export interface Family {
  id: number;
  name: string;
}

export interface Ingredient {
  id: number;
  name: string;
  unit: string;
}

export interface MealIngredient {
  ingredientId: number;
  quantity: number;
}

export interface Meal {
  id: number;
  familyId: number;
  name: string;
  description?: string;
  ingredients: MealIngredient[];
} 