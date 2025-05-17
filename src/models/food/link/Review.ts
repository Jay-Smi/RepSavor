import { FoodItemBase } from '../FoodItemBase';

/** User reviews (rating + comment) for any FoodItem */
export interface Review {
  id?: number;
  itemType: FoodItemBase['type'];
  itemId: number; // FK -> FoodItem id
  rating: number; // 1–5
  comment?: string;
  createdAt?: number;
}
