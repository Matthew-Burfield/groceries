import {
  ShoppingList,
  ShoppingListGroup,
  ShoppingListItem,
} from '@groceries/features/shopping-list';
import Checkbox from '@groceries/ui/checkbox';
import { Stack } from 'expo-router';
import React from 'react';
import { GestureResponderEvent, Text, View } from 'react-native';

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

function useData<TReturnType>({
  key,
  fetchFn,
}: {
  key: string[];
  fetchFn: () => Promise<TReturnType>;
}) {
  const queryClient = useQueryClient();
  const queryData = useQuery<TReturnType>({
    queryKey: key,
    queryFn: fetchFn,
  });

  const update = (updateFn: (oldItems: TReturnType) => TReturnType) => {
    queryClient.setQueryData(key, updateFn);
  };

  return {
    status: queryData.status,
    data: queryData.data,
    error: queryData.error,
    update,
  };
}

function useItems() {
  return useData<Item[]>({
    key: ['items'],
    fetchFn: () => Promise.resolve(items),
  });
}

function usePubSub<TMessage>({
  channelName,
  action,
}: {
  channelName: string;
  action: (message: TMessage) => void;
}) {
  useEffect(() => {
    channel.subscribe(channelName, action);

    return () => channel.unsubscribe(channelName);
  }, []);
}

function Home() {
  const { status, data: items, error, update: updateItems } = useItems();

  usePubSub<Message>({
    channel: 'items',
    action: function (message) {
      switch (message.type) {
        case 'item_added':
        case 'item_updated':
        case 'item_deleted':
        case 'item_completed':
        case 'item_uncompleted': {
          updateItems((items) => [...items, message.item]);
        }
      }
    },
  });

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
