import { queryOptions } from "@tanstack/react-query";
import { getBrand, getBrands } from "./service";
import { makeKeys, type Filters } from "@/features/common";

export const brandKeys = makeKeys("brand");

export const brandsQueryOptions = (filters: Filters) =>
  queryOptions({
    queryKey: brandKeys.list(filters),
    queryFn: () => getBrands({ data: filters }),
  });

export const brandQueryOptions = (id: string) =>
  queryOptions({
    queryKey: brandKeys.detail(id),
    queryFn: () => getBrand({ data: { id } }),
  });
