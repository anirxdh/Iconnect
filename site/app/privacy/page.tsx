import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Privacy Notice · Rua",
  description:
    "How Rua collects, protects, and honors the personal and health information entrusted to us.",
};

export default function PrivacyPage() {
  return (
    <LegalShell
      kicker="The fine print, kept honest"
      title="Privacy Notice"
      updated="July 8, 2026"
    >
      <h2>Our promise, before the provisions</h2>
      <p>
        Rua exists to care for people in the most personal chapter of
        their lives. Nothing we hold is more sensitive than the health
        information of the people in our circle, and we treat it accordingly:
        collected only for care, seen only by those who need it to care, and
        never sold. Not to anyone, for any reason, ever.
      </p>
      <p>
        This notice explains what Rua Care Systems, Inc.
        (&ldquo;Rua,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) collects,
        why, and the rights you hold. It applies to our website, our care
        platform, our wearable devices, and our houses.
      </p>

      <h2>What we collect</h2>
      <h3>Identity &amp; enrollment</h3>
      <ul>
        <li>Name, date of birth, contact details, and emergency contacts.</li>
        <li>
          Care relationships: which caretakers, physicians, family members,
          and organizations form your circle.
        </li>
      </ul>
      <h3>Health information</h3>
      <ul>
        <li>
          Medical history imported, with authorization, from your existing
          health records (including MyChart and other EHR systems) when
          enrollment begins at seventy-five.
        </li>
        <li>
          Medications, allergies, dietary needs, and care plans maintained by
          your circle.
        </li>
        <li>
          Wearable telemetry: heart rhythm, activity, sleep, and falls.
          Location, for emergency response only.
        </li>
      </ul>
      <h3>Caregiver records</h3>
      <ul>
        <li>
          Certifications, training progress, scheduling, and payroll details
          for professional caretakers in our network.
        </li>
      </ul>
      <h3>This website</h3>
      <ul>
        <li>
          <strong>Nothing.</strong> This site sets no cookies, runs no
          analytics, and embeds no trackers. If you write or call us, we keep
          the correspondence. That is all.
        </li>
      </ul>

      <h2>Why we collect it</h2>
      <ul>
        <li>To coordinate care across your circle, without gaps or repetition.</li>
        <li>
          To summon help: our devices alert emergency services, the fire
          department, and disaster-relief networks the moment something is
          wrong.
        </li>
        <li>To keep medication, meals, and daily care safe and accurate.</li>
        <li>To train, schedule, and support the caretakers who serve you.</li>
        <li>To meet our legal and professional obligations.</li>
      </ul>
      <p>
        We do not use your information for advertising. We do not build
        profiles for marketing. We do not sell or rent personal information,
        and we have never done so.
      </p>

      <h2>Health information and HIPAA</h2>
      <p>
        Where Rua provides or coordinates care, protected health
        information (PHI) is handled in accordance with the Health Insurance
        Portability and Accountability Act (HIPAA) and applicable state law.
        Partner physicians, nurses, and care organizations access records
        under care relationships and business-associate agreements that bind
        them to the same standard. Each access to your record is logged, and
        the log is yours to inspect.
      </p>

      <h2>Who can see your information</h2>
      <ul>
        <li>
          <strong>Your circle</strong>: the caretakers, clinicians, and
          family members you (or your authorized representative) have named.
        </li>
        <li>
          <strong>Emergency responders</strong>: when a device or caretaker
          raises an alarm, responders receive what they need to help you:
          identity, location, medications, allergies, and conditions.
        </li>
        <li>
          <strong>Service partners</strong>: vetted providers (such as
          secure hosting) operating under contract, encryption, and audit.
        </li>
        <li>
          <strong>The law</strong>: when a valid legal process compels us,
          and no further.
        </li>
      </ul>

      <h2>How we protect it</h2>
      <ul>
        <li>Encryption in transit and at rest, for every record.</li>
        <li>
          Role-based access: a caretaker sees their ten to fifteen patients,
          never the roster.
        </li>
        <li>Complete audit trails on every record view and change.</li>
        <li>Annual third-party security assessment and penetration testing.</li>
        <li>
          Breach notification to you and to regulators within the timelines
          the law requires, and sooner where we can.
        </li>
      </ul>

      <h2>Your rights</h2>
      <p>You may, at any time and without charge:</p>
      <ul>
        <li>See every record we hold about you, and receive a copy.</li>
        <li>Correct anything inaccurate.</li>
        <li>Receive an accounting of who has accessed your record, and when.</li>
        <li>
          Withdraw consents you have given, including record imports and
          location services (noting that some withdrawals limit what our
          emergency response can do for you).
        </li>
        <li>
          Request deletion of information we are not legally required to
          retain.
        </li>
      </ul>
      <p>
        Write to{" "}
        <a href="mailto:ishanagu0601@gmail.com">ishanagu0601@gmail.com</a> and
        our privacy officer will respond within five business days. You may
        also lodge a complaint with the U.S. Department of Health and Human
        Services Office for Civil Rights; we will never retaliate for it.
      </p>

      <h2>Retention</h2>
      <p>
        Care records are kept for as long as care continues, then for the
        period state and federal law requires. When retention ends, records
        are destroyed securely and verifiably.
      </p>

      <h2>Children</h2>
      <p>
        Our services are designed for adults aged seventy-five and older and
        the adults who care for them. We do not knowingly collect information
        from anyone under eighteen.
      </p>

      <h2>Changes to this notice</h2>
      <p>
        When this notice changes materially, we tell you directly, by mail
        or by hand in your house, before the change takes effect. The date
        at the top of this page always reflects the current version.
      </p>
    </LegalShell>
  );
}
