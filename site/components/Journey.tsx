"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { CurtainImage, InkReveal, Reveal, RuleReveal, WordsReveal } from "./Reveal";

type Chapter = {
  numeral: string;
  label: string;
  headline: string;
  copy: string;
  src: string;
  alt: string;
  bloom?: boolean;
};

const CHAPTERS: Chapter[] = [
  {
    numeral: "01",
    label: "The record",
    headline: "Seventy-five.",
    copy: "Your whole story, gathered into one living record.",
    src: "/people/portrait-hands.jpg",
    alt: "",
  },
  {
    numeral: "02",
    label: "The wearable",
    headline: "A companion on the wrist.",
    copy: "Worn day and night. It learns what ordinary feels like.",
    src: "/brand/hands-held.jpg",
    alt: "",
  },
  {
    numeral: "03",
    label: "The network",
    headline: "The circle connects.",
    copy: "Emergency services, fire and disaster relief are already watching. Help is alerted before anyone dials.",
    src: "/people/window-couple.jpg",
    alt: "",
    bloom: true,
  },
  {
    numeral: "04",
    label: "The promise",
    headline: "Care that never breaks.",
    copy: "The next pair of hands already knows you.",
    src: "/people/braiding-hair.jpg",
    alt: "Two elderly hands clasped together, wedding rings catching the light.",
    bloom: true,
  },
];

/**
 * Track geometry, in vw. These constants MUST agree with the literal
 * Tailwind classes on the track: pl-[10vw] pr-[10vw] gap-[5vw] w-[72vw].
 */
const PANEL_W = 72;
const GAP_W = 5;
const PAD_L = 10;
const PAD_R = 10;
const TRACK_W =
  PAD_L + PANEL_W * CHAPTERS.length + GAP_W * (CHAPTERS.length - 1) + PAD_R;
const TRACK_SHIFT_VW = -(TRACK_W - 100);

/** One chapter panel on the horizontal track (lg+). */
function ChapterPanel({ chapter }: { chapter: Chapter }) {
  const decorative = chapter.alt === "";
  return (
    <div className="relative flex h-full w-[72vw] shrink-0 items-center">
      <div className="grid w-full grid-cols-12 items-center">
        {/* The image, unveiled as the panel glides into view */}
        <div className="relative z-10 col-span-5">
          <div aria-hidden={decorative || undefined}>
            <CurtainImage
              src={chapter.src}
              alt={chapter.alt}
              className="h-[58vh] w-full xl:h-[64vh]"
              curtainClass="bg-bone"
              imgClass={chapter.bloom ? "photo-bloom" : undefined}
            />
          </div>
          {/* Oversized ghost numeral, leaning over the photograph */}
          <span
            aria-hidden
            data-decorative
            className="voice-display pointer-events-none absolute -top-[0.26em] -right-[0.55em] z-20 text-[clamp(9rem,15vw,19rem)] leading-none text-parchment select-none"
          >
            {chapter.numeral}
          </span>
        </div>

        {/* The words */}
        <div className="relative z-30 col-span-6 col-start-7">
          <Reveal delay={0.1} y={20}>
            <p className="voice-kicker text-moss">
              {chapter.numeral} · {chapter.label}
            </p>
          </Reveal>
          <WordsReveal
            as="h3"
            text={chapter.headline}
            className="voice-upright mt-6 text-[clamp(2.4rem,3vw,3.6rem)] text-ink"
            delay={0.15}
          />
          <InkReveal
            text={chapter.copy}
            className="mt-7 max-w-[42ch] text-[0.95rem] leading-relaxed text-ink/70"
            delay={0.3}
          />
        </div>
      </div>
    </div>
  );
}

/** One chapter as a quiet card in the vertical stack (below lg). */
function ChapterCard({ chapter, index }: { chapter: Chapter; index: number }) {
  const decorative = chapter.alt === "";
  return (
    <article
      className={`relative max-w-xl md:max-w-2xl ${
        index % 2 === 1 ? "md:ml-auto" : ""
      }`}
    >
      <div className="relative">
        <div aria-hidden={decorative || undefined}>
          <CurtainImage
            src={chapter.src}
            alt={chapter.alt}
            className="aspect-[4/5] w-full"
            curtainClass="bg-bone"
            imgClass={chapter.bloom ? "photo-bloom" : undefined}
          />
        </div>
        <span
          aria-hidden
          data-decorative
          className="voice-display pointer-events-none absolute -bottom-[0.3em] left-3 z-10 text-[clamp(5.5rem,22vw,8rem)] leading-none text-parchment select-none"
        >
          {chapter.numeral}
        </span>
      </div>
      <Reveal delay={0.1} y={20}>
        <p className="voice-kicker mt-10 text-moss">
          {chapter.numeral} · {chapter.label}
        </p>
      </Reveal>
      <WordsReveal
        as="h3"
        text={chapter.headline}
        className="voice-upright mt-4 text-[clamp(2rem,8vw,3rem)] text-ink"
        delay={0.15}
      />
      <InkReveal
        text={chapter.copy}
        className="mt-5 max-w-[46ch] text-[0.95rem] leading-relaxed text-ink/70"
        delay={0.25}
      />
    </article>
  );
}

/** A numeral along the progress rule that brightens as its chapter passes. */
function ProgressMark({
  progress,
  index,
  numeral,
}: {
  progress: MotionValue<number>;
  index: number;
  numeral: string;
}) {
  const center = index / (CHAPTERS.length - 1);
  // Function mapper (not keyframes): keeps Motion on the JS path, since a
  // keyframe range centered on 0 or 1 would produce out-of-bounds WAAPI offsets.
  const opacity = useTransform(progress, (v) => {
    const d = Math.abs(v - center);
    return d >= 0.24 ? 0.7 : 1 - (d / 0.24) * 0.3;
  });
  return (
    <motion.span
      className="voice-kicker text-[0.625rem] text-ink"
      style={{ opacity }}
    >
      {numeral}
    </motion.span>
  );
}

export default function Journey() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  // Horizontal glide: raw scroll position, smoothed through a spring.
  // Under prefers-reduced-motion the spring is bypassed — position stays
  // strictly 1:1 with the reader's own scrolling, nothing moves on its own.
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, TRACK_SHIFT_VW]);
  const xGlide = useSpring(xRaw, { stiffness: 72, damping: 24, mass: 0.9 });
  const x = useTransform(reduced ? xRaw : xGlide, (v) => `${v}vw`);

  const fillSpring = useSpring(scrollYProgress, { stiffness: 80, damping: 26 });
  const fill = reduced ? scrollYProgress : fillSpring;

  return (
    <section id="circle" className="relative bg-bone">
      {/* ——— Section opening, in the normal flow ——— */}
      <div className="mx-auto max-w-[90rem] px-6 pt-28 pb-16 md:px-12 md:pt-40 md:pb-24">
        <Reveal>
          <p className="voice-kicker text-moss">02 · The Circle</p>
        </Reveal>
        <RuleReveal className="mt-6 bg-ink/15" delay={0.15} />

        <div className="mt-14 md:mt-20 lg:grid lg:grid-cols-12 lg:items-end lg:gap-8">
          <WordsReveal
            as="h2"
            text="At seventy-five, a circle forms around you."
            whispers={{
              circle: { note: "Doctors, caretakers, family. All holding one thread." },
            }}
            className="voice-display max-w-[16ch] text-[clamp(2.75rem,5.6vw,5.75rem)] text-ink lg:col-span-8"
          />
        </div>
      </div>

      {/* ——— The pinned horizontal stage (lg and up) ——— */}
      <div ref={stageRef} className="relative hidden h-[420vh] lg:block">
        <div className="sticky top-0 h-screen overflow-hidden">
          <p className="voice-kicker absolute top-10 right-12 z-30 text-[0.6rem] text-ink/70">
            The story moves sideways
          </p>

          <motion.div
            className="flex h-full w-max gap-[5vw] pr-[10vw] pl-[10vw] will-change-transform"
            style={{ x }}
          >
            {CHAPTERS.map((chapter) => (
              <ChapterPanel key={chapter.numeral} chapter={chapter} />
            ))}
          </motion.div>

          {/* Progress rule — a thin thread drawn as the circle closes */}
          <div className="absolute inset-x-12 bottom-9 z-30">
            <div className="relative h-px bg-ink/15">
              <motion.div
                className="absolute inset-y-0 left-0 w-full origin-left bg-moss"
                style={{ scaleX: fill }}
              />
            </div>
            <div className="mt-4 flex justify-between">
              {CHAPTERS.map((chapter, i) => (
                <ProgressMark
                  key={chapter.numeral}
                  progress={scrollYProgress}
                  index={i}
                  numeral={chapter.numeral}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ——— The same four chapters, stacked quietly (below lg) ——— */}
      <div className="mx-auto max-w-[90rem] space-y-24 px-6 pb-28 md:space-y-32 md:px-12 md:pb-40 lg:hidden">
        {CHAPTERS.map((chapter, i) => (
          <ChapterCard key={chapter.numeral} chapter={chapter} index={i} />
        ))}
      </div>
    </section>
  );
}
