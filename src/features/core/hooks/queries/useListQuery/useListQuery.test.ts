// src/hooks/useListQuery.test.ts
import { act, renderHook } from '@test-utils';
import type { Table } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ListItemsDataResponse } from '../../../types/query.types';
import { useListQuery } from './useListQuery';

vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: vi.fn(),
}));

// A minimal Table<T, number> stub; we only need the .name property here.
class FakeTable<T> {
  name = 'FakeTable';
  constructor(public items: T[] = []) {}
  toCollection() {
    // not used in these shallow tests
    return {} as any;
  }
}

const mockedLive = vi.mocked(useLiveQuery);

describe('useListQuery hook', () => {
  const defaultParams = {};

  beforeEach(() => {
    mockedLive.mockReset();
  });

  it('pending state when liveData is undefined', () => {
    // simulate useLiveQuery returning still‑loading
    mockedLive.mockReturnValue(undefined);

    const table = new FakeTable([]);
    const { result } = renderHook(() =>
      useListQuery(table as unknown as Table<any, number>, defaultParams)
    );

    expect(result.current.status).toBe('pending');
    expect(result.current.isFetching).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual({
      items: [],
      total: undefined,
      allTags: [],
    });
  });

  it('error state when liveData is an Error', () => {
    const err = new Error('oh no');
    mockedLive.mockReturnValue(err);

    const table = new FakeTable([]);
    const { result } = renderHook(() =>
      useListQuery(table as any, defaultParams)
    );

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe(err);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toEqual({
      items: [],
      total: undefined,
      allTags: [],
    });
  });

  it('success state when liveData is a ListItemsDataResponse', () => {
    const payload: ListItemsDataResponse<{ id: number }> = {
      items: [{ id: 1 }],
      total: 1,
      allTags: ['foo'],
    };
    mockedLive.mockReturnValue(payload);

    const table = new FakeTable([{ id: 1 }]);
    const { result } = renderHook(() =>
      useListQuery(table as any, defaultParams)
    );

    expect(result.current.status).toBe('success');
    expect(result.current.error).toBeNull();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toEqual(payload);
  });

  it('refetch callback is stable and callable', () => {
    mockedLive.mockReturnValue(undefined);

    const table = new FakeTable([]);
    const { result } = renderHook(() =>
      useListQuery(table as any, defaultParams)
    );

    expect(typeof result.current.refetch).toBe('function');
    act(() => {
      // should not throw
      result.current.refetch();
    });
  });

  it('keeps the same data, status, error and refetch in success state', () => {
    // arrange: a fixed payload
    const payload = {
      items: [{ id: 1 }],
      total: 1,
      allTags: ['foo'],
    };
    mockedLive.mockReturnValue(payload);

    const table = new FakeTable([{ id: 1 }]);
    const { result, rerender } = renderHook(() =>
      useListQuery(table as any, {})
    );

    // capture the first render
    const first = result.current;

    // act: rerender with the same inputs
    rerender();

    // assert: still exactly the same references
    expect(result.current.data).toBe(first.data);
    expect(result.current.error).toBe(first.error);
    expect(result.current.status).toBe(first.status);
    expect(result.current.refetch).toBe(first.refetch);
  });

  it('keeps the same data, status, error and refetch in error state', () => {
    // arrange: a fixed Error
    const err = new Error('fetch failed');
    mockedLive.mockReturnValue(err);

    const table = new FakeTable([]);
    const { result, rerender } = renderHook(() =>
      useListQuery(table as any, {})
    );

    const first = result.current;

    // act
    rerender();

    // assert stability
    expect(result.current.data).toBe(first.data);
    expect(result.current.error).toBe(first.error);
    expect(result.current.status).toBe(first.status);
    expect(result.current.refetch).toBe(first.refetch);
  });
});
