# Grocery List App

A full-stack web application for meal planning, grocery list management, and inventory tracking with real-time collaboration.

## Features

- User authentication and family group management
- Meal planning and recipe management
- Automated shopping list generation
- Inventory tracking
- Real-time updates for collaborative shopping
- Mobile-responsive design

## Tech Stack

- **Frontend:** React with Next.js, React Context, Tailwind CSS
- **Backend:** Node.js with Next.js API routes
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Real-time Updates:** Socket.io

## Prerequisites

- Node.js (v18+)
- PostgreSQL

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/grocery-list-app.git
cd grocery-list-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following:

```
DATABASE_URL="postgresql://username:password@localhost:5432/grocery_list_db?schema=public"
JWT_SECRET="your_super_secret_key_here_change_in_production"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

4. Create the database and run migrations:

```bash
npx prisma db push
```

5. Seed the database with initial data:

```bash
npm run db:seed
```

6. Start the development server:

```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:3000`

## Database Models

- User
- Family
- FamilyMember
- Category
- Ingredient
- Meal
- MealIngredient
- MealPlan
- MealPlanEntry
- ShoppingList
- ShoppingListItem
- StapleItem
- Inventory

## API Routes

- `/api/auth/*` - Authentication endpoints
- `/api/families/*` - Family management
- `/api/meals/*` - Meal and recipe management
- `/api/meal-plans/*` - Meal planning 
- `/api/shopping-lists/*` - Shopping list management
- `/api/inventory/*` - Inventory tracking

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
