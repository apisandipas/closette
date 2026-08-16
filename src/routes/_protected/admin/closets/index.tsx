import AdminListView, {
  ListItem,
} from "@/components/admin/closets/closets-list-view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/closets/")({
  component: RouteComponent,
});

const itemsList: ListItem[] = [{ id: "123", name: "Barbie" }];

function RouteComponent() {
  return (
    <div>
      <AdminListView title="Closets" items={itemsList} />
    </div>
  );
}
