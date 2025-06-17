import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import {
  MRT_ColumnFilterFnsState,
  MRT_ColumnFiltersState,
  MRT_GroupingState,
  MRT_PaginationState,
  MRT_SortingState,
} from 'mantine-react-table';
import { ListQueryParams } from '../../types/query.types';

export type ListQueryParamsHandlers = {
  handleColumnFiltersChange: Dispatch<SetStateAction<MRT_ColumnFiltersState>>;
  handleColumnFilterFnsChange: Dispatch<
    SetStateAction<MRT_ColumnFilterFnsState>
  >;
  handleGlobalFilterChange: Dispatch<SetStateAction<string>>;
  handleSortingChange: Dispatch<SetStateAction<MRT_SortingState>>;
  handlePaginationChange: Dispatch<SetStateAction<MRT_PaginationState>>;
  handleGroupingChange: Dispatch<SetStateAction<MRT_GroupingState>>;
};

type ParamStateReturnType = [ListQueryParams, ListQueryParamsHandlers];

export function useListQueryParamState(): ParamStateReturnType {
  const [params, setParams] = useState<ListQueryParams>({
    columnFilters: [],
    columnFilterFns: {},
    globalFilter: '',
    sorting: [],
    pagination: { pageIndex: 0, pageSize: 100 },
    grouping: [],
  });

  const handleColumnFiltersChange: Dispatch<
    SetStateAction<MRT_ColumnFiltersState>
  > = useCallback(
    (action) =>
      setParams((p) => ({
        ...p,
        columnFilters:
          typeof action === 'function' ? action(p.columnFilters!) : action,
      })),
    []
  );

  const handleColumnFilterFnsChange: Dispatch<
    SetStateAction<MRT_ColumnFilterFnsState>
  > = useCallback(
    (action) =>
      setParams((p) => ({
        ...p,
        columnFilterFns:
          typeof action === 'function' ? action(p.columnFilterFns!) : action,
      })),
    []
  );

  const handleGlobalFilterChange: Dispatch<SetStateAction<string>> =
    useCallback(
      (action) =>
        setParams((p) => ({
          ...p,
          globalFilter:
            typeof action === 'function' ? action(p.globalFilter!) : action,
        })),
      []
    );

  const handleSortingChange: Dispatch<SetStateAction<MRT_SortingState>> =
    useCallback(
      (action) =>
        setParams((p) => ({
          ...p,
          sorting: typeof action === 'function' ? action(p.sorting!) : action,
        })),
      []
    );

  const handlePaginationChange: Dispatch<SetStateAction<MRT_PaginationState>> =
    useCallback(
      (action) =>
        setParams((p) => ({
          ...p,
          pagination:
            typeof action === 'function' ? action(p.pagination!) : action,
        })),
      []
    );

  const handleGroupingChange: Dispatch<SetStateAction<MRT_GroupingState>> =
    useCallback(
      (action) =>
        setParams((p) => ({
          ...p,
          grouping: typeof action === 'function' ? action(p.grouping!) : action,
        })),
      []
    );

  return [
    params,
    {
      handleColumnFiltersChange,
      handleColumnFilterFnsChange,
      handleGlobalFilterChange,
      handleSortingChange,
      handlePaginationChange,
      handleGroupingChange,
    },
  ] as const;
}
