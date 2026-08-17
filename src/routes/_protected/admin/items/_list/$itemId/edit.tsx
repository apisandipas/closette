import ItemFormModal from "@/components/admin/items/item-form-modal";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_protected/admin/items/_list/$itemId/edit",
)({
  component: RouteComponent,
});

// Mocked until the item loader lands.
const MOCK_ITEM = {
  name: "Too Cool Teen Skipper",
  brand: "Mattel",
  type: "Dress",
  color: "Sunset pink",
  size: "M",
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
