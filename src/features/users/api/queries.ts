import { queryOptions } from "@tanstack/react-query";
import { makeKeys, type Filters } from "@/features/common";
import { getUser, getUsers } from "./service";

export const userKeys = makeKeys("user");

export const usersQueryOptions = (filters: Filters) =>
  queryOptions({
    queryKey: userKeys.list(filters),
    queryFn: () => getUsers({ data: filters }),
  });

export const userQueryOptions = (id: string) =>
  queryOptions({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser({ data: { id } }),
  });
