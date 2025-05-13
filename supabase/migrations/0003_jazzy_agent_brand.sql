ALTER TABLE "customers" ALTER COLUMN "phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" DROP COLUMN "image_url";--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_phone_unique" UNIQUE("phone");