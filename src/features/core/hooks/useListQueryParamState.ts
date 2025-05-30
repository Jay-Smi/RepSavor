import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import {
  MRT_ColumnFilterFnsState,
  MRT_ColumnFiltersState,
  MRT_GroupingState,
  MRT_PaginationState,
  MRT_SortingState,
} from 'mantine-react-table';
import { ListQueryParams } from '../types/query.types';

export type ListQueryParamsSetStateActions = {
  setColumnFilters: Dispatch<SetStateAction<MRT_ColumnFiltersState>>;
  setColumnFilterFns: Dispatch<SetStateAction<MRT_ColumnFilterFnsState>>;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  setSorting: Dispatch<SetStateAction<MRT_SortingState>>;
  setPagination: Dispatch<SetStateAction<MRT_PaginationState>>;
  setGrouping: Dispatch<SetStateAction<MRT_GroupingState>>;
};

type ParamStateReturnType = [ListQueryParams, ListQueryParamsSetStateActions];

export function useListQueryParamState(): ParamStateReturnType {
  const [params, setParams] = useState<ListQueryParams>({
    columnFilters: [],
    columnFilterFns: {},
    globalFilter: '',
    sorting: [],
    pagination: { pageIndex: 0, pageSize: 100 },
    grouping: [],
  });

  const setColumnFilters: Dispatch<SetStateAction<MRT_ColumnFiltersState>> =
    useCallback(
      (action) =>
        setParams((p) => ({
          ...p,
          columnFilters:
            typeof action === 'function' ? action(p.columnFilters!) : action,
        })),
      []
    );

  const setColumnFilterFns: Dispatch<SetStateAction<MRT_ColumnFilterFnsState>> =
    useCallback(
      (action) =>
        setParams((p) => ({
          ...p,
          columnFilterFns:
            typeof action === 'function' ? action(p.columnFilterFns!) : action,
        })),
      []
    );

  const setGlobalFilter: Dispatch<SetStateAction<string>> = useCallback(
    (action) =>
      setParams((p) => ({
        ...p,
        globalFilter:
          typeof action === 'function' ? action(p.globalFilter!) : action,
      })),
    []
  );

  const setSorting: Dispatch<SetStateAction<MRT_SortingState>> = useCallback(
    (action) =>
      setParams((p) => ({
        ...p,
        sorting: typeof action === 'function' ? action(p.sorting!) : action,
      })),
    []
  );

  const setPagination: Dispatch<SetStateAction<MRT_PaginationState>> =
    useCallback(
      (action) =>
        setParams((p) => ({
          ...p,
          pagination:
            typeof action === 'function' ? action(p.pagination!) : action,
        })),
      []
    );

  const setGrouping: Dispatch<SetStateAction<MRT_GroupingState>> = useCallback(
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
      setColumnFilters,
      setColumnFilterFns,
      setGlobalFilter,
      setSorting,
      setPagination,
      setGrouping,
    },
  ] as const;
}
