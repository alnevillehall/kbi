import { z } from "zod";

const requiredText = (label: string, maxLength: number) =>
  z
    .string({ error: `${label} is required.` })
    .trim()
    .min(1, `${label} is required.`)
    .max(maxLength, `${label} must be ${maxLength} characters or fewer.`);

const optionalText = (label: string, maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `${label} must be ${maxLength} characters or fewer.`)
    .optional();

const email = z
  .string({ error: "Email is required." })
  .trim()
  .min(1, "Email is required.")
  .email("Enter a valid email address.")
  .max(254, "Email must be 254 characters or fewer.")
  .transform((value) => value.toLowerCase());

const phone = requiredText("Phone or WhatsApp number", 40).refine(
  (value) => value.replace(/\D/g, "").length >= 7,
  "Enter a valid phone or WhatsApp number.",
);

const consent = z.literal(true, {
  error: "You must agree to be contacted about your application.",
});

/**
 * The form schemas intentionally validate only each flow's public `data`
 * object. Spam-control fields belong to the API request envelope instead.
 */
export const customerSchema = z
  .object({
    email,
    location: optionalText("City or parish", 120),
  })
  .strict();

export const restaurantSchema = z
  .object({
    businessName: requiredText("Restaurant or business name", 160),
    contactName: requiredText("Contact person", 120),
    email,
    phone,
    location: requiredText("Location", 160),
    cuisine: requiredText("Cuisine type", 100),
    locationCount: z.coerce
      .number({ error: "Enter the number of locations." })
      .int("Number of locations must be a whole number.")
      .min(1, "Number of locations must be at least 1.")
      .max(1_000, "Number of locations must be 1,000 or fewer."),
    deliverySetup: requiredText("Current delivery setup", 200),
    message: optionalText("Message", 1_000),
    consent,
  })
  .strict();

export const driverSchema = z
  .object({
    fullName: requiredText("Full name", 120),
    email,
    phone,
    location: requiredText("Parish or city", 120),
    vehicleType: requiredText("Vehicle type", 80),
    licenceStatus: requiredText("Driver's licence status", 100),
    availability: requiredText("Availability", 160),
    consent,
  })
  .strict();

export type InterestType = "customer" | "restaurant" | "driver";

export type CustomerFormData = z.infer<typeof customerSchema>;
export type RestaurantFormData = z.infer<typeof restaurantSchema>;
export type DriverFormData = z.infer<typeof driverSchema>;

export type InterestDataByType = {
  customer: CustomerFormData;
  restaurant: RestaurantFormData;
  driver: DriverFormData;
};

export type ValidatedInterestSubmission = {
  [Type in InterestType]: {
    type: Type;
    data: InterestDataByType[Type];
  };
}[InterestType];
