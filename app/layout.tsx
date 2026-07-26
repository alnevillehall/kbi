import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = await getSiteUrl();

  return {
    metadataBase,
    alternates: {
      canonical: "/",
    },
    title: {
      default: "ONDI — Good food. On di way.",
      template: "%s | ONDI",
    },
    description:
      "Kingston’s next food-delivery app is on the way. Join ONDI for early access, become a founding restaurant, or apply to drive.",
    applicationName: "ONDI",
    keywords: [
      "food delivery Jamaica",
      "Kingston food delivery",
      "restaurant delivery app",
      "delivery driver Jamaica",
      "ONDI",
    ],
    authors: [{ name: "ONDI" }],
    creator: "ONDI",
    openGraph: {
      type: "website",
      locale: "en_JM",
      siteName: "ONDI",
      title: "ONDI — Good food. On di way.",
      description:
        "A new route from Kingston’s kitchens to your door. Join the launch list.",
      images: [
        {
          url: "/og.png",
          width: 1730,
          height: 909,
          alt: "ONDI — Good food. On di way. Coming soon to Kingston.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "ONDI — Good food. On di way.",
      description:
        "A new route from Kingston’s kitchens to your door. Join the launch list.",
      images: ["/og.png"],
    },
    icons: {
      icon: "/icon.png",
      shortcut: "/icon.png",
      apple: "/apple-icon.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${bebas.variable}`}>
        {children}
      </body>
    </html>
  );
}
