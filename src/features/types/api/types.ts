import { itemType } from "@/lib/db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export type Type = typeof itemType.$inferSelect;
export type NewType = typeof itemType.$inferInsert;

export type TypesWithItemCount = Type & { itemCount: number };

export const insertTypeSchema = createInsertSchema(itemType);
export const selectTypeSchema = createSelectSchema(itemType);
export const updateTypeSchema = createUpdateSchema(itemType);
