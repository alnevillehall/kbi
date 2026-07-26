import { z } from "zod";

import {
  customerSchema,
  driverSchema,
  restaurantSchema,
  type InterestType,
  type ValidatedInterestSubmission,
} from "@/lib/forms";
import {
  enforceSubmissionRateLimit,
  getSubmissionService,
  SubmissionRateLimitExceededError,
  SubmissionStorageUnavailableError,
} from "@/lib/submissions";

const MAX_REQUEST_BYTES = 16_384;

const requestSchema = z
  .object({
    type: z.enum(["customer", "restaurant", "driver"]),
    data: z.unknown(),
    website: z.string().max(200).optional().default(""),
    idempotencyKey: z.string().uuid("The submission ID is invalid."),
  })
  .strict();

const schemasByType = {
  customer: customerSchema,
  restaurant: restaurantSchema,
  driver: driverSchema,
} as const;

type FieldErrors = Record<string, string[]>;

function jsonResponse(
  body: unknown,
  status: number,
  extraHeaders?: Record<string, string>,
) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

function errorResponse(
  status: number,
  code: string,
  message: string,
  fieldErrors?: FieldErrors,
  extraHeaders?: Record<string, string>,
) {
  return jsonResponse(
    {
      ok: false,
      error: {
        code,
        message,
        ...(fieldErrors && Object.keys(fieldErrors).length > 0
          ? { fieldErrors }
          : {}),
      },
    },
    status,
    extraHeaders,
  );
}

function parseSubmission(
  type: InterestType,
  data: unknown,
):
  | { success: true; submission: ValidatedInterestSubmission }
  | { success: false; fieldErrors: FieldErrors } {
  const result = schemasByType[type].safeParse(data);

  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,
    submission: { type, data: result.data } as ValidatedInterestSubmission,
  };
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return errorResponse(
      415,
      "unsupported_media_type",
      "Send the submission as application/json.",
    );
  }

  const declaredContentLength = Number(
    request.headers.get("content-length") ?? 0,
  );

  if (
    Number.isFinite(declaredContentLength) &&
    declaredContentLength > MAX_REQUEST_BYTES
  ) {
    return errorResponse(
      413,
      "payload_too_large",
      "The submission is too large.",
    );
  }

  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return errorResponse(
      400,
      "invalid_json",
      "The request body is not valid JSON.",
    );
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
    return errorResponse(
      413,
      "payload_too_large",
      "The submission is too large.",
    );
  }

  try {
    await enforceSubmissionRateLimit(request);
  } catch (error) {
    if (error instanceof SubmissionRateLimitExceededError) {
      return errorResponse(
        429,
        "rate_limit_exceeded",
        "Too many attempts. Please wait before trying again.",
        undefined,
        { "Retry-After": String(error.retryAfterSeconds) },
      );
    }

    if (error instanceof SubmissionStorageUnavailableError) {
      return errorResponse(
        503,
        "storage_unavailable",
        "Submissions are temporarily unavailable. Please try again later.",
      );
    }

    console.error("Failed to enforce interest submission rate limit", error);
    return errorResponse(
      503,
      "rate_limit_unavailable",
      "Submissions are temporarily unavailable. Please try again later.",
    );
  }

  let payload: unknown;

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return errorResponse(
      400,
      "invalid_json",
      "The request body is not valid JSON.",
    );
  }

  const requestResult = requestSchema.safeParse(payload);

  if (!requestResult.success) {
    return errorResponse(
      400,
      "invalid_request",
      "The submission request is incomplete or invalid.",
      requestResult.error.flatten().fieldErrors,
    );
  }

  const { type, data, website, idempotencyKey } = requestResult.data;

  if (website.trim().length > 0) {
    return errorResponse(
      422,
      "spam_detected",
      "The submission could not be accepted.",
    );
  }

  const submissionResult = parseSubmission(type, data);

  if (!submissionResult.success) {
    return errorResponse(
      422,
      "validation_error",
      "Check the highlighted fields and try again.",
      submissionResult.fieldErrors,
    );
  }

  try {
    const submissionService = await getSubmissionService();
    const receipt = await submissionService.create(
      submissionResult.submission,
      idempotencyKey,
    );

    return jsonResponse(
      {
        ok: true,
        submission: receipt,
        message: "Thanks — your details have been received.",
      },
      201,
    );
  } catch (error) {
    if (error instanceof SubmissionStorageUnavailableError) {
      return errorResponse(
        503,
        "storage_unavailable",
        "Submissions are temporarily unavailable. Please try again later.",
      );
    }

    console.error("Failed to persist interest submission", error);

    return errorResponse(
      500,
      "internal_error",
      "We could not save your submission. Please try again.",
    );
  }
}
