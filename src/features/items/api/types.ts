import { item } from "@/lib/db/schema";
import { z } from "zod";

export type Item = typeof item.$inferSelect;
export type NewItem = typeof item.$inferInsert;

export const itemsSearchSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export type ItemFilters = z.infer<typeof itemsSearchSchema>;
