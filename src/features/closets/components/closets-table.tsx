import DataTable, {
  createDataTableColumnHelper,
  type DataTablePagination,
  type DataTableSearch,
} from "@/components/ui/data-table";
import { useNavigate } from "@tanstack/react-router";
import type { ClosetWithItemCount } from "../api/types";

export type ClosetsTableProps = {
  closets: Array<ClosetWithItemCount>;
  pagination: DataTablePagination;
  search: DataTableSearch;
};

const columnHelper = createDataTableColumnHelper<ClosetWithItemCount>();

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

function ClosetsTable({ closets, pagination, search }: ClosetsTableProps) {
  const navigate = useNavigate();

  return (
    <DataTable
      data={closets}
      columns={columns}
      openRow={(closet) =>
        navigate({
          to: "/admin/closets/$closetId/edit",
          params: { closetId: closet.id },
        })
      }
      pagination={pagination}
      search={search}
      searchPlaceholder="Search closets..."
      emptyMessage="No closets yet."
    />
  );
}

export default ClosetsTable;
