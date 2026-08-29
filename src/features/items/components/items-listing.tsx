import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { itemsQueryOptions } from "../api/queries";
import ItemsTable from "./items-table";

// getRouteApi instead of importing Route, which would be a circular import:
// the route file already imports this component.
const route = getRouteApi("/_protected/admin/items/_list");

function ItemsListPage() {
  const search = route.useSearch();
  const navigate = route.useNavigate();
  const { data } = useSuspenseQuery(itemsQueryOptions(search));

  // Paging and search live in the URL, so getItems does the work server-side
  // and the table stays a view over one page of rows.
  return (
    <ItemsTable
      items={data.items}
      pagination={{
        page: data.page,
        pageCount: data.pageCount,
        onPageChange: (page) =>
          navigate({ search: (prev) => ({ ...prev, page }) }),
      }}
      search={{
        value: search.search ?? "",
        onChange: (value) =>
          // Back to page 1: the old page number rarely exists in the new results.
          navigate({
            search: (prev) => ({
              ...prev,
              search: value || undefined,
              page: 1,
            }),
          }),
      }}
    />
  );
}

export default ItemsListPage;
