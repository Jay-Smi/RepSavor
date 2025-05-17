import { Collection } from 'dexie';
import {
  FilterParams,
  GroupedList,
  GroupParams,
  PaginationParams,
  SortByField,
  SortByTag,
  SortParams,
} from '../types/query.types';

/**
 * Apply filters on a Dexie Collection<T, number>.
 * Supports array‐valued fields by treating 'equals' as includes()
 * and 'contains' as any-element contains substring.
 */
export function applyFilters<T>(
  coll: Collection<T, number>,
  filters: FilterParams<T, keyof T>[]
): Collection<T, number> {
  let chain: Collection<T, number> = coll;
  for (const { field, operator, value } of filters) {
    chain = chain.filter((item: T) => {
      const fieldValue = item[field];

      // ARRAY‐BASED FIELDS
      if (Array.isArray(fieldValue)) {
        switch (operator) {
          case 'equals':
            return fieldValue.includes(value as any);
          case 'contains':
            return (fieldValue as unknown as string[]).some(
              (el) =>
                typeof el === 'string' &&
                el.includes(value as unknown as string)
            );
          default:
            // gt/lt etc. not supported on arrays
            return false;
        }
      }

      // NON‐ARRAY FIELDS
      switch (operator) {
        case 'equals':
          if (typeof fieldValue === 'string' && typeof value === 'string') {
            return fieldValue.toLowerCase() === value.toLowerCase();
          }
          return fieldValue === value;
        case 'contains':
          return (
            typeof fieldValue === 'string' &&
            (fieldValue as string).includes(value as unknown as string)
          );
        case 'gt':
          return (fieldValue as any) > (value as any);
        case 'lt':
          return (fieldValue as any) < (value as any);
        case 'gte':
          return (fieldValue as any) >= (value as any);
        case 'lte':
          return (fieldValue as any) <= (value as any);
        default:
          return false;
      }
    }) as Collection<T, number>;
  }
  return chain;
}

/**
 * Apply pagination on a Dexie Collection<T, number>.
 * Clamps page numbers below 1 to page 1.
 */
export function applyPagination<T>(
  chain: Collection<T, number>,
  { page, pageSize }: PaginationParams
): Collection<T, number> {
  const effectivePage = page < 1 ? 1 : page;
  const offset = (effectivePage - 1) * pageSize;

  if (!Number.isFinite(pageSize)) {
    return chain;
  }
  return chain.offset(offset).limit(pageSize);
}

/**
 * Recursively group items by specified fields or tags.
 */
export function groupItems<T>(
  items: T[],
  fields: GroupParams<T>[]
): GroupedList<T> {
  if (fields.length === 0) {
    return {};
  }

  const [first, ...rest] = fields;

  const buckets: Record<string, T[]> = {};

  if (first.type === 'field') {
    const keyField = first.value;
    for (const item of items) {
      const key = String(item[keyField]);
      if (!buckets[key]) {
        buckets[key] = [];
      }
      buckets[key].push(item); // buckets[key] is T[] so .push() works
    }
  } else {
    // first.type === 'tag'
    const tag = first.value;
    // those that have the tag
    buckets[String(tag)] = items.filter(
      (item: any) => Array.isArray(item.tags) && item.tags.includes(tag)
    );
    // those that do not
    const restItems = items.filter(
      (item: any) => !Array.isArray(item.tags) || !item.tags.includes(tag)
    );
    if (restItems.length) {
      buckets[`no-${tag}`] = restItems;
    }
  }

  // If we need to group by more fields, we know each buckets[key] is currently T[]
  if (rest.length > 0) {
    const nested: GroupedList<T> = {};
    for (const key in buckets) {
      // recurse on that T[] and assign back into nested
      nested[key] = groupItems(buckets[key], rest);
    }
    return nested;
  }

  return buckets as GroupedList<T>;
}

/**
 * Sort an array of items by multiple fields in-memory.
 * If a field value is an array, JSON-stringify both sides for lexicographic compare.
 */
export function sortItems<T>(items: T[], sortParams: SortParams<T>[]): T[] {
  return [...items].sort((a, b) => {
    for (const spec of sortParams) {
      if (spec.type === 'field') {
        const { field, direction } = spec as SortByField<T, keyof T>;
        const aVal = a[field],
          bVal = b[field];
        if (aVal! < bVal!) {
          return direction === 'asc' ? -1 : 1;
        }
        if (aVal! > bVal!) {
          return direction === 'asc' ? 1 : -1;
        }
      } else {
        // spec.type === 'tag'
        const { value: tag, direction } = spec as SortByTag<T>;
        const aHas =
          Array.isArray((a as any).tags) && (a as any).tags.includes(tag);
        const bHas =
          Array.isArray((b as any).tags) && (b as any).tags.includes(tag);
        if (aHas !== bHas) {
          // truthy sorts “after” in asc, or “before” in desc
          return direction === 'asc' ? (aHas ? 1 : -1) : aHas ? -1 : 1;
        }
      }
      // if equal on this spec, continue to next
    }
    return 0;
  });
}
