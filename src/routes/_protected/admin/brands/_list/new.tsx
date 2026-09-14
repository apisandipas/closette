import { useCreateBrand } from "@/features/brands/api/mutations";
import { BrandFormValues } from "@/features/brands/api/types";
import BrandFormModal from "@/features/brands/components/brand-form-modal";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/brands/_list/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutateAsync } = useCreateBrand();

  const onSubmit = async (value: BrandFormValues) => {
    await mutateAsync({ data: value });
  };

  return (
    <BrandFormModal
      title="New brand"
      description="Add a new brand option"
      submitLabel="Create brand"
      onSubmit={onSubmit}
    />
  );
}
