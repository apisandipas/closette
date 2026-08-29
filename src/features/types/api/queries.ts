import { queryOptions } from "@tanstack/react-query";
import { getTypes } from "./service";
import { makeKeys, type Filters } from "@/features/common";

export const typeKeys = makeKeys("type");

export const typesQueryOptions = (filters: Filters) =>
  queryOptions({
    queryKey: typeKeys.list(filters),
    queryFn: () => getTypes({ data: filters }),
  });
