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
 * The editorial hero: ink on bone, with the photograph held in a frame at
 * its natural size — a 577px source shown at ~480px stays pin-sharp, where
 * a full-bleed stretch would go soft on every large display.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  let slot = 0;

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden bg-bone"
    >
      <motion.div
        className="mx-auto w-full max-w-[90rem] px-6 pb-16 pt-28 md:px-12 md:pt-32"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        {/* Sized so "Growing old is a garden." always holds one line. */}
        <h1 className="voice-upright relative z-10 text-ink text-[clamp(1.55rem,min(7.2vw,12svh),6.75rem)]">
          <span className="whitespace-nowrap">
            {HEADLINE_TOP.map((w) => (
              <Slot key={w} word={w} i={slot++} reduced={reduced} />
            ))}
            {HEADLINE_ITALIC.map((w) => (
              <Whisper key={w} note="Every garden needs a gardener.">
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

        <div className="mt-10 flex items-end justify-between gap-8 md:mt-4">
          {/* The wordless invitation to scroll */}
          <motion.div
            className="mb-6 flex items-center gap-4 text-ink/60 [@media(max-height:480px)]:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 3.4 }}
          >
            <span className="relative flex h-11 w-7 items-start justify-center rounded-full border border-ink/30 pt-2">
              <motion.span
                className="block h-2 w-px bg-ink/60"
                animate={reduced ? undefined : { y: [0, 14, 0], opacity: [1, 0.2, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.div>

          {/* The photograph, framed at its own size — never stretched. */}
          <motion.div
            className="-mt-10 w-[min(30rem,78vw)] shrink-0 md:-mt-24 lg:mr-[4%]"
            style={reduced ? undefined : { y: photoY }}
          >
            <motion.div
              className="relative overflow-hidden rounded-sm shadow-2xl shadow-ink/20"
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 42, rotate: 1.8 }}
              animate={{ opacity: 1, y: 0, rotate: reduced ? 0 : 1.2 }}
              transition={{ duration: 1.4, delay: reduced ? 0.2 : 2.7, ease: EASE }}
            >
              <img
                src="/people/swing-tree.jpg"
                alt="An elderly man pushing his wife on a swing beneath an old tree"
                fetchPriority="high"
                className="h-auto w-full"
              />
            </motion.div>
            <motion.p
              className="voice-kicker mt-4 text-right text-[0.6rem] text-ink/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: reduced ? 0.4 : 3.2 }}
            >
              The garden, kept
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
