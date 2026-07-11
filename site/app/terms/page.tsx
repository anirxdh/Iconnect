import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";

export const metadata: Metadata = {
  title: "Terms of Service · Rua",
  description:
    "The terms that govern Rua's care network, houses, wearable devices, and website.",
};

export default function TermsPage() {
  return (
    <LegalShell
      kicker="The fine print, kept honest"
      title="Terms of Service"
      updated="July 8, 2026"
    >
      <h2>The agreement</h2>
      <p>
        These terms are an agreement between you and Rua Care Systems,
        Inc. (&ldquo;Rua&rdquo;). They govern the use of our website, our
        care platform and wearable devices, and our houses. By enrolling,
        visiting, or using our services, you accept them. Where a separate
        enrollment or licensing agreement exists for individuals, caretakers,
        or organizations, that agreement controls if the two differ.
      </p>

      <h2>What Rua is, and is not</h2>
      <p>
        Rua coordinates care. We unify health records, connect wearable
        devices to emergency services, train and support caretakers, and run
        houses with programs for people aged seventy-five and older.
      </p>
      <p>
        <strong>Rua is not a substitute for emergency services or for
        medical judgment.</strong> Our devices alert responders automatically,
        but if you are able to call 911, always call 911. Clinical decisions
        belong to you and your physicians; our platform informs those
        decisions, it does not make them.
      </p>

      <h2>Enrollment and eligibility</h2>
      <ul>
        <li>
          Individual enrollment is designed for adults aged seventy-five and
          older, personally or through an authorized representative.
        </li>
        <li>
          Enrollment requires accurate information. Care built on inaccurate
          records is unsafe, and we may pause services until records are
          corrected.
        </li>
        <li>
          Record imports from external systems (such as MyChart) occur only
          with written authorization, which you may withdraw at any time.
        </li>
      </ul>

      <h2>Three ways in</h2>
      <ul>
        <li>
          <strong>Organizations.</strong> Senior-living communities and care
          facilities may operate under the Rua name by license,
          receiving full access to our programs, platform, and network,
          subject to our standards of care and audit.
        </li>
        <li>
          <strong>Independent caretakers.</strong> Certified professionals
          may bring their patients to an Rua house once each month, and
          use the caretaker toolkit under an individual license.
        </li>
        <li>
          <strong>Home caregivers.</strong> Families caring at home may visit
          any Rua house as guests, whenever needed, for a posted fee.
        </li>
      </ul>

      <h2>Caretaker standards</h2>
      <p>
        Professional caretakers in our network complete and maintain Rua
        training and certification, including first aid, CPR/AED, basic and
        advanced life support, wound care, and anxiety-attack therapy. They
        serve no more than fifteen patients at a time. Certification may be
        suspended or revoked for conduct that endangers patients, and we owe
        our patients that vigilance.
      </p>

      <h2>Devices</h2>
      <ul>
        <li>
          Wearable devices remain Rua property unless purchased
          outright; care for them reasonably and return them when enrollment
          ends.
        </li>
        <li>
          Devices must be worn as directed to do their work. A device in a
          drawer protects no one.
        </li>
        <li>
          Do not open, modify, or interfere with a device&rsquo;s operation.
          Someone&rsquo;s safety may depend on it.
        </li>
      </ul>

      <h2>Fees</h2>
      <p>
        Fees for enrollment, licenses, and house visits are stated in your
        enrollment or license agreement, or posted at each house. Fees change
        only with thirty days&rsquo; written notice. We never charge for
        emergency response coordination.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not access records that are not yours to see.</li>
        <li>Do not use the platform to harass, deceive, or harm.</li>
        <li>
          Do not probe, scrape, reverse-engineer, or disrupt our systems.
        </li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The Rua name, wordmark, imagery, and the contents of this site
        and platform belong to Rua or its licensors. Licenses granted to
        organizations and caretakers extend only as far as their agreements
        state.
      </p>

      <h2>Privacy</h2>
      <p>
        Personal and health information is governed by our{" "}
        <a href="/privacy">Privacy Notice</a>, which is part of these terms.
      </p>

      <h2>Disclaimers and liability</h2>
      <p>
        We build for reliability, with redundant alerting, audited records,
        and trained hands. Still, no technology is infallible, and connectivity,
        device placement, and circumstances beyond our control can affect
        response. Except where the law does not permit limitation: services
        are provided &ldquo;as is,&rdquo; our aggregate liability is limited
        to the fees you paid in the twelve months preceding a claim, and we
        are not liable for indirect or consequential damages. Nothing in
        these terms limits liability for gross negligence, willful
        misconduct, or rights that cannot be waived.
      </p>

      <h2>Ending the relationship</h2>
      <p>
        You may end enrollment at any time. We may end services for material
        breach of these terms, with notice and, wherever safety allows, a
        transition period, because care should never stop abruptly. Sections
        that by nature survive (privacy, liability, records retention) do
        survive.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the State of California,
        without regard to conflict-of-law rules. Disputes will be resolved in
        the state or federal courts of San Francisco County, California,
        unless your enrollment agreement provides otherwise.
      </p>

      <h2>Changes</h2>
      <p>
        If these terms change materially, we will give you thirty days&rsquo;
        notice in writing before the change applies to you. Continued use
        after that notice is acceptance.
      </p>
    </LegalShell>
  );
}
