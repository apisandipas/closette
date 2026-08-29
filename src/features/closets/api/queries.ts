import { queryOptions } from "@tanstack/react-query";
import { getClosets } from "./service";
import type { ClosetFilters } from "./types";

export const closetKeys = {
  all: ["closet"] as const,
  list: (filters: ClosetFilters) => [...closetKeys.all, "list", filters],
  details: (id: string) => [...closetKeys.all, id] as const,
};

export const closetsQueryOptions = (filters: ClosetFilters) =>
  queryOptions({
    queryKey: closetKeys.list(filters),
    queryFn: () => getClosets({ data: filters }),
  });
