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
            italic ? "voice-display text-brass" : ""
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

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  let slot = 0;

  return (
    <section ref={ref} id="top" className="relative h-[100svh] overflow-hidden bg-forest">
      {/* The scene: a couple and their tree. The garden, kept. */}
      <motion.div className="absolute inset-0" style={reduced ? undefined : { scale: sceneScale }}>
        <img
          src="/people/swing-tree.jpg"
          alt=""
          aria-hidden
          fetchPriority="high"
          className="h-full w-full object-cover object-[68%_30%] brightness-[0.8]"
        />
      </motion.div>

      {/* Scrims for legibility: a vertical veil plus a left column of shade
          under the headline — the fog behind it is the palest part of the scene */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest/55 via-forest/20 to-forest/85" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[72%] bg-gradient-to-r from-forest/60 via-forest/25 to-transparent" />

      <motion.div
        className="relative z-10 flex h-full flex-col justify-end px-6 pb-14 md:px-12 md:pb-20"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        {/* Sized so "Growing old is a garden." always holds one line. */}
        <h1 className="voice-upright text-bone text-[clamp(1.55rem,min(7.2vw,12svh),6.75rem)] [text-shadow:0_2px_28px_rgba(15,27,18,0.55)]">
          <span className="whitespace-nowrap">
            {HEADLINE_TOP.map((w) => (
              <Slot key={w} word={w} i={slot++} reduced={reduced} />
            ))}
            {HEADLINE_ITALIC.map((w) => (
              <Whisper
                key={w}
                note="Every garden needs a gardener."
                tone="light"
              >
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

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.div
            className="flex items-center gap-4 text-bone/85 [text-shadow:0_1px_14px_rgba(15,27,18,0.6)] [@media(max-height:480px)]:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 3.5 }}
          >
            <span className="relative flex h-11 w-7 items-start justify-center rounded-full border border-bone/40 pt-2">
              <motion.span
                className="block h-2 w-px bg-bone/80"
                animate={reduced ? undefined : { y: [0, 14, 0], opacity: [1, 0.2, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
