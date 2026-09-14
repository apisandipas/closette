import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/users/")({
  component: () => null,
});
