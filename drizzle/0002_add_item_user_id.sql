-- Items now belong to a user directly; a closet is optional filing.
-- Added nullable first so the existing rows can be backfilled before the
-- NOT NULL constraint goes on.
ALTER TABLE "items" ADD COLUMN "user_id" text;--> statement-breakpoint
UPDATE "items" SET "user_id" = (SELECT "id" FROM "user" ORDER BY "created_at" ASC LIMIT 1) WHERE "user_id" IS NULL;--> statement-breakpoint
ALTER TABLE "items" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "items_userId_idx" ON "items" USING btree ("user_id");
