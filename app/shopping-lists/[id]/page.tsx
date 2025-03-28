import { redirect } from 'next/navigation';
import { getServerCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function ShoppingListDetailPage({ params }: { params: { id: string } }) {
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
  
  // Fetch the shopping list with all its details
  const shoppingList = await prisma.shoppingList.findUnique({
    where: {
      id: Number(params.id),
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
          ingredient: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          ingredient: {
            name: 'asc',
          },
        },
      },
    },
  });
  
  if (!shoppingList) {
    redirect('/shopping-lists');
  }
  
  // Group items by category
  const itemsByCategory = shoppingList.items.reduce((acc, item) => {
    const category = item.ingredient.category?.name || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof shoppingList.items>);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Shopping List</h1>
          <div className="flex items-center space-x-4">
            <a 
              href="/shopping-lists"
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
            >
              Back to Lists
            </a>
            <form action={`/api/shopping-lists/${shoppingList.id}/toggle-status`} method="POST">
              <input type="hidden" name="status" value={shoppingList.status === 'active' ? 'completed' : 'active'} />
              <button
                type="submit"
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  shoppingList.status === 'active' 
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {shoppingList.status === 'active' ? 'Mark as Completed' : 'Mark as Active'}
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Week of {new Date(shoppingList.mealPlan.weekStart).toLocaleDateString()}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Created {new Date(shoppingList.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <p className={`px-3 py-1 text-sm font-medium rounded-full ${
                    shoppingList.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : shoppingList.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {shoppingList.status.charAt(0).toUpperCase() + shoppingList.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Items
              </h3>
            </div>
            <div className="border-t border-gray-200">
              {Object.entries(itemsByCategory).map(([category, items]) => (
                <div key={category} className="border-b border-gray-200 last:border-b-0">
                  <div className="px-4 py-3 sm:px-6 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-500">{category}</h4>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <li key={item.id} className="px-4 py-4 sm:px-6">
                        <form action={`/api/shopping-lists/${shoppingList.id}/items/${item.id}/toggle`} method="POST" className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={(e) => e.target.form?.requestSubmit()}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <p className="ml-3 text-sm font-medium text-gray-900">
                              {item.ingredient.name}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {item.quantity} {item.ingredient.unit}
                            </p>
                          </div>
                        </form>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 