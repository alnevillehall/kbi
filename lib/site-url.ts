import { headers } from "next/headers";

export async function getSiteUrl(): Promise<URL> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol =
    headerList.get("x-forwarded-proto") ??
    (host?.includes("localhost") ? "http" : "https");

  return new URL(host ? `${protocol}://${host}` : "https://ondi.app");
}
