import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "@/utils/auth/functions";

export const Route = createFileRoute("/_protected/dashboard")({
  beforeLoad: async () => {
    const session = await getSession();

    if (!session) {
      throw redirect({ to: "/login" });
    }

    return { user: session.user };
  },
  component: Dashboard,
});

function Dashboard() {
  const { user } = Route.useRouteContext();

  return <div>Welcome, {user.name}!</div>;
}
