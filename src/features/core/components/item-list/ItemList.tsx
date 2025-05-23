import { MRT_RowData } from 'mantine-react-table';
import { FoodItemBase } from '@/models/food/FoodItemBase';
import { ListQueryParams, ListQueryResult } from '../../types/query.types';
import ItemGrid from './grid/ItemGrid';
import ItemTable from './table/ItemTable';

type ViewMode = 'grid' | 'table';

interface ItemListProps<T> {
  result: ListQueryResult<T>;
  params: ListQueryParams<T>;
  itemType: FoodItemBase['type'];
  viewMode?: ViewMode;
}

/**
 * Generic list component.
 * Shows initial skeleton, error state, then either grid or table, handling grouping if present.
 */
function ItemList<T extends MRT_RowData>({
  result,
  params,
  itemType,
  viewMode = 'grid',
}: ItemListProps<T>) {
  switch (viewMode) {
    case 'table':
      return <ItemTable<T> result={result} itemType={itemType} />;
    case 'grid':
      return (
        <ItemGrid<T> result={result} itemType={itemType} params={params} />
      );
  }
}
export default ItemList;
