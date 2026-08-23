import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { itemsQueryOptions } from "../api/queries";

// getRouteApi instead of importing Route, which would be a circular import:
// the route file already imports this component.
const route = getRouteApi("/_protected/admin/items/_list");

function ItemsListPage() {
  const search = route.useSearch();
  const { data } = useSuspenseQuery(itemsQueryOptions(search));

  if (data.items.length === 0) {
    return (
      <p className="p-7 border border-gray-500 text-center text-gray-500">
        No items yet.
      </p>
    );
  }

  return (
    <ul className="border border-gray-500 divide-y divide-gray-500 list-none">
      {data.items.map(({ id, name, brand, type, quantity }) => {
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

export default ItemsListPage;
