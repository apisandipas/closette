import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import Sidebar from "@/components/admin/sidebar";

export const Route = createFileRoute("/_protected/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-dvh flex-col overflow-y-auto overscroll-none bg-gray-100 pt-14 dark:bg-slate-700">
      <header className="bg-background fixed top-0 right-0 left-0 z-50 flex h-14 w-full grow-0 items-center justify-center shadow-xl">
        <Link to="/dashboard" className="flex flex-row items-center gap-4 pl-4">
          <div className="font-heading font-bold">Closette Admin</div>
        </Link>
        <div className="ml-auto flex flex-row items-center justify-center gap-4 pr-4">
          <Link to={"/dashboard"}>Back to Dashboard</Link>
        </div>
      </header>
      <div className="grid h-full grid-cols-[260px_1fr] gap-6 px-6 pt-7">
        <aside className="rounded-xl">
          <Sidebar />
        </aside>
        <main className="flex grow flex-col pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
