import { TypeFormValues } from "@/features/types/api/form";
import { useCreateType } from "@/features/types/api/mutations";
import TypeFormModal from "@/features/types/components/type-form-modal";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/types/_list/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutateAsync } = useCreateType();

  const onSubmit = async (value: TypeFormValues) => {
    await mutateAsync({ data: value });
  };

  return (
    <TypeFormModal
      title="New type"
      description="Add a new type option"
      submitLabel="Create type"
      onSubmit={onSubmit}
    />
  );
}
