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
  imageUrl: string | null;
};

const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/)
  .or(z.literal(""));

export const insertItemSchema = createInsertSchema(item)
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    color: hexColorSchema,
  });

export const selectItemSchema = createSelectSchema(item, {
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// export const updateItemSchema = createUpdateSchema(item);
export const updateItemSchema = insertItemSchema.partial().extend({
  id: z.string().uuid(),
  color: hexColorSchema,
});

export const itemFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brandId: z.string(),
  typeId: z.string(),
  closetId: z.string(),
  quantity: z.number().int().min(0),
  color: z.string(),
  year: z.number().int().min(1900).max(2100),
  image: z.string(),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;
