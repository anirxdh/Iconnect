import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy · Rua",
  description:
    "What this site collects (almost nothing), and the plain promises behind it.",
};

export default function PrivacyPage() {
  return (
    <LegalShell
      kicker="The fine print, kept honest"
      title="Privacy"
      updated="July 10, 2026"
    >
      <h2>The short version</h2>
      <p>
        Rua is a community project, still taking root. It is not yet an
        incorporated company, and this website offers no services and opens
        no accounts. So there is very little to tell you, and we like it
        that way.
      </p>

      <h2>What this site collects</h2>
      <ul>
        <li>
          <strong>No cookies, no profiles.</strong> This site sets no
          cookies and builds no profile of you.
        </li>
        <li>
          Visits are counted anonymously: pages viewed, country, and device
          type, through cookieless measurement that cannot identify you or
          follow you across the web. We use these counts to understand
          which parts of the site people find worth their time.
        </li>
        <li>
          If you write or call us, we keep the correspondence, and use it
          only to reply.
        </li>
      </ul>

      <h2>What we promise</h2>
      <ul>
        <li>We do not sell or share anything about you. There is nothing to sell.</li>
        <li>No advertising trackers, ever.</li>
        <li>
          If Rua one day becomes a care provider, real health information
          will come with real obligations, and this page will be replaced
          by a full notice before any of that begins.
        </li>
      </ul>

      <h2>Questions</h2>
      <p>
        Write to us at{" "}
        <a href="mailto:ishanagu0601@gmail.com">ishanagu0601@gmail.com</a>{" "}
        and a person will answer.
      </p>
    </LegalShell>
  );
}
