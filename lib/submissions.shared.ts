import type {
  DriverFormData,
  RestaurantFormData,
  ValidatedInterestSubmission,
} from "./forms";

export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1_000;
export const RATE_LIMIT_MAX_REQUESTS = 20;
export const RATE_LIMIT_RETENTION_MS = 24 * RATE_LIMIT_WINDOW_MS;

export interface SubmissionReceipt {
  id: string;
  createdAt: string;
}

export interface SubmissionService {
  create(
    submission: ValidatedInterestSubmission,
    idempotencyKey: string,
  ): Promise<SubmissionReceipt>;
}

export class SubmissionStorageUnavailableError extends Error {
  constructor() {
    super("The submissions database is not configured.");
    this.name = "SubmissionStorageUnavailableError";
  }
}

export class SubmissionRateLimitExceededError extends Error {
  readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super("Too many submission attempts.");
    this.name = "SubmissionRateLimitExceededError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export type StoredFields = {
  email: string;
  location: string | null;
  businessName: string | null;
  contactName: string | null;
  phone: string | null;
  cuisine: string | null;
  locationCount: number | null;
  deliverySetup: string | null;
  message: string | null;
  fullName: string | null;
  vehicleType: string | null;
  licenceStatus: string | null;
  availability: string | null;
  consent: number | null;
};

const emptyStoredFields = (
  email: string,
  location?: string,
): StoredFields => ({
  email,
  location: location || null,
  businessName: null,
  contactName: null,
  phone: null,
  cuisine: null,
  locationCount: null,
  deliverySetup: null,
  message: null,
  fullName: null,
  vehicleType: null,
  licenceStatus: null,
  availability: null,
  consent: null,
});

function restaurantFields(data: RestaurantFormData): StoredFields {
  return {
    ...emptyStoredFields(data.email, data.location),
    businessName: data.businessName,
    contactName: data.contactName,
    phone: data.phone,
    cuisine: data.cuisine,
    locationCount: data.locationCount,
    deliverySetup: data.deliverySetup,
    message: data.message || null,
    consent: data.consent ? 1 : 0,
  };
}

function driverFields(data: DriverFormData): StoredFields {
  return {
    ...emptyStoredFields(data.email, data.location),
    fullName: data.fullName,
    phone: data.phone,
    vehicleType: data.vehicleType,
    licenceStatus: data.licenceStatus,
    availability: data.availability,
    consent: data.consent ? 1 : 0,
  };
}

export function toStoredFields(
  submission: ValidatedInterestSubmission,
): StoredFields {
  switch (submission.type) {
    case "customer":
      return emptyStoredFields(
        submission.data.email,
        submission.data.location,
      );
    case "restaurant":
      return restaurantFields(submission.data);
    case "driver":
      return driverFields(submission.data);
  }
}

export function getClientAddress(request: Request): string {
  const cloudflareAddress = request.headers.get("cf-connecting-ip")?.trim();
  if (cloudflareAddress) return cloudflareAddress;

  const forwardedAddress = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();

  return forwardedAddress || "unavailable";
}

export async function hashRateLimitKey(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );

  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export function getRateLimitWindow(now: number) {
  const windowStart =
    Math.floor(now / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_WINDOW_MS;

  return {
    windowStart,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((windowStart + RATE_LIMIT_WINDOW_MS - now) / 1_000),
    ),
  };
}
