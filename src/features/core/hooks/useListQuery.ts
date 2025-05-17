import { useCallback, useState } from 'react';
import { Table } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  GroupedListItemsData,
  ListItemsData,
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
    pagination = { page: 1, pageSize: Infinity },
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

      let items = await chain.toArray();

      if (sort.length) {
        items = sortItems(items, sort);
      }

      if (groupBy.length > 0) {
        const groups = groupItems(items, groupBy);
        const result: GroupedListItemsData<T> = {
          type: 'grouped',
          groups,
          total,
          page: pagination.page,
          pageSize: pagination.pageSize,
        };
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return result;
      }

      const result: ListItemsData<T> = {
        type: 'list',
        items,
        total,
        page: pagination.page,
        pageSize: pagination.pageSize,
      };

      await new Promise((resolve) => setTimeout(resolve, 2000));

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
