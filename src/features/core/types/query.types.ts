/**
 * Generic pagination parameters for list queries.
 */
export interface PaginationParams {
  pageIndex: number; // 1-based page index
  pageSize: number; // items per page
}

/**
 * Generic sorting parameters for list queries.
 */
export type SortDirection = 'asc' | 'desc';

export interface SortByField<T, K extends keyof T> {
  type: 'field';
  field: K;
  direction: SortDirection;
}

export interface SortByTag<T> {
  type: 'tag';
  /** Only valid if T has a `tags: string[]` field */
  value: T extends { tags: (infer U)[] } ? U : never;
  direction: SortDirection;
}

export type SortParams<T> = SortByField<T, keyof T> | SortByTag<T>;

/**
 * Supported filter operators.
 */
export type FilterOperator =
  | 'equals'
  | 'contains'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte';

/**
 * Generic filter parameter for list queries.
 */
export interface FilterParams<T, K extends keyof T> {
  field: K;
  operator: FilterOperator;
  value: T[K];
}

/**
 * Generic grouping parameters: group by one or more fields.
 */
export type GroupParams<T> = (keyof T)[];

/**
 * Nested grouping result.
 */
export type GroupedItem<T> =
  | (T & { subRows: undefined })
  | {
      [groupName: string]: unknown;
      subRows: GroupedItem<T>[];
    };

/**
 * Combined list query parameters: pagination, sorting, filtering, grouping.
 */
export interface ListQueryParams<T> {
  pagination?: PaginationParams;
  sort?: SortParams<T>[];
  filters?: FilterParams<T, keyof T>[];
  groupBy?: GroupParams<T>;
}

export type ResultStatus = 'pending' | 'error' | 'success';

/**
 * Result of a list query: items, total count, current page, page size, and optional grouping.
 */
export interface ListItemsDataResponse<T> {
  items: GroupedItem<T>[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ListQueryResult<T> {
  data: ListItemsDataResponse<T> | undefined;
  status: ResultStatus;
  isFetching: boolean;
  error: Error | null;
  refetch: () => void;
}
