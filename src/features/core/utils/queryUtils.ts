import { Collection } from 'dexie';
import {
  MRT_ColumnFilterFnsState,
  MRT_ColumnFiltersState,
  MRT_GroupingState,
  MRT_SortingState,
} from 'mantine-react-table';
import { GroupedItem } from '../types/query.types';

export function applyGlobalFilter<T>(
  coll: Collection<T, number>,
  globalFilter: string,
  globalFilterFn?: (item: T, filter: string) => boolean
): Collection<T, number> {
  if (!globalFilter) {
    return coll;
  }

  return coll.filter((item) => {
    if (globalFilterFn) {
      return globalFilterFn(item, globalFilter);
    }

    return Object.values(item as object).some(
      (value) =>
        (typeof value === 'string' &&
          value.toLowerCase().includes(globalFilter.toLowerCase())) ||
        (Array.isArray(value) &&
          value.some(
            (v) =>
              typeof v === 'string' &&
              v.toLowerCase().includes(globalFilter.toLowerCase())
          )) ||
        (typeof value === 'number' && String(value).includes(globalFilter))
    );
  });
}

/**
 * Apply column filters (with their filter-fn keys) to a Dexie Collection.
 */
export function applyColumnFilters<T>(
  coll: Collection<T, number>,
  columnFilters: MRT_ColumnFiltersState = [],
  columnFilterFns: MRT_ColumnFilterFnsState = {}
): Collection<T, number> {
  let chain = coll;
  for (const { id: field, value } of columnFilters) {
    const operator = columnFilterFns[field] ?? 'contains';
    switch (operator) {
      case 'equals':
        chain = chain.filter((item) => item[field as keyof T] === value);
        break;
      case 'contains':
        chain = chain.filter(
          (item) =>
            typeof item[field as keyof T] === 'string' &&
            String(item[field as keyof T]).includes(String(value))
        );
        break;
      case 'greaterThan':
        chain = chain.filter(
          (item) => (item[field as keyof T] as any) > (value as any)
        );
        break;
      case 'lessThan':
        chain = chain.filter(
          (item) => (item[field as keyof T] as any) < (value as any)
        );
        break;
      case 'greaterThanOrEqualTo':
        chain = chain.filter(
          (item) => (item[field as keyof T] as any) >= (value as any)
        );
        break;
      case 'lessThanOrEqualTo':
        chain = chain.filter(
          (item) => (item[field as keyof T] as any) <= (value as any)
        );
        break;
      // add other custom operators here if needed
    }
  }
  return chain;
}

/**
 * Paginate a Dexie Collection<T, number>.
 * Clamps negative pageIndex to 0.
 */
export function applyPagination<T>(
  chain: Collection<T, number>,
  { pageIndex, pageSize }: { pageIndex: number; pageSize: number }
): Collection<T, number> {
  const effectivePage = Math.max(0, pageIndex);
  const offset = effectivePage * pageSize;

  if (!Number.isFinite(pageSize)) {
    return chain;
  }
  return chain.offset(offset).limit(pageSize);
}

/**
 * Recursively group items by the given list of keys.
 *
 * - If items[*][key] is an Array, each element in that array becomes its own bucket.
 * - Otherwise, we bucket by `String(item[key])`.
 * - Items may appear in multiple buckets if the field is an array.
 */
export function groupItems<T>(
  items: T[],
  fields: MRT_GroupingState
): GroupedItem<T>[] {
  // no grouping requested → just return raw items
  if (fields.length === 0) {
    return items as GroupedItem<T>[];
  }

  const [firstKey, ...restKeys] = fields;

  // stage 1: build buckets: map bucketName → T[]
  const buckets: Record<string, T[]> = {};
  for (const it of items) {
    const val = (it as any)[firstKey];
    if (Array.isArray(val)) {
      // explode array: each element becomes its own bucket
      for (const entry of val) {
        const name = String(entry);
        (buckets[name] ||= []).push(it);
      }
    } else {
      // normal scalar field
      const name = val == null ? 'undefined' : String(val);
      (buckets[name] ||= []).push(it);
    }
  }

  // stage 2: turn each bucket into a GroupRow
  return Object.entries(buckets).map(([bucketName, bucketItems]) => {
    const row: any = {
      [firstKey as string]: bucketName,
      subRows: restKeys.length
        ? groupItems(bucketItems, restKeys)
        : (bucketItems as GroupedItem<T>[]),
    };
    return row as GroupedItem<T>;
  });
}

/**
 * In-memory sort.
 */
export function sortItems<T>(items: T[], sorting: MRT_SortingState): T[] {
  return [...items].sort((a, b) => {
    for (const { id: key, desc } of sorting) {
      const aVal = (a as any)[key];
      const bVal = (b as any)[key];
      if (aVal < bVal) {
        return desc ? 1 : -1;
      }
      if (aVal > bVal) {
        return desc ? -1 : 1;
      }
    }
    return 0;
  });
}
