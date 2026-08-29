import ItemFormModal from "@/features/items/components/item-form-modal";
import type { ItemFormValues } from "@/features/items/components/item-form";
import { createFileRoute } from "@tanstack/react-router";
import { itemFormOptionsOptions, itemQueryOptions, itemsQueryOptions } from "@/features/items/api/queries";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute(
  "/_protected/admin/items/_list/$itemId/edit",
)({
  loader: ({ context, params }) =>
    Promise.all([
      context.queryClient.ensureQueryData(itemQueryOptions(params.itemId)),
      context.queryClient.ensureQueryData(itemFormOptionsOptions())
    ]),
  component: RouteComponent,
});

function RouteComponent() {
  const { itemId } = Route.useParams();
  const { data: itemData } = useSuspenseQuery(itemQueryOptions(itemId))
  const { data: formOptionData } = useSuspenseQuery(itemFormOptionsOptions())

  return (
    <ItemFormModal
      title="Edit item"
      description={`Item ${itemId}`}
      submitLabel="Save changes"
      idPrefix={`edit-item-${itemId}`}
      values={itemData.item}
      brands={formOptionData.brands}
      types={formOptionData.types}
    />
  );
}
