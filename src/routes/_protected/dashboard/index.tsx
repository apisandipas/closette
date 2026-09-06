import { FilterSidebar } from "@/components/dashboard/filter-sidebar";
import { MasonryComponent } from "@/components/dashboard/masonry";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { ErrorComponent, createFileRoute } from "@tanstack/react-router";

const DashboardErrorComponent = ({ error }: ErrorComponentProps) => {
  return <ErrorComponent error={error} />;
};

export const Route = createFileRoute("/_protected/dashboard/")({
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
