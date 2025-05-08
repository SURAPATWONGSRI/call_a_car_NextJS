CREATE TYPE "public"."reservation_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed');--> statement-breakpoint
CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"phone" varchar(20),
	"active" boolean DEFAULT true,
	"image_url" varchar(255),
	"created_at" timestamp DEFAULT (NOW() AT TIME ZONE 'Asia/Bangkok') NOT NULL,
	"updated_at" timestamp DEFAULT (NOW() AT TIME ZONE 'Asia/Bangkok') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"phone" varchar(20),
	"active" boolean DEFAULT true,
	"image_url" varchar(255),
	"created_at" timestamp DEFAULT (NOW() AT TIME ZONE 'Asia/Bangkok') NOT NULL,
	"updated_at" timestamp DEFAULT (NOW() AT TIME ZONE 'Asia/Bangkok') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"reserved_by_name" varchar(100) NOT NULL,
	"date" timestamp NOT NULL,
	"time_start" varchar(10) NOT NULL,
	"time_end" varchar(10) NOT NULL,
	"purpose" text,
	"pickup_location" text,
	"dropoff_location" text,
	"vehicle_id" integer,
	"driver_id" integer,
	"passenger_count" integer,
	"passenger_info" text,
	"status" "reservation_status" DEFAULT 'pending' NOT NULL,
	"image_url" varchar(255),
	"created_at" timestamp DEFAULT (NOW() AT TIME ZONE 'Asia/Bangkok') NOT NULL,
	"updated_at" timestamp DEFAULT (NOW() AT TIME ZONE 'Asia/Bangkok') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" serial PRIMARY KEY NOT NULL,
	"license_plate" varchar(20) NOT NULL,
	"brand" varchar(50) NOT NULL,
	"type" varchar(50) NOT NULL,
	"active" boolean DEFAULT true,
	"image_url" varchar(255),
	"created_at" timestamp DEFAULT (NOW() AT TIME ZONE 'Asia/Bangkok') NOT NULL,
	"updated_at" timestamp DEFAULT (NOW() AT TIME ZONE 'Asia/Bangkok') NOT NULL,
	CONSTRAINT "vehicles_license_plate_unique" UNIQUE("license_plate")
);
--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;