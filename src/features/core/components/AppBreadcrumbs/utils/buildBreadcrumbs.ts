import { Breadcrumb } from '../AppBreadcrumbs.types';

/**
 * Convert a pathname string (e.g. "/recipes/123/details") into
 * an array of { label, to } breadcrumb objects.
 */
export function buildBreadcrumbs(pathname: string): Breadcrumb[] {
  const segments = pathname.split('/').filter((segment) => segment.length > 0);

  return segments.map((segment, index) => {
    const to = `/${segments.slice(0, index + 1).join('/')}`;

    const words = segment.replace(/-/g, ' ').split(' ');

    const label = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return { label, to };
  });
}
