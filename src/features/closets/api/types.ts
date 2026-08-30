import { closet } from "@/lib/db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

export type Closet = typeof closet.$inferSelect;
export type NewCloset = typeof closet.$inferInsert;

// What getClosets returns per row: the closet plus how many items it holds.
export type ClosetWithItemCount = Closet & { itemCount: number };

export const insertClosetSchema = createInsertSchema(closet).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
export const selectClosetSchema = createSelectSchema(closet);
export const updateClosetSchema = createUpdateSchema(closet)
  .partial()
  .extend({ id: z.string() });

export const closetFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type ClosetFormValues = z.infer<typeof closetFormSchema>;
