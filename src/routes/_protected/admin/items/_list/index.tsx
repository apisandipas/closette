import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/items/_list/")({
  component: () => null,
});
