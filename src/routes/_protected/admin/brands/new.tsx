import PageContainer from "@/components/layout/page-container";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/brands/new")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PageContainer pageTitle="New Brand">Brands - New</PageContainer>;
}
