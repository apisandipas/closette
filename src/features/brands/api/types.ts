import { brand } from "@/lib/db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
export type Brand = typeof brand.$inferSelect;
export type NewBrand = typeof brand.$inferInsert;

export type BrandWithItemCount = Brand & { itemCount: number };

export const insertBrandSchema = createInsertSchema(brand).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
export const selectBrandSchema = createSelectSchema(brand);

export const updateBrandSchema = createUpdateSchema(brand)
  .partial()
  .extend({ id: z.string() });

export const brandFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;
