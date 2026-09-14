import NewButton from "@/components/admin/new-button";
import PageContainer from "@/components/layout/page-container";
import { ThemeToggle } from "@/components/theme-switcher";
import { searchFiltersSchema } from "@/features/common";
import { UserDropdown } from "@/features/dashboard/components/user-dropdown";
import { usersQueryOptions } from "@/features/users/api/queries";
import UsersListPage from "@/features/users/components/users-listing";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { Rabbit } from "lucide-react";

// Admin-only. Better Auth also rejects non-admins on the user endpoints
// server-side.
export const Route = createFileRoute("/_protected/users")({
  validateSearch: searchFiltersSchema,
  loaderDeps: ({ search }) => search,
  beforeLoad: ({ context }) => {
    if (context.user.role !== "admin") throw redirect({ to: "/dashboard" });
  },
  loader: ({ deps, context }) =>
    context.queryClient.ensureQueryData(usersQueryOptions(deps)),
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  return (
    <div className="flex h-dvh flex-col overflow-y-auto overscroll-none bg-gray-100 pt-14 dark:bg-slate-700">
      <header className="bg-background fixed top-0 right-0 left-0 z-50 flex h-14 w-full grow-0 shadow-xl">
        <Link to="/dashboard" className="flex flex-row items-center gap-4 pl-4">
          <Rabbit /> <div className="font-heading font-bold">Closette</div>
        </Link>
        <div className="ml-auto flex flex-row items-center justify-center gap-4 pr-4">
          <ThemeToggle />
          <UserDropdown userName={user.name} isAdmin />
        </div>
      </header>
      <main className="flex grow flex-col px-6 pt-13">
        <PageContainer
          pageTitle="Users"
          pageHeaderAction={<NewButton to="/users/new" />}
        >
          <UsersListPage />
          <Outlet />
        </PageContainer>
      </main>
    </div>
  );
}
