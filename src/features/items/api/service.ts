import { db } from "@/lib/db";
import { brand, item, itemType, closet } from "@/lib/db/schema";
import { ensureSession } from "@/lib/auth/functions";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { selectItemSchema, insertItemSchema, updateItemSchema } from "./types";
import { z } from "zod";
import {
  ALLOWED_IMAGE_TYPES,
  buildImageKey,
  ownsKey,
} from "@/lib/storage/constants";
import {
  deleteImage,
  presignDownload,
  presignUpload,
  verifyUpload,
} from "@/lib/storage";
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

    const signed = await Promise.all(
      items.map(async (row) => ({
        ...row,
        imageUrl: row.image ? await presignDownload(row.image) : null,
      })),
    );

    const total = totals[0]?.value ?? 0;

    return {
      items: signed,
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

    if (!theItem) return { item: undefined };

    return {
      item: {
        ...theItem,
        imageUrl: theItem.image ? await presignDownload(theItem.image) : null,
      },
    };
  });

export const getItemFormOptions = createServerFn({ method: "GET" }).handler(
  async () => {
    const { user } = await ensureSession();

    const [brands, types, closets] = await Promise.all([
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
      db.query.closet.findMany({
        where: eq(closet.userId, user.id),
        columns: { id: true, name: true },
        orderBy: asc(closet.name),
      }),
    ]);

    return { brands, types, closets };
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

    // Never trust a key from the client. It must sit under this user's prefix
    // and point at a real object of sane size and type.
    if (data.image) {
      if (!ownsKey(user.id, data.image)) throw new Error("Invalid image");
      if (!(await verifyUpload(data.image))) throw new Error("Invalid image");
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

    // Never trust a key from the client. It must sit under this user's prefix
    // and point at a real object of sane size and type.
    if (changes.image) {
      if (!ownsKey(user.id, changes.image)) throw new Error("Invalid image");
      if (!(await verifyUpload(changes.image)))
        throw new Error("Invalid image");
    }

    const previous = await db.query.item.findFirst({
      where: and(eq(item.id, id), eq(item.userId, user.id)),
      columns: { image: true },
    });

    const [updated] = await db
      .update(item)
      .set(changes)
      .where(and(eq(item.id, id), eq(item.userId, user.id)))
      .returning();

    if (!updated) throw new Error("Item not found");

    // The old object is unreferenced now. A failed cleanup must not fail the
    // request — the lifecycle rule sweeps up whatever leaks.
    if (previous?.image && previous.image !== updated.image) {
      await deleteImage(previous.image).catch(() => {});
    }

    return { item: updated };
  });

export const deleteItem = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().uuid(),
    }),
  )
  .handler(async ({ data: { id } }) => {
    const { user } = await ensureSession();

    const [deleted] = await db
      .delete(item)
      .where(and(eq(item.id, id), eq(item.userId, user.id)))
      .returning({ id: item.id, image: item.image });

    if (!deleted) throw new Error("Item not found");
    if (deleted.image) await deleteImage(deleted.image).catch(() => {});

    if (!deleted) throw new Error("Item not found");
    return { id: deleted.id };
  });

export const createUploadUrl = createServerFn({ method: "POST" })
  .validator(z.object({ contentType: z.enum(ALLOWED_IMAGE_TYPES) }))
  .handler(async ({ data: { contentType } }) => {
    const { user } = await ensureSession();

    const key = buildImageKey(user.id, contentType);
    const url = await presignUpload(key, contentType);

    return { key, url };
  });
