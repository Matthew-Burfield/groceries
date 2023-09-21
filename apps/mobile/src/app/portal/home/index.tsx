import {
  ShoppingList,
  ShoppingListGroup,
  ShoppingListItem,
} from '@groceries/features/shopping-list';
import Checkbox from '@groceries/ui/checkbox';
import { Stack } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home Stack' }} />
      <ShoppingList
        ListGroup={(group) => (
          <ShoppingListGroup asChild>
            <View>
              <Text>icon + {group}</Text>
            </View>
          </ShoppingListGroup>
        )}
        ListItem={(item) => (
          <ShoppingListItem key={item.id} asChild>
            <Checkbox
              isChecked={item.isComplete}
              onPress={(_event) => {
                return Promise.resolve(true);
              }}
              text={item.name}
            />
          </ShoppingListItem>
        )}
      />
      {/* <ShoppingList> */}
      {/*   {foodGroups.map((group) => { */}
      {/*     const foodGroupItems = items.filter((item) => item.type === group); */}
      {/*     if (foodGroupItems.length === 0) { */}
      {/*       return null; */}
      {/*     } */}
      {/*     return ( */}
      {/*       <React.Fragment key={group}> */}
      {/*         <ShoppingListGroup asChild> */}
      {/*           <View> */}
      {/*             <Text>icon + {group}</Text> */}
      {/*           </View> */}
      {/*         </ShoppingListGroup> */}
      {/*         {foodGroupItems.map((item) => ( */}
      {/*           <ShoppingListItem key={item.id} asChild> */}
      {/*             <Checkbox isChecked={item.isComplete} text={item.name} /> */}
      {/*           </ShoppingListItem> */}
      {/*         ))} */}
      {/*       </React.Fragment> */}
      {/*     ); */}
      {/*   })} */}
      {/* </ShoppingList> */}
    </>
  );
}

export default Home;
