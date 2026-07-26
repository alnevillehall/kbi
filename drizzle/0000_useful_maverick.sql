CREATE TABLE `interest_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`email` text NOT NULL,
	`location` text,
	`business_name` text,
	`contact_name` text,
	`phone` text,
	`cuisine` text,
	`location_count` integer,
	`delivery_setup` text,
	`message` text,
	`full_name` text,
	`vehicle_type` text,
	`licence_status` text,
	`availability` text,
	`consent` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
