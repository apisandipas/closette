import ItemListView, {
  ItemsListItem,
} from "@/components/admin/items/item-list-view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/items/")({
  component: RouteComponent,
});

const itemsList: ItemsListItem[] = [
  {
    id: "123",
    name: "Too Cool Teen Skipper",
  },
];

function RouteComponent() {
  return (
    <div>
      <ItemListView title="Items" items={itemsList} />
    </div>
  );
}
