import {
  ListQueryParams,
  ListQueryResult,
} from '@/features/core/types/query.types';
import { FoodItemBase } from '@/models/food/FoodItemBase';

interface ItemGridProps<T> {
  result: ListQueryResult<T>;
  params: ListQueryParams<T>;
  itemType: FoodItemBase['type'];
}

function ItemGrid<T>({ result, params }: ItemGridProps<T>) {
  // ** global state ** //

  // ** local state ** //

  // ** local vars ** //
  if (status === 'pending') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>Error: {String(error)}</div>;
  }

  const noData = !data || (data.type === 'list' && data.items.length === 0);

  if (noData) {
    return <div>No data</div>;
  }
  // ** handlers ** //
  return <div></div>;
}
export default ItemGrid;
