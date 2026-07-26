import { LandingPage } from "./components/LandingPage";
import { getSiteUrl } from "@/lib/site-url";

export default async function Home() {
  const siteUrl = await getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "KBI",
    url: siteUrl.toString(),
    logo: new URL("/icon.png", siteUrl).toString(),
    serviceType: "Food delivery",
    description:
      "A food-delivery platform connecting customers, restaurants and drivers in Montego Bay, Jamaica.",
    areaServed: {
      "@type": "City",
      name: "Montego Bay",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "St. James",
        containedInPlace: {
          "@type": "Country",
          name: "Jamaica",
        },
      },
    },
    provider: {
      "@type": "Organization",
      name: "KBI",
    },
  };

  return (
    <>
      <LandingPage year={new Date().getUTCFullYear()} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
