import { queryOptions } from "@tanstack/react-query";
import { getDashboardFilters } from "./service";

export const filterQueryOptions = () =>
  queryOptions({
    queryKey: ["dashboardFilters"],
    queryFn: () => getDashboardFilters(),
  });
