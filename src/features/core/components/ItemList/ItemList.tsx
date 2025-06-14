import { MRT_RowData } from 'mantine-react-table';
import { FoodItemBase } from '@/models/food/FoodItemBase';
import { ListQueryParamsSetStateActions } from '../../hooks/state/useListQueryParamState';
import { ListQueryParams, ListQueryResult } from '../../types/query.types';
import { ViewMode } from '../layouts/PageLayout/layouts/ListPageLayout/ListPageLayout.types';
import ItemGrid from './grid/ItemGrid';
import ItemTable from './table/ItemTable';

interface ItemListProps<T> {
  result: ListQueryResult<T>;
  params: ListQueryParams;
  handlers: ListQueryParamsSetStateActions;
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
  handlers,
  itemType,
  viewMode = 'grid',
}: ItemListProps<T>) {
  switch (viewMode) {
    case 'table':
      return (
        <ItemTable<T>
          result={result}
          itemType={itemType}
          params={params}
          handlers={handlers}
        />
      );
    case 'grid':
      return (
        <ItemGrid<T> result={result} itemType={itemType} params={params} />
      );
  }
}
export default ItemList;
