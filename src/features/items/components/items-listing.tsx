import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export type ItemsListItem = {
  id: string;
  name: string;
};

const itemsList: ItemsListItem[] = [
  {
    id: "123",
    name: "Too Cool Teen Skipper",
  },
];

function ItemsListPage() {
  return (
    <ul className="border border-gray-501 divide-y divide-gray-500 list-none">
      {itemsList.map(({ name, id }) => {
        return (
          <li key={name}>
            <Link
              className="flex items-center p-7"
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
  );
}

export default ItemsListPage;
