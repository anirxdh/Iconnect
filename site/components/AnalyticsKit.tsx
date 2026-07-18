"use client";

import { useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { trackEvent } from "@/lib/track";

/** The section ids whose first appearance we count, in page order. */
const SECTIONS = [
  "top",
  "vision",
  "circle",
  "companion",
  "programs",
  "nourishment",
  "gallery",
  "caregivers",
  "begin",
  "houses",
] as const;

const RETURN_KEY = "rua-returning";

/**
 * Anonymous, cookieless measurement (Vercel Web Analytics) plus the event
 * layer that turns the dashboard into a business instrument: one visit
 * event tagged new/returning (a note kept only on the visitor's device —
 * no identifier ever leaves it), first view of each section, and scroll
 * depth quartiles. Rendered only on Vercel deployments, so local runs and
 * the test suite stay network-silent.
 */
export default function AnalyticsKit() {
  /* The visit, tagged new or returning. */
  useEffect(() => {
    let visitor: "new" | "returning" | "unknown" = "returning";
    try {
      if (!localStorage.getItem(RETURN_KEY)) {
        visitor = "new";
        localStorage.setItem(RETURN_KEY, String(Date.now()));
      }
    } catch {
      visitor = "unknown";
    }
    // Give the analytics queue a beat to mount.
    const t = setTimeout(
      () =>
        trackEvent("visit", {
          visitor,
          landing: window.location.pathname,
        }),
      1_200,
    );
    return () => clearTimeout(t);
  }, []);

  /* First sighting of each section. */
  useEffect(() => {
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting && !seen.has(id)) {
            seen.add(id);
            trackEvent("section_view", { section: id });
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

  /* Scroll depth quartiles, once each per load. */
  useEffect(() => {
    const fired = new Set<number>();
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      for (const q of [25, 50, 75, 100]) {
        if (pct >= q - 1 && !fired.has(q)) {
          fired.add(q);
          trackEvent("scroll_depth", { percent: String(q) });
        }
      }
      if (fired.size === 4) window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <Analytics />;
}
