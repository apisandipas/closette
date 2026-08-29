import { queryOptions } from "@tanstack/react-query";
import { getTypes } from "./service";
import type { TypeFilters } from "./types";

export const typeKeys = {
  all: ["type"] as const,
  list: (filters: TypeFilters) => [...typeKeys.all, "list", filters],
  details: (id: string) => [...typeKeys.all, id] as const,
};

export const typesQueryOptions = (filters: TypeFilters) =>
  queryOptions({
    queryKey: typeKeys.list(filters),
    queryFn: () => getTypes({ data: filters }),
  });
