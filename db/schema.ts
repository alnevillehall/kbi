import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Migration representation of the table also created defensively by the
 * runtime submission service. Only initial-contact fields are stored.
 */
export const interestSubmissions = sqliteTable("interest_submissions", {
  id: text("id").primaryKey(),
  type: text("type", {
    enum: ["customer", "restaurant", "driver"],
  }).notNull(),
  email: text("email").notNull(),
  location: text("location"),
  businessName: text("business_name"),
  contactName: text("contact_name"),
  phone: text("phone"),
  cuisine: text("cuisine"),
  locationCount: integer("location_count"),
  deliverySetup: text("delivery_setup"),
  message: text("message"),
  fullName: text("full_name"),
  vehicleType: text("vehicle_type"),
  licenceStatus: text("licence_status"),
  availability: text("availability"),
  consent: integer("consent", { mode: "boolean" }),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const interestRateLimits = sqliteTable("interest_rate_limits", {
  key: text("key").primaryKey(),
  windowStart: integer("window_start").notNull(),
  count: integer("count").notNull().default(1),
  updatedAt: text("updated_at").notNull(),
});
