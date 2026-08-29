import DataTable, {
  createDataTableColumnHelper,
  type DataTablePagination,
  type DataTableSearch,
} from "@/components/ui/data-table";
import { useNavigate } from "@tanstack/react-router";
import type { BrandWithItemCount } from "../api/types";

export type BrandsTableProps = {
  brands: Array<BrandWithItemCount>;
  pagination: DataTablePagination;
  search: DataTableSearch;
};

const columnHelper = createDataTableColumnHelper<BrandWithItemCount>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("itemCount", { header: "Items" }),
]);

function BrandsTable({ brands, pagination, search }: BrandsTableProps) {
  const navigate = useNavigate();

  return (
    <DataTable
      data={brands}
      columns={columns}
      openRow={(brand) =>
        navigate({
          to: "/admin/brands/$brandId/edit",
          params: { brandId: brand.id },
        })
      }
      pagination={pagination}
      search={search}
      searchPlaceholder="Search closets..."
      emptyMessage="No closets yet."
    />
  );
}

export default BrandsTable;
