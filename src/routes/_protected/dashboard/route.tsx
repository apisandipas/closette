import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth/auth-client";

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
    <div>
      <div className="flex w-full border-red-500 border">
        <div className="p-4">Left</div>
        <div className="p-4 ml-auto">
          {session?.user && (
            <div>
              `Welcome, {session.user.name}`<a onClick={signOut}>Sign Out</a>
            </div>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
