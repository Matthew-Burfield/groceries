import { redirect } from 'next/navigation';
import { getServerCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AddMealForm from '@/app/components/AddMealForm';

export default async function DashboardPage() {
  const user = await getServerCurrentUser();
  
  // If no user or invalid token, redirect to login
  if (!user) {
    console.log('No user or invalid token, redirecting to login');
    redirect('/login');
  }
  
  // If user has no family members, redirect to setup
  if (!user.familyMembers?.length) {
    console.log('No family members, redirecting to setup');
    redirect('/setup-family');
  }
  
  const selectedFamily = user.familyMembers[0]?.family;
  
  // If no valid family found, redirect to setup
  if (!selectedFamily) {
    console.log('No valid family found, redirecting to setup');
    redirect('/setup-family');
  }

  // Fetch the current meal plan for the family
  const currentMealPlan = await prisma.mealPlan.findFirst({
    where: {
      familyId: selectedFamily.id,
    },
    include: {
      entries: {
        include: {
          meal: true,
        },
      },
    },
    orderBy: {
      weekStart: 'desc',
    },
  });
  
  // Fetch all meals for the family to be used for adding meals to the plan
  const familyMeals = await prisma.meal.findMany({
    where: {
      familyId: selectedFamily.id,
    },
    orderBy: {
      name: 'asc',
    },
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Grocery List App</h1>
          <div className="flex items-center space-x-4">
            <a 
              href="/meals"
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Manage Meals
            </a>
            <span className="text-sm text-gray-600">
              Welcome, {user.username}
            </span>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 min-h-96">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedFamily?.name} Dashboard
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg font-medium text-gray-900">Weekly Meal Plan</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Plan your meals for the week
                    </p>
                  </div>
                  <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                      {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                        const entry = currentMealPlan?.entries.find(e => e.dayOfWeek.toLowerCase() === day);
                        return (
                          <li key={day} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900 capitalize">
                                  {day}
                                </p>
                              </div>
                              <div className="ml-2 flex-shrink-0 flex">
                                {entry ? (
                                  <p className="text-sm text-gray-500">
                                    {entry.meal.name}
                                  </p>
                                ) : (
                                  <AddMealForm 
                                    mealPlanId={currentMealPlan?.id || 0} 
                                    dayOfWeek={day} 
                                    meals={familyMeals} 
                                  />
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {currentMealPlan && (
                    <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
                      <form action={`/api/meal-plans/${currentMealPlan.id}/generate-shopping-list`} method="POST">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Generate Shopping List
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Shopping Lists</h3>
                    <p className="text-gray-600 mb-4">
                      View and manage your shopping lists.
                    </p>
                    <div>
                      <a
                        href="/shopping-lists"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        View Shopping Lists
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Inventory</h3>
                    <p className="text-gray-600 mb-4">
                      Manage your current inventory of ingredients.
                    </p>
                    <div>
                      <a
                        href="/inventory"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Manage Inventory
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 