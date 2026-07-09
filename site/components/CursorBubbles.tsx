"use client";

import { useEffect, useRef } from "react";

type Bubble = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number; // 1 → 0
  decay: number;
  warm: boolean;
};

/**
 * Small bubbles rise from the pointer's path, everywhere on the site —
 * sage and the occasional brass, like pollen stirred by a passing hand.
 * Pure ornament on a fixed, pointer-transparent canvas: no layout impact,
 * fine pointers only, silent under reduced motion, and the loop stops
 * entirely the moment the last bubble fades.
 */
export default function CursorBubbles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let destroyed = false;
    let t = 0;

    const bubbles: Bubble[] = [];
    const MAX = 48;

    const layout = () => {
      width = Math.round(window.innerWidth * dpr);
      height = Math.round(window.innerHeight * dpr);
      canvas.width = width;
      canvas.height = height;
    };
    layout();

    let lastX = -1;
    let lastY = -1;

    const sow = (cx: number, cy: number, speed: number) => {
      const count = Math.min(2, Math.max(1, Math.round(speed / 40)));
      for (let i = 0; i < count && bubbles.length < MAX; i++) {
        bubbles.push({
          x: cx + (Math.random() - 0.5) * 22 * dpr,
          y: cy + (Math.random() - 0.5) * 22 * dpr,
          vx: (Math.random() - 0.5) * 0.3 * dpr,
          vy: (-0.3 - Math.random() * 0.55) * dpr,
          r: (1 + Math.random() * 2.4) * dpr,
          life: 1,
          decay: 0.006 + Math.random() * 0.008,
          warm: Math.random() < 0.28,
        });
      }
    };

    const frame = () => {
      if (destroyed) return;
      t += 1;
      ctx.clearRect(0, 0, width, height);
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.x += b.vx + Math.sin((t + i * 41) * 0.03) * 0.15 * dpr;
        b.y += b.vy;
        b.life -= b.decay;
        if (b.life <= 0) {
          bubbles.splice(i, 1);
          continue;
        }
        const alpha = b.life * 0.45;
        // Stone grey sits between bone and forest, so the bubbles stay
        // visible on the light sections and the dark ones alike.
        ctx.fillStyle = b.warm
          ? `rgba(185,138,69,${alpha})`
          : `rgba(136,140,131,${alpha})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * (0.55 + b.life * 0.45), 0, Math.PI * 2);
        ctx.fill();
      }
      if (bubbles.length === 0) {
        running = false;
        ctx.clearRect(0, 0, width, height);
        return; // idle — the next pointer move wakes us
      }
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (!running && !destroyed) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    const onMove = (e: PointerEvent) => {
      const x = e.clientX * dpr;
      const y = e.clientY * dpr;
      if (lastX < 0) {
        lastX = x;
        lastY = y;
      }
      const speed = Math.hypot(x - lastX, y - lastY);
      if (speed > 2) {
        sow(x, y, speed);
        wake();
      }
      lastX = x;
      lastY = y;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", layout);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", layout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[240] h-full w-full max-md:hidden"
    />
  );
}
