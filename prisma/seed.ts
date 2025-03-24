const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.category.deleteMany();
  // Create default categories
  const categories = [
    { name: "Fruits & Vegetables" },
    { name: "Dairy & Eggs" },
    { name: "Meat & Seafood" },
    { name: "Bakery" },
    { name: "Pantry Items" },
    { name: "Frozen Food" },
    { name: "Beverages" },
    { name: "Snacks" },
    { name: "Household" },
    { name: "Personal Care" },
  ];
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }
  console.log("Database has been seeded with categories");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

