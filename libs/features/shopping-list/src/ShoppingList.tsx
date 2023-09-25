import * as React from 'react';
import { View } from 'react-native';
import { Item, useItems } from './data-access/useItems';
import { foodGroups } from './constants/food-groups';

type Group = (typeof foodGroups)[number];

/* ----------------------------------------------------------------
 * ShoppingGroup
 * --------------------------------------------------------------*/

const SHOPPING_LIST_NAME = 'ShoppingList';

type ShoppingListProps = {
  ListGroup: (group: Group) => React.ReactNode;
  ListItem: (item: Item) => React.ReactNode;
};

function ShoppingList(props: ShoppingListProps) {
  const { status, data: items, error } = useItems();
  if (status === 'loading') {
    return <View>Loading...</View>;
  }
  if (error) {
    return <View>{error.message}</View>;
  }
  if (items === void 0) {
    return (
      <View>To start creating your shopping list. Please add an item.</View>
    );
  }
  return (
    <View>
      {foodGroups.map((group) => {
        const foodGroupItems = items.filter((item) => item.type === group);
        return (
          <React.Fragment key={group}>
            {props.ListGroup(group)}
            {foodGroupItems.map((item) => props.ListItem(item))}
          </React.Fragment>
        );
      })}
    </View>
  );
}
ShoppingList.displayName = SHOPPING_LIST_NAME;

/* ----------------------------------------------------------------
 * ShoppingGroup
 * --------------------------------------------------------------*/

const GROUP_NAME = 'ShoppingListGroup';

type ShoppingListGroupProps = {
  asChild: boolean;
  children: React.ReactNode;
};

const ShoppingListGroup = React.forwardRef<View, ShoppingListGroupProps>(
  (groupProps, forwardedRef) => {
    return <View {...groupProps} ref={forwardedRef} />;
  }
);

ShoppingListGroup.displayName = GROUP_NAME;

/* ----------------------------------------------------------------
 * ShoppingListItem
 * --------------------------------------------------------------*/

const ITEM_NAME = 'ShoppingListItem';

type ShoppingItemProps = {
  asChild: boolean;
  children: React.ReactNode;
};

const ShoppingListItem = React.forwardRef<View, ShoppingItemProps>(
  (itemProps, forwardedRef) => {
    return <View {...itemProps} ref={forwardedRef} />;
  }
);
ShoppingListItem.displayName = ITEM_NAME;

export { ShoppingList, ShoppingListGroup, ShoppingListItem };
