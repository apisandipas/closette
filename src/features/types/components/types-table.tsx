import DataTable, {
  createDataTableColumnHelper,
  type DataTablePagination,
  type DataTableSearch,
} from "@/components/ui/data-table";
import { useNavigate } from "@tanstack/react-router";
import type { Type, TypesWithItemCount } from "../api/types";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { useDeleteType } from "../api/mutations";

export type TypesTableProps = {
  types: Array<TypesWithItemCount>;
  pagination: DataTablePagination;
  search: DataTableSearch;
};

const columnHelper = createDataTableColumnHelper<TypesWithItemCount>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("itemCount", { header: "Items" }),
  columnHelper.accessor((row) => new Date(row.createdAt).toLocaleDateString(), {
    id: "createdAt",
    header: "Created",
  }),
]);

function TypesTable({ types, pagination, search }: TypesTableProps) {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { mutateAsync } = useDeleteType();

  const removeRow = async (type: Type) => {
    const ok = await confirm({
      title: "Delete type option",
      description: `${type.name} will be permanemt removed.`,
    });
    if (ok) {
      await mutateAsync({ data: type });
    }
  };

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
      removeRow={removeRow}
      pagination={pagination}
      search={search}
      searchPlaceholder="Search item types..."
      emptyMessage="No types yet."
    />
  );
}

export default TypesTable;
