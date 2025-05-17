import { FoodItemBase } from '../FoodItemBase';

/** Amount of a Nutrient per specified unit of a FoodItem */
export interface NutritionFact {
  id?: number;
  itemType: FoodItemBase['type'];
  itemId: number; // FK -> Ingredient.id | Recipe.id | CustomFood.id
  nutrientId: number; // FK -> Nutrient.id
  amountPerUnit: number; // per 1 unit or per 100g
  unitOverride?: string; // if differs from Nutrient.unit
}
