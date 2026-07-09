"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

/**
 * A vine that grows down the left edge of the page as the reader tends to
 * it, sprouting a leaf as each stretch of the story passes. A brass tip
 * marks the growing point. Pure ornament: aria-hidden, pointer-transparent,
 * hidden below xl, and rendered fully grown under reduced motion.
 */

const VIEW_H = 1000;
const VIEW_W = 40;

/** The stem's x position at a given y. One gentle breath per ~360 units. */
const stemX = (y: number) => 20 + 7 * Math.sin(y / 115);

/** Build a smooth stem path down the viewBox. */
const buildStem = () => {
  let d = `M ${stemX(0).toFixed(2)} 0`;
  for (let y = 20; y <= VIEW_H; y += 20) {
    const midY = y - 10;
    d += ` Q ${stemX(midY).toFixed(2)} ${midY} ${stemX(y).toFixed(2)} ${y}`;
  }
  return d;
};
const STEM_D = buildStem();

/** Leaf geometry shared by the animated and the static (reduced) vine. */
const leafShape = (y: number, side: number) => {
  const x = stemX(y);
  return {
    blade: `M ${x} ${y}
            q ${7.5 * side} -6 ${16.5 * side} -2.2
            q ${-6.6 * side} 7.4 ${-16.5 * side} 2.2 Z`,
    vein: `M ${x} ${y} q ${9 * side} -3.4 ${15.5 * side} -2.6`,
    x,
  };
};

/** Leaves sprout where the sections sit, alternating sides. */
const LEAF_FRACTIONS = [0.09, 0.19, 0.3, 0.41, 0.52, 0.63, 0.74, 0.85, 0.94];

function Leaf({
  fraction,
  index,
  progress,
}: {
  fraction: number;
  index: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const y = fraction * VIEW_H;
  const side = index % 2 === 0 ? 1 : -1;
  const { blade, vein, x } = leafShape(y, side);
  // The leaf unfurls just after the stem tip passes it.
  const grow = useTransform(progress, [fraction, Math.min(1, fraction + 0.045)], [0, 1]);
  const scale = useSpring(grow, { stiffness: 120, damping: 18 });
  return (
    <motion.g
      style={{
        scale,
        opacity: grow,
        transformOrigin: `${x}px ${y}px`,
      }}
    >
      <path d={blade} className="fill-fern/65" />
      <path d={vein} className="fill-none stroke-fern/80" strokeWidth={0.7} />
    </motion.g>
  );
}

export default function GrowingVine() {
  const reduced = useReducedMotion();
  // Branch only after mount: useReducedMotion is null during SSR, and
  // swapping to the static vine mid-hydration would mismatch the server HTML.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { scrollYProgress } = useScroll();
  const growth = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 20,
    mass: 0.6,
  });
  // A seed-tip of stem is always visible; the rest grows with the reader.
  const pathLength = useTransform(growth, [0, 1], [0.015, 1]);
  const tipY = useTransform(pathLength, (v) => v * VIEW_H);
  const tipX = useTransform(tipY, (y) => stemX(y));

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-3 z-40 hidden w-8 xl:block"
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        {mounted && reduced ? (
          <>
            <path
              d={STEM_D}
              className="fill-none stroke-fern/60"
              strokeWidth={2}
              strokeLinecap="round"
            />
            {LEAF_FRACTIONS.map((f, i) => {
              const { blade, vein } = leafShape(f * VIEW_H, i % 2 === 0 ? 1 : -1);
              return (
                <g key={f}>
                  <path d={blade} className="fill-fern/55" />
                  <path d={vein} className="fill-none stroke-fern/70" strokeWidth={0.7} />
                </g>
              );
            })}
          </>
        ) : (
          <>
            <motion.path
              d={STEM_D}
              className="fill-none stroke-fern/75"
              strokeWidth={2.2}
              strokeLinecap="round"
              style={{ pathLength }}
            />
            {LEAF_FRACTIONS.map((f, i) => (
              <Leaf key={f} fraction={f} index={i} progress={growth} />
            ))}
            {/* The growing point: a small brass seed at the stem's tip. */}
            <motion.circle
              cx={tipX}
              cy={tipY}
              r={3.4}
              className="fill-brass"
            />
            <motion.circle
              cx={tipX}
              cy={tipY}
              r={6}
              className="fill-none stroke-brass/40"
              strokeWidth={0.8}
            />
          </>
        )}
      </svg>
    </div>
  );
}
