import { z } from "zod";

export const searchFiltersSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export type Filters = z.infer<typeof searchFiltersSchema>;

export const makeKeys = (name: string) => {
  // https://tkdodo.eu/blog/effective-react-query-keys
  const keys = {
    all: [name] as const,
    lists: () => [...keys.all, "list"] as const,
    list: (filters: Filters) => [...keys.lists(), filters] as const,
    details: () => [...keys.all, "details"] as const,
    detail: (id: string) => [...keys.details(), id] as const,
  };
  return keys;
};
