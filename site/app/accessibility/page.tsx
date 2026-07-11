import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Accessibility · Rua",
  description:
    "Rua's accessibility commitment for this website and our houses.",
};

export default function AccessibilityPage() {
  return (
    <LegalShell
      kicker="The fine print, kept honest"
      title="Accessibility"
      updated="July 8, 2026"
    >
      <h2>Our commitment</h2>
      <p>
        Rua serves people aged seventy-five and older. If our front
        door is hard to open, whether physical or digital, we have failed at
        the first step of care. We design this website to meet or exceed the Web
        Content Accessibility Guidelines (WCAG) 2.2, Level AA, and our houses
        to meet or exceed the Americans with Disabilities Act.
      </p>

      <h2>On this website</h2>
      <ul>
        <li>
          Semantic structure throughout: real headings in order, landmarks,
          lists, and buttons that are buttons.
        </li>
        <li>
          Every interaction reachable by keyboard, with visible focus.
        </li>
        <li>
          Animation yields to you: with{" "}
          <strong>&ldquo;reduce motion&rdquo;</strong> enabled in your system
          settings, decorative movement stands still, including the
          interactive forest on our front page, and every word remains
          readable.
        </li>
        <li>
          Text meets AA contrast on every background, and scales with your
          browser settings.
        </li>
        <li>
          Images that carry meaning carry descriptions; ornament is hidden
          from screen readers.
        </li>
        <li>No time limits, no autoplaying sound, no flashing content.</li>
      </ul>

      <h2>In our houses</h2>
      <ul>
        <li>Step-free entries, wide corridors, and accessible restrooms.</li>
        <li>Hearing-loop systems in program rooms.</li>
        <li>Large-print and screen-reader-ready program materials.</li>
        <li>Staff trained to assist without being asked twice.</li>
      </ul>

      <h2>Known limitations</h2>
      <p>
        The interactive artwork on our front page is decorative by design and
        conveys no information that the text does not. If you find any
        content that requires it, that is a defect. Tell us and we will fix
        it.
      </p>

      <h2>Tell us where we fall short</h2>
      <p>
        If any part of this site or our houses is difficult for you, write to{" "}
        <a href="mailto:ishanagu0601@gmail.com">ishanagu0601@gmail.com</a> or
        call <a href="tel:+17632331350">+1 (763) 233-1350</a>. A person, not
        a ticket queue, will respond within two business days, and we will
        work with you until the barrier is gone.
      </p>
    </LegalShell>
  );
}
