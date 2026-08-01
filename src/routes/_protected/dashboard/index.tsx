import {
  ErrorComponent,
  createFileRoute,
  redirect,
} from "@tanstack/react-router";
import { getSession } from "@/lib/auth/functions";
import type { ErrorComponentProps } from "@tanstack/react-router";

const DashboardErrorComponent = ({ error }: ErrorComponentProps) => {
  return <ErrorComponent error={error} />;
};

export const Route = createFileRoute("/_protected/dashboard/")({
  beforeLoad: async () => {
    const session = await getSession();

    if (!session) {
      throw redirect({ to: "/login" });
    }

    return { user: session.user };
  },
  errorComponent: DashboardErrorComponent,
  component: DashboardComponent,
});

function DashboardComponent() {
  const { user } = Route.useRouteContext();

  return <div>Welcome, {user.name}!</div>;
}
