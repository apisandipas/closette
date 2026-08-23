
import { db } from "@/lib/db";
import { closet } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { typeSearchSchema } from "./types";
import { ensureSession } from "@/lib/auth/functions";

export const getTypes = createServerFn({ method: "GET" })
  .validator(typeSearchSchema)
  .handler(async ({ data: { page, limit, search, sort } }) => {
    const { user } = await ensureSession();

    // userId comes from the session, never from anything the client sent.
    const where = and(
      eq(closet.userId, user.id),
      search ? ilike(closet.name, `%${search}%`) : undefined,
    );

    const [rows, totals] = await Promise.all([
      db.query.itemType.findMany({
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
