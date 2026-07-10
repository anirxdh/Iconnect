"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal, RuleReveal, WordsReveal } from "./Reveal";

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
    alt: "A portrait of an elderly woman resting her face on her clasped hands",
  },
  {
    label: "The wearable",
    headline: "A companion on the wrist.",
    copy: "Worn day and night. It learns what ordinary feels like.",
    src: "/brand/hands-held.jpg",
    alt: "Two elderly hands clasped together, wedding rings catching the light",
  },
  {
    label: "The network",
    headline: "The circle connects.",
    copy: "Help is alerted before anyone dials.",
    src: "/people/window-couple.jpg",
    alt: "A couple laughing together from their open window",
  },
  {
    label: "The promise",
    headline: "Care that never breaks.",
    copy: "The next pair of hands already knows you.",
    src: "/people/braiding-hair.jpg",
    alt: "A husband braiding his wife's hair beneath their wedding portrait",
  },
];

/**
 * The Circle as scrollytelling: a pinned frame holds the photograph and
 * crossfades as each chapter's words pass beside it. Vertical, quiet,
 * and the images render near native size, where they stay sharp.
 */
export default function Journey() {
  const [active, setActive] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.chapter);
            setActive(idx);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    blockRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="circle" className="bg-forest text-bone">
      {/* ——— Section opening ——— */}
      <div className="mx-auto max-w-[90rem] px-6 pb-10 pt-16 md:px-12 md:pb-12 md:pt-24">
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

      {/* ——— Pinned frame + passing chapters ——— */}
      <div className="mx-auto grid max-w-[90rem] gap-x-16 px-6 pb-16 md:px-12 lg:grid-cols-2">
        {/* The frame: photographs trade places as the reader moves */}
        <div className="relative hidden lg:block">
          <div className="sticky top-0 flex h-[100svh] items-center">
            <div className="relative aspect-[4/5] max-h-[80svh] w-full max-w-[32rem] overflow-hidden rounded-sm">
              {CHAPTERS.map((c, i) => (
                <img
                  key={c.src}
                  src={c.src}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  data-frame-index={i}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-garden ${
                    active === i ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* The chapters */}
        <div>
          {CHAPTERS.map((chapter, i) => (
            <div
              key={chapter.headline}
              data-chapter={i}
              ref={(el) => {
                blockRefs.current[i] = el;
              }}
              className="flex min-h-[92svh] flex-col justify-center py-12"
            >
              {/* On small screens the photograph travels with its chapter */}
              <Reveal className="mb-8 lg:hidden" y={26}>
                <img
                  src={chapter.src}
                  alt={chapter.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-sm"
                />
              </Reveal>
              <Reveal y={14} duration={0.8}>
                <p className="voice-kicker text-sage">{chapter.label}</p>
              </Reveal>
              <WordsReveal
                as="h3"
                text={chapter.headline}
                className="voice-upright mt-5 text-bone text-[clamp(2.2rem,4.4vw,4.4rem)]"
                delay={0.12}
              />
              <Reveal delay={0.3} y={14}>
                <p className="mt-5 max-w-[40ch] text-[0.98rem] leading-relaxed text-bone/80">
                  {chapter.copy}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
