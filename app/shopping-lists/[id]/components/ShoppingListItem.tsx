'use client';

interface ShoppingListItemProps {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  shoppingListId: number;
}

export default function ShoppingListItem({ id, name, quantity, unit, checked, shoppingListId }: ShoppingListItemProps) {
  return (
    <li className="px-4 py-4 sm:px-6">
      <form action={`/api/shopping-lists/${shoppingListId}/items/${id}/toggle`} method="POST" className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => e.target.form?.requestSubmit()}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <p className="ml-3 text-sm font-medium text-gray-900">
            {name}
          </p>
        </div>
        <div className="ml-2 flex-shrink-0 flex">
          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {quantity} {unit}
          </p>
        </div>
      </form>
    </li>
  );
} 