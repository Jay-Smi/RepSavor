import { useMemo } from 'react';
import { useArgs } from '@storybook/preview-api';
import { Meta, StoryObj } from '@storybook/react';
import ListDataControls from './ListDataControls';
import { ListDataControlsProps } from './ListDataControls.types';

const meta: Meta<ListDataControlsProps> = {
  title: 'Components/PageLayout/ListDataControls',
  component: ListDataControls,
};

export default meta;

type Story = StoryObj<ListDataControlsProps>;

export const Default: Story = {
  args: {
    queryParams: {
      columnFilters: [],
      columnFilterFns: {},
      globalFilter: '',
      sorting: [],
      pagination: { pageIndex: 0, pageSize: 10 },
      grouping: [],
    },
    queryParamHandlers: {
      handleColumnFiltersChange: () => {},
      handleColumnFilterFnsChange: () => {},
      handleGlobalFilterChange: () => {},
      handleSortingChange: () => {},
      handlePaginationChange: () => {},
      handleGroupingChange: () => {},
    },
  },
};
