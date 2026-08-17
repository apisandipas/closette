import PageContainer from "@/components/layout/page-container";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/items/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PageContainer pageTitle="Create Item">Items - New</PageContainer>;
}
