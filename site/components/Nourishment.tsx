"use client";

import { InkReveal, Reveal, RuleReveal, Whisper, WordsReveal } from "./Reveal";

const PROMISES = [
  {
    src: "/brand/washing-herbs.jpg",
    alt: "Hands washing fresh herbs over a steel bowl, water catching the light",
    label: "Dietary plans",
    line: "Built around every allergy and every prescription.",
  },
  {
    src: "/brand/herbal-brew.jpg",
    alt: "Rosemary, star anise and cinnamon steeping in a pot",
    label: "Farmer tie-ups",
    line: "Fresh food from growers we know by name.",
  },
  {
    src: "/brand/blueberries.jpg",
    alt: "A bowl of blueberries resting on pale silk",
    label: "Allergy notes",
    line: "Remembered by the record, never by memory.",
  },
] as const;

/**
 * Nourishment as a dark still-life gallery: ghost type behind a framed
 * chiaroscuro photograph, three promises in one straight row.
 */
export default function Nourishment() {
  return (
    <section
      id="nourishment"
      className="relative overflow-hidden bg-forest py-16 text-bone md:py-24"
    >
      {/* Ghost word, barely there — the GAZU move, whispered */}
      <span
        aria-hidden
        data-decorative
        className="voice-display pointer-events-none absolute -top-[0.05em] right-[-0.06em] z-0 text-[clamp(7rem,20vw,19rem)] leading-none text-bone/[0.05] select-none"
      >
        Nourish
      </span>

      <div className="relative z-10 mx-auto max-w-[90rem] px-6 md:px-12">
        <div className="flex items-center gap-5 md:gap-8">
          <Reveal y={12} duration={0.8}>
            <p className="voice-kicker whitespace-nowrap text-sage">
              Nourishment
            </p>
          </Reveal>
          <RuleReveal className="flex-1 bg-bone/20" delay={0.15} />
        </div>

        <div className="mt-10 grid items-center gap-10 md:mt-14 lg:grid-cols-2 lg:gap-16">
          {/* The still life, framed on the dark ground it was shot on */}
          <Reveal y={34} duration={1.2}>
            <img
              src="/brand/papaya-table.jpg"
              alt="Papayas and lemons arranged on a dark green door, a butterfly resting among them"
              loading="lazy"
              decoding="async"
              className="aspect-[5/7] w-full rounded-sm object-cover"
            width={576}
              height={744}
            />
          </Reveal>

          <div>
            <h2 className="voice-display text-[clamp(2.4rem,5.2vw,5.4rem)]">
              <WordsReveal
                as="span"
                text="Food is the first medicine."
                whispers={{
                  "medicine.": {
                    note: "eat how you want to feel",
                    tone: "light",
                  },
                }}
              />
            </h2>
            <InkReveal
              text="Every allergy remembered. Every farmer known by name."
              className="mt-6 max-w-[36ch] text-[0.98rem] leading-relaxed text-bone/85"
              delay={0.25}
            />
          </div>
        </div>

        {/* Three promises, one straight line */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 md:mt-16 md:gap-5">
          {PROMISES.map((p, i) => (
            <Reveal key={p.src} y={30} delay={i * 0.12}>
              <div className="group overflow-hidden rounded-sm">
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-garden group-hover:scale-[1.04]"
                />
              </div>
              <p className="voice-kicker mt-4 text-sage">{p.label}</p>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-bone/85">
                {p.line}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
