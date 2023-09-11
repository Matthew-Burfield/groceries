type Item = { name: string };
type ShoppingListProps = {
  items: Item[];
  children: React.ReactNode;
};
function ShoppingList(props: ShoppingListProps) {
  return null;
}

type ShoppingGroupProps = {
  children: (groupName: string) => React.ReactNode;
};
function Group(props: ShoppingGroupProps) {
  return null;
}

type ShoppingItemProps = {
  children: (item: Item) => React.ReactNode;
};
function Item(props: ShoppingItemProps) {
  return null;
}

ShoppingList.Group = Group;
ShoppingList.Item = Item;

export { ShoppingList };
