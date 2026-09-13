CREATE TYPE "public"."color_family" AS ENUM('black', 'white', 'grey', 'brown', 'beige', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink');--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "color_family" "color_family";--> statement-breakpoint
CREATE INDEX "items_colorFamily_idx" ON "items" USING btree ("color_family");