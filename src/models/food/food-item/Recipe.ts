import { FoodItemBase } from '../FoodItemBase';

export interface Recipe extends FoodItemBase {
  type: 'recipe';
  instructions: string;
  servings: number;
  externalLink?: string;
}
