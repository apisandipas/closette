import { ClosetFormValues } from "@/features/closets/api/form";
import ClosetFormModal from "@/features/closets/components/closet-form-modal";
import { createFileRoute } from "@tanstack/react-router";
import { useCreateCloset } from "@/features/closets/api/mutations";

export const Route = createFileRoute("/_protected/admin/closets/_list/new")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutateAsync } = useCreateCloset();

  const onSubmit = async (values: ClosetFormValues) => {
    await mutateAsync({ data: values });
  };

  return (
    <ClosetFormModal
      title="New closet"
      description="Add a new closet"
      submitLabel="Create closet"
      onSubmit={onSubmit}
    />
  );
}
