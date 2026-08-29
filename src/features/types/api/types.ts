import { itemType } from "@/lib/db/schema";
import { z } from "zod";

export type Type = typeof itemType.$inferSelect;
export type NewType = typeof itemType.$inferInsert;

// What getClosets returns per row: the closet plus how many items it holds.
export type TypesWithItemCount = Type & { itemCount: number };

export const typeSearchSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export type TypeFilters = z.infer<typeof typeSearchSchema>;
