"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE } from "./Reveal";

/**
 * Opening curtain: the wordmark grows a stem beneath it while a counter
 * climbs; then the whole veil lifts like morning fog.
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDone(true);
      return;
    }
    document.documentElement.style.overflow = "hidden";
    let value = 0;
    const tick = () => {
      value += Math.random() * 16 + 6;
      if (value >= 100) {
        setProgress(100);
        setTimeout(() => setDone(true), 420);
        return;
      }
      setProgress(Math.floor(value));
      setTimeout(tick, Math.random() * 130 + 70);
    };
    const t = setTimeout(tick, 200);
    return () => clearTimeout(t);
  }, [reduced]);

  useEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-forest"
          exit={{ y: "-100%" }}
          transition={{ duration: 1.05, ease: EASE }}
          aria-hidden
        >
          <motion.div
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex flex-col items-center"
          >
            <span className="voice-display text-bone text-[clamp(2.6rem,6vw,4.6rem)]">
              Rua
            </span>
            <motion.div
              className="mt-6 h-14 w-px bg-sage/60 origin-top"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: progress / 100 }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
            <div className="voice-kicker mt-6 text-sage tabular-nums">
              {progress.toString().padStart(3, "0")}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
