import { ItemsListItem } from "@/components/admin/items/item-list-view";
import NewButton from "@/components/admin/new-button";
import PageContainer from "@/components/layout/page-container";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_protected/admin/items/")({
  component: RouteComponent,
});

const itemsList: ItemsListItem[] = [
  {
    id: "123",
    name: "Too Cool Teen Skipper",
  },
];

function RouteComponent() {
  return (
    <PageContainer
      pageTitle="Items"
      pageHeaderAction={<NewButton to={"/admin/items/new"} />}
    >
      <ul className="border border-gray-500 divide-y divide-gray-500 list-none">
        {itemsList.map(({ name, id }) => {
          return (
            <li key={name}>
              <Link
                className="flex items-center p-6"
                to={"/admin/items/$itemId/edit"}
                params={{ itemId: id }}
              >
                {name}
                <div className="ml-auto">
                  <ArrowRight />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <Outlet />
    </PageContainer>
  );
}
