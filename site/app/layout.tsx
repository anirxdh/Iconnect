import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { preload } from "react-dom";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import AnalyticsKit from "@/components/AnalyticsKit";

// display "block": the fonts are self-hosted and preloaded, so they arrive
// within the block window — one clean paint, no fallback-then-swap flash
// re-rendering every line of text at load.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-fraunces",
  display: "block",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "block",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rua-care.vercel.app"),
  title: "Rua: A circle of care for life after 75",
  description:
    "Rua wraps every person over 75 in a smart, always-on network of technology and trained, devoted humans. Growing old, beautifully tended.",
  openGraph: {
    title: "Rua: A circle of care for life after 75",
    description:
      "One record. One wearable. One circle of trained caretakers, connected to everything that matters.",
    type: "website",
    images: [
      {
        url: "/scene/hero-garden.jpg",
        width: 3840,
        height: 2559,
        alt: "Morning light through old park trees",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rua Care Systems",
  description:
    "A care network for life after 75: one health record, a 24/7 wearable, trained caretakers, and houses full of programs, all connected to emergency services.",
  email: "ishanagu0601@gmail.com",
  telephone: "+1-763-233-1350",
  address: {
    "@type": "PostalAddress",
    streetAddress: "One Garden Way",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    addressCountry: "US",
  },
  slogan: "Growing old, beautifully tended.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The hero scene is fetched from JS (canvas), invisible to the preload
  // scanner — hint it so LCP doesn't wait for hydration.
  preload("/scene/hero-garden.jpg", { as: "image", fetchPriority: "high" });
  return (
    <html lang="en" className={`${fraunces.variable} ${instrument.variable}`}>
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
        <SmoothScroll>{children}</SmoothScroll>
        {process.env.VERCEL ? <AnalyticsKit /> : null}
      </body>
    </html>
  );
}
