import { db } from "@/lib/db";
import { itemType } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { searchFiltersSchema } from "@/features/common";
import { ensureSession } from "@/lib/auth/functions";

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
