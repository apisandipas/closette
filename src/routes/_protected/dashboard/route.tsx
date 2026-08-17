import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { authClient } from "@/lib/auth/auth-client";
import { ThemeToggle } from "@/components/theme-switcher";
import { LogOut, Rabbit } from "lucide-react";
import { UserDropdown } from "@/components/dashboard/user-dropdown";
import { getSession } from "@/lib/auth/functions";

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
  const navigate = useNavigate();

  const signOut = async () => {
    await authClient.signOut();
    navigate({ to: "/login" });
  };

  const { data: session } = authClient.useSession();
  return (
    <div className="flex flex-col bg-gray-100 dark:bg-slate-700 h-dvh">
      <header className="flex bg-background shadow-xl w-full h-14 grow-0">
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
