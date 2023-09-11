import { ShoppingList } from '@groceries/features/shopping-list';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

type FoodGroup =
  | 'fruit_and_vegetables'
  | 'meat_and_seafood'
  | 'dairy_eggs_fridge'
  | 'bakery'
  | 'deli'
  | 'pantry'
  | 'snacks_and_confectionary'
  | 'drinks'
  | 'frozen'
  | 'household'
  | 'health_and_beauty'
  | 'baby'
  | 'pet'
  | 'liquor'
  | 'tobacco';
type Item = {
  name: string;
  type: FoodGroup;
  isComplete: boolean;
  quantity?: string;
};

function Home() {
  const items: Item[] = [
    {
      name: 'Chicken breast',
      type: 'meat_and_seafood',
      isComplete: false,
      quantity: '2kg',
    },
    {
      name: 'Chocolate',
      type: 'snacks_and_confectionary',
      isComplete: true,
    },
  ];
  return (
    <>
      <Stack.Screen options={{ title: 'Home Stack' }} />
      <ShoppingList items={items}>
        <ShoppingList.Group>
          {(groupName) => <View>icon + {groupName}</View>}
        </ShoppingList.Group>
        <ShoppingList.Item>
          {(item) => (
            <View>{item.name} + edit button + isCompleted styles</View>
          )}
        </ShoppingList.Item>
      </ShoppingList>
    </>
  );
}

export default Home;
