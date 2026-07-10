import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared frame for the legal & policy pages. Same editorial voice as the
 * main site, set quieter: bone ground, generous measure, patient type.
 */
export default function LegalShell({
  kicker,
  title,
  updated,
  children,
}: {
  kicker: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bone text-ink">
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-7 md:px-8">
          <Link href="/" className="voice-display text-[1.45rem] leading-none">
            iConnect
          </Link>
          <Link
            href="/"
            className="link-sweep text-[0.78rem] tracking-[0.14em] uppercase text-ink/70"
          >
            Return to the garden
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-20 md:px-8 md:py-28">
        <p className="voice-kicker text-moss">{kicker}</p>
        <h1 className="voice-upright mt-6 text-[clamp(2.4rem,6vw,4.5rem)]">
          {title}
        </h1>
        <p className="mt-5 text-[0.85rem] tracking-[0.08em] text-ink/70">
          Last updated: {updated}
        </p>

        <article
          className="legal-prose mt-10 md:mt-12"
        >
          {children}
        </article>

        <div className="mt-20 border-t border-ink/10 pt-8">
          <p className="text-[0.85rem] leading-relaxed text-ink/70">
            Questions about this document? Write to{" "}
            <a href="mailto:privacy@iconnect.care" className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              privacy@iconnect.care
            </a>{" "}
            or call{" "}
            <a href="tel:+17632331350" className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              +1 (763) 233-1350
            </a>
            .
          </p>
          <nav className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[0.8rem] tracking-[0.1em] uppercase text-ink/70">
            <Link className="link-sweep" href="/privacy">Privacy</Link>
            <Link className="link-sweep" href="/terms">Terms</Link>
            <Link className="link-sweep" href="/accessibility">Accessibility</Link>
          </nav>
        </div>
      </div>
    </main>
  );
}
