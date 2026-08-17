import PageContainer from "@/components/layout/page-container";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/brands/edit/$brandId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PageContainer pageTitle="Edit Brand">Brands - Edit</PageContainer>;
}
