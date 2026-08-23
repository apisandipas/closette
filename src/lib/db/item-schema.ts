import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export const closet = pgTable(
  "closets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("closets_userId_idx").on(table.userId)],
);

export const brand = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

export const itemType = pgTable("types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

export const item = pgTable(
  "items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    image: text("image"),
    year: integer("year").default(1959).notNull(),
    quantity: integer("quantity").default(1).notNull(),
    closetId: uuid("closet_id").references(() => closet.id, {
      onDelete: "set null",
    }),
    typeId: uuid("type_id").references(() => itemType.id, {
      onDelete: "set null",
    }),
    brandId: uuid("brand_id").references(() => brand.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("items_userId_idx").on(table.userId),
    index("items_closetId_idx").on(table.closetId),
    index("items_typeId_idx").on(table.typeId),
    index("items_brandId_idx").on(table.brandId),
  ],
);

export const closetRelations = relations(closet, ({ one, many }) => ({
  user: one(user, {
    fields: [closet.userId],
    references: [user.id],
  }),
  items: many(item),
}));

export const itemRelations = relations(item, ({ one }) => ({
  user: one(user, {
    fields: [item.userId],
    references: [user.id],
  }),
  closet: one(closet, {
    fields: [item.closetId],
    references: [closet.id],
  }),
  type: one(itemType, {
    fields: [item.typeId],
    references: [itemType.id],
  }),
  brand: one(brand, {
    fields: [item.brandId],
    references: [brand.id],
  }),
}));

export const brandRelations = relations(brand, ({ many }) => ({
  items: many(item),
}));

export const itemTypeRelations = relations(itemType, ({ many }) => ({
  items: many(item),
}));
