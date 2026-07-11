"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  CurtainImage,
  InkReveal,
  Reveal,
  RuleReveal,
  WordsReveal,
} from "./Reveal";

const STATS = [
  { value: "24/7", caption: "the watch never ends" },
  { value: "10–15", caption: "patients per caretaker, never more" },
  { value: "1", caption: "living record that follows you" },
];

/**
 * 03 — The Caretakers. The soul of the site: a dark, hushed room where
 * the three B&W portraits hang like family photographs. Each one warms
 * toward brass when a hand lingers on it — tended, not archived.
 */
export default function Caretakers() {
  const collageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: collageRef,
    offset: ["start end", "end start"],
  });

  // Three photographs drift at three speeds — a slow breath between frames.
  const yBraid = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const yHands = useTransform(scrollYProgress, [0, 1], [110, -70]);
  const yRest = useTransform(scrollYProgress, [0, 1], [30, -120]);
  const yQuote = useTransform(scrollYProgress, [0, 1], [46, -36]);

  return (
    <section className="relative overflow-hidden bg-forest text-bone">
      <div className="mx-auto max-w-[90rem] px-6 py-28 md:px-12 md:py-40">
        {/* ——— Kicker · rule · headline ——— */}
        <Reveal y={18}>
          <p className="voice-kicker text-sage">The Caretakers</p>
        </Reveal>
        <RuleReveal className="mt-6 bg-bone/20" delay={0.15} />

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12 md:items-end md:gap-8">
          <h2 className="voice-upright text-bone text-[clamp(2.75rem,6.2vw,5.75rem)] md:col-span-8">
            <WordsReveal as="span" className="block" text="Trained hands." />
            <span className="block">
              <WordsReveal
                as="span"
                className="voice-display text-brass"
                text="Devoted"
                delay={0.2}
              />{" "}
              <WordsReveal as="span" text="hours." delay={0.3} />
            </span>
          </h2>
          <InkReveal
            className="max-w-md leading-relaxed text-bone/70 md:col-span-4 md:pb-3"
            delay={0.4}
            text="The soul of this network is not the software. It is the people who arrive at the door, and stay."
          />
        </div>

        {/* ——— The collage: three portraits, three drift speeds ——— */}
        <div
          ref={collageRef}
          className="relative mt-20 flex flex-col gap-12 md:mt-32 md:grid md:grid-cols-12 md:items-start md:gap-x-8 md:gap-y-0"
        >
          {/* Braiding — tall, left, largest */}
          <motion.div
            className="photo-bloom relative w-full md:col-span-5 md:col-start-1 md:row-start-1"
            style={reduced ? undefined : { y: yBraid }}
          >
            <CurtainImage
              src="/people/portrait-beret.jpg"
              alt="Aged hands braiding long silver hair into a loose plait"
              className="aspect-[11/14] w-full"
              curtainClass="bg-forest"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-brass/40 mix-blend-color"
            />
          </motion.div>

          {/* Held hands — center-right, anchored lower */}
          <motion.div
            className="photo-bloom relative w-4/5 self-end md:col-span-3 md:col-start-6 md:row-start-1 md:w-full md:self-end"
            style={reduced ? undefined : { y: yHands }}
          >
            <CurtainImage
              src="/people/cane-kiss.jpg"
              alt="Two elderly hands clasped together, wedding rings still worn"
              className="aspect-[4/5] w-full"
              curtainClass="bg-forest"
              delay={0.12}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-brass/40 mix-blend-color"
            />
          </motion.div>

          {/* The pull-quote drifts in the clearing between frames */}
          <motion.blockquote
            className="relative z-10 my-6 md:absolute md:right-0 md:bottom-2 md:my-0 md:w-[30%]"
            style={reduced ? undefined : { y: yQuote }}
          >
            <WordsReveal
              as="p"
              className="voice-display max-w-[20ch] text-[clamp(1.6rem,3vw,2.6rem)] text-bone/90"
              text="Machines carry the paperwork. People carry each other."
              delay={0.2}
              stagger={0.07}
            />
          </motion.blockquote>

          {/* At rest — right, higher, smallest */}
          <motion.div
            className="photo-bloom relative w-3/5 md:col-span-3 md:col-start-10 md:row-start-1 md:mt-12 md:w-full"
            style={reduced ? undefined : { y: yRest }}
          >
            <CurtainImage
              src="/people/doorway-couple.jpg"
              alt="An elderly woman seated in a wooden chair, hands folded in her lap"
              className="aspect-[5/6] w-full"
              curtainClass="bg-forest"
              delay={0.24}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-brass/40 mix-blend-color"
            />
          </motion.div>
        </div>

        {/* ——— Who arrives at the door ——— */}
        <div className="mt-24 grid gap-12 md:mt-36 md:grid-cols-12 md:gap-8">
          <InkReveal
            className="leading-relaxed text-bone/70 md:col-span-4 md:col-start-2"
            text="Geriatricians and gerontological nurses. People who chose older adults as their life's work."
          />
          <InkReveal
            className="leading-relaxed text-bone/70 md:col-span-4 md:col-start-7 md:mt-20"
            delay={0.15}
            text="Trained through Rua in first aid, cardiac life support, and wound care. Ten to fifteen patients each. Never more."
          />
        </div>

        {/* ——— The measures that matter ——— */}
        <div className="mt-28 md:mt-40">
          <RuleReveal className="bg-bone/20" />
          <div className="mt-12 grid gap-12 sm:grid-cols-3 md:mt-16 md:gap-8">
            {STATS.map((stat, i) => (
              <Reveal key={stat.value} delay={0.15 + i * 0.16} y={28}>
                <p className="voice-upright text-brass text-[clamp(3rem,5.5vw,5rem)]">
                  {stat.value}
                </p>
                <p className="mt-3 max-w-[24ch] text-sm leading-relaxed text-sage">
                  {stat.caption}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
