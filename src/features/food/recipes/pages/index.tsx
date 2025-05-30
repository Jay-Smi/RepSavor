import ItemList from '@/features/core/components/item-list/ItemList';
import { useListQueryParamState } from '@/features/core/hooks/useListQueryParamState';
import { Recipe } from '@/models/food/food-item/Recipe';
import { useRecipes } from '../hooks/useRecipes';

interface RecipesPageProps {}

const RecipesPage = ({}: RecipesPageProps) => {
  // ** global state ** //
  const [params, handlers] = useListQueryParamState();

  const result = useRecipes(params);

  // ** local state ** //

  // ** local vars ** //

  // ** handlers ** //
  return (
    <ItemList<Recipe>
      itemType="recipe"
      result={result}
      params={params}
      handlers={handlers}
      viewMode="table"
    />
  );
};
export default RecipesPage;
