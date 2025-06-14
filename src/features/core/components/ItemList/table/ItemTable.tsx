import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_RowData,
  useMantineReactTable,
} from 'mantine-react-table';
import {
  ListQueryParams,
  ListQueryResult,
} from '@/features/core/types/query.types';

import 'mantine-react-table/styles.css';

import { useMemo } from 'react';
import { IconRefresh } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Group,
  MultiSelectProps,
  Tooltip,
} from '@mantine/core';
import { ListQueryParamsSetStateActions } from '@/features/core/hooks/state/useListQueryParamState';
import { stringToHSL } from '@/features/core/utils/color-utils';
import { Recipe } from '@/models/food/food-item/Recipe';
import { FoodItemBase } from '@/models/food/FoodItemBase';

interface ItemTableProps<TData extends MRT_RowData> {
  result: ListQueryResult<TData>;
  itemType: FoodItemBase['type'];
  params: ListQueryParams;
  handlers: ListQueryParamsSetStateActions;
}

const renderMultiSelectOption: MultiSelectProps['renderOption'] = ({
  option,
}) => (
  <Group gap="sm">
    <Badge color={stringToHSL(option.value, 100, 30)} autoContrast>
      {option.label}
    </Badge>
  </Group>
);

const getFoodItemBaseColumns = (
  allTags: string[]
): MRT_ColumnDef<FoodItemBase>[] => {
  const columns: MRT_ColumnDef<FoodItemBase>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      enableGrouping: false,
      filterVariant: 'multi-select',
      mantineFilterMultiSelectProps: {
        data: allTags,
        renderOption: renderMultiSelectOption,
      },
      Cell: ({ cell }) => {
        const tags = cell.getValue();

        if (Array.isArray(tags)) {
          return (
            <Group>
              {tags.map((tag) => (
                <Badge key={tag} color={stringToHSL(tag, 100, 30)} autoContrast>
                  {tag}
                </Badge>
              ))}
            </Group>
          );
        }
      },
      // AggregatedCell: () => null,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      Cell: ({ cell }) => {
        const date = new Date(cell.getValue() as number);
        return <span>{date.toLocaleDateString()}</span>;
      },
      AggregatedCell: () => null,
    },
    {
      accessorKey: 'updatedAt',
      header: 'Updated At',
      Cell: ({ cell }) => {
        const date = new Date(cell.getValue() as number);
        return <span>{date.toLocaleDateString()}</span>;
      },
      AggregatedCell: () => null,
    },
  ];

  return columns;
};

const getRecipeColumns = (allTags: string[]): MRT_ColumnDef<Recipe>[] => {
  const columns: MRT_ColumnDef<Recipe>[] = [
    ...(getFoodItemBaseColumns(allTags) as MRT_ColumnDef<Recipe>[]),
    {
      accessorKey: 'servings',
      header: 'Servings',
    },
    {
      accessorKey: 'externalLink',
      header: 'External Link',
    },
  ];

  return columns;
};

const getColumns = (type: FoodItemBase['type'], allTags: string[]) => {
  switch (type) {
    case 'ingredient':
      return getRecipeColumns(allTags);
    case 'recipe':
      return getRecipeColumns(allTags);
    case 'custom':
      return getRecipeColumns(allTags);
  }
};

function ItemTable<TData extends MRT_RowData>({
  result,
  itemType,
  params,
  handlers,
}: ItemTableProps<TData>) {
  const { data, status, isFetching, error, refetch } = result;

  const { items, total, allTags } = data;

  const { grouping, ...restParams } = params;

  const {
    setColumnFilters,
    setColumnFilterFns,
    setGlobalFilter,
    setSorting,
    setPagination,
  } = handlers;

  // ** global state ** //

  // ** local state ** //
  const columns: MRT_ColumnDef<TData>[] = useMemo(
    () => getColumns(itemType, allTags) as MRT_ColumnDef<TData>[],
    [allTags]
  );

  const table = useMantineReactTable({
    columns,
    data: items,
    layoutMode: 'grid',
    enableGrouping: true,
    enableColumnFilterModes: true,
    columnFilterModeOptions: [
      'contains',
      'equals',
      'greaterThan',
      'lessThan',
      'greaterThanOrEqualTo',
      'lessThanOrEqualTo',
    ],
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    state: {
      ...restParams,
      showAlertBanner: status === 'error',
      showProgressBars: isFetching,
      showSkeletons: status === 'pending',
    },
    rowCount: total,
    onColumnFilterFnsChange: setColumnFilterFns,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    mantineToolbarAlertBannerProps: error
      ? {
          color: 'red',
          children: `Error: ${error.message}`,
        }
      : undefined,
    renderTopToolbarCustomActions: () => (
      <Tooltip label="Refresh Data">
        <ActionIcon
          variant="subtle"
          color="var(--mantine-color-bright)"
          onClick={() => refetch()}
        >
          <IconRefresh />
        </ActionIcon>
      </Tooltip>
    ),
  });

  // ** local vars ** //

  // ** handlers ** //

  return <MantineReactTable table={table} />;
}
export default ItemTable;
