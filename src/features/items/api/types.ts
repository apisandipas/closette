import { brand, closet, item, itemType } from "@/lib/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export type Item = typeof item.$inferSelect;
export type NewItem = typeof item.$inferInsert;

// What getItems actually returns per row: the item plus its `with` relations.
export type ItemWithRelations = Item & {
  brand: typeof brand.$inferSelect | null;
  type: typeof itemType.$inferSelect | null;
  closet: typeof closet.$inferSelect | null;
};

export const insertItemSchema = createInsertSchema(item).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const selectItemSchema = createSelectSchema(item, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// export const updateItemSchema = createUpdateSchema(item);
export const updateItemSchema = insertItemSchema
  .partial()
  .extend({ id: z.string() });

export const itemFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brandId: z.string(), // "" = none selected
  typeId: z.string(),
  closetId: z.string(),
  quantity: z.number().int().min(0),
  year: z.number().int().min(1900).max(2100),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;
