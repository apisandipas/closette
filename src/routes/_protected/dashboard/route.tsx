import { UserDropdown } from "@/components/dashboard/user-dropdown";
import { ThemeToggle } from "@/components/theme-switcher";
import { authClient } from "@/lib/auth/auth-client";
import { getSession } from "@/lib/auth/functions";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { Rabbit } from "lucide-react";

export const Route = createFileRoute("/_protected/dashboard")({
  beforeLoad: async () => {
    const session = await getSession();

    if (!session) {
      throw redirect({ to: "/login" });
    }

    return { user: session.user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: session } = authClient.useSession();
  return (
    <div className="flex flex-col bg-gray-100 dark:bg-slate-700 h-dvh overflow-y-auto overscroll-none pt-14">
      <header className="fixed top-0 left-0 right-0 z-50 flex bg-background shadow-xl w-full h-14 grow-0">
        <Link to="/dashboard" className="flex flex-row items-center gap-4 pl-4">
          <Rabbit /> <div className="font-heading font-bold">Closette</div>
        </Link>
        <div className="flex flex-row justify-center items-center gap-4 ml-auto pr-4">
          <ThemeToggle />
          <UserDropdown userName={session?.user?.name} />
        </div>
      </header>
      <main className="flex flex-col grow">
        <Outlet />
      </main>
    </div>
  );
}
