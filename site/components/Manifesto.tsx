"use client";

import { InkReveal, Reveal, RuleReveal, WordsReveal } from "./Reveal";

const MANIFESTO =
  "One record. One wearable. One circle who knows you by name.";

const PHOTOS = [
  {
    src: "/people/braiding-hair.jpg",
    alt: "A husband braiding his wife's hair beneath their wedding portrait",
  },
  {
    src: "/people/seaside-hug.jpg",
    alt: "Two old friends embracing and laughing by the sea",
  },
  {
    src: "/people/three-friends.jpg",
    alt: "Three old friends standing together with flowers and walking sticks",
  },
] as const;

/**
 * The Vision: the argument in one headline, one line, and three
 * photographs in a clean aligned row. No collage, no tilt.
 */
export default function Manifesto() {
  return (
    <section id="vision" className="bg-bone py-16 md:py-24">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12">
        <div className="flex items-center gap-5 md:gap-8">
          <Reveal y={12} duration={0.8}>
            <p className="voice-kicker whitespace-nowrap text-moss">
              The Vision
            </p>
          </Reveal>
          <RuleReveal className="flex-1 bg-ink/15" delay={0.15} />
        </div>

        <h2 className="mt-10 text-[clamp(2.1rem,7vw,7.25rem)] md:mt-14">
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
          className="voice-prose mt-10 max-w-xl text-[clamp(1.15rem,1.7vw,1.6rem)] text-ink/85"
          delay={0.2}
        />

        {/* Three photographs, one straight line */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mt-16 md:gap-5">
          {PHOTOS.map((photo, i) => (
            <Reveal key={photo.src} y={30} delay={i * 0.12}>
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full rounded-sm object-cover"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
