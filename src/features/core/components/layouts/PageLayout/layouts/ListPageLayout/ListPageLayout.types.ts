import { ReactNode } from 'react';
import { ListQueryParamsHandlers } from '@/features/core/hooks/state/useListQueryParamState';
import { ListQueryParams } from '@/features/core/types/query.types';
import { PageLayoutProps } from '../../PageLayout.types';

export type ViewMode = 'grid' | 'table';

export interface ListPageLayoutProps {
  pageLayoutProps?: PageLayoutProps;
  children: ReactNode;
  queryParams: ListQueryParams;
  queryParamHandlers: ListQueryParamsHandlers;
}
