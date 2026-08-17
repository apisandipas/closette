import PageContainer from "@/components/layout/page-container";
import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/admin/items/$itemId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  // return <PageContainer pageTitle="Edit Item">Item - Edit</PageContainer>;
  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black/50 p-4"
      tabIndex={-1}
      onClick={() => router.navigate({ to: "/admin/items" })}
    >
      <div
        className="bg-white shadow-xl p-6 rounded-lg w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        Hello
      </div>
    </div>
  );
}
