import { useCallback, useMemo, useState } from 'react';
import { Table } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import { FoodItemBase } from '@/models/food/FoodItemBase';
import {
  ListItemsDataResponse,
  ListQueryParams,
  ListQueryResult,
} from '../types/query.types';
import {
  applyColumnFilters,
  applyGlobalFilter,
  applyPagination,
  sortItems,
} from '../utils/queryUtils';

export function useListQuery<T extends FoodItemBase>(
  table: Table<T, number>,
  params: ListQueryParams = {}
): ListQueryResult<T> {
  const {
    columnFilters = [],
    columnFilterFns = {},
    globalFilter,
    sorting = [],
    pagination = { pageIndex: 0, pageSize: Infinity },
  } = params;

  const [trigger, setTrigger] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const liveData = useLiveQuery<ListItemsDataResponse<T> | Error>(async () => {
    setIsFetching(true);
    try {
      let coll = applyGlobalFilter(table.toCollection(), globalFilter || '');

      coll = applyColumnFilters(coll, columnFilters, columnFilterFns);

      const total = await coll.count();

      coll = applyPagination(coll, pagination);

      let raw = await coll.toArray();

      if (sorting.length) {
        raw = sortItems(raw, sorting);
      }

      await new Promise((r) => setTimeout(r, 300));

      const allTags = new Set<string>();
      raw.forEach((item) => {
        if (item.tags && Array.isArray(item.tags)) {
          item.tags.forEach((tag) => allTags.add(tag));
        }
      });

      return {
        items: raw,
        total,
        allTags: Array.from(allTags),
      };
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.warn(`Error retrieving ${table.name}`, err);
      return new Error(`Error retrieving ${table.name}: ${err.message}`);
    } finally {
      setIsFetching(false);
    }
  }, [
    table,
    globalFilter,
    JSON.stringify(columnFilters),
    JSON.stringify(columnFilterFns),
    JSON.stringify(sorting),
    JSON.stringify(pagination),
    trigger,
  ]);

  const refetch = useCallback(() => {
    setTrigger((t) => t + 1);
  }, []);

  const defaultData = useMemo(
    () => ({
      items: [],
      total: undefined,
      allTags: [],
    }),
    []
  );

  if (liveData instanceof Error) {
    return {
      data: defaultData,
      status: 'error',
      isFetching,
      error: liveData,
      refetch,
    };
  }

  return {
    data: liveData || defaultData,
    status: liveData ? 'success' : 'pending',
    isFetching,
    error: null,
    refetch,
  };
}
