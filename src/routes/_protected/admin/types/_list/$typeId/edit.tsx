import { TypeFormValues } from "@/features/types/api/form";
import { useUpdateType } from "@/features/types/api/mutations";
import { typeQueryOptions } from "@/features/types/api/queries";
import TypeFormModal from "@/features/types/components/type-form-modal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_protected/admin/types/_list/$typeId/edit",
)({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(typeQueryOptions(params.typeId)),
  component: RouteComponent,
});

function RouteComponent() {
  const { typeId } = Route.useParams();
  const { data: typeData } = useSuspenseQuery(typeQueryOptions(typeId));
  const { mutateAsync } = useUpdateType();

  const existingType = typeData.type;
  if (!existingType) return null;

  const onSubmit = async (values: TypeFormValues) => {
    console.log({ values });
    await mutateAsync({ data: { id: typeId, ...values } });
  };

  return (
    <TypeFormModal
      title="Edit type"
      defaultValues={{
        name: existingType.name ?? "",
      }}
      description="Edit a type option"
      submitLabel="Update type"
      onSubmit={onSubmit}
    />
  );
}
