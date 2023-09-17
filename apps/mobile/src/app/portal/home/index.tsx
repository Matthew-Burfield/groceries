import {
  ShoppingList,
  ShoppingListGroup,
  ShoppingListItem,
} from '@groceries/features/shopping-list';
import Checkbox from '@groceries/ui/checkbox';
import { Stack } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const foodGroups = [
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

type FoodGroup = (typeof foodGroups)[number];
type Item = {
  id: number;
  name: string;
  type: FoodGroup;
  isComplete: boolean;
  quantity?: string;
};

function Home() {
  const items: Item[] = [
    {
      id: 1,
      name: 'Chicken breast',
      type: 'meat_and_seafood',
      isComplete: false,
      quantity: '2kg',
    },
    {
      id: 2,
      name: 'Chocolate',
      type: 'snacks_and_confectionary',
      isComplete: true,
    },
  ];

  return (
    <>
      <Stack.Screen options={{ title: 'Home Stack' }} />
      <ShoppingList>
        {foodGroups.map((group) => {
          const foodGroupItems = items.filter((item) => item.type === group);
          if (foodGroupItems.length === 0) {
            return null;
          }
          return (
            <React.Fragment key={group}>
              <ShoppingListGroup asChild>
                <View>
                  <Text>icon + {group}</Text>
                </View>
              </ShoppingListGroup>
              {foodGroupItems.map((item) => (
                <ShoppingListItem key={item.id} asChild>
                  <Checkbox isChecked={item.isComplete} text={item.name} />
                </ShoppingListItem>
              ))}
            </React.Fragment>
          );
        })}
      </ShoppingList>
    </>
  );
}

export default Home;
