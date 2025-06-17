import { useMemo } from 'react';
import { useLocation } from '@tanstack/react-router';
import { Breadcrumb } from '../AppBreadcrumbs.types';
import { buildBreadcrumbs } from '../utils/buildBreadcrumbs';

export const useBreadcrumbs = (): Breadcrumb[] => {
  const pathname = useLocation({
    select: (state) => state.pathname,
  });

  return useMemo(() => buildBreadcrumbs(pathname), [pathname]);
};
