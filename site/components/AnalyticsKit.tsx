"use client";

import { useEffect } from "react";
import { Analytics, track } from "@vercel/analytics/react";

/** The section ids whose first appearance we count, in page order. */
const SECTIONS = [
  "top",
  "vision",
  "circle",
  "programs",
  "nourishment",
  "gallery",
  "caregivers",
  "begin",
  "houses",
] as const;

/**
 * Anonymous, cookieless measurement (Vercel Web Analytics) plus one custom
 * event per section per visit, so the dashboard shows how deep readers
 * actually travel. Rendered only on Vercel deployments — local runs and
 * the test suite stay network-silent. No identifiers, no profiling; the
 * footer's privacy promise is kept honest in the Privacy Notice.
 */
export default function AnalyticsKit() {
  useEffect(() => {
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting && !seen.has(id)) {
            seen.add(id);
            track("section_view", { section: id });
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.25 },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return <Analytics />;
}
