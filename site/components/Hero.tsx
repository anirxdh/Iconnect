"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { EASE, Whisper } from "./Reveal";

const HEADLINE_TOP = ["Growing", "old", "is", "a"];
const HEADLINE_ITALIC = ["garden."];
const HEADLINE_BOTTOM = ["We", "tend", "it."];

function Slot({
  word,
  i,
  italic = false,
  reduced = false,
}: {
  word: string;
  i: number;
  italic?: boolean;
  reduced?: boolean;
}) {
  return (
    <>
      <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
        <motion.span
          className={`inline-block ${
            italic ? "voice-display text-brass-deep" : ""
          }`}
          // The reduced targets must still zero the transform: useReducedMotion
          // is null during SSR, so the words mount translated out of their
          // slots — a fade that never clears y would leave the hero empty.
          initial={reduced ? { opacity: 0, y: "0%", rotate: 0 } : { y: "112%", rotate: 3 }}
          animate={
            reduced ? { opacity: 1, y: "0%", rotate: 0 } : { y: "0%", rotate: 0 }
          }
          transition={
            reduced
              ? { duration: 0.6, delay: 0.15 }
              : { duration: 1.25, delay: 2.25 + i * 0.09, ease: EASE }
          }
        >
          {word}
        </motion.span>
      </span>{" "}
    </>
  );
}

/**
 * The hero, set like a product page: pearl ground, a ghost wordmark
 * drifting behind, the headline centered, and the photograph presented
 * beneath it at its native size — the object of desire.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const ghostY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  let slot = 0;

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-start overflow-hidden bg-bone"
    >
      {/* Ghost wordmark, the quiet monument behind everything */}
      <motion.span
        aria-hidden
        data-decorative
        className="voice-display pointer-events-none absolute top-[0.02em] left-1/2 -translate-x-1/2 text-[38vw] leading-none text-ink/[0.05] select-none"
        style={reduced ? undefined : { y: ghostY }}
      >
        Rua
      </motion.span>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-col items-center px-6 pt-32 md:pt-36"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        {/* Sized so "Growing old is a garden." always holds one line. */}
        <h1 className="voice-upright text-center text-ink text-[clamp(1.55rem,min(6.4vw,11svh),6rem)]">
          <span className="whitespace-nowrap">
            {HEADLINE_TOP.map((w) => (
              <Slot key={w} word={w} i={slot++} reduced={reduced} />
            ))}
            {HEADLINE_ITALIC.map((w) => (
              <Whisper key={w} note="Every garden needs a gardener." id={w}>
                <Slot word={w} i={slot++} italic reduced={reduced} />
              </Whisper>
            ))}
          </span>
          <br />
          <span className="whitespace-nowrap">
            {HEADLINE_BOTTOM.map((w) => (
              <Slot key={w} word={w} i={slot++} reduced={reduced} />
            ))}
          </span>
        </h1>

        {/* The photograph, presented — never stretched past its pixels */}
        <motion.div
          className="mt-10 w-[min(30rem,84vw)] md:mt-12"
          style={reduced ? undefined : { y: photoY }}
        >
          <motion.div
            className="overflow-hidden rounded-md shadow-2xl shadow-ink/25"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.5, delay: reduced ? 0.2 : 2.8, ease: EASE }}
          >
            <img
              src="/people/swing-tree.jpg"
              alt="An elderly man pushing his wife on a swing beneath an old tree"
              fetchPriority="high"
              className="h-auto w-full"
            width={567}
              height={683}
            />
          </motion.div>
        </motion.div>

        {/* The wordless invitation to scroll */}
        <motion.div
          className="mt-9 mb-8 text-ink/85 [@media(max-height:600px)]:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 3.6 }}
        >
          <span className="relative flex h-11 w-7 items-start justify-center rounded-full border border-ink/30 pt-2">
            <motion.span
              className="block h-2 w-px bg-ink/60"
              animate={reduced ? undefined : { y: [0, 14, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
