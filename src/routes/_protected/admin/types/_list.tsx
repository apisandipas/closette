import NewButton from "@/components/admin/new-button";
import PageContainer from "@/components/layout/page-container";
import { typesQueryOptions } from "@/features/types/api/queries";
import { searchFiltersSchema } from "@/features/common";
import TypesListPage from "@/features/types/components/types-listing";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

export const Route = createFileRoute("/_protected/admin/types/_list")({
  validateSearch: zodValidator(searchFiltersSchema),
  loaderDeps: ({ search }) => search,
  loader: ({ deps, context }) =>
    context.queryClient.ensureQueryData(typesQueryOptions(deps)),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PageContainer
      pageTitle="Types"
      pageHeaderAction={<NewButton to="/admin/types/new" />}
    >
      <TypesListPage />
      <Outlet />
    </PageContainer>
  );
}
