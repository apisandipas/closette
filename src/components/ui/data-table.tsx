import { Button } from "@/components/ui/button";
import DebouncedInput from "@/components/ui/debounced-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Search,
} from "lucide-react";
import {
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type { ColumnDef, RowData } from "@tanstack/react-table";

// One shared feature set for every table in the app. Columns are typed against
// it, so callers must build them with the helper below rather than their own
// createColumnHelper call.
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
  filterFns: {
    includesString: filterFn_includesString,
  },
});

export type DataTableFeatures = typeof dataTableFeatures;

export function createDataTableColumnHelper<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}

export type DataTableColumns<TData extends RowData> = ReadonlyArray<
  ColumnDef<DataTableFeatures, TData>
>;

/** Server-driven pagination. Supply this when the rows for one page are all
 *  the component receives; leave it off and the table paginates `data` itself. */
export type DataTablePagination = {
  /** 1-based, matching the page number in the URL. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

/** Server-driven search. Same deal: supply it and filtering happens upstream,
 *  leave it off and the table filters `data` itself. */
export type DataTableSearch = {
  value: string;
  onChange: (value: string) => void;
};

export type DataTableProps<TData extends RowData> = {
  data: Array<TData>;
  columns: DataTableColumns<TData>;
  /** Called when a row is clicked or activated by keyboard. Rows are only
   *  interactive when this is provided. */
  openRow?: (row: TData) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  pagination?: DataTablePagination;
  search?: DataTableSearch;
  /** Client-side page size. Ignored when `pagination` is supplied. */
  pageSize?: number;
};

// `0` and `false` are real values; only null/undefined/"" are missing.
function isEmpty(value: unknown) {
  return value === null || value === undefined || value === "";
}

function DataTable<TData extends RowData>({
  data,
  columns,
  openRow,
  searchable = true,
  searchPlaceholder = "Search all columns...",
  emptyMessage = "Nothing here yet.",
  pagination,
  search,
  pageSize = 10,
}: DataTableProps<TData>) {
  const table = useTable(
    {
      features: dataTableFeatures,
      columns,
      data,
      globalFilterFn: "includesString",
      // In server mode the rows have already been sliced upstream, so the
      // table must not slice them a second time.
      manualPagination: Boolean(pagination),
      pageCount: pagination?.pageCount,
      initialState: { pagination: { pageIndex: 0, pageSize } },
    },
    (state) => state, // default selector
  );

  const rows = table.getRowModel().rows;

  // Controlled (server) when the prop is supplied, otherwise the table owns it.
  const page = pagination ? pagination.page : table.state.pagination.pageIndex + 1;
  const pageCount = pagination ? pagination.pageCount : table.getPageCount();
  const goToPage = (next: number) =>
    pagination ? pagination.onPageChange(next) : table.setPageIndex(next - 1);

  const searchValue = search ? search.value : (table.state.globalFilter ?? "");
  const onSearchChange = (value: string | number) =>
    search ? search.onChange(String(value)) : table.setGlobalFilter(String(value));
  const isInteractive = Boolean(openRow);
  // +1 for the affordance column that trails each interactive row.
  const columnCount = columns.length + (isInteractive ? 1 : 0);

  return (
    <div className="flex flex-col gap-4">
      {searchable && (
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <DebouncedInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            className="pl-8"
          />
        </div>
      )}

      <div className="border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id} className="hover:bg-transparent">
                {group.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <button
                          type="button"
                          className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <table.FlexRender header={header} />
                          {sorted === "asc" && <ChevronUp className="size-3" />}
                          {sorted === "desc" && (
                            <ChevronDown className="size-3" />
                          )}
                        </button>
                      )}
                    </TableHead>
                  );
                })}
                {isInteractive && <TableHead className="w-0" />}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columnCount}
                  className="p-7 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  role={isInteractive ? "link" : undefined}
                  tabIndex={isInteractive ? 0 : undefined}
                  onClick={
                    openRow ? () => openRow(row.original) : undefined
                  }
                  onKeyDown={
                    openRow
                      ? (event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            openRow(row.original);
                          }
                        }
                      : undefined
                  }
                  className={
                    "even:bg-muted/40 focus-visible:outline-2 focus-visible:-outline-offset-2" +
                    (isInteractive ? " cursor-pointer" : "")
                  }
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {/* Accessor columns with no value render N/A; display
                          columns (no accessor) always render their own cell. */}
                      {cell.column.accessorFn && isEmpty(cell.getValue()) ? (
                        <span className="text-muted-foreground">N/A</span>
                      ) : (
                        <table.FlexRender cell={cell} />
                      )}
                    </TableCell>
                  ))}
                  {isInteractive && (
                    <TableCell className="w-0 text-muted-foreground">
                      <ArrowRight className="size-4" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 1 && (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between gap-4"
        >
          <p className="text-sm text-muted-foreground">
            Page {page} of {pageCount}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              <ChevronLeft data-icon="inline-start" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pageCount}
              onClick={() => goToPage(page + 1)}
            >
              Next
              <ChevronRight data-icon="inline-end" />
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
}

export default DataTable;
