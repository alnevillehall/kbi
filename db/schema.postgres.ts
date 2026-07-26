import { sql } from "drizzle-orm";
import {
  bigint,
  check,
  index,
  integer,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

export const interestSubmissions = pgTable(
  "interest_submissions",
  {
    id: text("id").primaryKey(),
    type: text("type").notNull(),
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
    consent: integer("consent"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    check(
      "interest_submissions_type_check",
      sql`${table.type} IN ('customer', 'restaurant', 'driver')`,
    ),
  ],
);

export const interestRateLimits = pgTable(
  "interest_rate_limits",
  {
    key: text("key").primaryKey(),
    windowStart: bigint("window_start", { mode: "number" }).notNull(),
    count: integer("count").notNull().default(1),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    index("interest_rate_limits_window_start_idx").on(table.windowStart),
  ],
);
