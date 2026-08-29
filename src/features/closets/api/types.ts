import { closet } from "@/lib/db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export type Closet = typeof closet.$inferSelect;
export type NewCloset = typeof closet.$inferInsert;

// What getClosets returns per row: the closet plus how many items it holds.
export type ClosetWithItemCount = Closet & { itemCount: number };

export const insertClosetSchema = createInsertSchema(closet);
export const selectClosetSchema = createSelectSchema(closet);
export const updateClosetSchema = createUpdateSchema(closet);
