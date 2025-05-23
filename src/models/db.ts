import Dexie, { Table } from 'dexie';
import { CustomFood } from './food/food-item/CustomFood';
import { Ingredient } from './food/food-item/Ingredient';
import { Recipe } from './food/food-item/Recipe';
import { FoodItemBase } from './food/FoodItemBase';
import { RecipeIngredient } from './food/link/RecipeIngredient';
import { Review } from './food/link/Review';
import { Nutrient } from './food/nutrient/Nutrient';
import { NutritionFact } from './food/nutrient/NutritionFact';
import { ShoppingList } from './food/shopping-list/ShoppingList';
import { ShoppingListItem } from './food/shopping-list/ShoppingListItem';
import { Consumption } from './food/tracking/Consumption';
import {
  populateConsumptions,
  populateCustomFoods,
  populateIngredients,
  populateNutrients,
  populateNutritionFacts,
  populateRecipeIngredients,
  populateRecipes,
  populateReviews,
  populateShoppingListItems,
  populateShoppingLists,
} from './populate';

export class AppDB extends Dexie {
  ingredients!: Table<Ingredient, number>;
  recipes!: Table<Recipe, number>;
  customFoods!: Table<CustomFood, number>;
  recipeIngredients!: Table<RecipeIngredient, number>;
  nutrients!: Table<Nutrient, number>;
  nutritionFacts!: Table<NutritionFact, number>;
  reviews!: Table<Review, number>;
  consumptions!: Table<Consumption, number>;

  shoppingLists!: Table<ShoppingList, number>;
  shoppingListItems!: Table<ShoppingListItem, number>;

  constructor() {
    super('RepSavorDB');
    this.version(1).stores({
      ingredients: '++id, name, *tags, createdAt, updatedAt',
      recipes: '++id, name, *tags, createdAt, updatedAt',
      customFoods: '++id, name, *tags, createdAt, updatedAt',
      recipeIngredients: '++id, recipeId, ingredientId',
      nutrients: '++id, name',
      nutritionFacts: '++id, itemType, itemId, nutrientId',
      reviews: '++id, itemType, itemId, rating, createdAt',
      consumptions: '++id, date, [date+itemType], [date+itemId]',
      shoppingLists: '++id, name, createdAt, updatedAt',
      shoppingListItems:
        '++id, listId, itemType, itemId, purchased, createdAt, updatedAt',
    });

    // Auto-set timestamps on create/update
    [
      this.ingredients,
      this.recipes,
      this.customFoods,
      this.shoppingLists,
    ].forEach((table: Table<any, number>) => {
      table.hook('creating', (_: number, obj: FoodItemBase) => {
        const now = Date.now();
        obj.createdAt = now;
        obj.updatedAt = now;
      });
      table.hook('updating', (mods: Partial<FoodItemBase>) => {
        mods.updatedAt = Date.now();
      });
    });
  }

  /**
   * Generic cascade-delete for any FoodItem type.
   */
  async deleteFoodItem(
    type: FoodItemBase['type'],
    id: number,
    cascade = true
  ): Promise<void> {
    const recIng = this.recipeIngredients;
    const nutFacts = this.nutritionFacts;
    const rev = this.reviews;
    const cons = this.consumptions;
    let tbl: Table<FoodItemBase, number>;

    // Determine the primary table to delete from
    switch (type) {
      case 'ingredient':
        tbl = this.ingredients;
        break;
      case 'recipe':
        tbl = this.recipes;
        break;
      case 'custom':
        tbl = this.customFoods;
        break;
      default:
        throw new Error(`Unsupported type for deleteFoodItem: ${type}`);
    }
    if (cascade) {
      await this.transaction(
        'rw',
        [recIng, nutFacts, rev, cons, tbl],
        async () => {
          // Remove recipe-ingredient links if applicable
          switch (type) {
            case 'ingredient':
              await recIng.where({ ingredientId: id }).delete();
              break;
            case 'recipe':
              await recIng.where({ recipeId: id }).delete();
              break;
            case 'custom':
              // no recipe-ingredient records to delete
              break;
            default:
              throw new Error(`Unsupported type for deleteFoodItem: ${type}`);
          }

          // Remove all nutrition facts, reviews, and consumption logs
          await nutFacts.where({ itemType: type, itemId: id }).delete();
          await rev.where({ itemType: type, itemId: id }).delete();
          await cons.where({ itemType: type, itemId: id }).delete();

          // Finally, delete the item itself
          await tbl.delete(id);
        }
      );
    } else {
      await tbl.delete(id);
    }
  }

  async deleteShoppingList(listId: number, cascade = true): Promise<void> {
    if (cascade) {
      await this.transaction(
        'rw',
        [this.shoppingListItems, this.shoppingLists],
        async () => {
          // Remove all items in that list
          await this.shoppingListItems.where({ listId }).delete();
          // Then remove the list itself
          await this.shoppingLists.delete(listId);
        }
      );
    } else {
      await this.shoppingLists.delete(listId);
    }
  }
}

export const db = new AppDB();

db.on('populate', async () => {
  await populateIngredients(db);
  await populateRecipes(db);
  await populateCustomFoods(db);
  await populateRecipeIngredients(db);
  await populateNutrients(db);
  await populateNutritionFacts(db);
  await populateReviews(db);
  await populateConsumptions(db);
  await populateShoppingLists(db);
  await populateShoppingListItems(db);
});

(globalThis as any).clearRepSavorDB = async () => {
  // delete the underlying database completely
  await db.delete();

  // re-open it—this will trigger your `db.on('populate', ...)` handlers
  await db.open();
};
