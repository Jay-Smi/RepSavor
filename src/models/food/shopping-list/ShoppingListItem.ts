import { Portion } from '../Portion';

/** An item within a shopping list */
export interface ShoppingListItem extends Portion {
  id?: number;
  listId: number;
  // optional link to an existing ingredient or custom food
  itemType?: 'ingredient' | 'custom';
  itemId?: number;
  name: string; // name if not linked
  purchased: boolean;
  createdAt?: number;
  updatedAt?: number;
}
