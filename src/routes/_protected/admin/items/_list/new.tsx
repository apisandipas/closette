import { itemFormOptionsOptions } from "@/features/items/api/queries";
import ItemFormModal from "@/features/items/components/item-form-modal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/items/_list/new")({
  loader: ({ context }) => context.queryClient.ensureQueryData(itemFormOptionsOptions()),
  component: RouteComponent,
});

function RouteComponent() {
  const { data: formOptionData } = useSuspenseQuery(itemFormOptionsOptions())

  return (
    <ItemFormModal
      title="New item"
      description="Add a piece to the closet."
      submitLabel="Create item"
      idPrefix="new-item"
      brands={formOptionData.brands}
      types={formOptionData.types}
    />
  );
}
