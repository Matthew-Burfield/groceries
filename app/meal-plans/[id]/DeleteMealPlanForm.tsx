"use client";

import { useRouter } from 'next/navigation';

export default function DeleteMealPlanForm({ id }: { id: number }) {
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    if (!confirm('Are you sure you want to delete this meal plan?')) {
      e.preventDefault();
    }
  };
  
  return (
    <form 
      action={`/api/meal-plans/${id}`} 
      method="DELETE" 
      onSubmit={handleSubmit}
    >
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-gray-50"
      >
        Delete Plan
      </button>
    </form>
  );
} 