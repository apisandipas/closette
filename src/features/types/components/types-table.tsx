import DataTable, {
  createDataTableColumnHelper,
  type DataTablePagination,
  type DataTableSearch,
} from "@/components/ui/data-table";
import { useNavigate } from "@tanstack/react-router";
import type { TypesWithItemCount } from "../api/types";

export type TypesTableProps = {
  types: Array<TypesWithItemCount>;
  pagination: DataTablePagination;
  search: DataTableSearch;
};

const columnHelper = createDataTableColumnHelper<TypesWithItemCount>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("itemCount", { header: "Items" }),
  // Formatted in the accessor: a Date object can't be rendered as a React
  // child, and `new Date` tolerates the string form after serialization.
  columnHelper.accessor((row) => new Date(row.createdAt).toLocaleDateString(), {
    id: "createdAt",
    header: "Created",
  }),
]);

function TypesTable({ types, pagination, search }: TypesTableProps) {
  const navigate = useNavigate();

  return (
    <DataTable
      data={types}
      columns={columns}
      openRow={(type) =>
        navigate({
          to: "/admin/types/$typeId/edit",
          params: { typeId: type.id },
        })
      }
      pagination={pagination}
      search={search}
      searchPlaceholder="Search item types..."
      emptyMessage="No types yet."
    />
  );
}

export default TypesTable;
