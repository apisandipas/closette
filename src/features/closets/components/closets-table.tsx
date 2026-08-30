import DataTable, {
  createDataTableColumnHelper,
  type DataTablePagination,
  type DataTableSearch,
} from "@/components/ui/data-table";
import { useNavigate } from "@tanstack/react-router";
import type { Closet, ClosetWithItemCount } from "../api/types";
import { useDeleteCloset } from "../api/mutations";
import { useConfirm } from "@/components/ui/confirm-dialog";

export type ClosetsTableProps = {
  closets: Array<ClosetWithItemCount>;
  pagination: DataTablePagination;
  search: DataTableSearch;
};

const columnHelper = createDataTableColumnHelper<ClosetWithItemCount>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("itemCount", { header: "Items" }),
  columnHelper.accessor((row) => new Date(row.createdAt).toLocaleDateString(), {
    id: "createdAt",
    header: "Created",
  }),
]);

function ClosetsTable({ closets, pagination, search }: ClosetsTableProps) {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { mutateAsync } = useDeleteCloset();

  const removeRow = async (closet: Closet) => {
    const ok = await confirm({
      title: "Delete closet?",
      description: `${closet.name} will be permanently removed.`,
    });
    if (ok) {
      await mutateAsync({ data: { id: closet.id } });
    }
  };

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
      removeRow={removeRow}
      pagination={pagination}
      search={search}
      searchPlaceholder="Search closets..."
      emptyMessage="No closets yet."
    />
  );
}

export default ClosetsTable;
