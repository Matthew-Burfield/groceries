import { redirect } from 'next/navigation';
import { getServerCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function ShoppingListsPage() {
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
  
  // Fetch shopping lists for the selected family
  const shoppingLists = await prisma.shoppingList.findMany({
    where: {
      familyId: selectedFamily.id,
    },
    include: {
      mealPlan: {
        select: {
          weekStart: true,
        },
      },
      items: {
        include: {
          ingredient: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Lists</h1>
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
          {shoppingLists.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-500">No shopping lists found.</p>
              <p className="mt-2 text-sm text-gray-600">
                Create a meal plan to generate a shopping list.
              </p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {shoppingLists.map((list) => (
                  <li key={list.id}>
                    <a href={`/shopping-lists/${list.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              Week of {new Date(list.mealPlan.weekStart).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {list.items.length} items
                            </p>
                            <p className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {list.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Created {new Date(list.createdAt).toLocaleDateString()}
                          </p>
                        </div>
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