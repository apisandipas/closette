import type { UserWithRole } from "better-auth/plugins/admin";
import { z } from "zod";
import { ROLES } from "@/lib/auth/roles";

export type User = UserWithRole;

const password = z.string().min(12, "Password must be at least 12 characters");

// Better Auth owns the table, so these are hand-written rather than derived.
export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  role: z.enum(ROLES),
  password,
});
export type UserFormValues = z.infer<typeof createUserSchema>;

// Blank password means "leave it alone".
export const editUserFormSchema: z.ZodType<UserFormValues, UserFormValues> =
  createUserSchema.extend({ password: password.or(z.literal("")) });

export const updateUserSchema = createUserSchema.extend({
  id: z.string().min(1),
  password: password.or(z.literal("")),
});
