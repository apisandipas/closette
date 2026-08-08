import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { authClient } from "@/lib/auth/auth-client";
import { ThemeToggle } from "@/components/theme-switcher";
import { LogOut, Rabbit } from "lucide-react";

export const Route = createFileRoute("/_protected/dashboard")({
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
    <div className="flex h-dvh dark:bg-slate-700 bg-gray-100 flex-col">
      <header className="flex w-full shadow-xl bg-background grow-0 h-14">
        <Link to="/dashboard" className="flex flex-row items-center gap-4 pl-4">
          <Rabbit /> <div className="font-heading font-bold">Closette</div>
        </Link>
        <div className="flex  flex-row gap-4 ml-auto items-center pr-4">
          <ThemeToggle />
          {session?.user && (
            <div className="flex gap-2 flexp-row">
              Welcome, {session.user.name}
              <a onClick={signOut}>
                <div className="flex gap-2 flex-row cursor-pointer">
                  Sign Out <LogOut />
                </div>
              </a>
            </div>
          )}
        </div>
      </header>
      <main className="flex flex-col grow">
        <Outlet />
      </main>
    </div>
  );
}
