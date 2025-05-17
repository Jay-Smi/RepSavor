import { describe, expect, it } from 'vitest';
import type { FilterParams, GroupParams } from '../../types/query.types';
import {
  applyFilters,
  applyPagination,
  groupItems,
  sortItems,
} from '../queryUtils';

/**
 * Minimal fake of Dexie’s Collection<T, number> for testing.
 */
class FakeCollection<T> {
  constructor(public items: T[]) {}

  filter(fn: (item: T) => boolean): FakeCollection<T> {
    return new FakeCollection(this.items.filter(fn));
  }
  offset(n: number): FakeCollection<T> {
    return new FakeCollection(this.items.slice(n));
  }
  limit(m: number): FakeCollection<T> {
    return new FakeCollection(this.items.slice(0, m));
  }
  async toArray(): Promise<T[]> {
    return this.items;
  }
  async count(): Promise<number> {
    return this.items.length;
  }
}

type Item = {
  id: number;
  name: string;
  tags: string[];
  value: number;
};

describe('applyFilters', () => {
  const data: Item[] = [
    { id: 1, name: 'Alice', tags: ['x', 'y'], value: 10 },
    { id: 2, name: 'alice', tags: ['y', 'z'], value: 20 },
    { id: 3, name: 'Bob', tags: ['x'], value: 5 },
    { id: 4, name: 'Carol', tags: [], value: 15 },
  ];
  const coll = new FakeCollection(data) as unknown as any;

  it('no filters returns everything', async () => {
    expect(await applyFilters(coll, []).toArray()).toEqual(data);
  });

  it('field missing on item', async () => {
    type X = { a: number };
    const collX = new FakeCollection<X>([{ a: 1 }, { a: 2 }]) as any;
    const filters: FilterParams<X, keyof X>[] = [
      // @ts-expect-error testing runtime behaviour
      { field: 'b', operator: 'equals', value: 1 },
    ];
    expect(await applyFilters(collX, filters).toArray()).toEqual([]);
  });

  it('boolean field', async () => {
    type B = { flag?: boolean | null };
    const bc = new FakeCollection<B>([
      { flag: true },
      { flag: false },
      { flag: null },
      {},
    ]) as any;
    expect(
      await applyFilters(bc, [
        { field: 'flag', operator: 'equals', value: false },
      ]).toArray()
    ).toEqual([{ flag: false }]);
  });

  it('contains on non-string returns none', async () => {
    type N = { num: number };
    const nc = new FakeCollection<N>([{ num: 123 }]) as any;
    const result = await applyFilters(nc, [
      { field: 'num', operator: 'contains', value: 2 as any },
    ]).toArray();
    expect(result).toEqual([]);
  });

  it('equals on primitive', async () => {
    const filters: FilterParams<Item, keyof Item>[] = [
      { field: 'value', operator: 'equals', value: 15 },
    ];
    const result = await applyFilters(coll, filters).toArray();
    expect(result.map((i) => i.id)).toEqual([4]);
  });

  it('equals on string (case-insensitive)', async () => {
    const filters: FilterParams<Item, keyof Item>[] = [
      { field: 'name', operator: 'equals', value: 'ALICE' },
    ];
    const result = await applyFilters(coll, filters).toArray();
    expect(result.map((i) => i.id).sort()).toEqual([1, 2]);
  });

  it('contains on string', async () => {
    const filters: FilterParams<Item, keyof Item>[] = [
      { field: 'name', operator: 'contains', value: 'ar' },
    ];
    const result = await applyFilters(coll, filters).toArray();
    expect(result.map((i) => i.id)).toEqual([4]);
  });

  it('gt, lt, gte, lte on numeric', async () => {
    const f1: FilterParams<Item, keyof Item>[] = [
      { field: 'value', operator: 'gt', value: 10 },
    ];
    expect((await applyFilters(coll, f1).toArray()).map((i) => i.id)).toEqual([
      2, 4,
    ]);

    const f2: FilterParams<Item, keyof Item>[] = [
      { field: 'value', operator: 'lt', value: 10 },
    ];
    expect((await applyFilters(coll, f2).toArray()).map((i) => i.id)).toEqual([
      3,
    ]);

    const f3: FilterParams<Item, keyof Item>[] = [
      { field: 'value', operator: 'gte', value: 10 },
    ];
    expect(
      (await applyFilters(coll, f3).toArray()).map((i) => i.id).sort()
    ).toEqual([1, 2, 4]);

    const f4: FilterParams<Item, keyof Item>[] = [
      { field: 'value', operator: 'lte', value: 10 },
    ];
    expect(
      (await applyFilters(coll, f4).toArray()).map((i) => i.id).sort()
    ).toEqual([1, 3]);
  });

  it('equals on array field', async () => {
    const filters: FilterParams<Item, keyof Item>[] = [
      { field: 'tags', operator: 'equals', value: 'z' },
    ];
    const result = await applyFilters(coll, filters).toArray();
    expect(result.map((i) => i.id)).toEqual([2]);
  });

  it('contains on array field', async () => {
    const filters: FilterParams<Item, keyof Item>[] = [
      { field: 'tags', operator: 'contains', value: 'x' },
    ];
    const result = await applyFilters(coll, filters).toArray();
    expect(result.map((i) => i.id).sort()).toEqual([1, 3]);
  });

  it('unsupported operator on array returns none', async () => {
    const filters: FilterParams<Item, keyof Item>[] = [
      { field: 'tags', operator: 'gt', value: 'anything' },
    ];
    const result = await applyFilters(coll, filters).toArray();
    expect(result).toEqual([]);
  });

  it('multiple filters AND together', async () => {
    const filters: FilterParams<Item, keyof Item>[] = [
      { field: 'tags', operator: 'equals', value: 'x' },
      { field: 'value', operator: 'gt', value: 8 },
    ];
    const result = await applyFilters(coll, filters).toArray();
    expect(result.map((i) => i.id)).toEqual([1]);
  });
});

describe('applyPagination', () => {
  const data = new FakeCollection([...Array(10).keys()]) as unknown as any;

  it('first page', async () => {
    const paged = applyPagination(data, { page: 1, pageSize: 3 });
    expect(await paged.toArray()).toEqual([0, 1, 2]);
  });

  it('second page', async () => {
    const paged = applyPagination(data, { page: 2, pageSize: 3 });
    expect(await paged.toArray()).toEqual([3, 4, 5]);
  });

  it('overflow page returns empty', async () => {
    const paged = applyPagination(data, { page: 5, pageSize: 3 });
    expect(await paged.toArray()).toEqual([]);
  });

  it('page 0 behaves as page 1 (or empty)', async () => {
    expect(
      await applyPagination(data, { page: 0, pageSize: 3 }).toArray()
    ).toEqual([0, 1, 2]);
  });

  it('pageSize 0 always empty', async () => {
    expect(
      await applyPagination(data, { page: 1, pageSize: 0 }).toArray()
    ).toEqual([]);
  });

  it('pageSize Infinity returns all', async () => {
    const paged = applyPagination(data, { page: 1, pageSize: Infinity });
    expect(await paged.toArray()).toEqual([...Array(10).keys()]);
  });
});

describe('groupItems (discriminated union API)', () => {
  const items: Item[] = [
    { id: 1, name: 'Alice', tags: ['x', 'y'], value: 10 },
    { id: 2, name: 'Bob', tags: ['y'], value: 20 },
    { id: 3, name: 'Alice', tags: ['x'], value: 5 },
  ];

  it('groups by a field', () => {
    const params: GroupParams<Item>[] = [{ type: 'field', value: 'name' }];
    const result = groupItems(items, params);
    expect(Object.keys(result).sort()).toEqual(['Alice', 'Bob']);
    expect((result.Alice as Item[]).map((i) => i.id).sort()).toEqual([1, 3]);
  });

  it('groups by a tag', () => {
    const params: GroupParams<Item>[] = [{ type: 'tag', value: 'x' }];
    const result = groupItems(items, params);
    expect((result.x as Item[]).map((i) => i.id).sort()).toEqual([1, 3]);
    expect((result['no-x'] as Item[]).map((i) => i.id)).toEqual([2]);
  });

  it('nested grouping: tag then field', () => {
    const params: GroupParams<Item>[] = [
      { type: 'tag', value: 'x' },
      { type: 'field', value: 'name' },
    ];
    const nested = groupItems(items, params);
    expect(Object.keys(nested).sort()).toEqual(['no-x', 'x']);
    const xGroup = nested.x as Record<string, Item[]>;
    expect(Object.keys(xGroup)).toEqual(['Alice']);
    expect(xGroup.Alice.map((i) => i.id).sort()).toEqual([1, 3]);
  });
});

describe('groupItems', () => {
  const items: Item[] = [
    { id: 1, name: 'Alice', tags: ['x', 'y'], value: 10 },
    { id: 2, name: 'Bob', tags: ['y'], value: 20 },
    { id: 3, name: 'Alice', tags: ['x'], value: 5 },
  ];

  it('group by field', () => {
    const params: GroupParams<Item>[] = [{ type: 'field', value: 'name' }];
    const grouped = groupItems(items, params);
    expect(Object.keys(grouped).sort()).toEqual(['Alice', 'Bob']);
    expect((grouped.Alice as Item[]).map((i) => i.id).sort()).toEqual([1, 3]);
  });

  it('group by tag', () => {
    const params: GroupParams<Item>[] = [{ type: 'tag', value: 'x' }];
    const grouped = groupItems(items, params);
    // bucket "x" contains those with tag 'x'
    expect((grouped.x as Item[]).map((i) => i.id).sort()).toEqual([1, 3]);
    // bucket "no-x" contains those without 'x'
    expect((grouped['no-x'] as Item[]).map((i) => i.id)).toEqual([2]);
  });

  it('nested group: tag then field', () => {
    const params: GroupParams<Item>[] = [
      { type: 'tag', value: 'x' },
      { type: 'field', value: 'name' },
    ];
    const nested = groupItems(items, params);
    // first-level keys: 'x' and 'no-x'
    expect(Object.keys(nested).sort()).toEqual(['no-x', 'x']);
    // within 'x', group by name:
    const xGroup = nested.x as Record<string, Item[]>;
    expect(Object.keys(xGroup).sort()).toEqual(['Alice']);
    expect(xGroup.Alice.map((i) => i.id).sort()).toEqual([1, 3]);
  });
});

describe('full pipeline: filter + paginate + sort + group', () => {
  // reuse existing Item type and FakeCollection
  const data: Item[] = [
    { id: 1, name: 'Alice', tags: ['x', 'y'], value: 10 },
    { id: 2, name: 'alice', tags: ['y', 'z'], value: 20 },
    { id: 3, name: 'Bob', tags: ['x'], value: 5 },
    { id: 4, name: 'Carol', tags: [], value: 15 },
  ];
  const coll = new FakeCollection<Item>(data) as unknown as any;

  it('filters tags contains "x", paginates page=1 size=1, sorts by value asc, groups by name', async () => {
    // 1) Filter items whose tags contain "x" → ids [1,3]
    const filters: FilterParams<Item, keyof Item>[] = [
      { field: 'tags', operator: 'contains', value: 'x' },
    ];
    const filtered = applyFilters(coll, filters);
    const filteredIds = (await filtered.toArray()).map((i) => i.id).sort();
    expect(filteredIds).toEqual([1, 3]);

    // 2) Paginate: page 1, pageSize 1 → first of [1,3] → id 1
    const paged = applyPagination(filtered, { page: 1, pageSize: 1 });
    const pageItems = await paged.toArray();
    expect(pageItems.map((i) => i.id)).toEqual([1]);

    // 3) Sort by value ascending
    const sorted = sortItems(pageItems, [
      { type: 'field', field: 'value', direction: 'asc' },
    ]);
    expect(sorted.map((i) => i.value)).toEqual([10]);

    // 4) Group by name
    const grouped = groupItems(sorted, [{ type: 'field', value: 'name' }]);
    expect(Object.keys(grouped)).toEqual(['Alice']);
    expect((grouped.Alice as Item[])[0].id).toBe(1);
  });
});
