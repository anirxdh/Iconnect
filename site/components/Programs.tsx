"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { EASE, InkReveal, Reveal, RuleReveal, WordsReveal } from "./Reveal";

type Program = {
  number: string;
  name: string;
  description: string;
  image: string;
};

const PROGRAMS: Program[] = [
  {
    number: "01",
    name: "Social Club",
    description: "Friendship on the calendar, not by chance.",
    image: "/people/park-bench-ladies.jpg",
  },
  {
    number: "02",
    name: "Laughter Therapy",
    description: "Medicine that needs no bottle.",
    image: "/people/tulips-laugh.jpg",
  },
  {
    number: "03",
    name: "Fitness & Wellness",
    description: "Strength for the years still coming.",
    image: "/people/spa-day.jpg",
  },
  {
    number: "04",
    name: "Mental Health & Emotional Support",
    description: "Someone to sit with the hard days.",
    image: "/people/pigeon-window.jpg",
  },
  {
    number: "05",
    name: "Learning & Skill Development",
    description: "The mind stays green where it is watered.",
    image: "/people/camera-woman.jpg",
  },
  {
    number: "06",
    name: "Hobby & Recreation Clubs",
    description: "Hands busy with what they love.",
    image: "/people/vespa-ride.jpg",
  },
  {
    number: "07",
    name: "Health Services",
    description: "Medicine woven into the everyday.",
    image: "/brand/apothecary.jpg",
  },
  {
    number: "08",
    name: "Intergenerational Programs",
    description: "The young and the old, planted together.",
    image: "/people/checkers-bench.jpg",
  },
  {
    number: "09",
    name: "Community Outings",
    description: "The world, visited often.",
    image: "/people/horses-valley.jpg",
  },
  {
    number: "10",
    name: "Volunteer & Purpose",
    description: "Being needed never retires.",
    image: "/people/florist-couple.jpg",
  },
];

/* Floating frame dimensions — w-72 with a 3/4 aspect: 288 × 384px. */
const FRAME_W = 288;
const FRAME_H = 384;

/**
 * 04 — The Programs. An editorial index of ten reasons to get up.
 * Rows wash over in moss on hover while a framed photograph drifts
 * after the cursor. On touch devices the index stands quietly on its own.
 */
export default function Programs() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [finePointer, setFinePointer] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [lastActive, setLastActive] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const frameReady = loadedImages.has(PROGRAMS[lastActive].image);
  // On touch screens the wash is driven by scroll instead of hover: the row
  // crossing the center band of the viewport blooms on its own.
  const [centered, setCentered] = useState<number | null>(null);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const frameX = useSpring(cursorX, { stiffness: 150, damping: 20 });
  const frameY = useSpring(cursorY, { stiffness: 150, damping: 20 });

  /* The frame exists only for a true pointer — never on touch. */
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const frameEnabled = finePointer && !reduced;
  const scrollWash = !finePointer;

  /* Touch devices: watch which row crosses the middle of the screen. */
  useEffect(() => {
    if (!scrollWash) return;
    const rows = sectionRef.current?.querySelectorAll("[data-program-index]");
    if (!rows || rows.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = Number(
            (entry.target as HTMLElement).dataset.programIndex,
          );
          if (entry.isIntersecting) {
            setCentered(idx);
          } else {
            setCentered((cur) => (cur === idx ? null : cur));
          }
        }
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, [scrollWash]);

  /* Let the frame drift after the cursor, centered on it. */
  const lastMouse = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!frameEnabled) return;
    const move = (e: MouseEvent) => {
      lastMouse.current = { x: e.clientX, y: e.clientY };
      cursorX.set(e.clientX - FRAME_W / 2);
      cursorY.set(e.clientY - FRAME_H / 2);
    };
    // Browsers do not refresh hover state on scroll: a stationary cursor keeps
    // "hovering" a row that has scrolled away. Re-resolve the row under the
    // pointer on every scroll so the frame hides (or swaps) correctly.
    const onScroll = () => {
      const m = lastMouse.current;
      if (!m) return;
      const el = document.elementFromPoint(m.x, m.y);
      const row = el?.closest<HTMLElement>("[data-program-index]");
      if (row) {
        const idx = Number(row.dataset.programIndex);
        setActive(idx);
        setLastActive(idx);
      } else {
        setActive(null);
      }
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", onScroll);
    };
  }, [frameEnabled, cursorX, cursorY]);

  /* Warm the images so the crossfade never stutters — but only once the
     section approaches the viewport, not on first paint. */
  useEffect(() => {
    if (!frameEnabled) return;
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        PROGRAMS.forEach((p) => {
          const img = new window.Image();
          img.onload = () =>
            setLoadedImages((prev) => new Set(prev).add(p.image));
          img.src = p.image;
        });
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [frameEnabled]);

  return (
    <section ref={sectionRef} id="programs" className="relative bg-bone py-16 md:py-24">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12">
        {/* ——— Section opening ——— */}
        <div className="flex items-center gap-5 md:gap-8">
          <Reveal y={12} duration={0.8}>
            <p className="voice-kicker whitespace-nowrap text-moss">
              The Programs
            </p>
          </Reveal>
          <RuleReveal className="flex-1 bg-ink/15" delay={0.15} />
        </div>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
          <WordsReveal
            text="Days worth waking for."
            as="h2"
            className="voice-display max-w-[12ch] text-[clamp(2.8rem,6.5vw,6.25rem)] text-ink md:col-span-8"
          />
        </div>

        {/* ——— The index ——— */}
        <div className="mt-16 flex items-end justify-between md:mt-24">
          <Reveal y={10} duration={0.8}>
            <p className="voice-kicker text-ink/70">The index</p>
          </Reveal>
          <Reveal y={10} duration={0.8} delay={0.1}>
            <p className="voice-kicker text-ink/70">Ten programs</p>
          </Reveal>
        </div>

        <ul className="mt-5" onMouseLeave={() => setActive(null)}>
          {PROGRAMS.map((program, i) => {
            // Lit by the pointer on desktop (CSS hover) or by scroll position
            // on touch — the row crossing mid-screen blooms on its own.
            const lit = scrollWash && centered === i;
            return (
              <li
                key={program.number}
                data-program-index={i}
                className="group relative border-t border-ink/10 last:border-b"
                onMouseEnter={() => {
                  setActive(i);
                  setLastActive(i);
                }}
              >
                {/* Moss wash rising from the row's root. */}
                <span
                  aria-hidden
                  className={`absolute inset-0 origin-bottom bg-moss transition-transform duration-500 ease-garden group-hover:scale-y-100 ${
                    lit ? "scale-y-100" : "scale-y-0"
                  }`}
                />
                <Reveal y={26} duration={0.95}>
                  <div
                    className={`relative z-10 grid grid-cols-[3.25rem_1fr] items-center gap-x-4 py-5 transition-transform duration-500 md:grid-cols-1 md:py-7 ease-garden group-hover:translate-x-4 ${
                      lit ? "translate-x-2" : ""
                    }`}
                  >
                    {/* Mobile thumbnail — the photography the cursor frame
                        shows on desktop, resident in the row on touch. */}
                    <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-sm md:hidden">
                      <img
                        src={program.image}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        decoding="async"
                        className={`h-full w-full object-cover transition-transform duration-700 ease-garden ${
                          lit ? "scale-100" : "scale-110"
                        }`}
                      />
                    </span>
                    <span
                      className={`voice-upright text-[clamp(1.35rem,3.4vw,2.8rem)] transition-colors duration-500 ease-garden group-hover:text-bone ${
                        lit ? "text-bone" : "text-ink"
                      }`}
                    >
                      {program.name}
                    </span>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>

        {/* ——— Specialized focus ——— */}
        <Reveal className="mt-10 md:mt-14" y={30}>
          <div className="rounded-sm border border-moss/30 bg-mist p-8 md:p-12">
            <p className="voice-kicker text-moss">Specialized focus</p>
            <WordsReveal
              text="Memory may wander. Belonging stays."
              as="h3"
              className="voice-upright mt-6 max-w-[22ch] text-[clamp(1.6rem,3.2vw,2.6rem)] text-ink"
              delay={0.1}
            />
            <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-2 md:gap-12">
              <div className="border-t border-moss/25 pt-5">
                <p className="voice-kicker text-ink/70">Dementia care</p>
                <InkReveal
                  text="Dementia-friendly activities. Gentle, familiar, and unhurried."
                  className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink/70"
                  delay={0.15}
                />
              </div>
              <div className="border-t border-moss/25 pt-5">
                <p className="voice-kicker text-ink/70">For caregivers</p>
                <InkReveal
                  text="Standing support for families carrying Alzheimer’s."
                  className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink/70"
                  delay={0.25}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ——— Cursor-following frame (pointer: fine only) ——— */}
      {frameEnabled && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-50 aspect-[3/4] w-72 overflow-hidden rounded-sm bg-forest shadow-2xl shadow-ink/25"
          style={{ x: frameX, y: frameY }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            // The frame appears only once the photograph is decoded — an
            // empty forest-green card is worse than a beat of patience.
            opacity: active !== null && frameReady ? 1 : 0,
            scale: active !== null && frameReady ? 1 : 0.85,
          }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <AnimatePresence initial={false}>
            <motion.img
              key={PROGRAMS[lastActive].image}
              src={PROGRAMS[lastActive].image}
              alt=""
              onLoad={() =>
                setLoadedImages((prev) =>
                  new Set(prev).add(PROGRAMS[lastActive].image),
                )
              }
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
