import { redirect } from 'next/navigation';
import { getServerCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import IngredientForm from '@/app/components/IngredientForm';

export default async function NewMealPage() {
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
  
  // Fetch all ingredients for the family
  const ingredients = await prisma.ingredient.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Create New Meal</h1>
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
            <div className="px-4 py-5 sm:p-6">
              <form action="/api/meals" method="POST" className="space-y-6">
                <input 
                  type="hidden" 
                  name="familyId" 
                  value={selectedFamily.id} 
                />
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Meal Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description (Optional)
                  </label>
                  <div className="mt-1">
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <IngredientForm ingredients={ingredients} />
                
                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Meal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 