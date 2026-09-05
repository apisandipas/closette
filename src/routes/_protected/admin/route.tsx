import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import Sidebar from "@/components/admin/sidebar";

export const Route = createFileRoute("/_protected/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col bg-gray-100 dark:bg-slate-700 h-dvh overflow-y-auto overscroll-none pt-14">
      <header className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center bg-background shadow-xl w-full h-14 grow-0">
        <Link to="/dashboard" className="flex flex-row items-center gap-4 pl-4">
          <div className="font-heading font-bold">Closette Admin</div>
        </Link>
        <div className="flex flex-row justify-center items-center gap-4 ml-auto pr-4">
          <Link to={"/dashboard"}>Back to Dashboard</Link>
        </div>
      </header>
      <div className="grid grid-cols-[260px_1fr] gap-6 px-6 pt-7 h-full">
        <aside className="rounded-xl">
          <Sidebar />
        </aside>
        <main className="flex flex-col grow pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
