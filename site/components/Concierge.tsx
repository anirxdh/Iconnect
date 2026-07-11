"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "./Reveal";

/**
 * The concierge. Deliberately not a chatbot: no scripts, no data intake,
 * no artificial cheer — just the three honest ways to reach a human,
 * offered quietly from the corner of the page.
 */
export default function Concierge() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Appear only after the reader has settled in (past the hero). */
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Escape closes; focus moves into the panel when it opens. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-[150] md:bottom-9 md:right-9">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-label="Reach the concierge"
            className="absolute bottom-[4.4rem] right-0 w-[calc(100vw-3rem)] max-w-sm overflow-hidden rounded-sm border border-bone/10 bg-forest text-bone shadow-2xl shadow-ink/40"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="border-b border-bone/10 px-7 py-6">
              <p className="voice-kicker text-sage">The concierge</p>
              <p className="voice-display mt-3 text-[1.55rem] leading-snug">
                A person, not a program.
              </p>
              <p className="mt-3 text-[0.88rem] leading-relaxed text-bone/65">
                A human answers, usually within the hour and always
                within the day.
              </p>
            </div>

            <ul>
              <li className="border-b border-bone/10">
                <a
                  href="tel:+17632331350"
                  className="group flex items-baseline justify-between px-7 py-5 transition-colors duration-300 hover:bg-pine"
                >
                  <span>
                    <span className="voice-kicker block text-[0.6rem] text-sage">Call</span>
                    <span className="mt-1 block text-[1.02rem]">+1 (763) 233-1350</span>
                  </span>
                  <span aria-hidden className="text-bone/60 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </li>
              <li className="border-b border-bone/10">
                <a
                  href="mailto:ishanagu0601@gmail.com"
                  className="group flex items-baseline justify-between px-7 py-5 transition-colors duration-300 hover:bg-pine"
                >
                  <span>
                    <span className="voice-kicker block text-[0.6rem] text-sage">Write</span>
                    <span className="mt-1 block text-[1.02rem]">ishanagu0601@gmail.com</span>
                  </span>
                  <span aria-hidden className="text-bone/60 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </li>
              <li>
                <div className="px-7 py-5">
                  <span className="voice-kicker block text-[0.6rem] text-sage">Visit</span>
                  <span className="mt-1 block text-[0.95rem] text-bone/80">
                    One Garden Way, San Francisco CA
                  </span>
                  <span className="mt-1 block text-[0.82rem] text-bone/50">
                    Doors open daily, eight to eight.
                  </span>
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {visible && (
          <motion.button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close concierge" : "Open concierge"}
            className="group flex h-14 items-center gap-3 rounded-full border border-bone/20 bg-forest pl-6 pr-5 text-bone shadow-xl shadow-ink/30 transition-colors duration-400 hover:border-brass/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brass/60 [animation-duration:2.6s] [@media(hover:none)]:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brass" />
            </span>
            <span className="text-[0.78rem] tracking-[0.18em] uppercase">
              {open ? "Close" : "Concierge"}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
