import { useCallback, useState } from 'react';
import { Table } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  GroupedItem,
  ListItemsDataResponse,
  ListQueryParams,
  ListQueryResult,
} from '../types/query.types';
import {
  applyFilters,
  applyPagination,
  groupItems,
  sortItems,
} from '../utils/queryUtils';

/**
 * Generic hook for any Table<T, number> list query.
 * Applies filters, pagination in IndexedDB, then sorts & groups in memory.
 */
export function useListQuery<T extends { tags: string[] }>(
  table: Table<T, number>,
  params?: ListQueryParams<T>
): ListQueryResult<T> {
  const {
    filters = [],
    sort = [],
    pagination = { pageIndex: 1, pageSize: Infinity },
    groupBy = [],
  } = params || {};

  // A simple counter to force re-run
  const [trigger, setTrigger] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const data = useLiveQuery(async (): Promise<
    ListItemsDataResponse<T> | Error
  > => {
    setIsFetching(true);

    try {
      let chain = applyFilters(table.toCollection(), filters);

      const total = await chain.count();

      chain = applyPagination(chain, pagination);

      let raw = await chain.toArray();

      if (sort.length) {
        raw = sortItems(raw, sort);
      }

      const items: GroupedItem<T>[] =
        groupBy.length > 0
          ? groupItems(raw, groupBy)
          : (raw as GroupedItem<T>[]);

      const result: ListItemsDataResponse<T> = {
        items,
        total,
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
      };

      await new Promise((resolve) => setTimeout(resolve, 500));

      return result;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`error retrieving ${table.name}`, err);
      return new Error(`Error retrieving ${table.name}: ${String(err)}`);
    } finally {
      setIsFetching(false);
    }
  }, [
    table,
    JSON.stringify(filters),
    JSON.stringify(sort),
    JSON.stringify(pagination),
    JSON.stringify(groupBy),
    trigger,
  ]);

  const refetch = useCallback(() => {
    setTrigger((v) => v + 1);
  }, []);

  const isError = data instanceof Error;

  return isError
    ? {
        data: undefined,
        status: 'error',
        isFetching,
        error: data,
        refetch,
      }
    : {
        data,
        status: data ? 'success' : 'pending',
        isFetching,
        error: null,
        refetch,
      };
}
