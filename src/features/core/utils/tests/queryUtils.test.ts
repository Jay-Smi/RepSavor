import {
  MRT_ColumnFilterFnsState,
  MRT_ColumnFiltersState,
  MRT_GroupingState,
  MRT_SortingState,
} from 'mantine-react-table';
import { describe, expect, it } from 'vitest';
import {
  applyColumnFilters,
  applyGlobalFilter,
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
describe('applyGlobalFilter', () => {
  const data = [
    { name: 'Alice', tags: ['foo', 'bar'], age: 30 },
    { name: 'Bob', tags: ['baz'], age: 42 },
    { name: 'Carol', tags: [], age: 100 },
  ];

  it('returns original collection when filter string is empty', async () => {
    const coll = new FakeCollection(data) as any;
    const result = applyGlobalFilter(coll, '');
    expect(await result.toArray()).toEqual(data);
  });

  it('filters by substring in string properties (case‑insensitive)', async () => {
    const coll = new FakeCollection(data) as any;
    const result = applyGlobalFilter(coll, 'ali');
    expect(await result.toArray()).toEqual([
      { name: 'Alice', tags: ['foo', 'bar'], age: 30 },
    ]);
  });

  it('filters by substring in array properties', async () => {
    const coll = new FakeCollection(data) as any;
    const result = applyGlobalFilter(coll, 'BAZ');
    expect(await result.toArray()).toEqual([
      { name: 'Bob', tags: ['baz'], age: 42 },
    ]);
  });

  it('filters by substring in numeric properties', async () => {
    const coll = new FakeCollection(data) as any;
    // ages: "30", "42", "100" → filter "00" should match Carol
    const result = applyGlobalFilter(coll, '00');
    expect(await result.toArray()).toEqual([
      { name: 'Carol', tags: [], age: 100 },
    ]);
  });

  it('uses custom globalFilterFn when provided', async () => {
    const coll = new FakeCollection(data) as any;
    // only allow even ages
    const fn = (item: (typeof data)[0], _: string) => item.age % 2 === 0;
    const result = applyGlobalFilter(coll, 'whatever', fn);
    expect(await result.toArray()).toEqual([
      { name: 'Alice', tags: ['foo', 'bar'], age: 30 },
      { name: 'Bob', tags: ['baz'], age: 42 },
      { name: 'Carol', tags: [], age: 100 },
    ]);
  });
});

// -- applyColumnFilters ------------------------------------------
describe('applyColumnFilters', () => {
  type Item = { name: string; age: number };
  const data: Item[] = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 42 },
    { name: 'Carol', age: 30 },
  ];

  function coll(
    filters: MRT_ColumnFiltersState = [],
    fns: MRT_ColumnFilterFnsState = {}
  ) {
    return applyColumnFilters(new FakeCollection(data) as any, filters, fns);
  }

  it('defaults to "contains" for string fields', async () => {
    const filtered = coll([{ id: 'name', value: 'ar' }]);
    expect(await filtered.toArray()).toEqual([{ name: 'Carol', age: 30 }]);
  });

  it('equals operator', async () => {
    const filtered = coll([{ id: 'age', value: 30 }], { age: 'equals' });
    expect(await filtered.toArray()).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Carol', age: 30 },
    ]);
  });

  it('greaterThan / lessThan operators', async () => {
    let filtered = coll([{ id: 'age', value: 30 }], { age: 'greaterThan' });
    expect(await filtered.toArray()).toEqual([{ name: 'Bob', age: 42 }]);

    filtered = coll([{ id: 'age', value: 42 }], { age: 'lessThan' });
    expect(await filtered.toArray()).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Carol', age: 30 },
    ]);
  });

  it('greaterThanOrEqualTo / lessThanOrEqualTo operators', async () => {
    let filtered = coll([{ id: 'age', value: 30 }], {
      age: 'greaterThanOrEqualTo',
    });
    expect(await filtered.toArray()).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 42 },
      { name: 'Carol', age: 30 },
    ]);

    filtered = coll([{ id: 'age', value: 42 }], { age: 'lessThanOrEqualTo' });
    expect(await filtered.toArray()).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 42 },
      { name: 'Carol', age: 30 },
    ]);
  });

  it('chains multiple column filters', async () => {
    // name contains 'o' AND age equals 30
    const filtered = coll(
      [
        { id: 'name', value: 'o' },
        { id: 'age', value: 30 },
      ],
      { age: 'equals', name: 'contains' }
    );
    expect(await filtered.toArray()).toEqual([{ name: 'Carol', age: 30 }]);
  });
});

// -- applyPagination ---------------------------------------------
describe('applyPagination', () => {
  const data = Array.from({ length: 10 }, (_, i) => i);
  const base = new FakeCollection(data) as any;

  it('returns page of correct size', async () => {
    const page = applyPagination(base, { pageIndex: 1, pageSize: 3 });
    // offset = 3, limit = 3 → [3,4,5]
    expect(await page.toArray()).toEqual([3, 4, 5]);
  });

  it('handles negative pageIndex by clamping to 0', async () => {
    const page = applyPagination(base, { pageIndex: -5, pageSize: 2 });
    expect(await page.toArray()).toEqual([0, 1]);
  });

  it('ignores pagination when pageSize is infinite', async () => {
    // Number.isFinite(Infinity) === false
    const page = applyPagination(base, { pageIndex: 2, pageSize: Infinity });
    expect(await page.toArray()).toEqual(data);
  });
});

// -- groupItems ---------------------------------------------------
describe('groupItems', () => {
  type Item = { color?: string; size?: string; tags?: string[] };
  const items: Item[] = [
    { color: 'red', size: 'S', tags: ['a', 'b'] },
    { color: 'blue', size: 'M', tags: ['b'] },
    { color: 'red', size: 'M', tags: ['a'] },
  ];

  it('returns flat list when no grouping fields', () => {
    const grouped = groupItems(items, [] as MRT_GroupingState);
    expect(grouped).toEqual(items);
  });

  it('groups by a single field', () => {
    const grouped = groupItems(items, ['color']);
    // Should produce two buckets: "red" and "blue"
    const redGroup = grouped.find((g) => g.color === 'red');
    const blueGroup = grouped.find((g) => g.color === 'blue');

    expect(redGroup?.subItems!.length).toBe(2);
    expect(blueGroup!.subItems!).toEqual([
      { color: 'blue', size: 'M', tags: ['b'] },
    ]);
  });

  it('supports multi‑level grouping', () => {
    const grouped = groupItems(items, ['color', 'size']);
    // First level: color
    const redGroup = grouped.find((g) => g.color === 'red')!;
    // Second level: size within redGroup
    expect(redGroup.subItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ size: 'S' }),
        expect.objectContaining({ size: 'M' }),
      ])
    );
  });
});

// -- sortItems ----------------------------------------------------
describe('sortItems', () => {
  type Item = { name: string; age: number };
  const data: Item[] = [
    { name: 'Charlie', age: 20 },
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
  ];

  it('sorts ascending by single field', () => {
    const sorted = sortItems(data, [
      { id: 'name', desc: false },
    ] as MRT_SortingState);
    expect(sorted.map((i) => i.name)).toEqual(['Alice', 'Bob', 'Charlie']);
  });

  it('sorts descending by single field', () => {
    const sorted = sortItems(data, [
      { id: 'age', desc: true },
    ] as MRT_SortingState);
    expect(sorted.map((i) => i.age)).toEqual([30, 25, 20]);
  });

  it('applies multi‑level sort', () => {
    // tie on first key → sort by age
    const dupes = [
      { name: 'A', age: 20 },
      { name: 'A', age: 10 },
      { name: 'B', age: 5 },
    ];
    const sorted = sortItems(dupes, [
      { id: 'name', desc: false },
      { id: 'age', desc: false },
    ] as MRT_SortingState);
    expect(sorted.map((i) => [i.name, i.age])).toEqual([
      ['A', 10],
      ['A', 20],
      ['B', 5],
    ]);
  });
});
