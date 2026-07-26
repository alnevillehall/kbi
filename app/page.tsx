import { LandingPage } from "./components/LandingPage";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "ONDI",
    description:
      "A food-delivery platform connecting customers, restaurants and drivers in Kingston, Jamaica.",
    areaServed: {
      "@type": "City",
      name: "Kingston",
      containedInPlace: {
        "@type": "Country",
        name: "Jamaica",
      },
    },
    provider: {
      "@type": "Organization",
      name: "ONDI",
      email: "hello@ondi.app",
    },
  };

  return (
    <>
      <LandingPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
