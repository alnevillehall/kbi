import { env } from "cloudflare:workers";

import type { ValidatedInterestSubmission } from "./forms";
import {
  getClientAddress,
  getRateLimitWindow,
  hashRateLimitKey,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_RETENTION_MS,
  RATE_LIMIT_WINDOW_MS,
  type SubmissionReceipt,
  type SubmissionService,
  SubmissionRateLimitExceededError,
  SubmissionStorageUnavailableError,
  toStoredFields,
} from "./submissions.shared";

export {
  SubmissionRateLimitExceededError,
  SubmissionStorageUnavailableError,
} from "./submissions.shared";

const CREATE_INTEREST_SUBMISSIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS interest_submissions (
    id TEXT PRIMARY KEY NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('customer', 'restaurant', 'driver')),
    email TEXT NOT NULL,
    location TEXT,
    business_name TEXT,
    contact_name TEXT,
    phone TEXT,
    cuisine TEXT,
    location_count INTEGER,
    delivery_setup TEXT,
    message TEXT,
    full_name TEXT,
    vehicle_type TEXT,
    licence_status TEXT,
    availability TEXT,
    consent INTEGER,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

const INSERT_INTEREST_SUBMISSION = `
  INSERT OR IGNORE INTO interest_submissions (
    id,
    type,
    email,
    location,
    business_name,
    contact_name,
    phone,
    cuisine,
    location_count,
    delivery_setup,
    message,
    full_name,
    vehicle_type,
    licence_status,
    availability,
    consent,
    created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const CREATE_INTEREST_RATE_LIMITS_TABLE = `
  CREATE TABLE IF NOT EXISTS interest_rate_limits (
    key TEXT PRIMARY KEY NOT NULL,
    window_start INTEGER NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL
  )
`;

const UPSERT_INTEREST_RATE_LIMIT = `
  INSERT INTO interest_rate_limits (key, window_start, count, updated_at)
  VALUES (?, ?, 1, ?)
  ON CONFLICT(key) DO UPDATE SET
    count = interest_rate_limits.count + 1,
    updated_at = excluded.updated_at
  RETURNING count
`;

const DELETE_EXPIRED_RATE_LIMITS = `
  DELETE FROM interest_rate_limits WHERE window_start < ?
`;

const CREATE_RATE_LIMIT_WINDOW_INDEX = `
  CREATE INDEX IF NOT EXISTS interest_rate_limits_window_start_idx
  ON interest_rate_limits (window_start)
`;

class D1SubmissionService implements SubmissionService {
  constructor(private readonly database: D1Database) {}

  async create(
    submission: ValidatedInterestSubmission,
    idempotencyKey: string,
  ): Promise<SubmissionReceipt> {
    const id = idempotencyKey;
    const createdAt = new Date().toISOString();
    const fields = toStoredFields(submission);

    await ensureSubmissionTables(this.database);

    await this.database
      .prepare(INSERT_INTEREST_SUBMISSION)
      .bind(
        id,
        submission.type,
        fields.email,
        fields.location,
        fields.businessName,
        fields.contactName,
        fields.phone,
        fields.cuisine,
        fields.locationCount,
        fields.deliverySetup,
        fields.message,
        fields.fullName,
        fields.vehicleType,
        fields.licenceStatus,
        fields.availability,
        fields.consent,
        createdAt,
      )
      .run();

    return { id, createdAt };
  }
}

export function getSubmissionService(): SubmissionService {
  if (!env.DB) {
    throw new SubmissionStorageUnavailableError();
  }

  return new D1SubmissionService(env.DB);
}

let tableInitialization: Promise<void> | null = null;
let lastRateLimitCleanup = 0;

function ensureSubmissionTables(database: D1Database): Promise<void> {
  tableInitialization ??= (async () => {
    await database.prepare(CREATE_INTEREST_SUBMISSIONS_TABLE).run();
    await database.prepare(CREATE_INTEREST_RATE_LIMITS_TABLE).run();
    await database.prepare(CREATE_RATE_LIMIT_WINDOW_INDEX).run();
  })().catch((error) => {
    tableInitialization = null;
    throw error;
  });

  return tableInitialization;
}

export async function enforceSubmissionRateLimit(
  request: Request,
): Promise<void> {
  if (!env.DB) {
    throw new SubmissionStorageUnavailableError();
  }

  const now = Date.now();
  const { windowStart, retryAfterSeconds } = getRateLimitWindow(now);
  const addressHash = await hashRateLimitKey(
    `kbi-interest:${getClientAddress(request)}`,
  );
  const key = `${addressHash}:${windowStart}`;
  const updatedAt = new Date(now).toISOString();

  await ensureSubmissionTables(env.DB);

  if (now - lastRateLimitCleanup > RATE_LIMIT_WINDOW_MS) {
    await env.DB
      .prepare(DELETE_EXPIRED_RATE_LIMITS)
      .bind(now - RATE_LIMIT_RETENTION_MS)
      .run();
    lastRateLimitCleanup = now;
  }

  const result = await env.DB
    .prepare(UPSERT_INTEREST_RATE_LIMIT)
    .bind(key, windowStart, updatedAt)
    .first<{ count: number }>();

  if (!result || result.count > RATE_LIMIT_MAX_REQUESTS) {
    throw new SubmissionRateLimitExceededError(retryAfterSeconds);
  }
}
