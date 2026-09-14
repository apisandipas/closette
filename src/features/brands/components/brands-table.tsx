import { useConfirm } from "@/components/ui/confirm-dialog";
import DataTable, {
  createDataTableColumnHelper,
  type DataTablePagination,
  type DataTableSearch,
} from "@/components/ui/data-table";
import { useNavigate } from "@tanstack/react-router";
import { useDeleteBrand } from "../api/mutations";
import type { Brand, BrandWithItemCount } from "../api/types";

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
  const confirm = useConfirm();
  const { mutateAsync } = useDeleteBrand();

  const removeRow = async (brand: Brand) => {
    const ok = await confirm({
      title: "Delete brand",
      description: `${brand.name} will be permanently removed`,
    });
    if (ok) {
      await mutateAsync({ data: { id: brand.id } });
    }
  };

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
      removeRow={removeRow}
      pagination={pagination}
      search={search}
      searchPlaceholder="Search closets..."
      emptyMessage="No closets yet."
    />
  );
}

export default BrandsTable;
