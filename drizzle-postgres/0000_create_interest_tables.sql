-- Initial Neon schema for KBI interest submissions and rate limits.
CREATE TABLE "interest_rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"window_start" bigint NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interest_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"email" text NOT NULL,
	"location" text,
	"business_name" text,
	"contact_name" text,
	"phone" text,
	"cuisine" text,
	"location_count" integer,
	"delivery_setup" text,
	"message" text,
	"full_name" text,
	"vehicle_type" text,
	"licence_status" text,
	"availability" text,
	"consent" integer,
	"created_at" text NOT NULL,
	CONSTRAINT "interest_submissions_type_check" CHECK ("interest_submissions"."type" IN ('customer', 'restaurant', 'driver'))
);
--> statement-breakpoint
CREATE INDEX "interest_rate_limits_window_start_idx" ON "interest_rate_limits" USING btree ("window_start");
