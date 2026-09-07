ALTER TABLE "brands" DROP CONSTRAINT "brands_name_unique";--> statement-breakpoint
ALTER TABLE "types" DROP CONSTRAINT "types_name_unique";--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_userId_name_unique" UNIQUE("user_id","name");--> statement-breakpoint
ALTER TABLE "types" ADD CONSTRAINT "types_userId_name_unique" UNIQUE("user_id","name");