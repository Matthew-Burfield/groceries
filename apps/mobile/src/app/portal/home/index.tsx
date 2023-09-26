import {
  ShoppingList,
  ShoppingListGroup,
  ShoppingListItem,
} from '@groceries/client/features';
import { FOOD_GROUPS } from '@groceries/client/constants';
import { useItems } from '@groceries/client/data';
import { Checkbox } from '@groceries/client/components';
import { Stack } from 'expo-router';
import React, { Fragment } from 'react';
import { Text, View } from 'react-native';

// Separation of concerns
// 1. Route does the data fetching and has over all layout
// 1.1 Route also registers for the pubsub events
// 1.2 Route is responsible for looping through the list items, sorting and filtering.
// 2. ShoppingList is responsible for rendering the scrollable list. Should optimize for a long list with many items off the screen.
// 3. ShoppingListGroup is responsible for rendering the group header
// 4. ShoppingListItem is responsible for rendering the item

function Home() {
  const { status, data: items, error } = useItems();
  if (status === 'loading') {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View>
        <Text>{error.message}</Text>
      </View>
    );
  }
  if (items === void 0) {
    return (
      <View>
        <Text>To start creating your shopping list. Please add an item.</Text>
      </View>
    );
  }
  return (
    <>
      <Stack.Screen options={{ title: 'Home Stack' }} />
      <ShoppingList>
        {FOOD_GROUPS.map((group) => {
          const foodGroupItems = items.filter((item) => item.type === group);
          if (foodGroupItems.length === 0) {
            return null;
          }
          return (
            <Fragment key={group}>
              <ShoppingListGroup>
                <View>
                  <Text>icon + {group}</Text>
                </View>
              </ShoppingListGroup>
              {foodGroupItems.map((item) => {
                return (
                  <ShoppingListItem key={item.id} asChild>
                    <Checkbox
                      isChecked={item.isComplete}
                      onPress={(_event) => {
                        return Promise.resolve(true);
                      }}
                      text={item.name}
                    />
                  </ShoppingListItem>
                );
              })}
            </Fragment>
          );
        })}
      </ShoppingList>
    </>
  );
}

export default Home;
