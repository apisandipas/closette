import NewButton from "@/components/admin/new-button";
import PageContainer from "@/components/layout/page-container";
import { searchFiltersSchema } from "@/features/common";
import { itemsQueryOptions } from "@/features/items/api/queries";
import ItemsListPage from "@/features/items/components/items-listing";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/items/_list")({
  validateSearch: searchFiltersSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ deps, context }) =>
    context.queryClient.ensureQueryData(itemsQueryOptions(deps)),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageContainer
      pageTitle="Items"
      pageHeaderAction={<NewButton to={"/admin/items/new"} />}
    >
      <ItemsListPage />
      <Outlet />
    </PageContainer>
  );
}
