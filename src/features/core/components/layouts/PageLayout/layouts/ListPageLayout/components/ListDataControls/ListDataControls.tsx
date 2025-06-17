import { ListDataControlsProps } from './ListDataControls.types';

const ListDataControls = ({
  queryParams,
  queryParamHandlers,
}: ListDataControlsProps) => {
  const {
    columnFilters,
    columnFilterFns,
    globalFilter,
    sorting,
    pagination,
    grouping,
  } = queryParams;

  const {
    handleColumnFiltersChange,
    handleColumnFilterFnsChange,
    handleGlobalFilterChange,
    handleSortingChange,
    handlePaginationChange,
    handleGroupingChange,
  } = queryParamHandlers;

  // ** global state ** //

  // ** local state ** //

  // ** local vars ** //

  // ** handlers ** //
  return <div>Comp</div>;
};
export default ListDataControls;
