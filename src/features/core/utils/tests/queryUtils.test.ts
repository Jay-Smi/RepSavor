import {
  MRT_ColumnFilterFnsState,
  MRT_ColumnFiltersState,
  MRT_SortingState,
} from 'mantine-react-table';
import { describe, expect, it } from 'vitest';
import {
  applyColumnFilters,
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
  const coll = new FakeCollection(data) as any;

  it('no filters returns everything', async () => {
    const columnFilters: MRT_ColumnFiltersState = [];
    const columnFilterFns: MRT_ColumnFilterFnsState = {};
    expect(
      await applyColumnFilters(coll, columnFilters, columnFilterFns).toArray()
    ).toEqual(data);
  });

  it('field missing on item', async () => {
    type X = { a: number };
    const collX = new FakeCollection<X>([{ a: 1 }, { a: 2 }]) as any;
    const columnFilters: MRT_ColumnFiltersState = [{ id: 'b', value: 1 }];
    const columnFilterFns: MRT_ColumnFilterFnsState = {};
    expect(
      await applyColumnFilters(collX, columnFilters, columnFilterFns).toArray()
    ).toEqual([]);
  });

  it('boolean field', async () => {
    type B = { flag?: boolean | null };
    const bc = new FakeCollection<B>([
      { flag: true },
      { flag: false },
      { flag: null },
      {},
    ]) as any;
    const columnFilters: MRT_ColumnFiltersState = [
      { id: 'flag', value: false },
    ];
    const columnFilterFns: MRT_ColumnFilterFnsState = {};
    expect(
      await applyColumnFilters(bc, columnFilters, columnFilterFns).toArray()
    ).toEqual([{ flag: false }]);
  });

  it('contains on non-string returns none', async () => {
    type N = { num: number };
    const nc = new FakeCollection<N>([{ num: 123 }]) as any;
    const columnFilters: MRT_ColumnFiltersState = [
      { id: 'num', value: 2 as any },
    ];
    const columnFilterFns: MRT_ColumnFilterFnsState = { num: 'contains' };
    expect(
      await applyColumnFilters(nc, columnFilters, columnFilterFns).toArray()
    ).toEqual([]);
  });

  it('equals on primitive', async () => {
    const columnFilters: MRT_ColumnFiltersState = [{ id: 'value', value: 15 }];
    const columnFilterFns: MRT_ColumnFilterFnsState = {};
    const result = await applyColumnFilters(
      coll,
      columnFilters,
      columnFilterFns
    ).toArray();
    expect(result.map((i) => (i as any).id)).toEqual([4]);
  });

  it('equals on string (case-sensitive)', async () => {
    const columnFilters: MRT_ColumnFiltersState = [
      { id: 'name', value: 'Alice' },
    ];
    const columnFilterFns: MRT_ColumnFilterFnsState = {};
    const result = await applyColumnFilters(
      coll,
      columnFilters,
      columnFilterFns
    ).toArray();
    expect(result.map((i) => (i as any).id)).toEqual([1]);
  });

  it('contains on string', async () => {
    const columnFilters: MRT_ColumnFiltersState = [{ id: 'name', value: 'ar' }];
    const columnFilterFns: MRT_ColumnFilterFnsState = { name: 'contains' };
    const result = await applyColumnFilters(
      coll,
      columnFilters,
      columnFilterFns
    ).toArray();
    expect(result.map((i) => (i as any).id)).toEqual([4]);
  });

  it('gt, lt, gte, lte on numeric', async () => {
    const f1Filters: MRT_ColumnFiltersState = [{ id: 'value', value: 10 }];
    const f1Fns: MRT_ColumnFilterFnsState = { value: 'gt' };
    expect(
      (await applyColumnFilters(coll, f1Filters, f1Fns).toArray()).map(
        (i) => (i as any).id
      )
    ).toEqual([2, 4]);

    const f2Filters: MRT_ColumnFiltersState = [{ id: 'value', value: 10 }];
    const f2Fns: MRT_ColumnFilterFnsState = { value: 'lt' };
    expect(
      (await applyColumnFilters(coll, f2Filters, f2Fns).toArray()).map(
        (i) => (i as any).id
      )
    ).toEqual([3]);

    const f3Filters: MRT_ColumnFiltersState = [{ id: 'value', value: 10 }];
    const f3Fns: MRT_ColumnFilterFnsState = { value: 'gte' };
    expect(
      (await applyColumnFilters(coll, f3Filters, f3Fns).toArray())
        .map((i) => (i as any).id)
        .sort()
    ).toEqual([1, 2, 4]);

    const f4Filters: MRT_ColumnFiltersState = [{ id: 'value', value: 10 }];
    const f4Fns: MRT_ColumnFilterFnsState = { value: 'lte' };
    expect(
      (await applyColumnFilters(coll, f4Filters, f4Fns).toArray())
        .map((i) => (i as any).id)
        .sort()
    ).toEqual([1, 3]);
  });

  it('equals on array field', async () => {
    const columnFilters: MRT_ColumnFiltersState = [{ id: 'tags', value: 'z' }];
    const columnFilterFns: MRT_ColumnFilterFnsState = { tags: 'equals' };
    const result = await applyColumnFilters(
      coll,
      columnFilters,
      columnFilterFns
    ).toArray();
    expect(result.map((i) => (i as any).id)).toEqual([2]);
  });

  it('contains on array field', async () => {
    const columnFilters: MRT_ColumnFiltersState = [{ id: 'tags', value: 'x' }];
    const columnFilterFns: MRT_ColumnFilterFnsState = { tags: 'contains' };
    const result = await applyColumnFilters(
      coll,
      columnFilters,
      columnFilterFns
    ).toArray();
    expect(result.map((i) => (i as any).id).sort()).toEqual([1, 3]);
  });

  it('unsupported operator on array returns none', async () => {
    const columnFilters: MRT_ColumnFiltersState = [
      { id: 'tags', value: 'anything' },
    ];
    const columnFilterFns: MRT_ColumnFilterFnsState = { tags: 'gt' };
    const result = await applyColumnFilters(
      coll,
      columnFilters,
      columnFilterFns
    ).toArray();
    expect(result).toEqual([]);
  });

  it('multiple filters AND together', async () => {
    const columnFilters: MRT_ColumnFiltersState = [
      { id: 'tags', value: 'x' },
      { id: 'value', value: 8 },
    ];
    const columnFilterFns: MRT_ColumnFilterFnsState = {
      tags: 'equals',
      value: 'gt',
    };
    const result = await applyColumnFilters(
      coll,
      columnFilters,
      columnFilterFns
    ).toArray();
    expect(result.map((i) => (i as any).id)).toEqual([1]);
  });
});

describe('applyPagination', () => {
  const data = new FakeCollection([...Array(10).keys()]) as any;

  it('first page', async () => {
    const paged = applyPagination(data, { pageIndex: 0, pageSize: 3 });
    expect(await paged.toArray()).toEqual([0, 1, 2]);
  });

  it('second page', async () => {
    const paged = applyPagination(data, { pageIndex: 1, pageSize: 3 });
    expect(await paged.toArray()).toEqual([3, 4, 5]);
  });

  it('overflow page returns empty', async () => {
    const paged = applyPagination(data, { pageIndex: 4, pageSize: 3 });
    expect(await paged.toArray()).toEqual([]);
  });

  it('pageSize 0 always empty', async () => {
    const paged = applyPagination(data, { pageIndex: 0, pageSize: 0 });
    expect(await paged.toArray()).toEqual([]);
  });

  it('pageSize Infinity returns all', async () => {
    const paged = applyPagination(data, { pageIndex: 0, pageSize: Infinity });
    expect(await paged.toArray()).toEqual([...Array(10).keys()]);
  });
});

describe('groupItems', () => {
  const items: Item[] = [
    { id: 1, name: 'Alice', tags: ['x', 'y'], value: 10 },
    { id: 2, name: 'Bob', tags: ['y'], value: 20 },
    { id: 3, name: 'Alice', tags: ['x'], value: 5 },
  ];

  it('groups by a scalar field', () => {
    const grouped = groupItems(items, ['name']);
    const keys = grouped.map((r) => (r as any).name).sort();
    expect(keys).toEqual(['Alice', 'Bob']);

    const alice = grouped.find((r) => (r as any).name === 'Alice')!;
    const ids = ((alice as any).subRows as Item[]).map((i) => i.id).sort();
    expect(ids).toEqual([1, 3]);
  });

  it('groups by an array field (tags)', () => {
    const grouped = groupItems(items, ['tags']);
    const tagKeys = grouped.map((r) => (r as any).tags).sort();
    expect(tagKeys).toEqual(['x', 'y']);

    const xGroup = grouped.find((r) => (r as any).tags === 'x')!;
    expect(((xGroup as any).subRows as Item[]).map((i) => i.id).sort()).toEqual(
      [1, 3]
    );

    const yGroup = grouped.find((r) => (r as any).tags === 'y')!;
    expect(((yGroup as any).subRows as Item[]).map((i) => i.id).sort()).toEqual(
      [1, 2]
    );
  });

  it('nested grouping: first by tags, then by name', () => {
    const nested = groupItems(items, ['tags', 'name']);
    const topKeys = nested.map((r) => (r as any).tags).sort();
    expect(topKeys).toEqual(['x', 'y']);

    const xBucket = nested.find((r) => (r as any).tags === 'x')!;
    const subGroupKeys = ((xBucket as any).subRows as any[]).map((r) => r.name);
    expect(subGroupKeys).toEqual(['Alice']);

    const aliceSub = (xBucket as any).subRows.find(
      (r: any) => (r as any).name === 'Alice'
    )!;
    expect((aliceSub.subRows as Item[]).map((i) => i.id).sort()).toEqual([
      1, 3,
    ]);
  });
});

describe('full pipeline: filter + paginate + sort + group', () => {
  const data: Item[] = [
    { id: 1, name: 'Alice', tags: ['x', 'y'], value: 10 },
    { id: 2, name: 'alice', tags: ['y', 'z'], value: 20 },
    { id: 3, name: 'Bob', tags: ['x'], value: 5 },
    { id: 4, name: 'Carol', tags: [], value: 15 },
  ];
  const coll = new FakeCollection<Item>(data) as any;

  it('filters tags equals "x", paginates, sorts, then groups by name', async () => {
    // 1) Filter
    const columnFilters: MRT_ColumnFiltersState = [{ id: 'tags', value: 'x' }];
    const columnFilterFns: MRT_ColumnFilterFnsState = { tags: 'equals' };
    const filtered = applyColumnFilters(coll, columnFilters, columnFilterFns);
    expect((await filtered.toArray()).map((i) => (i as any).id).sort()).toEqual(
      [1, 3]
    );

    // 2) Paginate
    const paged = applyPagination(filtered, { pageIndex: 0, pageSize: 1 });
    expect((await paged.toArray()).map((i) => (i as any).id)).toEqual([1]);

    // 3) Sort
    const sorted = sortItems(await paged.toArray(), [
      { id: 'value', desc: false },
    ] as MRT_SortingState);
    expect(sorted.map((i) => (i as any).value)).toEqual([10]);

    // 4) Group
    const grouped = groupItems(sorted, ['name']);
    expect((grouped[0] as any).name).toBe('Alice');
    expect(((grouped[0] as any).subRows as Item[])[0].id).toBe(1);
  });
});
