/**
 * Generic pagination parameters for list queries.
 */
export interface PaginationParams {
  page: number; // 1-based page index
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
export interface GroupByField<T, K extends keyof T> {
  type: 'field';
  value: K;
}

export interface GroupByTag<T> {
  type: 'tag';
  value: T extends { tags: (infer U)[] } ? U : never;
}

export type GroupParams<T> = GroupByField<T, keyof T> | GroupByTag<T>;

/**
 * Nested grouping result.
 */
export interface GroupedList<T> {
  [key: string]: T[] | GroupedList<T>;
}

/**
 * Combined list query parameters: pagination, sorting, filtering, grouping.
 */
export interface ListQueryParams<T> {
  pagination?: PaginationParams;
  sort?: SortParams<T>[];
  filters?: FilterParams<T, keyof T>[];
  groupBy?: GroupParams<T>[];
}

export type ResultStatus = 'pending' | 'error' | 'success';

/** When no grouping is requested */
export interface ListItemsData<T> {
  type: 'list';
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** When grouping *is* requested */
export interface GroupedListItemsData<T> {
  type: 'grouped';
  groups: GroupedList<T>;
  /** total *leaf* count before pagination/grouping */
  total: number;
  page: number;
  pageSize: number;
}

export type ListItemsDataResponse<T> =
  | ListItemsData<T>
  | GroupedListItemsData<T>;

/**
 * Result of a list query: items, total count, current page, page size, and optional grouping.
 */
/** Result of the hook */
export interface ListQueryResult<T> {
  data: ListItemsDataResponse<T> | undefined;
  status: ResultStatus;
  isFetching: boolean;
  error: Error | null;
  refetch: () => void;
}
