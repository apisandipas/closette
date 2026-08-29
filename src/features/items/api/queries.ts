import { queryOptions } from "@tanstack/react-query";
import { getItems, getItem, getItemFormOptions } from "./service";
import { Filters, makeKeys } from "@/features/common";

export const itemKeys = makeKeys("item");

export const itemsQueryOptions = (filters: Filters) =>
  queryOptions({
    queryKey: itemKeys.list(filters),
    queryFn: () => getItems({ data: filters }),
  });

export const itemQueryOptions = (id: string) =>
  queryOptions({
    queryKey: itemKeys.detail(id),
    queryFn: () => getItem({ data: { id } }),
  });

export const itemFormOptionsOptions = () =>
  queryOptions({
    queryKey: ["itemFormOptions"],
    queryFn: () => getItemFormOptions(),
  });

