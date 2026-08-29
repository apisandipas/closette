import { db } from "@/lib/db";
import { brand, item, itemType } from "@/lib/db/schema";
import { ensureSession } from "@/lib/auth/functions";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { getItemSchema, itemsSearchSchema } from "./types";

export const getItems = createServerFn({ method: "GET" })
  .validator(itemsSearchSchema)
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
  .validator(getItemSchema)
  .handler(async ({ data: { id } }) => {
    const { user } = await ensureSession();

    const where = and(eq(item.id, id), eq(item.userId, user.id));

    const theItem = await db.query.item.findFirst({ where })

    return { item: theItem };
  });

export const getItemFormOptions = createServerFn({ method: 'GET' })
  .handler(async () => {
    const { user } = await ensureSession()

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
      })
    ])

    return { brands, types }
  })