import { describe, expect, it } from 'vitest';
import { Breadcrumb } from '../AppBreadcrumbs.types';
import { buildBreadcrumbs } from './buildBreadcrumbs';

describe('buildBreadcrumbs util', () => {
  it('returns empty array for root path "/"', () => {
    expect(buildBreadcrumbs('/')).toEqual([]);
  });

  it('parses a single segment', () => {
    expect(buildBreadcrumbs('/recipes')).toEqual<Breadcrumb[]>([
      { label: 'Recipes', to: '/recipes' },
    ]);
  });

  it('parses multiple segments', () => {
    expect(buildBreadcrumbs('/recipes/123/details')).toEqual<Breadcrumb[]>([
      { label: 'Recipes', to: '/recipes' },
      { label: '123', to: '/recipes/123' },
      { label: 'Details', to: '/recipes/123/details' },
    ]);
  });

  it('handles kebab-case segments with title case', () => {
    expect(buildBreadcrumbs('/my-recipes/edit-item')).toEqual<Breadcrumb[]>([
      { label: 'My Recipes', to: '/my-recipes' },
      { label: 'Edit Item', to: '/my-recipes/edit-item' },
    ]);
  });

  it('ignores empty segments between slashes', () => {
    expect(buildBreadcrumbs('///a//b///')).toEqual<Breadcrumb[]>([
      { label: 'A', to: '/a' },
      { label: 'B', to: '/a/b' },
    ]);
  });
});
