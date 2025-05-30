import type {
  MRT_ColumnFilterFnsState,
  MRT_ColumnFiltersState,
  MRT_GroupingState,
  MRT_PaginationState,
  MRT_SortingState,
} from 'mantine-react-table';

export type ResultStatus = 'pending' | 'error' | 'success';

export interface ListQueryParams {
  columnFilters?: MRT_ColumnFiltersState;
  columnFilterFns?: MRT_ColumnFilterFnsState;
  globalFilter?: string;
  sorting?: MRT_SortingState;
  pagination?: MRT_PaginationState;
  grouping?: MRT_GroupingState;
}

export type GroupedItem<T> = T & {
  subItems?: GroupedItem<T>[];
};

export interface ListItemsDataResponse<T> {
  items: T[];
  total?: number;
  allTags: string[];
}

export interface ListQueryResult<T> {
  data: ListItemsDataResponse<T>;
  status: ResultStatus;
  isFetching: boolean;
  error: Error | null;
  refetch: () => void;
}
