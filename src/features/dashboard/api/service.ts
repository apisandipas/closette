import { ensureSession } from "@/lib/auth/functions";
import { db } from "@/lib/db";
import { brand, closet, itemType } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, desc, eq, inArray, isNotNull } from "drizzle-orm";
import { item } from "@/lib/db/schema";
import { presignDownload } from "@/lib/storage";
import { dashboardFiltersSchema } from "./types";
import { colorFamilies as allColorFamilies } from "@/lib/color";

export const getDashboardFilters = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();

    const [brands, types, closetNames, families] = await Promise.all([
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
      db
        .selectDistinct({ family: item.colorFamily })
        .from(item)
        .where(and(eq(item.userId, user.id), isNotNull(item.colorFamily))),
    ]);

    return {
      brands: brands.map(({ name }) => name),
      types: types.map(({ name }) => name),
      closetNames: closetNames.map(({ name }) => name),
      colorFamilies: allColorFamilies.filter((f) =>
        families.some(({ family }) => family === f),
      ),
    };
  },
);

export const getDashboardItems = createServerFn({ method: "GET" })
  .validator(dashboardFiltersSchema)
  .handler(async ({ data: { brands, types, closetNames, colorFamilies } }) => {
    const { user } = await ensureSession();

    const where = and(
      eq(item.userId, user.id),
      brands.length
        ? inArray(
            item.brandId,
            db
              .select({ id: brand.id })
              .from(brand)
              .where(
                and(eq(brand.userId, user.id), inArray(brand.name, brands)),
              ),
          )
        : undefined,
      types.length
        ? inArray(
            item.typeId,
            db
              .select({ id: itemType.id })
              .from(itemType)
              .where(
                and(
                  eq(itemType.userId, user.id),
                  inArray(itemType.name, types),
                ),
              ),
          )
        : undefined,
      closetNames.length
        ? inArray(
            item.closetId,
            db
              .select({ id: closet.id })
              .from(closet)
              .where(
                and(
                  eq(closet.userId, user.id),
                  inArray(closet.name, closetNames),
                ),
              ),
          )
        : undefined,
      colorFamilies.length
        ? inArray(item.colorFamily, colorFamilies)
        : undefined,
    );

    // ponytail: loads every matching item; add page/limit when a closet passes a few hundred
    const rows = await db.query.item.findMany({
      where,
      with: { brand: true, type: true, closet: true },
      orderBy: desc(item.createdAt),
    });

    return Promise.all(
      rows.map(async (row) => ({
        ...row,
        imageUrl: row.image ? await presignDownload(row.image) : null,
      })),
    );
  });

export type DashboardItem = Awaited<
  ReturnType<typeof getDashboardItems>
>[number];
