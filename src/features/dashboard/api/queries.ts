import { queryOptions } from "@tanstack/react-query";
import { getDashboardFilters, getDashboardItems } from "./service";
import type { DashboardFilters } from "./types";

export const filterQueryOptions = () =>
  queryOptions({
    queryKey: ["dashboardFilters"],
    queryFn: () => getDashboardFilters(),
  });

export const dashboardQueryOptions = (filters: DashboardFilters) =>
  queryOptions({
    queryKey: ["dashboardItems", filters],
    queryFn: () => getDashboardItems({ data: filters }),
  });
