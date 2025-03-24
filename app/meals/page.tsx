import { redirect } from 'next/navigation';
import { getServerCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function MealsPage() {
  const user = await getServerCurrentUser();
  
  // Redirect if user is not logged in
  if (!user) {
    redirect('/login');
  }
  
  // Redirect to family setup if user doesn't have a family
  if (!user.familyMembers || user.familyMembers.length === 0) {
    redirect('/setup-family');
  }
  
  const selectedFamily = user.familyMembers[0]?.family;
  
  // Fetch meals for the selected family
  const meals = await prisma.meal.findMany({
    where: {
      familyId: selectedFamily.id,
    },
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Meals</h1>
          <div className="flex items-center space-x-4">
            <a 
              href="/ingredients"
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Manage Ingredients
            </a>
            <a 
              href="/meals/new"
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create New Meal
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedFamily?.name} Meals
            </h2>
            <a
              href="/meals/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create New Meal
            </a>
          </div>
          
          {meals.length === 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
              <p className="text-gray-500">You haven't created any meals yet.</p>
              <p className="mt-2">
                <a 
                  href="/meals/new"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Create your first meal
                </a>
              </p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {meals.map((meal) => (
                  <li key={meal.id}>
                    <a href={`/meals/${meal.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {meal.name}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {meal.ingredients.length} ingredients
                            </p>
                          </div>
                        </div>
                        {meal.description && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              {meal.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 