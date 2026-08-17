import ItemFormModal from "@/components/admin/items/item-form-modal";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/items/_list/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ItemFormModal
      title="New item"
      description="Add a piece to the closet."
      submitLabel="Create item"
      idPrefix="new-item"
    />
  );
}
