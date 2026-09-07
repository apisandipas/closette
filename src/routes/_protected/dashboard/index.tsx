import { FilterSidebar } from "@/features/dashboard/components/filter-sidebar";
import { MasonryComponent } from "@/features/dashboard/components/masonry";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { ErrorComponent, createFileRoute } from "@tanstack/react-router";
import { dashboardFiltersSchema } from "@/features/dashboard/api/types";

const DashboardErrorComponent = ({ error }: ErrorComponentProps) => {
  return <ErrorComponent error={error} />;
};

export const Route = createFileRoute("/_protected/dashboard/")({
  validateSearch: dashboardFiltersSchema,
  loaderDeps: ({ search }) => ({
    types: search.types,
    brands: search.brands,
    closetNames: search.closetNames,
  }),
  // loader: async ({ context, deps }) =>
  //   Promise.all([
  //     context.queryClient.ensureQueryData(dashboardQueryOptions(deps)),
  //     context.queryClient.ensureQueryData(filterQueryOptions()),
  //   ]),
  errorComponent: DashboardErrorComponent,
  component: DashboardComponent,
});

function DashboardComponent() {
  return (
    <div className="grid grid-cols-[260px_1fr] gap-6 px-6 pt-7 h-full">
      <div className="rounded-xl">
        <FilterSidebar />
      </div>
      <main className="flex flex-col grow pt-6">
        <MasonryComponent />
      </main>
    </div>
  );
}
