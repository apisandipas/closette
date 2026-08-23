import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export type ItemsTableRow = {
  id: string;
  name: string;
  quantity: number;
  brand?: { name: string } | null;
  type?: { name: string } | null;
};

export type ItemsTableProps = {
  items: ItemsTableRow[];
};

function ItemsTable({ items }: ItemsTableProps) {
  return (
    <ul className="border border-gray-500 divide-y divide-gray-500 list-none">
      {items.map(({ id, name, brand, type, quantity }) => {
        return (
          <li key={id}>
            <Link
              className="flex items-center p-7"
              to={"/admin/items/$itemId/edit"}
              params={{ itemId: id }}
            >
              <div>
                <div>{name}</div>
                <div className="text-gray-500 text-sm">
                  {[brand?.name, type?.name].filter(Boolean).join(" · ")}
                </div>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                {quantity > 1 && <span>&times;{quantity}</span>}
                <ArrowRight />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default ItemsTable;
