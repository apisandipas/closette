import PageContainer from "@/components/layout/page-container";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";

export type ItemsListItem = {
  id: string;
  name: string;
};

export type ItemsListViewProps = {
  title: string;
  items: ItemsListItem[];
};

export default function AdminListView({ title, items }: ItemsListViewProps) {
  return (
    <PageContainer
      pageTitle="Items"
      pageHeaderAction={
        <Link
          to={"/admin/items/new"}
          className="flex gap-2 bg-primary p-3 rounded-lg text-white"
        >
          <Plus /> New
        </Link>
      }
    >
      <ul className="border border-gray-500 divide-y divide-gray-500 list-none">
        {items.map(({ name, id }) => {
          return (
            <li key={name}>
              <Link
                className="flex p-6 itemsems-center"
                to={"/admin/items/edit/$itemId"}
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
    </PageContainer>
  );
}
