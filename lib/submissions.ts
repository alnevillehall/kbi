import type { SubmissionService } from "./submissions.shared";

export {
  SubmissionRateLimitExceededError,
  SubmissionStorageUnavailableError,
} from "./submissions.shared";

type SubmissionProvider = {
  getSubmissionService(): SubmissionService;
  enforceSubmissionRateLimit(request: Request): Promise<void>;
};

let providerPromise: Promise<SubmissionProvider> | null = null;

async function loadProvider(): Promise<SubmissionProvider> {
  if (process.env.VERCEL === "1") {
    return import("./submissions.postgres");
  }

  try {
    return await import("./submissions.cloudflare");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const code =
      error instanceof Error && "code" in error
        ? String(error.code)
        : "";
    const cloudflareRuntimeIsUnavailable =
      code === "ERR_UNSUPPORTED_ESM_URL_SCHEME" ||
      message.includes("cloudflare:") ||
      message.includes("submissions.cloudflare");

    if (!cloudflareRuntimeIsUnavailable) {
      throw error;
    }

    return import("./submissions.postgres");
  }
}

function getProvider(): Promise<SubmissionProvider> {
  providerPromise ??= loadProvider().catch((error) => {
    providerPromise = null;
    throw error;
  });

  return providerPromise;
}

export async function getSubmissionService(): Promise<SubmissionService> {
  return (await getProvider()).getSubmissionService();
}

export async function enforceSubmissionRateLimit(
  request: Request,
): Promise<void> {
  return (await getProvider()).enforceSubmissionRateLimit(request);
}
