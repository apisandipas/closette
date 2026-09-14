import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { usersQueryOptions } from "../api/queries";
import UsersTable from "./users-table";

// getRouteApi instead of importing Route, which would be a circular import.
const route = getRouteApi("/_protected/users");

export default function UsersListPage() {
  const search = route.useSearch();
  const navigate = route.useNavigate();
  const { data } = useSuspenseQuery(usersQueryOptions(search));

  return (
    <UsersTable
      users={data.users}
      pagination={{
        page: data.page,
        pageCount: data.pageCount,
        onPageChange: (page) =>
          navigate({ search: (prev) => ({ ...prev, page }) }),
      }}
      search={{
        value: search.search ?? "",
        onChange: (value) =>
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
