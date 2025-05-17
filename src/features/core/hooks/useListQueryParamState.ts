import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import {
  FilterParams,
  GroupParams,
  ListQueryParams,
  PaginationParams,
  SortParams,
} from '../types/query.types';

/**
 * Manages ListQueryParams<T> state and exposes setters
 * that mirror React's setState API (accepting a value or updater).
 */
export function useListQueryParamState<T>(
  defaultParams?: Partial<ListQueryParams<T>>
) {
  const [params, setParams] = useState<ListQueryParams<T>>({
    pagination: { page: 1, pageSize: Infinity },
    sort: [],
    filters: [],
    groupBy: [],
    ...defaultParams,
  });

  const setPagination: Dispatch<SetStateAction<PaginationParams>> = useCallback(
    (action) =>
      setParams((p) => ({
        ...p,
        pagination:
          typeof action === 'function' ? action(p.pagination!) : action,
      })),
    []
  );

  const setSort: Dispatch<SetStateAction<SortParams<T>[]>> = useCallback(
    (action) =>
      setParams((p) => ({
        ...p,
        sort: typeof action === 'function' ? action(p.sort!) : action,
      })),
    []
  );

  const setFilters: Dispatch<SetStateAction<FilterParams<T, keyof T>[]>> =
    useCallback(
      (action) =>
        setParams((p) => ({
          ...p,
          filters: typeof action === 'function' ? action(p.filters!) : action,
        })),
      []
    );

  const setGroupBy: Dispatch<SetStateAction<GroupParams<T>[]>> = useCallback(
    (action) =>
      setParams((p) => ({
        ...p,
        groupBy: typeof action === 'function' ? action(p.groupBy!) : action,
      })),
    []
  );

  return [params, { setPagination, setSort, setFilters, setGroupBy }] as const;
}
