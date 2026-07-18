"use client";

import { Reveal, RuleReveal, WordsReveal } from "./Reveal";

/**
 * The companion app: three finished screens side by side in one calm view,
 * with a single line of handwriting as the wink. Desktop shows the trio;
 * phones swipe through a snap carousel. Nothing pins, nothing hijacks.
 */

const SCREENS = [
  {
    key: "morning",
    caption: "The day, already arranged",
    line: "Walks, visits and appointments arrive gently, one morning at a time.",
  },
  {
    key: "medication",
    caption: "Medicine that keeps itself",
    line: "Every dose confirmed on the wrist, every miss noticed in minutes.",
  },
  {
    key: "circle",
    caption: "The circle, always close",
    line: "Family sees what matters the moment it matters. Never more, never less.",
  },
] as const;

function CircleChips({ active }: { active: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {["EA", "RA", "RM"].map((who) => (
        <span
          key={who}
          className={`flex h-6 w-6 items-center justify-center rounded-full text-[0.5rem] font-semibold ${
            who === active
              ? "bg-ink text-cream"
              : "border border-ink/15 text-ink/75"
          }`}
        >
          {who}
        </span>
      ))}
    </div>
  );
}

function MorningScreen() {
  return (
    <div className="flex h-full flex-col bg-cream px-5 pt-9 pb-5 font-sans">
      <div className="flex items-center justify-between">
        <p className="text-[0.56rem] font-semibold tracking-[0.18em] text-ink/75 uppercase">
          Tuesday · July 14
        </p>
        <CircleChips active="EA" />
      </div>
      <p className="mt-2.5 text-[1.3rem] font-semibold leading-tight tracking-tight text-ink">
        Good morning,
        <br />
        Eleanor.
      </p>
      <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
        {[
          ["8:00", "Garden walk", "With Maya, around the pond"],
          ["11:30", "Dr. Osei", "She already has your chart"],
          ["4:00", "Checkers club", "Sam is bringing the board"],
        ].map(([time, name, sub]) => (
          <div key={name as string} className="flex items-baseline gap-3 py-3">
            <p className="w-9 shrink-0 text-[0.68rem] font-semibold text-moss">{time}</p>
            <div>
              <p className="text-[0.78rem] font-semibold text-ink">{name}</p>
              <p className="mt-0.5 text-[0.68rem] text-ink/75">{sub}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-moss" />
        <p className="text-[0.66rem] text-ink/75">The circle is watching over today.</p>
      </div>
    </div>
  );
}

function MedicationScreen() {
  return (
    <div className="flex h-full flex-col bg-cream px-5 pt-9 pb-5 font-sans">
      <p className="text-[0.56rem] font-semibold tracking-[0.18em] text-ink/75 uppercase">
        Medication
      </p>
      <p className="mt-2.5 text-[1.3rem] font-semibold leading-tight tracking-tight text-ink">
        All taken,
        <br />
        on time.
      </p>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[3px] border-moss">
          <span className="text-[0.95rem] font-semibold text-ink">3/3</span>
        </div>
        <div>
          <p className="text-[0.72rem] font-semibold text-ink">Adherence 98%</p>
          <p className="mt-0.5 text-[0.64rem] text-ink/75">Last 30 days · confirmed on the wrist</p>
        </div>
      </div>
      <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
        {[
          ["Metformin 500 mg", "8:02 am"],
          ["Lisinopril 10 mg", "8:02 am"],
          ["Vitamin D", "12:31 pm"],
        ].map(([name, time]) => (
          <div key={name} className="flex items-center justify-between py-3">
            <p className="text-[0.75rem] font-medium text-ink">{name}</p>
            <p className="text-[0.64rem] font-semibold text-moss">✓ {time}</p>
          </div>
        ))}
      </div>
      <p className="mt-auto text-[0.66rem] text-ink/75">
        A missed dose is noticed within minutes.
      </p>
    </div>
  );
}

function CircleScreen() {
  return (
    <div className="flex h-full flex-col bg-cream px-5 pt-9 pb-5 font-sans">
      <div className="flex items-center justify-between">
        <p className="text-[0.56rem] font-semibold tracking-[0.18em] text-ink/75 uppercase">
          The circle
        </p>
        <CircleChips active="EA" />
      </div>
      <p className="mt-2.5 text-[1.3rem] font-semibold leading-tight tracking-tight text-ink">
        Maya is on
        <br />
        her way.
      </p>
      <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
        <div className="flex items-center gap-3 py-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-[0.55rem] font-semibold text-cream">M</span>
          <div className="min-w-0">
            <p className="text-[0.75rem] font-semibold text-ink">
              Maya · caretaker
            </p>
            <p className="mt-0.5 text-[0.66rem] text-ink/75">Morning visit, as every day</p>
          </div>
          <span className="ml-auto rounded-full bg-moss px-2 py-0.5 text-[0.5rem] font-semibold tracking-[0.08em] text-cream uppercase">
            8 min
          </span>
        </div>
        <div className="flex items-center gap-3 py-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/15 text-[0.55rem] font-semibold text-ink/75">MA</span>
          <div className="min-w-0">
            <p className="text-[0.75rem] font-semibold text-ink">Maria · daughter</p>
            <p className="mt-0.5 truncate text-[0.66rem] text-ink/75">“Sleep was calm. All well.”</p>
          </div>
        </div>
        <div className="flex items-center gap-3 py-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink/15 text-[0.55rem] font-semibold text-ink/75">911</span>
          <div className="min-w-0">
            <p className="text-[0.75rem] font-semibold text-ink">Emergency services</p>
            <p className="mt-0.5 text-[0.66rem] text-ink/75">Connected · nothing to report</p>
          </div>
        </div>
      </div>
      <div className="mt-auto flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-moss" />
        <p className="text-[0.66rem] text-ink/75">Watching, quietly</p>
      </div>
    </div>
  );
}


const SCREEN_COMPONENTS = [MorningScreen, MedicationScreen, CircleScreen];

function PhoneCard({ index }: { index: number }) {
  const Screen = SCREEN_COMPONENTS[index];
  const meta = SCREENS[index];
  return (
    <div className="w-[16rem] shrink-0 snap-center md:w-auto md:max-w-[16.5rem]">
      <div className="relative aspect-[9/19] rounded-[2.4rem] bg-forest p-[0.5rem] shadow-2xl shadow-ink/25">
        <span
          aria-hidden
          className="absolute left-1/2 top-[0.82rem] z-20 h-[0.38rem] w-14 -translate-x-1/2 rounded-full bg-forest"
        />
        <div className="h-full w-full overflow-hidden rounded-[1.95rem] bg-cream">
          <Screen />
        </div>
      </div>
      <p className="voice-kicker mt-6 text-center text-brass-deep">
        {meta.caption}
      </p>
      <p className="mx-auto mt-2 max-w-[30ch] text-center text-[0.9rem] leading-relaxed text-ink/85">
        {meta.line}
      </p>
    </div>
  );
}

export default function PhoneShowcase() {
  return (
    <section id="companion" className="overflow-hidden bg-bone py-16 md:py-24">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12">
        <div className="flex items-center gap-5 md:gap-8">
          <Reveal y={12} duration={0.8}>
            <p className="voice-kicker whitespace-nowrap text-moss">The Companion</p>
          </Reveal>
          <RuleReveal className="flex-1 bg-ink/15" delay={0.15} />
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
          <WordsReveal
            text="Care, in the family's pocket."
            as="h2"
            className="voice-display max-w-[16ch] text-[clamp(2.2rem,5.5vw,5.5rem)] text-ink"
          />
          {/* the one surviving line of handwriting — a wink, not a style */}
          <Reveal delay={0.25}>
            <p className="font-hand rotate-[-2deg] text-[1.5rem] leading-tight text-ink/85">
              the app we are growing
              <svg viewBox="0 0 190 16" className="mt-1 h-3 w-full" aria-hidden>
                <path
                  d="M 4 10 Q 30 6 60 9 T 120 8 T 186 9"
                  fill="none"
                  className="stroke-moss"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
            </p>
          </Reveal>
        </div>

        {/* Desktop: the trio in one view. Phones: a snap carousel. */}
        <div
          data-carousel
          className="mt-12 flex snap-x snap-mandatory gap-8 overflow-x-auto px-2 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mt-16 md:snap-none md:justify-center md:gap-10 md:overflow-visible lg:gap-14"
        >
          {SCREENS.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.12} y={30}>
              <PhoneCard index={i} />
            </Reveal>
          ))}
        </div>

        {/* swipe hint, phones only */}
        <p className="voice-kicker mt-2 text-center text-[0.6rem] text-ink/70 md:hidden">
          Swipe
        </p>
      </div>
    </section>
  );
}
