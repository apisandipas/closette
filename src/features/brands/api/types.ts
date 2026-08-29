import { brand } from "@/lib/db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export type Brand = typeof brand.$inferSelect;
export type NewBrand = typeof brand.$inferInsert;

export type BrandWithItemCount = Brand & { itemCount: number };

export const insertBrandSchema = createInsertSchema(brand);
export const selectBrandSchema = createSelectSchema(brand);
export const updateBrandSchema = createUpdateSchema(brand);
