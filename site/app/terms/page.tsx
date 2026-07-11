import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "The Fine Print · Rua",
  description:
    "What Rua is today, what it is not yet, and the honest ground rules.",
};

export default function TermsPage() {
  return (
    <LegalShell
      kicker="The fine print, kept honest"
      title="The Fine Print"
      updated="July 10, 2026"
    >
      <h2>What Rua is today</h2>
      <p>
        Rua is a community project: a vision for how growing old should be
        tended, shared here so families, caretakers, and neighbors can find
        it and help shape it. It is not yet an incorporated company.
      </p>

      <h2>What this site is not</h2>
      <ul>
        <li>
          <strong>Not a care service.</strong> Nothing here creates a care
          relationship, an enrollment, or any promise of service. The
          houses on the map are intentions taking root, not open doors.
        </li>
        <li>
          <strong>Not medical advice.</strong> Nothing on this site is a
          substitute for your physician&rsquo;s judgment.
        </li>
        <li>
          <strong>Not an emergency service.</strong> In an emergency,
          always call 911.
        </li>
      </ul>

      <h2>The site itself</h2>
      <ul>
        <li>
          The words, images, and design here belong to the Rua project and
          its contributors. Enjoy them here rather than republishing them.
        </li>
        <li>
          We may change, pause, or reimagine any part of this site as the
          community grows.
        </li>
      </ul>

      <h2>When this changes</h2>
      <p>
        If Rua becomes an operating care provider, proper terms will stand
        here before any service begins, and the date at the top of this
        page will say so.
      </p>

      <h2>Talk to us</h2>
      <p>
        Questions, ideas, or corrections:{" "}
        <a href="mailto:ishanagu0601@gmail.com">ishanagu0601@gmail.com</a>.
      </p>
    </LegalShell>
  );
}
