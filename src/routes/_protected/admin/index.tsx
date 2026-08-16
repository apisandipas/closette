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

export const Route = createFileRoute("/_protected/admin/")({
  beforeLoad: async () => {
    const session = await getSession();

    if (!session) {
      throw redirect({ to: "/login" });
    }

    throw redirect({ to: "/admin/items" });
  },
  errorComponent: DashboardErrorComponent,
  component: DashboardComponent,
});

function DashboardComponent() {
  return null;
}
