import { ListQueryParamsHandlers } from '@/features/core/hooks/state/useListQueryParamState';
import { ListQueryParams } from '@/features/core/types/query.types';

export type ListDataControlsProps = {
  queryParams: ListQueryParams;
  queryParamHandlers: ListQueryParamsHandlers;
};
