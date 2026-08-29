import { closet } from "@/lib/db/schema";
import { z } from "zod";

export type Closet = typeof closet.$inferSelect;
export type NewCloset = typeof closet.$inferInsert;

// What getClosets returns per row: the closet plus how many items it holds.
export type ClosetWithItemCount = Closet & { itemCount: number };

export const closetSearchSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export type ClosetFilters = z.infer<typeof closetSearchSchema>;
