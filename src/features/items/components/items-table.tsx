import DataTable, {
  createDataTableColumnHelper,
  type DataTablePagination,
  type DataTableSearch,
} from "@/components/ui/data-table";
import { useNavigate } from "@tanstack/react-router";
import type { ItemWithRelations } from "../api/types";
import { useDeleteItem } from "../api/mutations";
import { useConfirm } from "@/components/ui/confirm-dialog";

export type ItemsTableProps = {
  items: Array<ItemWithRelations>;
  pagination: DataTablePagination;
  search: DataTableSearch;
};

const columnHelper = createDataTableColumnHelper<ItemWithRelations>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor((row) => row.brand?.name ?? "", {
    id: "brand",
    header: "Brand",
  }),
  columnHelper.accessor((row) => row.type?.name ?? "", {
    id: "type",
    header: "Type",
  }),
  columnHelper.accessor((row) => row.closet?.name ?? "", {
    id: "closet",
    header: "Closet",
  }),
  columnHelper.accessor("color", {
    header: "Color",
    cell: (props) => {
      return (
        <div
          className="h-6 w-12"
          style={{ backgroundColor: props.getValue() }}
        ></div>
      );
    },
  }),
  columnHelper.accessor("year", { header: "Year" }),
  columnHelper.accessor("quantity", { header: "Quantity" }),
]);

function ItemsTable({ items, pagination, search }: ItemsTableProps) {
  const navigate = useNavigate();
  const { mutateAsync } = useDeleteItem();
  const confirm = useConfirm();

  const removeItemRow = async (item: ItemWithRelations) => {
    const ok = await confirm({
      title: "Delete item?",
      description: `“${item.name}” will be permanently removed.`,
    });
    if (ok) await mutateAsync({ data: { id: item.id } });
  };

  return (
    <DataTable
      data={items}
      columns={columns}
      removeRow={removeItemRow}
      openRow={(item) =>
        navigate({
          to: "/admin/items/$itemId/edit",
          params: { itemId: item.id },
        })
      }
      pagination={pagination}
      search={search}
      searchPlaceholder="Search items..."
      emptyMessage="No items yet."
    />
  );
}

export default ItemsTable;
