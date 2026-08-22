import { db } from "@/lib/db";
import { item } from "@/lib/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { asc, desc, ilike } from "drizzle-orm";
import { itemsSearchSchema } from "./types";

export const getItems = createServerFn({ method: "GET" })
  .inputValidator(itemsSearchSchema)
  .handler(async ({ data: { page, limit, search, sort } }) => {
    return db.query.item.findMany({
      where: search ? ilike(item.name, `%${search}%`) : undefined,
      limit,
      offset: (page - 1) * limit,
      orderBy: sort === "name" ? asc(item.name) : desc(item.createdAt),
    });
  });
