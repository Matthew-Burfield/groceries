import { redirect } from 'next/navigation';
import { getServerCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DeleteMealPlanForm from './DeleteMealPlanForm';
import AddMealForm from './components/AddMealForm';
import GenerateShoppingListButton from './components/GenerateShoppingListButton';

export default async function MealPlanDetailPage({ params }: { params: { id: string } }) {
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
  const parsedId = await Promise.resolve(params.id);
  const id = Number(parsedId);
  if (isNaN(id)) {
    redirect('/meal-plans');
  }
  
  // Fetch the meal plan
  const mealPlan = await prisma.mealPlan.findUnique({
    where: { id },
    include: {
      entries: {
        include: {
          meal: {
            include: {
              ingredients: {
                include: {
                  ingredient: true,
                },
              },
            },
          },
        },
      },
      family: true,
    },
  });
  
  if (!mealPlan) {
    redirect('/meal-plans');
  }
  
  // Check if user is a member of the family
  const familyMember = user.familyMembers.find(
    (member) => member.familyId === mealPlan.familyId
  );
  
  if (!familyMember) {
    redirect('/meal-plans');
  }
  
  // Fetch all meals for the family to be used for adding meals to the plan
  const familyMeals = await prisma.meal.findMany({
    where: {
      familyId: mealPlan.familyId,
    },
    orderBy: {
      name: 'asc',
    },
  });
  
  const weekStart = new Date(mealPlan.weekStart);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];
  
  // Get shopping list if it exists
  const shoppingList = await prisma.shoppingList.findUnique({
    where: { mealPlanId: id },
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Meal Plan Details</h1>
          <div className="flex items-center space-x-4">
            <a 
              href="/meal-plans"
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Back to Meal Plans
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Week of {formatDate(weekStart)}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {formatDate(weekStart)} - {formatDate(weekEnd)}
                </p>
              </div>
              <div className="flex space-x-3">
                {!shoppingList ? (
                  <GenerateShoppingListButton mealPlanId={id} />
                ) : (
                  <>
                    <a
                      href={`/shopping-lists/${shoppingList.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                    >
                      View Shopping List
                    </a>
                    <GenerateShoppingListButton mealPlanId={id} existingShoppingListId={shoppingList.id} />
                  </>
                )}
                <DeleteMealPlanForm id={id} />
              </div>
            </div>
            
            <div className="border-t border-gray-200">
              <dl>
                {daysOfWeek.map((day, idx) => {
                  const entry = mealPlan.entries.find(e => e.dayOfWeek.toLowerCase() === day.key);
                  
                  return (
                    <div key={day.key} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                      <dt className="text-sm font-medium text-gray-500">
                        {day.label}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex justify-between items-center">
                        {entry ? (
                          <span>{entry.meal.name}</span>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <AddMealForm 
                              mealPlanId={id}
                              dayOfWeek={day.key}
                              meals={familyMeals}
                            />
                          </div>
                        )}
                        
                        <div className="ml-4">
                          {entry && (
                            <form 
                              action={`/api/meal-plans/${id}/entries/${entry.id}`} 
                              method="DELETE"
                              className="inline-block"
                            >
                              <button
                                type="submit"
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-600 hover:text-red-900"
                              >
                                Remove
                              </button>
                            </form>
                          )}
                        </div>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 