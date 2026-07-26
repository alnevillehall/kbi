import { headers } from "next/headers";

export async function getSiteUrl(): Promise<URL> {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) {
    const parsedUrl = new URL(configuredUrl);
    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
      throw new Error("NEXT_PUBLIC_SITE_URL must use http or https.");
    }
    return parsedUrl;
  }

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const isTrustedRequestHost =
    host?.endsWith(".chatgpt.site") ||
    host?.startsWith("localhost:") ||
    host?.startsWith("127.0.0.1:");
  const protocol =
    headerList.get("x-forwarded-proto") ??
    (host?.includes("localhost") ? "http" : "https");

  return new URL(
    host && isTrustedRequestHost
      ? `${protocol}://${host}`
      : "http://localhost:3000",
  );
}
