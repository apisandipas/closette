import { db } from "@/lib/db";
import { itemType } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { searchFiltersSchema } from "@/features/common";
import { ensureSession } from "@/lib/auth/functions";
import { insertTypeSchema, selectTypeSchema, updateTypeSchema } from "./types";
import { z } from "zod";

export const getTypes = createServerFn({ method: "GET" })
  .validator(searchFiltersSchema)
  .handler(async ({ data: { page, limit, search, sort } }) => {
    const { user } = await ensureSession();

    // userId comes from the session, never from anything the client sent.
    const where = and(
      eq(itemType.userId, user.id),
      search ? ilike(itemType.name, `%${search}%`) : undefined,
    );

    const [rows, totals] = await Promise.all([
      db.query.itemType.findMany({
        where,
        // ids only: enough to count without hauling every item row back.
        with: { items: { columns: { id: true } } },
        limit,
        offset: (page - 1) * limit,
        orderBy:
          sort === "name" ? asc(itemType.name) : desc(itemType.createdAt),
      }),
      db.select({ value: count() }).from(itemType).where(where),
    ]);

    const total = totals[0]?.value ?? 0;

    return {
      types: rows.map(({ items, ...rest }) => ({
        ...rest,
        itemCount: items.length,
      })),
      total,
      page,
      limit,
      pageCount: Math.max(1, Math.ceil(total / limit)),
    };
  });

export const getType = createServerFn({ method: "GET" })
  .validator(selectTypeSchema.pick({ id: true }))
  .handler(async ({ data: { id } }) => {
    const { user } = await ensureSession();

    const where = and(eq(itemType.id, id), eq(itemType.userId, user.id));

    const selected = await db.query.itemType.findFirst({
      where,
    });

    if (!selected) throw new Error("Type option now found");

    return { type: selected };
  });

export const createType = createServerFn({ method: "POST" })
  .validator(insertTypeSchema)
  .handler(async ({ data }) => {
    const { user } = await ensureSession();

    const [created] = await db
      .insert(itemType)
      .values({ ...data, userId: user.id })
      .returning();

    if (!created) throw new Error("Type option not created");

    return { type: created };
  });

export const updateType = createServerFn({ method: "POST" })
  .validator(updateTypeSchema)
  .handler(async ({ data }) => {
    const { user } = await ensureSession();

    const where = and(eq(itemType.id, data.id), eq(itemType.userId, user.id));

    const [updated] = await db
      .update(itemType)
      .set(data)
      .where(where)
      .returning();

    if (!updated) throw new Error("Type option not updated");

    return { type: updated };
  });

export const deleteType = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data: { id } }) => {
    const { user } = await ensureSession();

    const where = and(eq(itemType.id, id), eq(itemType.userId, user.id));

    const [deleted] = await db
      .delete(itemType)
      .where(where)
      .returning({ id: itemType.id });

    if (!deleted) throw new Error("Type option not deleted");

    return { id: deleted };
  });
