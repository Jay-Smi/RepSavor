import { useCallback, useState } from 'react';
import { Table, UpdateSpec } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

/** Options for fetching a single item: either by primary key, or by a where‐clause filter. */
export type ItemQueryKey<T> = number | Partial<T>;

export interface ItemQueryResult<T> {
  item: T | undefined;
  /** Force a refetch (re‐run the live query) */
  refresh: () => void;
  /** Update this record. Returns number of updated rows. */
  update: (changes: UpdateSpec<T>) => Promise<number>;
  /** Delete this record (and optionally cascade). */
  delete: () => Promise<void>;
}

/**
 * Generic hook to load a single T from Dexie and give you update/delete helpers.
 */
export function useItemQuery<T extends { id?: number }>(
  table: Table<T, number>,
  key: ItemQueryKey<T>
): ItemQueryResult<T> {
  // We use a simple counter to trigger refresh()
  const [version, setVersion] = useState(0);

  // live query: get by PK or by filter object
  const item = useLiveQuery(async () => {
    if (typeof key === 'number') {
      return table.get(key);
      // eslint-disable-next-line no-else-return
    } else {
      return table.where(key).first();
    }
  }, [version, key]);

  // helpers
  const update = useCallback(
    async (changes: UpdateSpec<T>) => {
      if (typeof key !== 'number') {
        throw new Error('Cannot update: key is not numeric id');
      }
      const count = await table.update(key, changes);

      return count;
    },
    [table, key]
  );

  const deleteItem = useCallback(async () => {
    if (typeof key === 'number') {
      await table.delete(key);
    } else {
      throw new Error('Cannot delete: key is not numeric id');
    }
  }, [table, key]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  return { item, update, delete: deleteItem, refresh };
}
