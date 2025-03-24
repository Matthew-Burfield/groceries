import { redirect } from 'next/navigation';
import { getServerCurrentUser } from '@/lib/auth';

export default async function NewMealPlanPage() {
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Create New Meal Plan</h1>
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
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form action="/api/meal-plans" method="POST" className="space-y-6">
                <input 
                  type="hidden" 
                  name="familyId" 
                  value={selectedFamily.id} 
                />
                
                <div>
                  <label htmlFor="weekStart" className="block text-sm font-medium text-gray-700">
                    Week Start Date
                  </label>
                  <div className="mt-1">
                    <input
                      type="date"
                      name="weekStart"
                      id="weekStart"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Choose the start date for your meal planning week (typically a Sunday or Monday).
                  </p>
                </div>
                
                <div className="pt-5">
                  <div className="flex justify-end">
                    <a
                      href="/meal-plans"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </a>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Create Meal Plan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 