import NewButton from "@/components/admin/new-button";
import PageContainer from "@/components/layout/page-container";
import { itemsQueryOptions } from "@/features/items/api/queries";
import { itemsSearchSchema } from "@/features/items/api/types";
import ItemsListPage from "@/features/items/components/items-listing";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

export const Route = createFileRoute("/_protected/admin/items/_list")({
  validateSearch: zodValidator(itemsSearchSchema),
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
