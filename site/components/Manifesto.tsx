"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { EASE, InkReveal, Reveal, RuleReveal, WordsReveal } from "./Reveal";

const MANIFESTO =
  "One record. One wearable. One circle who knows you by name.";

const CARDS = [
  {
    src: "/people/three-friends.jpg",
    from: 90,
    to: -110,
    rotate: -4,
    position:
      "right-[2%] top-[10%] w-[14rem] xl:w-[17rem] 2xl:right-[3%] 2xl:w-[19rem]",
  },
  {
    src: "/people/seaside-hug.jpg",
    from: 150,
    to: -170,
    rotate: 3,
    position:
      "left-[2%] top-[62%] w-[13rem] xl:w-[16rem] 2xl:left-[3%] 2xl:w-[18rem]",
  },
  {
    src: "/people/braiding-hair.jpg",
    from: 50,
    to: -60,
    rotate: -2.5,
    position: "bottom-[8%] right-[8%] w-[11rem] xl:w-[13rem] 2xl:w-[15rem]",
  },
] as const;

/** A campaign card drifting at its own pace behind the manifesto. */
function FloatCard({
  src,
  progress,
  from,
  to,
  rotate,
  position,
}: {
  src: string;
  progress: MotionValue<number>;
  from: number;
  to: number;
  rotate: number;
  position: string;
}) {
  const reduced = useReducedMotion();
  const y = useTransform(progress, [0, 1], [from, to]);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-8% 0px" });
  // The entrance waits for the pixels, not just the viewport: fading in a
  // frame whose image is still decoding pops mid-animation and reads as a
  // twitch. Cached images may finish before hydration, so check complete.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (imgRef.current?.complete) setReady(true);
  }, []);
  const shown = inView && ready;
  return (
    <motion.div
      ref={cardRef}
      aria-hidden
      className={`pointer-events-none absolute hidden lg:block ${position}`}
      style={reduced ? { rotate } : { y, rotate }}
    >
      <motion.img
        ref={imgRef}
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        onLoad={() => setReady(true)}
        className="aspect-[11/14] w-full rounded-sm object-cover shadow-2xl shadow-ink/10"
        initial={false}
        animate={
          shown
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: reduced ? 1 : 1.06 }
        }
        transition={{ duration: reduced ? 0.4 : 1.5, ease: EASE }}
      />
    </motion.div>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section id="vision" className="relative bg-bone">
      <div
        ref={ref}
        className="relative mx-auto max-w-[90rem] px-6 py-28 md:px-12 md:py-40"
      >
        {/* Campaign cards drift behind the words, each at its own pace */}
        {CARDS.map((card) => (
          <FloatCard key={card.src} progress={scrollYProgress} {...card} />
        ))}

        <div className="relative z-10">
          <Reveal>
            <p className="voice-kicker text-moss">01 · The Vision</p>
          </Reveal>
          <RuleReveal className="mt-6 bg-ink/15" delay={0.15} />

          <h2 className="mt-14 text-[clamp(2.1rem,7vw,7.25rem)] md:mt-20 lg:pr-[17rem] xl:pr-[21rem]">
            <WordsReveal
              as="span"
              text="The world grows older."
              className="voice-upright block text-ink"
            />
            <WordsReveal
              as="span"
              text="Its care should grow wiser."
              className="voice-display mt-2 block text-brass-deep md:mt-3"
              delay={0.4}
              stagger={0.07}
              whispers={{
                "wiser.": { note: "Care that learns you by name." },
              }}
            />
          </h2>

          <InkReveal
            text={MANIFESTO}
            className="voice-prose mt-12 md:mt-20 max-w-xl text-[clamp(1.05rem,1.5vw,1.4rem)] text-ink/85 md:mt-28 lg:ml-[26%]"
          />

          {/* On small screens the photographs overlap like kept prints */}
          <div className="mt-12 lg:hidden">
            <div className="flex items-start gap-4">
              <Reveal y={24} className="w-[56%]">
                <img
                  src="/people/braiding-hair.jpg"
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  className="w-full -rotate-2 rounded-sm shadow-xl shadow-ink/15"
                />
              </Reveal>
              <Reveal y={36} delay={0.15} className="mt-12 w-[44%]">
                <img
                  src="/people/seaside-hug.jpg"
                  alt=""
                  aria-hidden
                  loading="lazy"
                  decoding="async"
                  className="w-full rotate-2 rounded-sm shadow-xl shadow-ink/15"
                />
              </Reveal>
            </div>
            <Reveal y={30} delay={0.25} className="mx-auto -mt-8 w-[58%]">
              <img
                src="/people/three-friends.jpg"
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                className="w-full rotate-[1.5deg] rounded-sm shadow-xl shadow-ink/15"
              />
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}
