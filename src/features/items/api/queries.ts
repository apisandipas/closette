import { queryOptions } from "@tanstack/react-query";
import { getItems, getItem, getItemFormOptions } from "./service";
import type { ItemFilters } from "./types";

export const itemKeys = {
  all: ["items"] as const,
  list: (filters: ItemFilters) => [...itemKeys.all, "list", filters],
  details: (id: string) => [...itemKeys.all, id] as const,
};

export const itemsQueryOptions = (filters: ItemFilters) =>
  queryOptions({
    queryKey: itemKeys.list(filters),
    queryFn: () => getItems({ data: filters }),
  });

export const itemQueryOptions = (id: string) =>
  queryOptions({
    queryKey: itemKeys.details(id),
    queryFn: () => getItem({ data: { id } })
  })

export const itemFormOptionsOptions = () => queryOptions({
  queryKey: ['itemFormOptions'],
  queryFn: () => getItemFormOptions()
})