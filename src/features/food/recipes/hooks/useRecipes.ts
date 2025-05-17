import { useListQuery } from '@/features/core/hooks/useListQuery';
import { ListQueryParams, ListQueryResult } from '@/features/core/types/query.types';
import { db } from '@/models/db';
import { Recipe } from '@/models/food/food-item/Recipe';

export type UseRecipesParams = ListQueryParams<Recipe>;

/**
 * Hook to fetch a paginated, sorted, filtered, and optionally grouped list of recipes.
 */
export function useRecipes(params?: UseRecipesParams): ListQueryResult<Recipe> {
  return useListQuery(db.recipes, params);
}
