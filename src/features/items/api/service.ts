import { db } from "@/lib/db";
import { item } from "@/lib/db/schema";
import { ensureSession } from "@/lib/auth/functions";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { itemsSearchSchema } from "./types";

export const getItems = createServerFn({ method: "GET" })
  .inputValidator(itemsSearchSchema)
  .handler(async ({ data: { page, limit, search, sort } }) => {
    const { user } = await ensureSession();

    // Ownership lives on the item, so an item needs no closet to show up.
    // userId comes from the session, never from anything the client sent.
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
