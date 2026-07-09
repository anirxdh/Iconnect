import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { preload } from "react-dom";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CursorBubbles from "@/components/CursorBubbles";

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
  metadataBase: new URL("https://iconnect-anirxdh.vercel.app"),
  title: "iConnect: A circle of care for life after 75",
  description:
    "iConnect wraps every person over 75 in a smart, always-on network of technology and trained, devoted humans. Growing old, beautifully tended.",
  openGraph: {
    title: "iConnect: A circle of care for life after 75",
    description:
      "One record. One wearable. One circle of trained caretakers, connected to everything that matters.",
    type: "website",
    images: [
      {
        url: "/people/swing-tree.jpg",
        width: 1084,
        height: 1362,
        alt: "An elderly man pushing his wife on a swing beneath an old tree",
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
  name: "iConnect Care Systems",
  description:
    "A care network for life after 75: one health record, a 24/7 wearable, trained caretakers, and houses full of programs, all connected to emergency services.",
  email: "hello@iconnect.care",
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
  preload("/people/swing-tree.jpg", { as: "image", fetchPriority: "high" });
  return (
    <html lang="en" className={`${fraunces.variable} ${instrument.variable}`}>
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
        <SmoothScroll>{children}</SmoothScroll>
        <CursorBubbles />
      </body>
    </html>
  );
}
