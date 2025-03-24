import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Grocery List App</h1>
          <div className="flex space-x-4">
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Simplify Your Grocery Shopping
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Plan meals, manage your shopping list, and collaborate with your family members.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Meal Planning</h3>
                <p className="text-gray-600">
                  Plan your meals for the week and automatically generate shopping lists based on recipes.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Inventory Management</h3>
                <p className="text-gray-600">
                  Keep track of what you have at home and only buy what you need.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Collaboration</h3>
                <p className="text-gray-600">
                  Share shopping lists with your family and see real-time updates while shopping.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            &copy; 2023 Grocery List App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
