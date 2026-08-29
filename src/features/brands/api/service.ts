import { ensureSession } from "@/lib/auth/functions";
import { db } from "@/lib/db";
import { brand } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { searchFiltersSchema } from "@/features/common";

export const getBrands = createServerFn({ method: "GET" })
  .validator(searchFiltersSchema)
  .handler(async ({ data: { page, limit, search, sort } }) => {
    const { user } = await ensureSession();

    // userId comes from the session, never from anything the client sent.
    const where = and(
      eq(brand.userId, user.id),
      search ? ilike(brand.name, `%${search}%`) : undefined,
    );

    const [rows, totals] = await Promise.all([
      db.query.brand.findMany({
        where,
        // ids only: enough to count without hauling every item row back.
        with: { items: { columns: { id: true } } },
        limit,
        offset: (page - 1) * limit,
        orderBy: sort === "name" ? asc(brand.name) : desc(brand.createdAt),
      }),
      db.select({ value: count() }).from(brand).where(where),
    ]);

    const total = totals[0]?.value ?? 0;

    return {
      brands: rows.map(({ items, ...rest }) => ({
        ...rest,
        itemCount: items.length,
      })),
      total,
      page,
      limit,
      pageCount: Math.max(1, Math.ceil(total / limit)),
    };
  });
