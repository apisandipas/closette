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
    <section className="flex flex-col">
      <div className="flex items-center mb-6">
        <h1 className="font-sans font-bold text-4xl">{title}</h1>
        <Link
          to={"/admin/items/new"}
          className="flex gap-2 bg-primary ml-auto p-3 rounded-lg text-white"
        >
          <Plus /> New
        </Link>
      </div>
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

        {items.map(({ name }) => {
          return (
            <li key={name} className="p-6">
              {name}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
