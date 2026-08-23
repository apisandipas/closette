import { brand, closet, item, itemType } from "@/lib/db/schema";
import { z } from "zod";

export type Item = typeof item.$inferSelect;
export type NewItem = typeof item.$inferInsert;

// What getItems actually returns per row: the item plus its `with` relations.
export type ItemWithRelations = Item & {
  brand: typeof brand.$inferSelect | null;
  type: typeof itemType.$inferSelect | null;
  closet: typeof closet.$inferSelect | null;
};

export const itemsSearchSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export type ItemFilters = z.infer<typeof itemsSearchSchema>;
