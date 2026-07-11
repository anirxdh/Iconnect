"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { trackEvent } from "@/lib/track";

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Fade + rise into view. The workhorse entrance. */
export function Reveal({
  children,
  delay = 0,
  y = 36,
  duration = 1.1,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Words rise out of clipped slots, one by one. For display headlines. */
export function WordsReveal({
  text,
  className,
  as: Tag = "h2",
  delay = 0,
  stagger = 0.055,
  once = true,
  whispers,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
  once?: boolean;
  /** Hover notes for specific words, keyed by the exact word token. */
  whispers?: Record<string, { note: string; tone?: "dark" | "light" }>;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      {/* The container (never translated, so IntersectionObserver can see it)
          drives the reveal; each clipped word follows via variants. Observing
          the words themselves fails: they start fully translated out of their
          overflow-hidden slots, which clips their intersection to zero. */}
      <motion.span
        aria-hidden
        initial={reduced ? false : "hidden"}
        whileInView="shown"
        viewport={{ once, margin: "-10% 0px" }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {words.map((word, i) => {
          const slot = (
            <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: "115%", rotate: 2.5 },
                  shown: { y: "0%", rotate: 0 },
                }}
                transition={{ duration: 1.15, ease: EASE }}
              >
                {word}
              </motion.span>
            </span>
          );
          const whisper = whispers?.[word];
          return (
            // The clipped slot is inline-block, so the word-separating space
            // must live OUTSIDE it — trailing spaces inside get trimmed.
            <span key={i}>
              {whisper ? (
                <Whisper note={whisper.note} tone={whisper.tone} id={word}>
                  {slot}
                </Whisper>
              ) : (
                slot
              )}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}

/** A paragraph that arrives quietly, as one piece. */
export function InkReveal({
  text,
  className,
  delay = 0,
  once = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.p
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px" }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {text}
    </motion.p>
  );
}

/**
 * A word that holds a secret: dotted brass underline, and on hover a small
 * note rises above it. Decorative flavor, hidden from screen readers (the
 * headline's sr-only copy stays clean). Hover only, so touch is untouched.
 */
export function Whisper({
  note,
  tone = "dark",
  id,
  children,
}: {
  note: string;
  tone?: "dark" | "light";
  /** Coarse tracking label (the plain word). Falls back to a slice of the note. */
  id?: string;
  children: ReactNode;
}) {
  const trackedRef = useRef(false);
  return (
    <span
      data-whisper
      className="relative inline-block border-b-2 border-dotted border-brass/55 pb-[0.05em]"
      onMouseEnter={() => {
        if (trackedRef.current) return;
        const word = id ?? note?.slice(0, 24);
        if (!word) return;
        trackedRef.current = true;
        trackEvent("whisper", { word: word.toLowerCase() });
      }}
    >
      {children}
      {/* display:none while closed (zero layout footprint on any screen);
          globals.css animates it open with @starting-style on hover. */}
      <span
        aria-hidden
        data-whisper-note
        className={`pointer-events-none absolute bottom-[calc(100%+0.9rem)] left-1/2 z-[60] w-max max-w-[17rem] whitespace-normal rounded-sm px-4 py-3 text-left font-sans text-[0.78rem] font-normal normal-case not-italic leading-relaxed tracking-normal shadow-xl ${
          tone === "light"
            ? "bg-bone text-forest shadow-ink/30"
            : "bg-forest text-bone shadow-ink/20"
        }`}
      >
        {note}
      </span>
    </span>
  );
}

/** Thin rule that draws itself across. */
export function RuleReveal({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`h-px origin-left ${className ?? "bg-ink/20"}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.4, delay, ease: EASE }}
    />
  );
}

/** Image unveiled by a curtain that slides away. */
export function CurtainImage({
  src,
  alt,
  className,
  curtainClass = "bg-bone",
  imgClass,
  delay = 0,
  parallax = false,
}: {
  src: string;
  alt: string;
  className?: string;
  curtainClass?: string;
  imgClass?: string;
  delay?: number;
  parallax?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const inView = useInView(frameRef, { once: true, margin: "-8% 0px" });
  // The curtain only lifts once the image behind it has fully loaded, so a
  // slow connection never reveals an empty frame that pops in later.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (imgRef.current?.complete) setReady(true);
  }, []);
  const shown = inView && ready;
  return (
    <div ref={frameRef} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setReady(true)}
        className={`h-full w-full object-cover ${imgClass ?? ""}`}
        initial={false}
        animate={{ scale: shown ? (parallax ? 1.08 : 1) : 1.18 }}
        transition={{ duration: 1.6, delay, ease: EASE }}
      />
      <motion.div
        aria-hidden
        className={`absolute inset-0 ${curtainClass}`}
        initial={false}
        animate={{ y: shown ? "-101%" : "0%" }}
        transition={{ duration: 1.2, delay, ease: EASE }}
      />
    </div>
  );
}
