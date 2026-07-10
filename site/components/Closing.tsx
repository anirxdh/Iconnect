"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Reveal, RuleReveal, WordsReveal } from "./Reveal";

const EXPLORE_LINKS = [
  { label: "The Vision", href: "#vision" },
  { label: "The Circle", href: "#circle" },
  { label: "Programs", href: "#programs" },
  { label: "Nourishment", href: "#nourishment" },
  { label: "Caretakers", href: "#caregivers" },
];

const FINE_PRINT_LINKS = [
  { label: "Privacy Notice", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];

/**
 * The finale — an invitation under fog-wrapped trees, then the footer.
 * The image settles from 1.15 to rest as the reader arrives; the page
 * exhales into forest dark and closes.
 */
export default function Closing() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end end"],
  });
  const sceneScale = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [1, 1] : [1.15, 1],
  );

  return (
    <footer className="bg-forest text-bone">
      {/* ——— The invitation ——— */}
      <div
        ref={sceneRef}
        className="relative flex min-h-[74svh] items-center justify-center overflow-hidden py-16 md:py-24"
      >
        <motion.img
          src="/people/lakeside-bench.jpg"
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{ scale: sceneScale }}
        />
        <div aria-hidden className="absolute inset-0 bg-forest/70" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-forest"
        />

        <div className="relative z-10 mx-auto w-full max-w-[90rem] px-6 text-center md:px-12">
          <Reveal>
            <p className="voice-kicker text-sage">The invitation</p>
          </Reveal>
          <RuleReveal className="mx-auto mt-7 w-16 bg-bone/25" delay={0.15} />

          <WordsReveal
            text="Join the circle."
            as="h2"
            delay={0.2}
            className="voice-display mt-10 text-bone text-[clamp(3.5rem,11vw,10rem)]"
            whispers={{
              "circle.": { note: "It closes around no one.", tone: "light" },
            }}
          />


          <Reveal delay={0.7}>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <a
                href="mailto:hello@iconnect.care"
                className="voice-kicker rounded-full bg-bone px-9 py-4 text-forest transition-colors duration-500 hover:bg-brass hover:text-forest"
              >
                Begin the conversation
              </a>
              <a
                href="#programs"
                className="voice-kicker rounded-full border border-bone/50 px-9 py-4 text-bone transition-colors duration-500 hover:border-bone hover:bg-bone/10"
              >
                Visit a house
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ——— Footer bar ——— */}
      <div className="border-t border-bone/10 bg-forest px-6 py-14 md:px-12">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {/* Wordmark */}
            <div className="col-span-2 md:col-span-1">
              <p className="voice-display text-3xl text-bone">iConnect</p>
              <p className="mt-4 text-sm text-sage">
                Growing old, beautifully tended.
              </p>
            </div>

            {/* Explore */}
            <nav aria-label="Explore">
              <p className="voice-kicker text-sage">Explore</p>
              <ul className="mt-6 space-y-3">
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="link-sweep inline-block py-1.5 -my-1.5 text-sm text-bone/70"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Reach us */}
            <div>
              <p className="voice-kicker text-sage">Reach us</p>
              <ul className="mt-6 space-y-3 text-sm text-bone/70">
                <li>
                  <a
                    href="mailto:hello@iconnect.care"
                    className="link-sweep inline-block py-1.5 -my-1.5"
                  >
                    hello@iconnect.care
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+17632331350"
                    className="link-sweep inline-block py-1.5 -my-1.5"
                  >
                    +1 (763) 233-1350
                  </a>
                </li>
                <li>One Garden Way, San Francisco CA</li>
              </ul>
            </div>

            {/* The fine print */}
            <div>
              <p className="voice-kicker text-sage">The fine print</p>
              <ul className="mt-6 space-y-3">
                {FINE_PRINT_LINKS.map((link) => (
                  <li key={link.href}>
                    {/* next/link so the policy pages prefetch as the footer
                        nears the viewport — navigation lands instantly */}
                    <Link
                      href={link.href}
                      className="link-sweep inline-block py-1.5 -my-1.5 text-sm text-bone/70"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-2 border-t border-bone/10 pt-10 text-xs text-bone/60 sm:flex-row sm:justify-between">
            <p>© 2026 iConnect Care Systems</p>
            <p>No cookies · No trackers · No exceptions</p>
            <p>Planted at seventy-five · Tended for life</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
