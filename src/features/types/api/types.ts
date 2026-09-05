import { itemType } from "@/lib/db/schema";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

export type Type = typeof itemType.$inferSelect;
export type NewType = typeof itemType.$inferInsert;

export type TypesWithItemCount = Type & { itemCount: number };

export const insertTypeSchema = createInsertSchema(itemType).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
export const selectTypeSchema = createSelectSchema(itemType);

export const updateTypeSchema = createUpdateSchema(itemType)
  .omit({ userId: true, createdAt: true, updatedAt: true })
  .partial()
  .extend({ id: z.string().uuid() });

export const typeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type TypeFormValues = z.infer<typeof typeFormSchema>;
