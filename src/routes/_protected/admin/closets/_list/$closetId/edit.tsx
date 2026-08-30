import { ClosetFormValues } from "@/features/closets/api/form";
import { useUpdateCloset } from "@/features/closets/api/mutations";
import { closetQueryOptions } from "@/features/closets/api/queries";
import ClosetFormModal from "@/features/closets/components/closet-form-modal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_protected/admin/closets/_list/$closetId/edit",
)({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(closetQueryOptions(params.closetId)),
  component: RouteComponent,
});

function RouteComponent() {
  const { closetId } = Route.useParams();
  const { data: closetData } = useSuspenseQuery(closetQueryOptions(closetId));
  const { mutateAsync } = useUpdateCloset();

  const existingCloset = closetData.closet;
  if (!existingCloset) return null;

  const onSubmit = async (values: ClosetFormValues) => {
    await mutateAsync({ data: { id: closetId, ...values } });
  };

  return (
    <ClosetFormModal
      title="Edit closet"
      defaultValues={{
        name: existingCloset.name,
      }}
      description="Edit a closet"
      submitLabel="Update closet"
      onSubmit={onSubmit}
    />
  );
}
