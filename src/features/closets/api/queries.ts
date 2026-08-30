import { queryOptions } from "@tanstack/react-query";
import { getCloset, getClosets } from "./service";
import { makeKeys, type Filters } from "@/features/common";

export const closetKeys = makeKeys("closet");

export const closetsQueryOptions = (filters: Filters) =>
  queryOptions({
    queryKey: closetKeys.list(filters),
    queryFn: () => getClosets({ data: filters }),
  });

export const closetQueryOptions = (id: string) =>
  queryOptions({
    queryKey: closetKeys.detail(id),
    queryFn: () => getCloset({ data: { id } }),
  });
