import ItemList from '@/features/core/components/ItemList/ItemList';
import {
  ListPageLayout,
  useListPageContext,
} from '@/features/core/components/layouts/PageLayout/layouts/ListPageLayout/ListPageLayout';
import { useListQueryParamState } from '@/features/core/hooks/state/useListQueryParamState';
import { Recipe } from '@/models/food/food-item/Recipe';
import { useRecipes } from '../hooks/useRecipes';

const RecipesPage = () => {
  // ** global state ** //
  const [params, handlers] = useListQueryParamState();

  const result = useRecipes(params);

  // const { viewMode } = useListPageContext();

  // ** local state ** //

  // ** local vars ** //

  // ** handlers ** //
  return (
    <ListPageLayout params={params} handlers={handlers}>
      <ItemList<Recipe>
        itemType="recipe"
        result={result}
        params={params}
        handlers={handlers}
        viewMode="table"
      />
    </ListPageLayout>
  );
};
export default RecipesPage;
