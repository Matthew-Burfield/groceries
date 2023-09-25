import { useGetData, usePubSub } from '@groceries/client/util/remote-data';
import { FoodGroup, foodGroups } from '../constants/food-groups';

type Item = {
  id: number;
  name: string;
  type: FoodGroup;
  isComplete: boolean;
  quantity?: string;
};

type Error = {
  message: string;
};

async function convertDummyTodosIntoItems(response: Response): Promise<Item[]> {
  const jsonResponse = await response.json();
  const todos: {
    id: number;
    todo: string;
    userId: number;
    completed: boolean;
  }[] = jsonResponse.todos;
  if (todos === void 0) return [];
  return todos.map((todo) => ({
    id: todo.id,
    name: todo.todo,
    type: foodGroups[Math.floor(Math.random() * foodGroups.length)],
    isComplete: todo.completed,
  }));
}

async function fetchItems() {
  const response = await fetch('https://dummyjson.com/todos');
  const items: Item[] = await convertDummyTodosIntoItems(response);
  return items;
}

function useItems() {
  const data = useGetData<Item[], Error>({
    queryKey: ['items'],
    queryFn: fetchItems,
    staleTime: Infinity,
  });
  // usePubSub<Item>({
  //   channelName: 'items',
  //   action: function (message) {
  //     switch (message.type) {
  //       case 'added':
  //         data.updateCache((items) => {
  //           if (items === void 0) return [];
  //           return [...items, message.data];
  //         });
  //         break;
  //       case 'updated':
  //         data.updateCache((items) => {
  //           if (items === void 0) return [];
  //           const index = items.findIndex(
  //             (item) => item.id === message.data.id
  //           );
  //           if (index === -1) {
  //             return items;
  //           }
  //           const newItems = [...items];
  //           newItems[index] = message.data;
  //           return newItems;
  //         });
  //         break;
  //       case 'deleted':
  //         data.updateCache((items) => {
  //           if (items === void 0) return [];
  //           return items.filter((item) => item.id !== message.data.id);
  //         });
  //     }
  //   },
  // });
  return {
    status: data.status,
    data: data.data,
    error: data.error,
  };
}

export { useItems, Item };
