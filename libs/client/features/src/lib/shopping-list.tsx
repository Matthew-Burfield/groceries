import * as React from 'react';
import { View } from 'react-native';

/* ----------------------------------------------------------------
 * ShoppingGroup
 * --------------------------------------------------------------*/

const SHOPPING_LIST_NAME = 'ShoppingList';

type ShoppingListProps = {
  children: React.ReactNode;
};

function ShoppingList(props: ShoppingListProps) {
  return <View>{props.children}</View>;
}
ShoppingList.displayName = SHOPPING_LIST_NAME;

/* ----------------------------------------------------------------
 * ShoppingGroup
 * --------------------------------------------------------------*/

const GROUP_NAME = 'ShoppingListGroup';

type ShoppingListGroupProps = {
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
