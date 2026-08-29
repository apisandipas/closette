import ItemFormModal from "@/features/items/components/item-form-modal";
import type { ItemFormValues } from "@/features/items/components/item-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_protected/admin/items/_list/$itemId/edit",
)({
  component: RouteComponent,
});

// Mocked until the item loader lands.
const MOCK_ITEM: ItemFormValues = {
  name: "Too Cool Teen Skipper",
  brand: "Mattel",
  type: "Dress",
  quantity: 1,
  year: "1971",
  notes: "",
};

function RouteComponent() {
  const { itemId } = Route.useParams();

  return (
    <ItemFormModal
      title="Edit item"
      description={`Item ${itemId}`}
      submitLabel="Save changes"
      idPrefix={`edit-item-${itemId}`}
      values={MOCK_ITEM}
    />
  );
}
