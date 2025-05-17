/** Shared fields for all food items */
export interface FoodItemBase {
  id?: number;
  name: string;
  type: 'ingredient' | 'recipe' | 'custom';
  tags: string[];
  createdAt?: number;
  updatedAt?: number;
}
