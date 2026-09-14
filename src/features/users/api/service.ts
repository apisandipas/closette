import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { APIError } from "better-auth";
import { z } from "zod";
import { searchFiltersSchema } from "@/features/common";
import { auth } from "@/lib/auth";
import { createUserSchema, updateUserSchema } from "./types";

// Every call forwards the request cookies; Better Auth's admin plugin then
// requires the caller to hold an admin role.
export const getUsers = createServerFn({ method: "GET" })
  .validator(searchFiltersSchema)
  .handler(async ({ data: { page, limit, search } }) => {
    const { users, total } = await auth.api.listUsers({
      headers: getRequestHeaders(),
      query: {
        limit,
        offset: (page - 1) * limit,
        sortBy: "createdAt",
        sortDirection: "desc",
        ...(search && {
          searchField: "email",
          searchOperator: "contains",
          searchValue: search,
        }),
      },
    });
    return {
      users,
      total,
      page,
      limit,
      pageCount: Math.max(1, Math.ceil(total / limit)),
    };
  });

export const getUser = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data: { id } }) => {
    const found = await auth.api
      .getUser({ headers: getRequestHeaders(), query: { id } })
      .catch((e: unknown) => {
        if (e instanceof APIError && e.status === "NOT_FOUND") return null;
        throw e;
      });
    return { user: found };
  });

export const createUser = createServerFn({ method: "POST" })
  .validator(createUserSchema)
  .handler(async ({ data }) => {
    const { user } = await auth.api.createUser({
      headers: getRequestHeaders(),
      body: data,
    });
    return { user };
  });

export const updateUser = createServerFn({ method: "POST" })
  .validator(updateUserSchema)
  .handler(async ({ data: { id, password, ...changes } }) => {
    const headers = getRequestHeaders();
    const user = await auth.api.adminUpdateUser({
      headers,
      body: { userId: id, data: changes },
    });
    if (password) {
      await auth.api.setUserPassword({
        headers,
        body: { userId: id, newPassword: password },
      });
    }
    return { user };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data: { id } }) => {
    await auth.api.removeUser({
      headers: getRequestHeaders(),
      body: { userId: id },
    });
    return { id };
  });

// Issues a reset token; sendResetPassword in src/lib/auth/index.ts mails it.
export const sendPasswordReset = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.email() }))
  .handler(async ({ data: { email } }) => {
    await auth.api.requestPasswordReset({
      headers: getRequestHeaders(),
      body: { email, redirectTo: "/reset-password" },
    });
    return { email };
  });
