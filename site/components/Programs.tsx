"use client";

import { InkReveal, Reveal, RuleReveal, WordsReveal } from "./Reveal";

type Program = {
  name: string;
  description: string;
  image: string;
  alt: string;
};

const PROGRAMS: Program[] = [
  { name: "Social Club", description: "Friendship on the calendar, not by chance.", image: "/people/park-bench-ladies.jpg", alt: "Friends talking together on park benches under the trees" },
  { name: "Laughter Therapy", description: "Medicine that needs no bottle.", image: "/people/tulips-laugh.jpg", alt: "A couple laughing together over a bunch of tulips" },
  { name: "Fitness & Wellness", description: "Strength for the years still coming.", image: "/people/spa-day.jpg", alt: "Three women resting with cucumber slices over their eyes" },
  { name: "Mental Health & Emotional Support", description: "Someone to sit with the hard days.", image: "/people/pigeon-window.jpg", alt: "A woman watches a dove take flight outside her window" },
  { name: "Learning & Skill Development", description: "The mind stays green where it is watered.", image: "/people/camera-woman.jpg", alt: "A woman photographs the street with a film camera" },
  { name: "Hobby & Recreation Clubs", description: "Delight, scheduled weekly.", image: "/people/vespa-ride.jpg", alt: "An elderly couple riding a scooter, she waves with an arm in the air" },
  { name: "Health Services", description: "Care that comes to where you are.", image: "/brand/apothecary.jpg", alt: "A sunlit apothecary shelf of oils and brass vessels" },
  { name: "Intergenerational Programs", description: "Grandchildren by blood or by borrowing.", image: "/people/checkers-bench.jpg", alt: "An older man plays checkers with a young girl on a park bench" },
  { name: "Community Outings", description: "The world, visited together.", image: "/people/street-arm-in-arm.jpg", alt: "A couple walking arm in arm down an old street" },
  { name: "Volunteer & Purpose", description: "Being needed never retires.", image: "/people/florist-couple.jpg", alt: "A man kneels to greet a woman holding a bouquet of flowers" },
];

/**
 * The programs as a wall of photographs — every offering visible at once,
 * named on its own image. No numbers, no hover-hunting.
 */
export default function Programs() {
  return (
    <section id="programs" className="bg-bone py-16 md:py-24">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12">
        <div className="flex items-center gap-5 md:gap-8">
          <Reveal y={12} duration={0.8}>
            <p className="voice-kicker whitespace-nowrap text-moss">
              The Programs
            </p>
          </Reveal>
          <RuleReveal className="flex-1 bg-ink/15" delay={0.15} />
        </div>

        <WordsReveal
          text="Days worth waking for."
          as="h2"
          className="voice-display mt-8 text-[clamp(2.2rem,5.5vw,5.5rem)] text-ink"
        />

        <ul className="mt-10 grid grid-cols-2 gap-3 md:mt-14 md:grid-cols-3 md:gap-4 xl:grid-cols-5">
          {PROGRAMS.map((program, i) => (
            <li key={program.name} data-program-index={i}>
              <Reveal y={26} delay={(i % 5) * 0.07}>
                <div className="group relative overflow-hidden rounded-sm">
                  <img
                    src={program.image}
                    alt={program.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-garden group-hover:scale-[1.05]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/10 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <h3 className="voice-upright text-[clamp(1.02rem,1.4vw,1.35rem)] leading-snug text-bone">
                      {program.name}
                    </h3>
                    <p className="mt-1 hidden text-[0.78rem] leading-relaxed text-bone/85 md:block">
                      {program.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
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
                <p className="voice-kicker text-ink/85">Dementia care</p>
                <InkReveal
                  text="Dementia-friendly activities. Gentle, familiar, and unhurried."
                  className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink/85"
                  delay={0.15}
                />
              </div>
              <div className="border-t border-moss/25 pt-5">
                <p className="voice-kicker text-ink/85">For caregivers</p>
                <InkReveal
                  text="Standing support for families carrying Alzheimer's."
                  className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink/85"
                  delay={0.25}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
