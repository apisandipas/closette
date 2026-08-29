import NewButton from "@/components/admin/new-button";
import PageContainer from "@/components/layout/page-container";
import { brandsQueryOptions } from "@/features/brands/api/queries";
import BrandsListPage from "@/features/brands/components/brands-listing";
import { searchFiltersSchema } from "@/features/common";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

export const Route = createFileRoute("/_protected/admin/brands/_list")({
  validateSearch: zodValidator(searchFiltersSchema),
  loaderDeps: ({ search }) => search,
  loader: ({ deps, context }) =>
    context.queryClient.ensureQueryData(brandsQueryOptions(deps)),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageContainer
      pageTitle="Brands"
      pageHeaderAction={<NewButton to="/admin/brands/new" />}
    >
      <BrandsListPage />
    </PageContainer>
  );
}
