"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CurtainImage,
  EASE,
  InkReveal,
  Reveal,
  RuleReveal,
  WordsReveal,
} from "./Reveal";

const GROUPS: { title: string; items: string[] }[] = [
  {
    title: "Work & Admin",
    items: [
      "Automated administration organizer",
      "A dashboard with everything at a glance",
      "Progress reports for every patient",
    ],
  },
  {
    title: "Training & Certification",
    items: [
      "First aid, CPR and AED",
      "Basic & advanced life support",
      "Wilderness first aid",
      "Anxiety-attack therapy",
      "Stop-the-bleed wound care",
      "Breathing exercises",
    ],
  },
  {
    title: "The Caretaker’s Own Wellbeing",
    items: [
      "Mental-health support",
      "Financial tools",
      "Clear pay structure and benefits",
    ],
  },
  {
    title: "Medication",
    items: [
      "Medication inventory",
      "Routine check-lists",
      "Trackers that never forget a dose",
    ],
  },
  {
    title: "Meals & Nutrition",
    items: [
      "Meal-plan trackers",
      "Ingredient and grocery inventories",
      "Dietary plans, allergy notes, recipes",
    ],
  },
  {
    title: "Money & Movement",
    items: [
      "Invoices and cost tracking",
      "Farmer tie-ups for fresh supply",
      "Fast routes, fuel prices, planned time",
    ],
  },
];

function AccordionGroup({
  title,
  items,
  index,
  open,
  onToggle,
}: {
  title: string;
  items: string[];
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const reduced = useReducedMotion();
  const headerId = `toolkit-header-${index}`;
  const panelId = `toolkit-panel-${index}`;

  return (
    <div className="border-t border-ink/10">
      <h3>
        <button
          type="button"
          id={headerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
        >
          <span
            className={`voice-upright text-[1.35rem] transition-colors duration-500 ${
              open ? "text-moss" : "text-ink group-hover:text-moss"
            }`}
          >
            {title}
          </span>
          <motion.span
            aria-hidden
            className="relative block h-4 w-4 shrink-0"
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
          >
            <span
              className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 transition-colors duration-500 ${
                open ? "bg-moss" : "bg-ink/45"
              }`}
            />
            <span
              className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 transition-colors duration-500 ${
                open ? "bg-moss" : "bg-ink/45"
              }`}
            />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
          >
            <ul className="space-y-3 pb-8 pr-10">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-[0.45em] text-[0.55rem] leading-none text-moss"
                  >
                    ✦
                  </span>
                  <span className="text-[0.95rem] leading-relaxed text-ink/85">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Toolkit() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="caregivers" className="bg-bone py-16 md:py-24">
      <div className="mx-auto max-w-[90rem] px-6 md:px-12">
        {/* Section opening — kicker, rule, headline */}
        <Reveal>
          <p className="voice-kicker text-moss">For Caretakers</p>
        </Reveal>
        <RuleReveal className="mt-6 bg-ink/15" delay={0.15} />

        <WordsReveal
          text="The paperwork tends itself."
          className="voice-display mt-12 max-w-[14ch] text-[clamp(2.6rem,6vw,5.75rem)] text-ink md:mt-16"
        />


        {/* Two columns — the cabinet and its drawers */}
        <div className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
          {/* LEFT — the apothecary shelf, sticky on large screens */}
          <div className="max-w-md lg:max-w-none lg:sticky lg:top-24 lg:self-start">
            <CurtainImage
              src="/brand/apothecary.jpg"
              alt="A sunlit apothecary shelf. Oils, brass vessels and folded towels, each in its place."
              className="aspect-[3/4] rounded-sm"
              curtainClass="bg-bone"
            />
            <Reveal delay={0.4} y={16}>
              <p className="voice-kicker mt-6 text-ink/85">
                Everything in its place
              </p>
            </Reveal>
          </div>

          {/* RIGHT — the accordion of tools */}
          <div>
            <Reveal y={28}>
              <div className="border-b border-ink/10">
                {GROUPS.map((group, i) => (
                  <AccordionGroup
                    key={group.title}
                    title={group.title}
                    items={group.items}
                    index={i}
                    open={open === i}
                    onToggle={() => setOpen(open === i ? null : i)}
                  />
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2} y={16}>
              <p className="mt-10 max-w-md text-sm leading-relaxed text-ink/85">
                Every list in one place, kept current by the software. A well-tended cabinet opens one drawer at a
                time.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
