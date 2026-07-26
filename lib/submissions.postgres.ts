// Native Next/Vercel adapter. The facade loads this module only when needed.
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

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

const INSERT_INTEREST_SUBMISSION = `
  INSERT INTO interest_submissions (
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
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9,
    $10, $11, $12, $13, $14, $15, $16, $17
  )
  ON CONFLICT (id) DO NOTHING
`;

const UPSERT_INTEREST_RATE_LIMIT = `
  INSERT INTO interest_rate_limits (key, window_start, count, updated_at)
  VALUES ($1, $2, 1, $3)
  ON CONFLICT (key) DO UPDATE SET
    count = interest_rate_limits.count + 1,
    updated_at = EXCLUDED.updated_at
  RETURNING count
`;

const DELETE_EXPIRED_RATE_LIMITS = `
  DELETE FROM interest_rate_limits WHERE window_start < $1
`;

type Database = NeonQueryFunction<false, false>;

let database: Database | null = null;
let lastRateLimitCleanup = 0;

function getDatabase(): Database {
  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    throw new SubmissionStorageUnavailableError();
  }

  database ??= neon(connectionString);
  return database;
}

class PostgresSubmissionService implements SubmissionService {
  constructor(private readonly databaseClient: Database) {}

  async create(
    submission: ValidatedInterestSubmission,
    idempotencyKey: string,
  ): Promise<SubmissionReceipt> {
    const id = idempotencyKey;
    const createdAt = new Date().toISOString();
    const fields = toStoredFields(submission);

    await this.databaseClient.query(INSERT_INTEREST_SUBMISSION, [
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
    ]);

    return { id, createdAt };
  }
}

export function getSubmissionService(): SubmissionService {
  return new PostgresSubmissionService(getDatabase());
}

export async function enforceSubmissionRateLimit(
  request: Request,
): Promise<void> {
  const databaseClient = getDatabase();
  const now = Date.now();
  const { windowStart, retryAfterSeconds } = getRateLimitWindow(now);
  const addressHash = await hashRateLimitKey(
    `kbi-interest:${getClientAddress(request)}`,
  );
  const key = `${addressHash}:${windowStart}`;
  const updatedAt = new Date(now).toISOString();

  if (now - lastRateLimitCleanup > RATE_LIMIT_WINDOW_MS) {
    await databaseClient.query(DELETE_EXPIRED_RATE_LIMITS, [
      now - RATE_LIMIT_RETENTION_MS,
    ]);
    lastRateLimitCleanup = now;
  }

  const rows = await databaseClient.query(UPSERT_INTEREST_RATE_LIMIT, [
    key,
    windowStart,
    updatedAt,
  ]);
  const count = Number(rows[0]?.count);

  if (!Number.isFinite(count) || count > RATE_LIMIT_MAX_REQUESTS) {
    throw new SubmissionRateLimitExceededError(retryAfterSeconds);
  }
}
