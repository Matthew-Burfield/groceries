'use client';

import { useState } from 'react';
import { Ingredient } from '@/lib/types';

interface IngredientFormProps {
  ingredients: Ingredient[];
}

interface IngredientField {
  id: string;
  ingredientId: string;
  quantity: string;
}

export default function IngredientForm({ ingredients }: IngredientFormProps) {
  const [fields, setFields] = useState<IngredientField[]>([
    { id: '1', ingredientId: '', quantity: '' }
  ]);

  const addIngredient = () => {
    setFields(prev => [
      ...prev,
      { id: String(prev.length + 1), ingredientId: '', quantity: '' }
    ]);
  };

  const removeIngredient = (id: string) => {
    setFields(prev => prev.filter(field => field.id !== id));
  };

  const renderIngredientField = (field: IngredientField, index: number) => (
    <div key={field.id} className="flex items-center space-x-4">
      <select 
        name={`ingredients[${index}][ingredientId]`}
        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
        required
      >
        <option value="">Select an ingredient</option>
        {ingredients.map((ingredient) => (
          <option key={ingredient.id} value={ingredient.id}>
            {ingredient.name} ({ingredient.unit})
          </option>
        ))}
      </select>
      <input
        type="number"
        name={`ingredients[${index}][quantity]`}
        step="0.01"
        min="0"
        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-32 sm:text-sm border-gray-300 rounded-md"
        placeholder="Quantity"
        required
      />
      {index > 0 && (
        <button
          type="button"
          onClick={() => removeIngredient(field.id)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
        >
          Remove
        </button>
      )}
    </div>
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Ingredients
      </label>
      <div className="mt-1 space-y-4">
        {fields.map((field, index) => renderIngredientField(field, index))}
        <button
          type="button"
          onClick={addIngredient}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
        >
          Add Ingredient
        </button>
      </div>
    </div>
  );
} 