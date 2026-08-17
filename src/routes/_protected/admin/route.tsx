import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import Sidebar from "@/components/admin/sidebar";

export const Route = createFileRoute("/_protected/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col bg-gray-100 dark:bg-slate-700 h-dvh">
      <header className="flex bg-background shadow-xl w-full h-14 grow-0">
        <Link to="/dashboard" className="flex flex-row items-center gap-4 pl-4">
          <div className="font-heading font-bold">Closette Admin</div>
        </Link>
        <div className="flex flex-row justify-center items-center gap-4 ml-auto pr-4">
          <Link to={"/dashboard"}>Back to Dashboard</Link>
        </div>
      </header>
      <div className="gap-6 grid grid-cols-4 m-6">
        <aside className="col-span-1 bg-white shadow-lg p-4 rounded-xl">
          <Sidebar />
        </aside>
        <main className="flex flex-col col-span-3 grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
