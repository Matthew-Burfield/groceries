import { redirect } from 'next/navigation';
import { getServerCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function MealPlansPage() {
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Meal Plan</h1>
          <div className="flex items-center space-x-4">
            <a 
              href="/dashboard"
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedFamily?.name} Meal Plan
            </h2>
            <a
              href="/meal-plans/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Update Meal Plan
            </a>
          </div>
          
          {!currentMealPlan ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
              <p className="text-gray-500">You haven't created a meal plan yet.</p>
              <p className="mt-2">
                <a 
                  href="/meal-plans/new"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Create your meal plan
                </a>
              </p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      Week of {new Date(currentMealPlan.weekStart).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {currentMealPlan.entries.length} meals planned
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {new Date(currentMealPlan.weekStart).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })} - {new Date(new Date(currentMealPlan.weekStart).getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                    const entry = currentMealPlan.entries.find(e => e.dayOfWeek.toLowerCase() === day);
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
                              <p className="text-sm text-gray-400 italic">
                                No meal planned
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
                <a
                  href={`/meal-plans/${currentMealPlan.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View Details
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 