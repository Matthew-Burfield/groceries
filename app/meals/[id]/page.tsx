import { redirect } from 'next/navigation';
import { getServerCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DeleteMealForm from './DeleteMealForm';

export default async function MealDetailPage({ params }: { params: { id: string } }) {
  const user = await getServerCurrentUser();
  
  // Redirect if user is not logged in
  if (!user) {
    redirect('/login');
  }
  
  // Redirect to family setup if user doesn't have a family
  if (!user.familyMembers || user.familyMembers.length === 0) {
    redirect('/setup-family');
  }
  
  // Make sure to wait for params to resolve before using it
  const { id: parsedId } = await params
  const id = Number(parsedId);
  if (isNaN(id)) {
    redirect('/meals');
  }
  
  // Fetch the meal
  const meal = await prisma.meal.findUnique({
    where: { id },
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
      family: true,
    },
  });
  
  if (!meal) {
    redirect('/meals');
  }
  
  // Check if user is a member of the family
  const familyMember = user.familyMembers.find(
    (member) => member.familyId === meal.familyId
  );
  
  if (!familyMember) {
    redirect('/meals');
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Meal Details</h1>
          <div className="flex items-center space-x-4">
            <a 
              href="/meals"
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Back to Meals
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {meal.name}
                </h3>
                {meal.description && (
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {meal.description}
                  </p>
                )}
              </div>
              <DeleteMealForm id={id} />
            </div>
            
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <h4 className="text-sm font-medium text-gray-500">Ingredients</h4>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {meal.ingredients.map((mealIngredient) => (
                    <li key={mealIngredient.ingredientId} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {mealIngredient.ingredient.name}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {mealIngredient.quantity} {mealIngredient.ingredient.unit}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 