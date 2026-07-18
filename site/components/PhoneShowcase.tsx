"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Reveal, RuleReveal, WordsReveal } from "./Reveal";

/**
 * The companion app, shown the way Apple shows hardware: a phone pinned
 * centre-stage while scrolling turns its screens. Everything inside the
 * frame is a live mock built from the design system — no screenshots.
 */

const SCREENS = [
  {
    key: "morning",
    caption: "The day, already arranged",
    line: "Walks, visits and appointments arrive gently, one morning at a time.",
  },
  {
    key: "medication",
    caption: "Medicine that keeps itself",
    line: "Every dose confirmed on the wrist, every miss noticed in minutes.",
  },
  {
    key: "circle",
    caption: "The circle, always close",
    line: "Family sees what matters the moment it matters. Never more, never less.",
  },
] as const;

function MorningScreen() {
  return (
    <div className="flex h-full flex-col bg-cream px-5 pt-10 pb-6">
      <p className="voice-kicker text-[0.5rem] text-ink/85">Tuesday · July 14</p>
      <p className="voice-upright mt-2 text-[1.35rem] leading-tight text-ink">
        Good morning,
        <br />
        Eleanor.
      </p>
      <div className="mt-5 space-y-2.5">
        <div className="rounded-lg bg-bone p-3.5">
          <p className="voice-kicker text-[0.48rem] text-brass-deep">8:00 · Garden walk</p>
          <p className="mt-1 text-[0.72rem] text-ink/85">With Maya, around the pond</p>
        </div>
        <div className="rounded-lg bg-bone p-3.5">
          <p className="voice-kicker text-[0.48rem] text-ink/85">11:30 · Dr. Osei</p>
          <p className="mt-1 text-[0.72rem] text-ink/85">She already has your chart</p>
        </div>
        <div className="rounded-lg bg-bone p-3.5">
          <p className="voice-kicker text-[0.48rem] text-ink/85">4:00 · Checkers club</p>
          <p className="mt-1 text-[0.72rem] text-ink/85">Sam is bringing the board</p>
        </div>
      </div>
      <div className="mt-auto rounded-lg bg-pine p-3.5">
        <p className="text-[0.7rem] text-sage">The circle is watching over today.</p>
      </div>
    </div>
  );
}

function MedicationScreen() {
  return (
    <div className="flex h-full flex-col bg-cream px-5 pt-10 pb-6">
      <p className="voice-kicker text-[0.5rem] text-ink/85">Medication</p>
      <p className="voice-upright mt-2 text-[1.35rem] leading-tight text-ink">
        All taken,
        <br />
        on time.
      </p>
      <div className="mt-6 flex items-center justify-center">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[6px] border-moss/90">
          <span className="voice-upright text-[1.6rem] text-ink">3/3</span>
        </div>
      </div>
      <div className="mt-6 space-y-2.5">
        {[
          ["Metformin", "8:02 am"],
          ["Lisinopril", "8:02 am"],
          ["Vitamin D", "12:31 pm"],
        ].map(([name, time]) => (
          <div key={name} className="flex items-center justify-between rounded-lg bg-bone p-3.5">
            <p className="text-[0.75rem] text-ink/85">{name}</p>
            <p className="voice-kicker text-[0.46rem] text-brass-deep">✓ {time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CircleScreen() {
  return (
    <div className="flex h-full flex-col bg-pine px-5 pt-10 pb-6">
      <p className="voice-kicker text-[0.5rem] text-sage">The circle</p>
      <p className="voice-display mt-2 text-[1.35rem] leading-tight text-cream">
        Maya is on
        <br />
        her way.
      </p>
      <div className="mt-6 space-y-2.5">
        <div className="rounded-lg bg-forest p-3.5">
          <p className="voice-kicker text-[0.48rem] text-sage">Caretaker · 8 min</p>
          <p className="mt-1 text-[0.72rem] text-bone/85">Morning visit, as every day</p>
        </div>
        <div className="rounded-lg bg-forest p-3.5">
          <p className="voice-kicker text-[0.48rem] text-sage">Daughter · seen 9:14</p>
          <p className="mt-1 text-[0.72rem] text-bone/85">“Sleep was calm. All well.”</p>
        </div>
        <div className="rounded-lg bg-forest p-3.5">
          <p className="voice-kicker text-[0.48rem] text-sage">Emergency services</p>
          <p className="mt-1 text-[0.72rem] text-bone/85">Connected · nothing to report</p>
        </div>
      </div>
      <div className="mt-auto flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute h-full w-full animate-ping rounded-full bg-brass/50 [animation-duration:2.4s]" />
          <span className="relative h-2 w-2 rounded-full bg-brass" />
        </span>
        <p className="text-[0.68rem] text-sage">Watching, quietly</p>
      </div>
    </div>
  );
}

const SCREEN_COMPONENTS = [MorningScreen, MedicationScreen, CircleScreen];

function ScreenLayer({
  index,
  progress,
  children,
}: {
  index: number;
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  // All input stops clamped to [0,1]: out-of-range keyframe offsets make
  // WAAPI throw and take the whole page down with it.
  const opacity = useTransform(
    progress,
    [
      Math.max(0, index / 3),
      Math.min(1, index / 3 + 0.08),
      Math.max(0, (index + 1) / 3 - 0.05),
      Math.min(1, (index + 1) / 3 + 0.03),
    ],
    [index === 0 ? 1 : 0, 1, 1, index === SCREEN_COMPONENTS.length - 1 ? 1 : 0],
  );
  const y = useTransform(
    progress,
    [Math.max(0, index / 3 - 0.05), Math.min(1, index / 3 + 0.08)],
    [index === 0 ? 0 : 26, 0],
  );
  return (
    <motion.div className="absolute inset-0" style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}

function PhoneFrame({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="relative mx-auto aspect-[9/19] w-[15.5rem] rounded-[2.6rem] bg-forest p-[0.55rem] shadow-2xl shadow-ink/40 md:w-[17rem]">
      <span aria-hidden className="absolute left-1/2 top-[0.9rem] z-20 h-[0.42rem] w-16 -translate-x-1/2 rounded-full bg-forest" />
      <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-cream">
        {SCREEN_COMPONENTS.map((Screen, i) => (
          <ScreenLayer key={i} index={i} progress={progress}>
            <Screen />
          </ScreenLayer>
        ))}
      </div>
    </div>
  );
}

export default function PhoneShowcase() {
  const outerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Swap to the static three-up only after mount: useReducedMotion is null
  // during SSR, and exchanging branches mid-hydration mismatches the DOM.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const still = mounted && reduced;
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="companion" className="bg-bone">
      <div className="mx-auto max-w-[90rem] px-6 pt-16 md:px-12 md:pt-24">
        <div className="flex items-center gap-5 md:gap-8">
          <Reveal y={12} duration={0.8}>
            <p className="voice-kicker whitespace-nowrap text-moss">The Companion</p>
          </Reveal>
          <RuleReveal className="flex-1 bg-ink/15" delay={0.15} />
        </div>
        <WordsReveal
          text="Care, in the family's pocket."
          as="h2"
          className="voice-display mt-8 max-w-[16ch] text-[clamp(2.2rem,5.5vw,5.5rem)] text-ink"
        />
      </div>

      {still ? (
        /* Reduced motion: the three screens side by side, still. */
        <div className="mx-auto grid max-w-[90rem] gap-10 px-6 py-14 md:grid-cols-3 md:px-12">
          {SCREENS.map((s, i) => {
            const Screen = SCREEN_COMPONENTS[i];
            return (
              <div key={s.key}>
                <div className="relative mx-auto aspect-[9/19] w-[15.5rem] overflow-hidden rounded-[2.6rem] bg-forest p-[0.55rem]">
                  <div className="h-full w-full overflow-hidden rounded-[2.1rem]">
                    <Screen />
                  </div>
                </div>
                <p className="voice-kicker mt-6 text-center text-brass-deep">{s.caption}</p>
                <p className="mx-auto mt-2 max-w-[30ch] text-center text-[0.9rem] leading-relaxed text-ink/85">
                  {s.line}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        /* Full motion: the phone pinned while scroll turns its screens. */
        <div ref={outerRef} className="relative h-[320svh]">
          <div className="sticky top-0 flex h-[100svh] items-center">
            <div className="mx-auto grid w-full max-w-[90rem] items-center gap-10 px-6 md:grid-cols-2 md:px-12">
              <div className="order-2 md:order-1">
                {SCREENS.map((s, i) => (
                  <Caption key={s.key} index={i} progress={scrollYProgress} caption={s.caption} line={s.line} />
                ))}
              </div>
              <div className="order-1 md:order-2">
                <PhoneFrame progress={scrollYProgress} />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Caption({
  index,
  progress,
  caption,
  line,
}: {
  index: number;
  progress: MotionValue<number>;
  caption: string;
  line: string;
}) {
  const opacity = useTransform(
    progress,
    [
      Math.max(0, index / 3),
      Math.min(1, index / 3 + 0.09),
      Math.max(0, (index + 1) / 3 - 0.06),
      Math.min(1, (index + 1) / 3 + 0.02),
    ],
    [index === 0 ? 1 : 0.14, 1, 1, index === 2 ? 1 : 0.14],
  );
  return (
    <motion.div style={{ opacity }} className="border-t border-ink/10 py-6 first:border-t-0 md:py-8">
      <p className="voice-kicker text-brass-deep">{caption}</p>
      <p className="mt-2 max-w-[34ch] text-[1rem] leading-relaxed text-ink/85">{line}</p>
    </motion.div>
  );
}
