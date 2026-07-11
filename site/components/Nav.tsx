"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { EASE } from "./Reveal";
import { trackEvent } from "@/lib/track";

const LINKS = [
  { label: "The Vision", href: "#vision" },
  { label: "The Circle", href: "#circle" },
  { label: "Programs", href: "#programs" },
  { label: "Nourishment", href: "#nourishment" },
  { label: "Caretakers", href: "#caregivers" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        // No blend modes: a fixed blend layer forces WebKit to recomposite
        // the whole page every scroll frame (iOS shimmer), and difference
        // washes out over midtone imagery. Instead the nav is scroll-aware:
        // transparent bone text over the hero, a solid bone bar after it.
        className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-500 ${
          open
            ? "bg-transparent"
            : scrolled
              ? "border-b border-ink/10 bg-bone/95"
              : "bg-transparent"
        }`}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 2.1, ease: EASE }}
      >
        <nav
          className={`flex items-center justify-between px-6 md:px-12 transition-[padding] duration-500 ${
            scrolled ? "py-4" : "py-7"
          }`}
        >
          <a
            href="#top"
            className={`voice-display text-[1.55rem] leading-none transition-colors duration-500 ${
              !open && scrolled ? "text-ink" : "text-bone"
            }`}
          >
            Rua
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`link-sweep text-[0.82rem] tracking-[0.08em] transition-colors duration-500 ${
                    scrolled ? "text-ink/85" : "text-bone/90"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <a
              href="#begin"
              onClick={() => trackEvent("cta", { target: "begin-at-75", source: "nav" })}
              className={`hidden rounded-full border px-5 py-2 text-[0.78rem] tracking-[0.14em] uppercase transition-colors duration-500 md:block ${
                scrolled
                  ? "border-ink/50 text-ink hover:bg-ink hover:text-bone"
                  : "border-bone/70 text-bone hover:bg-bone hover:text-forest"
              }`}
            >
              Begin at 75
            </a>
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => {
                if (!open) trackEvent("menu", { action: "open" });
                setOpen(!open);
              }}
              className="flex h-11 w-11 -m-0.5 flex-col items-center justify-center gap-[7px] lg:hidden"
            >
              <span
                className={`h-px w-7 transition-all duration-500 ${!open && scrolled ? "bg-ink" : "bg-bone"} ${
                  open ? "translate-y-[4px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-7 transition-all duration-500 ${!open && scrolled ? "bg-ink" : "bg-bone"} ${
                  open ? "-translate-y-[4px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile veil menu */}
      <motion.div
        id="mobile-menu"
        inert={!open}
        className="fixed inset-0 z-[90] flex flex-col overflow-y-auto bg-forest px-8 pt-24 pb-10 lg:hidden"
        initial={false}
        animate={
          open
            ? { clipPath: "inset(0% 0% 0% 0%)" }
            : { clipPath: "inset(0% 0% 100% 0%)" }
        }
        transition={{ duration: 0.8, ease: EASE }}
      >
        <ul className="my-auto space-y-2">
          {LINKS.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <motion.a
                href={l.href}
                onClick={() => setOpen(false)}
                className="voice-display block text-[clamp(2.4rem,9vw,4rem)] text-bone"
                initial={false}
                animate={open ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
                transition={{ duration: 0.7, delay: open ? 0.15 + i * 0.07 : 0, ease: EASE }}
              >
                {l.label}
              </motion.a>
            </li>
          ))}
        </ul>
        <motion.a
          href="#begin"
          onClick={() => {
            trackEvent("cta", { target: "begin-at-75", source: "menu" });
            setOpen(false);
          }}
          className="voice-kicker mt-12 inline-block w-fit rounded-full border border-sage px-7 py-4 text-sage"
          initial={false}
          animate={open ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: open ? 0.5 : 0 }}
        >
          Begin at 75
        </motion.a>
      </motion.div>
    </>
  );
}
