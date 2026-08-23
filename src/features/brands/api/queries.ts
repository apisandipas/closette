import { queryOptions } from "@tanstack/react-query";
import { getBrands } from "./service";
import type { BrandFilters } from "./types";

export const brandKeys = {
  all: ["brand"] as const,
  list: (filters: BrandFilters) => [...brandKeys.all, "list", filters],
  details: (id: string) => [...brandKeys.all, id] as const,
};

export const brandsQueryOptions = (filters: BrandFilters) =>
  queryOptions({
    queryKey: brandKeys.list(filters),
    queryFn: () => getBrands({ data: filters }),
  });
