import { FoodItemBase } from '../FoodItemBase';

export interface Ingredient extends FoodItemBase {
  type: 'ingredient';
  externalLink?: string; // e.g., source URL or barcode scan
}
