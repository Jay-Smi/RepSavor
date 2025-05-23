import {
  MantineReactTable,
  MRT_ColumnDef,
  MRT_ColumnFilterFnsState,
  MRT_ColumnFiltersState,
  MRT_FilterFns,
  MRT_GroupingState,
  MRT_PaginationState,
  MRT_RowData,
  MRT_SortingState,
  useMantineReactTable,
} from 'mantine-react-table';
import { ListQueryResult } from '@/features/core/types/query.types';

import 'mantine-react-table/styles.css';

import { useMemo, useState } from 'react';
import { Badge, Group, MultiSelectProps } from '@mantine/core';
import { stringToHSL } from '@/features/core/utils/color-utils';
import { Recipe } from '@/models/food/food-item/Recipe';
import { FoodItemBase } from '@/models/food/FoodItemBase';

interface ItemTableProps<TData extends MRT_RowData> {
  result: ListQueryResult<TData>;
  itemType: FoodItemBase['type'];
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
}: ItemTableProps<TData>) {
  const { data: initData, status, isFetching, error, refresh } = result;

  const data = (initData?.items as TData[]) || [];

  // ** global state ** //

  // ** local state ** //
  // {
  //   id: string;
  //   value: unknown;
  // }[]
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );

  // Record<string, filterFn>
  const [columnFilterFns, setColumnFilterFns] = //filter modes
    useState<MRT_ColumnFilterFnsState>(
      Object.fromEntries(
        columns.map(({ accessorKey }) => [accessorKey, 'contains'])
      )
    );

  const [globalFilter, setGlobalFilter] = useState('');

  // {
  //   desc: boolean;
  //   id: string;
  // }[]
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  // {
  //   pageIndex: number;
  //   pageSize: number;
  // }
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const allTags = useMemo(() => {
    const allTagsSet = new Set<string>();
    data.forEach((item) => {
      if (item.tags) {
        (item.tags as string[]).forEach((tag) => {
          allTagsSet.add(tag);
        });
      }
    });
    return Array.from(allTagsSet);
  }, [data]);

  const columns: MRT_ColumnDef<TData>[] = useMemo(
    () => getColumns(itemType, allTags) as MRT_ColumnDef<TData>[],
    [allTags]
  );

  const table = useMantineReactTable({
    columns,
    data,
    enableGrouping: true,
    layoutMode: 'grid',
  });

  // ** local vars ** //

  // ** handlers ** //

  return <MantineReactTable table={table} />;
}
export default ItemTable;
