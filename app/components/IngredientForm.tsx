'use client';

import { useState } from 'react';

interface Ingredient {
  id: number;
  name: string;
  unit: string;
}

interface IngredientFormProps {
  ingredients: Ingredient[];
}

export default function IngredientForm({ ingredients }: IngredientFormProps) {
  const [ingredientCount, setIngredientCount] = useState(1);

  const addIngredient = () => {
    setIngredientCount(prev => prev + 1);
  };

  const removeIngredient = (index: number) => {
    const container = document.getElementById('ingredients-container');
    if (container) {
      const element = container.children[index];
      if (element) {
        element.remove();
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Ingredients
      </label>
      <div className="mt-1 space-y-4" id="ingredients-container">
        {Array.from({ length: ingredientCount }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
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
                onClick={() => removeIngredient(index)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
              >
                Remove
              </button>
            )}
          </div>
        ))}
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