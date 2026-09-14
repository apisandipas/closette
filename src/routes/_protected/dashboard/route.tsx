import { UserDropdown } from "@/features/dashboard/components/user-dropdown";
import { ThemeToggle } from "@/components/theme-switcher";
import { authClient } from "@/lib/auth/auth-client";
import { getSession } from "@/lib/auth/functions";
import { dashboardFiltersSchema } from "@/features/dashboard/api/types";
import { FilterSidebar } from "@/features/dashboard/components/filter-sidebar";
import { MasonryComponent } from "@/features/dashboard/components/masonry";
import {
  dashboardQueryOptions,
  filterQueryOptions,
} from "@/features/dashboard/api/queries";
import type { ErrorComponentProps } from "@tanstack/react-router";
import {
  createFileRoute,
  ErrorComponent,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { Rabbit } from "lucide-react";

const DashboardErrorComponent = ({ error }: ErrorComponentProps) => {
  return <ErrorComponent error={error} />;
};

export const Route = createFileRoute("/_protected/dashboard")({
  validateSearch: dashboardFiltersSchema,
  loaderDeps: ({ search }) => search,
  beforeLoad: async () => {
    const session = await getSession();

    if (!session) {
      throw redirect({ to: "/login" });
    }

    return { user: session.user };
  },
  loader: ({ context, deps }) =>
    Promise.all([
      context.queryClient.ensureQueryData(dashboardQueryOptions(deps)),
      context.queryClient.ensureQueryData(filterQueryOptions()),
    ]),
  errorComponent: DashboardErrorComponent,
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session } = authClient.useSession();
  const { user } = Route.useRouteContext();
  return (
    <div className="flex h-dvh flex-col overflow-y-auto overscroll-none bg-gray-100 pt-14 dark:bg-slate-700">
      <header className="bg-background fixed top-0 right-0 left-0 z-50 flex h-14 w-full grow-0 shadow-xl">
        <Link to="/dashboard" className="flex flex-row items-center gap-4 pl-4">
          <Rabbit /> <div className="font-heading font-bold">Closette</div>
        </Link>
        <div className="ml-auto flex flex-row items-center justify-center gap-4 pr-4">
          <ThemeToggle />
          <UserDropdown
            userName={session?.user?.name}
            isAdmin={user.role === "admin"}
          />
        </div>
      </header>
      <main className="flex grow flex-col">
        <div className="grid h-full grid-cols-[260px_1fr] gap-6 px-6 pt-7">
          <div className="rounded-xl">
            <FilterSidebar />
          </div>
          <main className="flex grow flex-col pt-6">
            <MasonryComponent />
            <Outlet />
          </main>
        </div>
      </main>
    </div>
  );
}
