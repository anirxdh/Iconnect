"use client";

import { useEffect } from "react";

/**
 * Warms every photograph on the page in the background, in the order the
 * reader will meet them — so scrolling never catches an image mid-load.
 * Waits for the window load event (the hero keeps absolute priority),
 * then fetches quietly, three at a time. Data-saver users are left alone.
 *
 * Sets data-assets-warm on <html> when done — observable by tests.
 */

// Every image the page uses, in order of appearance. hero-garden.jpg is
// omitted: the hero preloads it with fetchPriority=high from the layout.
const MANIFEST = [
  "/people/swing-tree.jpg",
  "/people/three-friends.jpg",
  "/people/seaside-hug.jpg",
  "/people/aperitivo.jpg",
  "/people/portrait-hands.jpg",
  "/people/cane-kiss.jpg",
  "/people/window-couple.jpg",
  "/people/braiding-hair.jpg",
  "/people/portrait-beret.jpg",
  "/people/doorway-couple.jpg",
  "/brand/hands-held.jpg",
  "/people/park-bench-ladies.jpg",
  "/people/tulips-laugh.jpg",
  "/people/spa-day.jpg",
  "/people/pigeon-window.jpg",
  "/people/camera-woman.jpg",
  "/people/vespa-ride.jpg",
  "/brand/apothecary.jpg",
  "/people/checkers-bench.jpg",
  "/people/florist-couple.jpg",
  "/brand/papaya-table.jpg",
  "/brand/washing-herbs.jpg",
  "/brand/blueberries.jpg",
  "/brand/herbal-brew.jpg",
  "/people/nose-to-nose.jpg",
  "/people/garden-dance.jpg",
  "/people/night-walk.jpg",
  "/people/temple-kiss.jpg",
  "/people/street-arm-in-arm.jpg",
  "/people/foreheads.jpg",
  "/people/mirror-morning.jpg",
  "/people/lakeside-bench.jpg",
];

// One at a time: parallel decodes stutter the hero entrance on laptops.
const CONCURRENCY = 1;

// Start only after the hero's staged entrance has fully played (~3.6s
// after the preloader lifts) — the warm-up must never share the stage.
const START_DELAY_MS = 4_800;

export default function AssetWarmer() {
  useEffect(() => {
    let cancelled = false;

    const saveData = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData;
    if (saveData) {
      document.documentElement.dataset.assetsWarm = "skipped";
      return;
    }

    const warm = () => {
      const queue = [...MANIFEST];
      let inFlight = 0;

      const next = () => {
        if (cancelled) return;
        if (queue.length === 0) {
          if (inFlight === 0) {
            document.documentElement.dataset.assetsWarm = "true";
          }
          return;
        }
        const src = queue.shift()!;
        inFlight++;
        const img = new Image();
        img.decoding = "async";
        const done = () => {
          inFlight--;
          next();
        };
        img.onload = done;
        img.onerror = done;
        img.src = src;
      };

      for (let i = 0; i < CONCURRENCY; i++) next();
    };

    // Begin once the window has settled AND the hero has finished arriving.
    let timer: ReturnType<typeof setTimeout>;
    const start = () => {
      timer = setTimeout(warm, START_DELAY_MS);
    };
    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }

    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener("load", start);
    };
  }, []);

  return null;
}
