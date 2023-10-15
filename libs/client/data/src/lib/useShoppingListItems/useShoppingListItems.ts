import { fetch, useGetData } from '@groceries/client/utils';
import { FoodGroup } from '@groceries/client/constants';

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

async function fetchItems() {
  const response = await fetch('/api/shopping-list');
  const items = await response.json();
  console.log(items);
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
