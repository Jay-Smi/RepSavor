import { ReactNode } from 'react';
import { ListQueryParamsSetStateActions } from '@/features/core/hooks/state/useListQueryParamState';
import { ListQueryParams } from '@/features/core/types/query.types';
import { PageLayoutProps } from '../../PageLayout.types';

export type ViewMode = 'grid' | 'table';

export interface ListPageLayoutProps
  extends Omit<PageLayoutProps, 'headerRight' | 'children'> {
  children: ReactNode;
  params: ListQueryParams;
  handlers: ListQueryParamsSetStateActions;
}
