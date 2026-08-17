import NewButton from "@/components/admin/new-button";
import PageContainer from "@/components/layout/page-container";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/brands/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageContainer
      pageTitle="Brands"
      pageHeaderAction={<NewButton to="/admin/brands/new" />}
    >
      Brand Listings
    </PageContainer>
  );
}
