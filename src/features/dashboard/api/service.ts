import { ensureSession } from "@/lib/auth/functions";
import { db } from "@/lib/db";
import { brand, closet, itemType } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";

export const getDashboardFilters = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();

    const [brands, types, closetNames] = await Promise.all([
      db.query.brand.findMany({
        columns: { name: true },
        where: eq(brand.userId, user.id),
        orderBy: asc(brand.name),
      }),
      db.query.itemType.findMany({
        columns: { name: true },
        where: eq(itemType.userId, user.id),
        orderBy: asc(itemType.name),
      }),
      db.query.closet.findMany({
        columns: { name: true },
        where: eq(closet.userId, user.id),
        orderBy: asc(closet.name),
      }),
    ]);

    return {
      brands: brands.map(({ name }) => name),
      types: types.map(({ name }) => name),
      closetNames: closetNames.map(({ name }) => name),
    };
  },
);
