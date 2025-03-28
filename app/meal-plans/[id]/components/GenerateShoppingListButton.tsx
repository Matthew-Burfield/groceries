'use client';

interface GenerateShoppingListButtonProps {
  mealPlanId: number;
  existingShoppingListId?: number;
}

export default function GenerateShoppingListButton({ mealPlanId, existingShoppingListId }: GenerateShoppingListButtonProps) {
  return (
    <form 
      action={`/api/meal-plans/${mealPlanId}/generate-shopping-list`} 
      method="POST"
      onSubmit={(e) => {
        console.log('Submitting form to generate shopping list');
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
      >
        {existingShoppingListId ? 'Regenerate Shopping List' : 'Generate Shopping List'}
      </button>
    </form>
  );
} 