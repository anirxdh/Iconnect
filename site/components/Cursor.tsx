"use client";

import { useEffect, useRef } from "react";

/**
 * A quiet ring that trails the pointer and swells over anything
 * interactive. Blend-difference keeps it legible on bone and forest alike.
 * Renders nothing on touch devices or under reduced motion.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced || !ring.current || !dot.current) return;

    const ringEl = ring.current;
    const dotEl = dot.current;
    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let scale = 1;
    let targetScale = 1;
    let raf: number;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target instanceof Element ? e.target : null;
      targetScale = target?.closest("a, button, [data-cursor='wide']") ? 2.6 : 1;
      dotEl.style.opacity = "1";
      ringEl.style.opacity = "1";
    };
    const onLeave = () => {
      dotEl.style.opacity = "0";
      ringEl.style.opacity = "0";
    };

    const loop = () => {
      rx += (x - rx) * 0.14;
      ry += (y - ry) * 0.14;
      scale += (targetScale - scale) * 0.16;
      ringEl.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0) scale(${scale})`;
      dotEl.style.transform = `translate3d(${x - 2.5}px, ${y - 2.5}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="max-md:hidden">
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[250] h-9 w-9 rounded-full border border-white opacity-0 mix-blend-difference transition-opacity duration-300"
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[250] h-[5px] w-[5px] rounded-full bg-white opacity-0 mix-blend-difference"
      />
    </div>
  );
}
