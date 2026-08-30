import { ensureSession } from "@/lib/auth/functions";
import { db } from "@/lib/db";
import { closet } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { searchFiltersSchema } from "@/features/common";
import { z } from "zod";
import {
  insertClosetSchema,
  selectClosetSchema,
  updateClosetSchema,
} from "./types";

export const getClosets = createServerFn({ method: "GET" })
  .validator(searchFiltersSchema)
  .handler(async ({ data: { page, limit, search, sort } }) => {
    const { user } = await ensureSession();

    // userId comes from the session, never from anything the client sent.
    const where = and(
      eq(closet.userId, user.id),
      search ? ilike(closet.name, `%${search}%`) : undefined,
    );

    const [rows, totals] = await Promise.all([
      db.query.closet.findMany({
        where,
        // ids only: enough to count without hauling every item row back.
        with: { items: { columns: { id: true } } },
        limit,
        offset: (page - 1) * limit,
        orderBy: sort === "name" ? asc(closet.name) : desc(closet.createdAt),
      }),
      db.select({ value: count() }).from(closet).where(where),
    ]);

    const total = totals[0]?.value ?? 0;

    return {
      closets: rows.map(({ items, ...rest }) => ({
        ...rest,
        itemCount: items.length,
      })),
      total,
      page,
      limit,
      pageCount: Math.max(1, Math.ceil(total / limit)),
    };
  });

export const getCloset = createServerFn({ method: "GET" })
  .validator(selectClosetSchema.pick({ id: true }))
  .handler(async ({ data: { id } }) => {
    const { user } = await ensureSession();

    const where = and(eq(closet.id, id), eq(closet.userId, user.id));

    const selected = await db.query.closet.findFirst({
      where,
    });
    return { closet: selected };
  });

export const createCloset = createServerFn({ method: "POST" })
  .validator(insertClosetSchema)
  .handler(async ({ data }) => {
    const { user } = await ensureSession();

    const [created] = await db
      .insert(closet)
      .values({ ...data, userId: user.id })
      .returning();

    return created;
  });

export const updateCloset = createServerFn({ method: "POST" })
  .validator(updateClosetSchema)
  .handler(async ({ data: { id, ...changes } }) => {
    const { user } = await ensureSession();

    const [updated] = await db
      .update(closet)
      .set(changes)
      .where(and(eq(closet.id, id), eq(closet.userId, user.id)))
      .returning();

    if (!updated) throw new Error("Closet not found");
    return { closet: updated };
  });

export const deleteCloset = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ data: { id } }) => {
    const { user } = await ensureSession();

    const [deleted] = await db
      .delete(closet)
      .where(and(eq(closet.id, id), eq(closet.userId, user.id)))
      .returning({
        id: closet.id,
      });
    if (!deleted) throw new Error("Item not found");
    return { id: deleted.id };
  });
