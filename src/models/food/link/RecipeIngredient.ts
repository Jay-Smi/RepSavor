import { Portion } from '../Portion';

/** Maps Ingredients into Recipes with precise portions */
export interface RecipeIngredient extends Portion {
  id?: number;
  recipeId: number; // FK -> Recipe.id
  ingredientId: number; // FK -> Ingredient.id
}
