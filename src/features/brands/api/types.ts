
import { brand } from "@/lib/db/schema";
import { z } from "zod";

export type Brand = typeof brand.$inferSelect;
export type NewBrand = typeof brand.$inferInsert;

// What getClosets returns per row: the closet plus how many items it holds.
export type BrandWithItemCount = Brand & { itemCount: number };

export const brandSearchSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export type BrandFilters = z.infer<typeof brandSearchSchema>;
