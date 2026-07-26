import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f0e4" },
    { media: "(prefers-color-scheme: dark)", color: "#21101f" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = await getSiteUrl();

  return {
    metadataBase,
    alternates: {
      canonical: "/",
    },
    title: {
      default: "KBI — Good food. On di way.",
      template: "%s | KBI",
    },
    description:
      "Montego Bay’s next food-delivery app is on the way. Join KBI for early access, become a founding restaurant, or apply to drive.",
    applicationName: "KBI",
    keywords: [
      "food delivery Jamaica",
      "Montego Bay food delivery",
      "restaurant delivery app",
      "delivery driver Jamaica",
      "KBI",
    ],
    authors: [{ name: "KBI" }],
    creator: "KBI",
    openGraph: {
      type: "website",
      locale: "en_JM",
      siteName: "KBI",
      title: "KBI — Good food. On di way.",
      description:
        "A new route from Montego Bay’s kitchens to your door. Join the launch list.",
      url: "/",
      images: [
        {
          url: "/og-montego-bay.jpg",
          width: 1200,
          height: 630,
          alt: "KBI — Good food. On di way. Coming soon to Montego Bay.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "KBI — Good food. On di way.",
      description:
        "A new route from Montego Bay’s kitchens to your door. Join the launch list.",
      images: ["/og-montego-bay.jpg"],
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
    <html lang="en-JM">
      <body className={`${manrope.variable} ${bebas.variable}`}>
        {children}
      </body>
    </html>
  );
}
