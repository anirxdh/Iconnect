"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { EASE, InkReveal, Reveal, RuleReveal, WordsReveal } from "./Reveal";

/* ————— The constellation, mapped in SVG user units (800 × 500) ————— */

const CENTER = { x: 400, y: 258 };

type Satellite = {
  label: string;
  sub?: string;
  x: number;
  y: number;
  side: "above" | "below";
  path: string;
};

const SATELLITES: Satellite[] = [
  {
    label: "911",
    x: 152,
    y: 122,
    side: "above",
    path: "M400 258 Q258 224 152 122",
  },
  {
    label: "Fire Department",
    x: 640,
    y: 132,
    side: "above",
    path: "M400 258 Q546 226 640 132",
  },
  {
    label: "Disaster Relief",
    x: 172,
    y: 398,
    side: "below",
    path: "M400 258 Q274 322 172 398",
  },
  {
    label: "The Circle",
    sub: "Family & caretaker",
    x: 628,
    y: 390,
    side: "below",
    path: "M400 258 Q528 314 628 390",
  },
];

/* Faint fixed stars, so the sky feels inhabited */
const STARS = [
  { x: 92, y: 236, r: 1.6 },
  { x: 258, y: 62, r: 1.2 },
  { x: 494, y: 56, r: 1.6 },
  { x: 716, y: 246, r: 1.3 },
  { x: 560, y: 454, r: 1.5 },
  { x: 318, y: 456, r: 1.2 },
  { x: 706, y: 60, r: 1.1 },
  { x: 66, y: 446, r: 1.2 },
];

const LEDGER = [
  {
    k: "A fall",
    v: "Felt the moment it happens, not the morning after.",
  },
  {
    k: "A silence",
    v: "Noticed when a familiar routine goes quiet for too long.",
  },
  {
    k: "A rhythm",
    v: "Read from the wrist, hour by hour, all through the night.",
  },
];

const px = (x: number) => `${(x / 800) * 100}%`;
const py = (y: number) => `${(y / 500) * 100}%`;

export default function Safety() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={ref} className="relative overflow-hidden bg-pine text-bone">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-pine via-transparent to-pine"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-pine)_94%)]"
      />

      <div className="relative z-10 mx-auto max-w-[90rem] px-6 py-28 md:px-12 md:py-40">
        <Reveal>
          <p className="voice-kicker text-sage">06 · The Watch</p>
        </Reveal>
        <RuleReveal className="mt-6 bg-bone/20" delay={0.1} />

        <div className="mt-12 flex flex-col gap-10 md:mt-16 md:flex-row md:items-end md:justify-between">
          <WordsReveal
            as="h2"
            text="Seconds matter. So nothing waits."
            className="voice-upright max-w-[14ch] text-[clamp(2.5rem,5.5vw,5.5rem)] text-bone"
            delay={0.15}
          />
        </div>

        {/* ————— The constellation ————— */}
        <p className="sr-only">
          The wearable sits at the center of a constellation, connected at all
          hours to 911, the fire department, disaster relief, and the circle of
          family and caretaker.
        </p>

        <div className="relative mx-auto mt-20 w-full max-w-3xl md:mt-28">
          <svg
            viewBox="0 0 800 500"
            className="block h-auto w-full"
            aria-hidden
          >
            {/* Distant stars */}
            {STARS.map((s, i) => (
              <motion.circle
                key={`star-${i}`}
                cx={s.x}
                cy={s.y}
                r={s.r}
                className="fill-bone/30"
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 1.4, delay: 0.9 + i * 0.12, ease: EASE }}
              />
            ))}

            {/* Threads from the wearable outward — drawn, never dashed off */}
            {SATELLITES.map((s, i) => (
              <motion.path
                key={`path-${s.label}`}
                d={s.path}
                fill="none"
                strokeWidth={1.1}
                strokeLinecap="round"
                className="stroke-bone/25"
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  pathLength: { duration: 2, delay: 0.4 + i * 0.22, ease: EASE },
                  opacity: { duration: 0.5, delay: 0.4 + i * 0.22 },
                }}
              />
            ))}

            {/* Satellite nodes */}
            {SATELLITES.map((s, i) => (
              <motion.g
                key={`node-${s.label}`}
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.9, delay: 1.9 + i * 0.22, ease: EASE }}
              >
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={11}
                  strokeWidth={1}
                  className="fill-none stroke-bone/25"
                />
                <circle cx={s.x} cy={s.y} r={4.5} className="fill-bone/90" />
              </motion.g>
            ))}

            {/* The wearable — brass, slightly larger, always awake */}
            <motion.g
              initial={reduced ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
            >
              <circle
                cx={CENTER.x}
                cy={CENTER.y}
                r={19}
                strokeWidth={1}
                className="fill-none stroke-brass/40"
              />
              <circle cx={CENTER.x} cy={CENTER.y} r={9} className="fill-brass" />
            </motion.g>
          </svg>

          {/* Two breaths of the pulse, staggered */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[51.6%] w-[32%] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="aspect-square w-full animate-pulse-ring rounded-full border border-brass/50" />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[51.6%] w-[32%] -translate-x-1/2 -translate-y-1/2"
          >
            <div className="aspect-square w-full animate-pulse-ring rounded-full border border-bone/30 [animation-delay:1.6s]" />
          </div>

          {/* Center label */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: py(CENTER.y),
              transform: "translate(-50%, 30px)",
            }}
          >
            <motion.p
              className="voice-kicker whitespace-nowrap text-brass"
              initial={reduced ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 1, delay: 0.7, ease: EASE }}
            >
              The wearable
            </motion.p>
          </div>

          {/* Satellite labels */}
          {SATELLITES.map((s, i) => (
            <div
              key={`label-${s.label}`}
              className="absolute"
              style={{
                left: px(s.x),
                top: py(s.y),
                transform:
                  s.side === "above"
                    ? "translate(-50%, calc(-100% - 14px))"
                    : "translate(-50%, 14px)",
              }}
            >
              <motion.div
                className="text-center"
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 1, delay: 2.1 + i * 0.22, ease: EASE }}
              >
                <p className="voice-kicker max-w-[6.5rem] text-sage md:max-w-none md:whitespace-nowrap">
                  {s.label}
                </p>
                {s.sub ? (
                  <p className="mt-1 text-[0.7rem] tracking-wide text-bone/50">
                    {s.sub}
                  </p>
                ) : null}
              </motion.div>
            </div>
          ))}
        </div>

        {/* ————— What the watch listens for ————— */}
        <div className="mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-x-12 gap-y-10 md:mt-32 md:grid-cols-3">
          {LEDGER.map((row, i) => (
            <Reveal key={row.k} delay={i * 0.12}>
              <div className="border-t border-bone/15 pt-5">
                <p className="voice-kicker text-sage">{row.k}</p>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-bone/60">
                  {row.v}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ————— The promise ————— */}
        <div className="mt-24 text-center md:mt-36">
          <Reveal>
            <span aria-hidden className="text-sm text-brass">
              ✦
            </span>
          </Reveal>
          <WordsReveal
            as="p"
            text="No one falls through the cracks, because there are no cracks."
            className="voice-display mx-auto mt-6 max-w-3xl text-[clamp(1.75rem,3.4vw,3.1rem)] text-bone/90"
            delay={0.1}
          />
        </div>
      </div>
    </section>
  );
}
