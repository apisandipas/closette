import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export type ClosetsListItem = {
  id: string;
  name: string;
};

export type ClosetsListViewProps = {
  title: string;
  items: ClosetsListItem[];
};

export default function ItemsListView({ title, items }: ClosetsListViewProps) {
  console.log({ items });
  return (
    <section className="flex flex-col">
      <h1 className="mb-6 font-sans font-bold text-4xl">{title}</h1>
      <ul className="border border-gray-500 divide-y divide-gray-500 list-none">
        {items.map(({ name, id }) => {
          return (
            <li key={name}>
              <Link
                className="flex items-center p-6 cl"
                to={"/admin/closets/edit/$closetId"}
                params={{ closetId: id }}
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
