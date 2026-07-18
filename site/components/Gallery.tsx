"use client";

import { Reveal, RuleReveal, WordsReveal } from "./Reveal";

/**
 * The days, kept: a dense masonry wall of photographs — the site's
 * argument made without sentences. Straight edges, tight seams.
 */
const WALL: { src: string; w: number; h: number; alt: string; bloom?: boolean }[] = [
  { src: "/people/swing-tree.jpg", w: 567, h: 683, alt: "A man pushes his wife on a swing beneath an old tree" },
  { src: "/people/vespa-ride.jpg", w: 716, h: 622, alt: "An elderly couple riding a scooter, she waves with an arm in the air" },
  { src: "/people/spa-day.jpg", w: 719, h: 694, alt: "Three women resting with cucumber slices over their eyes, drinks in hand" },
  { src: "/people/checkers-bench.jpg", w: 653, h: 695, alt: "An older man plays checkers with a young girl on a park bench" },
  { src: "/people/aperitivo.jpg", w: 559, h: 680, alt: "A woman in red sunglasses sips an aperitivo through a straw" },
  { src: "/people/camera-woman.jpg", w: 553, h: 680, alt: "A woman photographs the street from her doorway with a film camera" },
  { src: "/people/tulips-laugh.jpg", w: 516, h: 618, alt: "A couple laughing together over a bunch of tulips" },
  { src: "/people/park-bench-ladies.jpg", w: 458, h: 689, alt: "Friends talking together on park benches under the trees" },
  { src: "/people/florist-couple.jpg", w: 564, h: 681, alt: "A man kneels to greet a woman holding a bouquet of flowers" },
  { src: "/people/three-friends.jpg", w: 490, h: 693, alt: "Three old friends standing together holding flowers and walking sticks" },
  { src: "/people/pigeon-window.jpg", w: 560, h: 678, alt: "A woman watches a dove take flight outside her window" },
  { src: "/people/doorway-couple.jpg", w: 598, h: 689, alt: "An elderly couple sitting close together in a doorway, deep in talk" },
  { src: "/people/nose-to-nose.jpg", w: 736, h: 1104, alt: "A couple laughing forehead to forehead" },
  { src: "/people/garden-dance.jpg", w: 403, h: 403, alt: "A man twirls his wife dancing in the garden" },
  { src: "/people/night-walk.jpg", w: 500, h: 750, alt: "A couple walks arm in arm down a city street at night" },
  { src: "/people/temple-kiss.jpg", w: 727, h: 926, alt: "A man kisses his wife on the temple" },
  { src: "/people/street-arm-in-arm.jpg", w: 389, h: 640, alt: "A couple walking arm in arm down an old street" },
  { src: "/people/foreheads.jpg", w: 625, h: 937, alt: "A couple resting forehead to forehead, eyes closed" },
  { src: "/people/mirror-morning.jpg", w: 452, h: 680, alt: "A woman fixes her earring in the bathroom mirror" },
];

export default function Gallery() {
  return (
    <section className="bg-bone py-16 md:py-24">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12">
        <div className="flex items-center gap-5 md:gap-8">
          <Reveal y={12} duration={0.8}>
            <p className="voice-kicker whitespace-nowrap text-moss">The days</p>
          </Reveal>
          <RuleReveal className="flex-1 bg-ink/15" delay={0.15} />
        </div>
        <WordsReveal
          text="Days worth keeping."
          as="h2"
          className="voice-display mt-8 text-[clamp(2.2rem,5.5vw,5.5rem)] text-ink"
        />

        <div className="mt-10 columns-2 gap-3 md:mt-12 md:columns-3 md:gap-4 xl:columns-4">
          {WALL.map((photo, i) => (
            <Reveal
              key={photo.src}
              y={26}
              delay={(i % 4) * 0.06}
              className="mb-3 break-inside-avoid md:mb-4"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                width={photo.w}
                height={photo.h}
                loading="lazy"
                decoding="async"
                className="h-auto w-full rounded-sm"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
