const FOOD_GROUPS = [
  'fruit_and_vegetables',
  'meat_and_seafood',
  'dairy_eggs_fridge',
  'bakery',
  'deli',
  'pantry',
  'snacks_and_confectionary',
  'drinks',
  'frozen',
  'household',
  'health_and_beauty',
  'baby',
  'pet',
  'liquor',
  'tobacco',
] as const;

type FoodGroup = (typeof FOOD_GROUPS)[number];

export { FOOD_GROUPS, FoodGroup };
