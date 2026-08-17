import AdminListView from "@/components/admin/closets/closets-list-view";
import NewButton from "@/components/admin/new-button";
import PageContainer from "@/components/layout/page-container";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/_protected/admin/closets/")({
  component: RouteComponent,
});

const itemsList = [{ id: "123", name: "Barbie" }];

function RouteComponent() {
  return (
    <PageContainer
      pageTitle="Closets"
      pageHeaderAction={<NewButton to="/admin/closets/new" />}
    >
      Closets listing
    </PageContainer>
  );
}
