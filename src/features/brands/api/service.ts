import { ensureSession } from "@/lib/auth/functions";
import { db } from "@/lib/db";
import { brand } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { searchFiltersSchema } from "@/features/common";
import {
  insertBrandSchema,
  selectBrandSchema,
  updateBrandSchema,
} from "./types";
import { z } from "zod";

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

export const getBrand = createServerFn({ method: "GET" })
  .validator(selectBrandSchema.pick({ id: true }))
  .handler(async ({ data: { id } }) => {
    const { user } = await ensureSession();
    const selected = await db.query.brand.findFirst({
      where: and(eq(brand.id, id), eq(brand.userId, user.id)),
    });
    if (!selected) throw new Error("Brand not found");

    return { brand: selected };
  });

export const createBrand = createServerFn({ method: "POST" })
  .validator(insertBrandSchema)
  .handler(async ({ data }) => {
    const { user } = await ensureSession();

    const [created] = await db
      .insert(brand)
      .values({ ...data, userId: user.id })
      .returning();

    if (!created) throw new Error("Brand not created");

    return { brand: created };
  });

export const updateBrand = createServerFn({ method: "POST" })
  .validator(updateBrandSchema)
  .handler(async ({ data: { id, ...changes } }) => {
    const { user } = await ensureSession();
    const [updated] = await db
      .update(brand)
      .set(changes)
      .where(and(eq(brand.id, id), eq(brand.userId, user.id)))
      .returning();

    if (!updated) throw new Error("Brand not updated");

    return updated;
  });

export const deleteBrand = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ data: { id } }) => {
    const { user } = await ensureSession();
    const [deleted] = await db
      .delete(brand)
      .where(and(eq(brand.id, id), eq(brand.userId, user.id)))
      .returning({ id: brand.id });

    if (!deleted) throw new Error("Brand not found");

    return { id: deleted.id };
  });
