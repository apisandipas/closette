import ClosetFormModal from "@/features/closets/components/closet-form-modal";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/closets/_list/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ClosetFormModal
      title="New closet"
      description="Add a new closet"
      submitLabel="Create closet"
      idPrefix="new-closet"
    />
  );
}
