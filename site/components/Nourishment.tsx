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

const PARAGRAPH =
  "Every allergy remembered. Every farmer known by name.";

const QUIET_LIST = [
  {
    title: "Dietary plans",
    line: "Built around the body's own season.",
  },
  {
    title: "Allergy notes",
    line: "Remembered, so no one must.",
  },
  {
    title: "Farmer tie-ups",
    line: "The shortest road from soil to table.",
  },
];

export default function Nourishment() {
  const collageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: collageRef,
    offset: ["start end", "end start"],
  });

  // Each layer drifts at its own pace — the table set in slow motion.
  const yPapaya = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const yHerbs = useTransform(scrollYProgress, [0, 1], [80, -60]);
  const yBlueberries = useTransform(scrollYProgress, [0, 1], [50, -70]);
  const yBrew = useTransform(scrollYProgress, [0, 1], [40, -50]);
  const yAvocados = useTransform(scrollYProgress, [0, 1], [70, -90]);
  const yCaption = useTransform(scrollYProgress, [0, 1], [60, -80]);

  return (
    <section id="nourishment" className="bg-parchment text-ink">
      <div className="mx-auto max-w-[90rem] px-6 py-28 md:px-12 md:py-40">
        {/* ————— Opening ————— */}
        <Reveal>
          <p className="voice-kicker text-moss">05 · Nourishment</p>
        </Reveal>
        <RuleReveal className="mt-6 bg-ink/15" delay={0.15} />

        <div className="mt-12 flex flex-col gap-10 md:mt-16 md:flex-row md:items-end md:justify-between md:gap-16">
          <WordsReveal
            text="Food is the first medicine."
            className="voice-display max-w-[14ch] text-[clamp(2.6rem,6.5vw,5.8rem)]"
          />
          <InkReveal
            text={PARAGRAPH}
            delay={0.3}
            className="max-w-xl text-[1.05rem] leading-relaxed text-ink/80 md:pb-3"
          />
        </div>

        {/* ————— The table, layered — desktop collage ————— */}
        <div
          ref={collageRef}
          className="relative mt-16 hidden aspect-[16/11] overflow-hidden md:mt-24 md:block"
        >
          {/* Avocado crates — top left, cropped by the frame */}
          <motion.div
            className="absolute -left-[2%] -top-[6%] z-0 w-[24%]"
            style={{ y: reduced ? 0 : yAvocados }}
          >
            <CurtainImage
              src="/people/aperitivo.jpg"
              alt="Crates of ripe avocados at market"
              curtainClass="bg-parchment"
              className="aspect-[4/5] w-full"
              delay={0.35}
            />
          </motion.div>

          {/* Papayas — the large anchor, center-left */}
          <motion.div
            className="absolute left-[8%] top-[10%] z-10 w-[46%]"
            style={{ y: reduced ? 0 : yPapaya }}
          >
            <CurtainImage
              src="/brand/papaya-table.jpg"
              alt="Halved papayas and butterflies arranged on a dark wooden table"
              curtainClass="bg-parchment"
              className="aspect-[5/6] w-full"
            />
          </motion.div>

          {/* Washing herbs — upper right */}
          <motion.div
            className="absolute right-[4%] top-[2%] z-0 w-[30%]"
            style={{ y: reduced ? 0 : yHerbs }}
          >
            <CurtainImage
              src="/brand/washing-herbs.jpg"
              alt="Hands washing fresh herbs under running water"
              curtainClass="bg-parchment"
              className="aspect-[4/5] w-full"
              delay={0.12}
            />
          </motion.div>

          {/* Blueberries — lower right, leaning on the papayas */}
          <motion.div
            className="absolute bottom-[6%] left-[47%] z-20 w-[26%]"
            style={{ y: reduced ? 0 : yBlueberries }}
          >
            <CurtainImage
              src="/brand/blueberries.jpg"
              alt="A bowl of blueberries resting on silk"
              curtainClass="bg-parchment"
              className="aspect-[4/5] w-full"
              delay={0.2}
            />
          </motion.div>

          {/* Herbal brew — small, peeking in from the lower left edge */}
          <motion.div
            className="absolute -left-[3%] bottom-[2%] z-20 w-[22%]"
            style={{ y: reduced ? 0 : yBrew }}
          >
            <CurtainImage
              src="/brand/herbal-brew.jpg"
              alt="Rosemary, star anise, and cinnamon steeping in a pot"
              curtainClass="bg-parchment"
              className="aspect-square w-full"
              delay={0.28}
            />
          </motion.div>

          {/* Floating caption — echo of the campaign */}
          <motion.div
            className="absolute bottom-[42%] left-[57%] z-30 -rotate-3"
            style={{ y: reduced ? 0 : yCaption }}
          >
            <Reveal delay={0.55} y={22}>
              <p className="voice-display whitespace-nowrap text-[clamp(1.4rem,2.6vw,2.2rem)] text-clay">
                eat how you want to feel
              </p>
            </Reveal>
          </motion.div>
        </div>

        {/* ————— The table — small screens, two quiet columns ————— */}
        <div className="mt-14 columns-2 gap-4 md:hidden">
          <div className="mb-4 break-inside-avoid">
            <CurtainImage
              src="/brand/papaya-table.jpg"
              alt="Halved papayas and butterflies arranged on a dark wooden table"
              curtainClass="bg-parchment"
              className="aspect-[4/5] w-full"
            />
          </div>
          <div className="mb-4 break-inside-avoid">
            <CurtainImage
              src="/brand/washing-herbs.jpg"
              alt="Hands washing fresh herbs under running water"
              curtainClass="bg-parchment"
              className="aspect-square w-full"
              delay={0.1}
            />
          </div>
          <div className="mb-4 break-inside-avoid py-6">
            <Reveal delay={0.2} y={18}>
              <p className="voice-display -rotate-3 text-[clamp(1.4rem,2.6vw,2.2rem)] leading-tight text-clay">
                eat how you want to feel
              </p>
            </Reveal>
          </div>
          <div className="mb-4 break-inside-avoid">
            <CurtainImage
              src="/brand/blueberries.jpg"
              alt="A bowl of blueberries resting on silk"
              curtainClass="bg-parchment"
              className="aspect-[4/5] w-full"
              delay={0.15}
            />
          </div>
          <div className="mb-4 break-inside-avoid">
            <CurtainImage
              src="/brand/herbal-brew.jpg"
              alt="Rosemary, star anise, and cinnamon steeping in a pot"
              curtainClass="bg-parchment"
              className="aspect-square w-full"
              delay={0.2}
            />
          </div>
          <div className="mb-4 break-inside-avoid">
            <CurtainImage
              src="/people/aperitivo.jpg"
              alt="Crates of ripe avocados at market"
              curtainClass="bg-parchment"
              className="aspect-[4/5] w-full"
              delay={0.25}
            />
          </div>
        </div>

        {/* ————— Three quiet promises ————— */}
        <div className="mt-24 grid gap-12 md:mt-32 md:grid-cols-3 md:gap-10">
          {QUIET_LIST.map((item, i) => (
            <div key={item.title}>
              <RuleReveal className="bg-ink/15" delay={0.1 + i * 0.15} />
              <Reveal delay={0.25 + i * 0.15} y={24}>
                <h3 className="voice-kicker mt-6 text-moss">{item.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">
                  {item.line}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
