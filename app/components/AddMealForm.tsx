'use client';

import { useRouter } from 'next/navigation';

interface AddMealFormProps {
  mealPlanId: number;
  dayOfWeek: string;
  meals: Array<{
    id: number;
    name: string;
  }>;
}

export default function AddMealForm({ mealPlanId, dayOfWeek, meals }: AddMealFormProps) {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(`/api/meal-plans/${mealPlanId}/entries`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add meal');
      }

      // Refresh the page to show the updated meal plan
      router.refresh();
    } catch (error) {
      console.error('Error adding meal:', error);
      // You might want to show an error message to the user here
    }
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex items-center space-x-2"
    >
      <input type="hidden" name="dayOfWeek" value={dayOfWeek} />
      <select 
        name="mealId" 
        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
        required
      >
        <option value="">Select a meal</option>
        {meals.map((meal) => (
          <option key={meal.id} value={meal.id}>
            {meal.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Plan Meal
      </button>
    </form>
  );
} 