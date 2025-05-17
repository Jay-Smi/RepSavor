import { Skeleton, Stack, Text } from '@mantine/core';
import { useListQueryParamState } from '@/features/core/hooks/useListQueryParamState';
import { Recipe } from '@/models/food/food-item/Recipe';
import { useRecipes } from '../hooks/useRecipes';

interface RecipesPageProps {}

const RecipesPage = ({}: RecipesPageProps) => {
  // ** global state ** //
  const [params, setParams] = useListQueryParamState<Recipe>({
    groupBy: [{ type: 'tag', value: 'high-protein' }],
  });

  const { data, status, isFetching, error, refetch } = useRecipes(params);

  // ** local state ** //

  // ** local vars ** //

  // ** handlers ** //
  return (
    <div>
      <button onClick={() => refetch()} type="button">
        Refetch
      </button>
      RecipesPage
      <Stack>
        {status === 'pending' &&
          Array(5).map((_, i) => <Skeleton key={i} height={20} />)}
        {status === 'error' && <Text color="red">{String(error)}</Text>}

        {status === 'success' && (
          <Stack>
            {data?.type === 'grouped' &&
              Object.entries(data.groups).map(([key, items]) => (
                <Stack key={key}>
                  <Text>{key}</Text>
                  {Array.isArray(items) &&
                    items.map((item) => <Text key={item.id}>{item.name}</Text>)}
                  {typeof items === 'object' &&
                    Object.entries(items).map(([key, items]) => (
                      <Stack key={key}>
                        <Text>{key}</Text>
                        {Array.isArray(items) &&
                          items.map((item) => (
                            <Text key={item.id}>{item.name}</Text>
                          ))}
                      </Stack>
                    ))}
                </Stack>
              ))}
            {data?.type === 'list' &&
              data.items.map((item) => <Text key={item.id}>{item.name}</Text>)}
          </Stack>
        )}
      </Stack>
    </div>
  );
};
export default RecipesPage;
