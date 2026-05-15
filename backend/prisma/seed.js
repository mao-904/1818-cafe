const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.menuItem.createMany({
    data: [
      { name: "House Blend", description: "Medium roast, notes of chocolate", price: 3.50, category: "coffee" },
      { name: "Oat Latte", description: "Creamy, smooth, vegan", price: 4.75, category: "coffee" },
      { name: "Espresso", description: "Bold, rich, single-origin", price: 3.00, category: "coffee" },
      { name: "Croissant", description: "Buttery, flaky, baked daily", price: 3.25, category: "pastry" },
      { name: "Avocado Toast", description: "Sourdough, chili flakes, lemon", price: 8.50, category: "food" },
      { name: "Breakfast Sandwich", description: "Egg, cheese, bacon on brioche", price: 7.00, category: "food" }
    ]
  });
  console.log('✅ Seeded 6 menu items');
}

main()
  .catch((e) => console.error('Seed error:', e))
  .finally(async () => await prisma.$disconnect());