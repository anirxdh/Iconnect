"use client";

import { motion } from "motion/react";
import { EASE, InkReveal, Reveal, RuleReveal, WordsReveal } from "./Reveal";
import { US_MAP_PATHS, US_MAP_VIEWBOX } from "./usMapPaths";

type House = {
  city: string;
  state: string;
  x: number; // svg coords in the 959×593 viewBox
  y: number;
  status: "Headquarters" | "Taking root";
  note: string;
};

// Nothing has opened its doors yet: every house is taking root. The one
// brass, breathing node is home — headquarters in the Bay Area.
const HOUSES: House[] = [
  { city: "San Francisco", state: "California", x: 62, y: 252, status: "Headquarters", note: "Home of Rua. The first house rises here." },
  { city: "Portland", state: "Oregon", x: 85, y: 95, status: "Taking root", note: "Taking root among the gardens." },
  { city: "Seattle", state: "Washington", x: 105, y: 52, status: "Taking root", note: "Taking root by the sound." },
  { city: "Denver", state: "Colorado", x: 330, y: 235, status: "Taking root", note: "Taking root a mile up." },
  { city: "Minneapolis", state: "Minnesota", x: 500, y: 130, status: "Taking root", note: "Taking root between the lakes." },
  { city: "Chicago", state: "Illinois", x: 580, y: 195, status: "Taking root", note: "Taking root along the shore." },
  { city: "Austin", state: "Texas", x: 445, y: 410, status: "Taking root", note: "Taking root in the hill country." },
  { city: "Boston", state: "Massachusetts", x: 858, y: 128, status: "Taking root", note: "Taking root by the harbor." },
];

function HouseNode({ house, index }: { house: House; index: number }) {
  const open = house.status === "Headquarters";
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, delay: 0.9 + index * 0.12, ease: EASE }}
      style={{ transformOrigin: `${house.x}px ${house.y}px` }}
    >
      {/* The quiet pulse — only home breathes, for now */}
      {open && (
        <>
          <circle cx={house.x} cy={house.y} r={16} className="fill-brass/25">
            <animate attributeName="r" values="6;22;22" dur="3.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.55;0;0" dur="3.2s" repeatCount="indefinite" />
          </circle>
        </>
      )}
      <circle
        cx={house.x}
        cy={house.y}
        r={open ? 6 : 4.5}
        className={open ? "fill-brass" : "fill-fern"}
      />
      <circle cx={house.x} cy={house.y} r={open ? 10 : 8.5} className="fill-none stroke-brass/40" strokeWidth={0.75} />
      <text
        x={house.x + 16}
        y={house.y + 4}
        className="fill-ink/70 hidden md:[display:unset]"
        style={{ fontSize: "13px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 550 }}
      >
        {house.city}
      </text>
    </motion.g>
  );
}

/**
 * 09 — The Houses. A fine-line map of where Rua grows,
 * each house a brass seed. In-bloom houses breathe.
 */
export default function Houses() {
  return (
    <section id="houses" className="bg-bone py-16 md:py-24">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12">
        <div className="flex items-center gap-5 md:gap-8">
          <Reveal y={12} duration={0.8}>
            <p className="voice-kicker whitespace-nowrap text-moss">
              The Houses
            </p>
          </Reveal>
          <RuleReveal className="flex-1 bg-ink/15" delay={0.15} />
        </div>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
          <WordsReveal
            text="Where the circle grows."
            as="h2"
            className="voice-display max-w-[13ch] text-[clamp(2.8rem,6.5vw,6.25rem)] text-ink md:col-span-8"
          />
          <InkReveal
            text="Eight houses taking root, from our Bay Area home outward."
            className="max-w-sm text-[0.95rem] leading-relaxed text-ink/70 md:col-span-4 md:justify-self-end md:pb-2"
            delay={0.3}
          />
        </div>

        {/* ——— The map ——— */}
        <Reveal className="mt-10 md:mt-14" y={40} duration={1.3}>
          <div className="relative mx-auto max-w-5xl">
            <svg
              viewBox={US_MAP_VIEWBOX}
              className="w-full"
              role="img"
              aria-label="Map of the United States marking Rua headquarters in San Francisco and houses taking root in Portland, Seattle, Denver, Minneapolis, Chicago, Austin and Boston"
            >
              <g
                className="fill-transparent stroke-ink/[0.16]"
                strokeWidth={0.75}
                strokeLinejoin="round"
                dangerouslySetInnerHTML={{ __html: US_MAP_PATHS }}
              />
              {HOUSES.map((h, i) => (
                <HouseNode key={h.city} house={h} index={i} />
              ))}
            </svg>
          </div>
        </Reveal>

        {/* ——— The ledger ——— */}
        <div className="mx-auto mt-10 max-w-5xl md:mt-12">
          <RuleReveal className="bg-ink/10" />
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {HOUSES.map((h, i) => (
              <li key={h.city} className="border-b border-ink/10 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+4)]:border-b-0">
                <Reveal delay={i * 0.07} y={20} className="py-7 pr-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="voice-upright text-[1.25rem]">{h.city}</h3>
                    <span
                      className={`voice-kicker text-[0.6rem] ${
                        h.status === "Headquarters"
                          ? "text-brass-deep"
                          : "text-ink/70"
                      }`}
                    >
                      {h.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[0.82rem] tracking-[0.06em] text-ink/70">
                    {h.state}
                  </p>
                  <p className="mt-3 text-[0.9rem] leading-relaxed text-ink/70">
                    {h.note}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
