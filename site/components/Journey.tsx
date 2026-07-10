"use client";

import { Reveal, RuleReveal, Whisper, WordsReveal } from "./Reveal";

type Chapter = {
  label: string;
  headline: string;
  copy: string;
  src: string;
  alt: string;
};

const CHAPTERS: Chapter[] = [
  {
    label: "The record",
    headline: "Seventy-five.",
    copy: "Your whole story, gathered into one living record.",
    src: "/people/portrait-hands.jpg",
    alt: "",
  },
  {
    label: "The wearable",
    headline: "A companion on the wrist.",
    copy: "Worn day and night. It learns what ordinary feels like.",
    src: "/brand/hands-held.jpg",
    alt: "Two elderly hands clasped together, wedding rings catching the light.",
  },
  {
    label: "The network",
    headline: "The circle connects.",
    copy: "Help is alerted before anyone dials.",
    src: "/people/window-couple.jpg",
    alt: "",
  },
  {
    label: "The promise",
    headline: "Care that never breaks.",
    copy: "The next pair of hands already knows you.",
    src: "/people/braiding-hair.jpg",
    alt: "",
  },
];

/**
 * The Circle, told in four full-screen photographs that stack over one
 * another as the reader scrolls — no sideways movement, almost no words.
 */
export default function Journey() {
  return (
    <section id="circle" className="relative bg-forest">
      {/* ——— Section opening ——— */}
      <div className="mx-auto max-w-[90rem] px-6 pb-12 pt-16 text-bone md:px-12 md:pb-16 md:pt-24">
        <div className="flex items-center gap-5 md:gap-8">
          <Reveal y={12} duration={0.8}>
            <p className="voice-kicker whitespace-nowrap text-sage">The Circle</p>
          </Reveal>
          <RuleReveal className="flex-1 bg-bone/20" delay={0.15} />
        </div>
        <h2 className="voice-upright mt-8 max-w-[16ch] text-[clamp(2rem,5.4vw,4.9rem)]">
          <WordsReveal
            as="span"
            text="At seventy-five, a circle forms around you."
            whispers={{
              circle: {
                note: "Doctors, caretakers, family. All holding one thread.",
              },
            }}
          />
        </h2>
      </div>

      {/* ——— The stack: each chapter rises over the last ——— */}
      {CHAPTERS.map((chapter) => {
        const decorative = chapter.alt === "";
        return (
          <div
            key={chapter.headline}
            className="sticky top-0 flex h-[100svh] items-end overflow-hidden shadow-[0_-30px_60px_rgba(15,27,18,0.45)]"
          >
            <img
              src={chapter.src}
              alt={chapter.alt}
              aria-hidden={decorative || undefined}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover`}
            />
            {/* Legibility scrims, gentle — the photograph stays the point */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/10 to-forest/25"
            />

            <div className="relative z-10 mx-auto w-full max-w-[90rem] px-6 pb-14 md:px-12 md:pb-20">
              <Reveal y={16} duration={0.8}>
                <p className="voice-kicker text-sage">{chapter.label}</p>
              </Reveal>
              <WordsReveal
                as="h3"
                text={chapter.headline}
                className="voice-upright mt-4 text-bone text-[clamp(2.2rem,6vw,5.5rem)] [text-shadow:0_2px_24px_rgba(15,27,18,0.6)]"
                delay={0.12}
              />
              <Reveal delay={0.3} y={14}>
                <p className="mt-4 max-w-[44ch] text-[0.95rem] leading-relaxed text-bone/85">
                  {chapter.copy}
                </p>
              </Reveal>
            </div>
          </div>
        );
      })}
    </section>
  );
}
