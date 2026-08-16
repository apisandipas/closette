import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_protected/admin/closets/edit/$closetId",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_protected/admin/closets/edit/$closetId"!</div>;
}
