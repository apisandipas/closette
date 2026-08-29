import { brand, closet, item, itemType } from "@/lib/db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export type Item = typeof item.$inferSelect;
export type NewItem = typeof item.$inferInsert;

// What getItems actually returns per row: the item plus its `with` relations.
export type ItemWithRelations = Item & {
  brand: typeof brand.$inferSelect | null;
  type: typeof itemType.$inferSelect | null;
  closet: typeof closet.$inferSelect | null;
};

export const insertItemSchema = createInsertSchema(item);
export const selectItemSchema = createSelectSchema(item);
export const updateItemSchema = createUpdateSchema(item);
