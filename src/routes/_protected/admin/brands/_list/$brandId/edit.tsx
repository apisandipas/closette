import { BrandFormValues } from "@/features/brands/api/form";
import { useUpdateBrand } from "@/features/brands/api/mutations";
import { brandQueryOptions } from "@/features/brands/api/queries";
import BrandFormModal from "@/features/brands/components/brand-form-modal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute(
  "/_protected/admin/brands/_list/$brandId/edit",
)({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(brandQueryOptions(params.brandId)),
  component: RouteComponent,
});

function RouteComponent() {
  const { brandId } = Route.useParams();
  const { data: brandData } = useSuspenseQuery(brandQueryOptions(brandId));
  const { mutateAsync } = useUpdateBrand();

  const existingBrand = brandData.brand;
  if (!existingBrand) return null;

  const onSubmit = async (values: BrandFormValues) => {
    await mutateAsync({ data: { id: brandId, ...values } });
  };

  return (
    <BrandFormModal
      title="Edit brand"
      defaultValues={{
        name: existingBrand.name ?? "",
      }}
      description="Edit a brand"
      submitLabel="Update brand"
      onSubmit={onSubmit}
    />
  );
}
