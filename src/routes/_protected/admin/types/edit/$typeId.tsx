import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/types/edit/$typeId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_protected/admin/types/edit/$typeId"!</div>;
}
