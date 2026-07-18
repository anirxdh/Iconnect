"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE, InkReveal, Reveal, RuleReveal, WordsReveal } from "./Reveal";

type Tier = {
  numeral: string;
  title: string;
  line: string;
  points: string[];
};

const TIERS: Tier[] = [
  {
    numeral: "I",
    title: "Organizations",
    line: "Senior living communities and care facilities operating under the Rua name.",
    points: [
      "Full access to every program, club and service.",
      "The complete caretaker toolkit.",
      "The wearable network, house-wide.",
    ],
  },
  {
    numeral: "II",
    title: "Independent Caretakers",
    line: "Professionals who walk their own path, their patients beside them.",
    points: [
      "Bring your patients to an Rua house once a month.",
      "Every patient's record, already there when you arrive.",
      "Training and certification kept current.",
    ],
  },
  {
    numeral: "III",
    title: "Home Caregivers",
    line: "Family hands, caring at home.",
    points: [
      "Visit any Rua house whenever needed, for a fee.",
      "The same programs, the same welcome.",
      "Guidance for the hardest days.",
    ],
  },
];

function TierCard({ tier, delay }: { tier: Tier; delay: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className="group flex h-full min-h-[26rem] flex-col rounded-sm border border-ink/15 bg-bone p-8 transition-colors duration-500 ease-garden hover:border-moss/30 hover:bg-mist md:p-10">

        <h3 className="voice-upright mt-6 text-[1.6rem] text-ink">
          {tier.title}
        </h3>

        <p className="mt-3 font-display italic leading-relaxed text-ink/85">
          {tier.line}
        </p>

        <RuleReveal className="mt-7 bg-ink/15" delay={delay + 0.2} />

        <ul className="mt-7 flex flex-col gap-4">
          {tier.points.map((point) => (
            <li
              key={point}
              className="flex items-start gap-3 text-[0.92rem] leading-relaxed text-ink/85"
            >
              <span aria-hidden className="mt-[0.3em] text-[0.65rem] text-moss">
                ✦
              </span>
              {point}
            </li>
          ))}
        </ul>

        <a
          href="mailto:ishanagu0601@gmail.com"
          className="link-sweep voice-kicker mt-auto inline-flex w-fit items-center gap-2 pt-10 text-ink"
        >
          Enquire
          <span
            aria-hidden
            className="transition-transform duration-500 ease-garden group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </article>
    </Reveal>
  );
}

export default function AccessTiers() {
  const reduced = useReducedMotion();

  return (
    <section id="begin" className="bg-bone py-16 md:py-24">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12">
        {/* Section opening — kicker, drawn rule, headline */}
        <div className="flex items-center gap-6">
          <Reveal y={16} duration={0.9}>
            <p className="voice-kicker whitespace-nowrap text-moss">
              Ways In
            </p>
          </Reveal>
          <RuleReveal className="flex-1 bg-ink/15" delay={0.2} />
        </div>

        <WordsReveal
          text="Three ways into the circle."
          className="voice-upright mt-10 max-w-[16ch] text-[clamp(2.8rem,6vw,5.5rem)] text-ink md:mt-14"
        />

        {/* The three doors */}
        <div className="mt-16 grid gap-5 md:mt-24 md:grid-cols-3">
          {TIERS.map((tier, i) => (
            <TierCard key={tier.numeral} tier={tier} delay={i * 0.12} />
          ))}
        </div>

        {/* Closing note */}
        <div className="mt-16 flex flex-col items-center gap-6 md:mt-24">
          <motion.span
            aria-hidden
            className="text-[0.8rem] text-moss"
            initial={reduced ? false : { opacity: 0, scale: 0.4, rotate: -90 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            ✦
          </motion.span>
          <Reveal y={20} delay={0.15}>
            <p className="voice-kicker text-center leading-loose text-ink/85">
              Rua activates at seventy-five. The circle is waiting.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
