import DataTable, {
  createDataTableColumnHelper,
  type DataTablePagination,
  type DataTableSearch,
} from "@/components/ui/data-table";
import { useNavigate } from "@tanstack/react-router";
import type { ItemWithRelations } from "../api/types";

export type ItemsTableProps = {
  items: Array<ItemWithRelations>;
  pagination: DataTablePagination;
  search: DataTableSearch;
};

const columnHelper = createDataTableColumnHelper<ItemWithRelations>();

// Accessors return "" for missing relations so sorting stays string-safe;
// DataTable renders empty values as N/A.
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
  columnHelper.accessor("year", { header: "Year" }),
  columnHelper.accessor("quantity", { header: "Quantity" }),
]);

function ItemsTable({ items, pagination, search }: ItemsTableProps) {
  const navigate = useNavigate();

  return (
    <DataTable
      data={items}
      columns={columns}
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
