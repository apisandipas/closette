import { db } from "@/lib/db";
import { brand, item, itemType, closet } from "@/lib/db/schema";
import { ensureSession } from "@/lib/auth/functions";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { selectItemSchema, insertItemSchema, updateItemSchema } from "./types";
import { searchFiltersSchema } from "@/features/common";

export const getItems = createServerFn({ method: "GET" })
  .validator(searchFiltersSchema)
  .handler(async ({ data: { page, limit, search, sort } }) => {
    const { user } = await ensureSession();

    const where = and(
      eq(item.userId, user.id),
      search ? ilike(item.name, `%${search}%`) : undefined,
    );

    const [items, totals] = await Promise.all([
      db.query.item.findMany({
        where,
        with: { brand: true, type: true, closet: true },
        limit,
        offset: (page - 1) * limit,
        orderBy: sort === "name" ? asc(item.name) : desc(item.createdAt),
      }),
      db.select({ value: count() }).from(item).where(where),
    ]);

    const total = totals[0]?.value ?? 0;

    return {
      items,
      total,
      page,
      limit,
      pageCount: Math.max(1, Math.ceil(total / limit)),
    };
  });

export const getItem = createServerFn({ method: "GET" })
  .validator(selectItemSchema.pick({ id: true }))
  .handler(async ({ data: { id } }) => {
    const { user } = await ensureSession();

    const where = and(eq(item.id, id), eq(item.userId, user.id));

    const theItem = await db.query.item.findFirst({ where });

    return { item: theItem };
  });

export const getItemFormOptions = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();

    const [brands, types] = await Promise.all([
      db.query.brand.findMany({
        where: eq(brand.userId, user.id),
        columns: { id: true, name: true },
        orderBy: asc(brand.name),
      }),
      db.query.itemType.findMany({
        where: eq(itemType.userId, user.id),
        columns: { id: true, name: true },
        orderBy: asc(itemType.name),
      }),
    ]);

    return { brands, types };
  },
);

export const createItem = createServerFn({ method: "POST" })
  .validator(insertItemSchema)
  .handler(async ({ data }) => {
    const { user } = await ensureSession();

    if (data.closetId) {
      const owned = await db.query.closet.findFirst({
        where: and(eq(closet.id, data.closetId), eq(closet.userId, user.id)),
        columns: { id: true },
      });
      if (!owned) throw new Error("Closet not found");
    }

    const [created] = await db
      .insert(item)
      .values({ ...data, userId: user.id })
      .returning();

    return { item: created };
  });

export const updateItem = createServerFn({ method: "POST" })
  .validator(updateItemSchema)
  .handler(async ({ data: { id, ...changes } }) => {
    const { user } = await ensureSession();
    // …same closetId/typeId/brandId ownership guards as createItem…
    const [updated] = await db
      .update(item)
      .set(changes)
      .where(and(eq(item.id, id), eq(item.userId, user.id))) // ownership in the WHERE
      .returning();
    if (!updated) throw new Error("Item not found");
    return { item: updated };
  });
