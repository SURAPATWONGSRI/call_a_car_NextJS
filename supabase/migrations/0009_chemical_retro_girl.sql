ALTER TABLE "session" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" SET DEFAULT (NOW() AT TIME ZONE 'Asia/Bangkok');--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DEFAULT (NOW() AT TIME ZONE 'Asia/Bangkok');--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET NOT NULL;