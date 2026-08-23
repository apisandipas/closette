import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { itemsQueryOptions } from "../api/queries";
import ItemsTable from "./items-table";

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
     <ItemsTable items={data.items} /> 
    </ul>
  );
}

export default ItemsListPage;
