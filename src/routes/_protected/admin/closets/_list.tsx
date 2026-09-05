import NewButton from "@/components/admin/new-button";
import PageContainer from "@/components/layout/page-container";
import { closetsQueryOptions } from "@/features/closets/api/queries";
import ClosetsListPage from "@/features/closets/components/closets-listing";
import { searchFiltersSchema } from "@/features/common";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/closets/_list")({
  validateSearch: searchFiltersSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps, context }) =>
    context.queryClient.ensureQueryData(closetsQueryOptions(deps)),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageContainer
      pageTitle="Closets"
      pageHeaderAction={<NewButton to={"/admin/closets/new"} />}
    >
      <ClosetsListPage />
      <Outlet />
    </PageContainer>
  );
}
