import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "./fixtures";
import { gotoHome, jumpToSection, walkThePage } from "./utils";

/**
 * Accessibility — automated axe scans plus structural checks that guard the
 * patterns this site leans on: sr-only copy behind animated headlines,
 * alt text on every photograph, visible keyboard focus, named controls.
 */

type ViolationLike = {
  id: string;
  impact?: string | null;
  help: string;
  nodes: Array<{ target: unknown[] }>;
};

function summarize(v: ViolationLike): string {
  const sample = v.nodes[0] ? JSON.stringify(v.nodes[0].target) : "?";
  return `[${v.impact ?? "unknown"}] ${v.id} — ${v.help} (${v.nodes.length} node${
    v.nodes.length === 1 ? "" : "s"
  }, e.g. ${sample})`;
}

/**
 * No rules are excluded: the low-opacity tint palette was corrected
 * (floors of ink/70 on light grounds, bone/60 / full sage on dark, and a
 * darker brass-deep) after axe originally flagged ~100 nodes site-wide.
 */
const KNOWN_BUG_RULE_IDS = new Set<string>();

/**
 * Elements tagged data-decorative are oversized ghost numerals — pure
 * decoration per WCAG 1.4.3's exception (their information is duplicated in
 * adjacent text). Axe cannot infer that, so they are excluded explicitly.
 */
const DECORATIVE = "[data-decorative]";

/** Run axe on the current page. Critical/serious fail; the rest is logged. */
async function expectNoSevereAxeViolations(page: Parameters<typeof gotoHome>[0], label: string) {
  const results = await new AxeBuilder({ page }).exclude(DECORATIVE).analyze();
  const severe = results.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious",
  );
  const mild = results.violations.filter(
    (v) => v.impact !== "critical" && v.impact !== "serious",
  );
  const knownBugs = severe.filter((v) => KNOWN_BUG_RULE_IDS.has(v.id));
  const unexpected = severe.filter((v) => !KNOWN_BUG_RULE_IDS.has(v.id));
  if (mild.length > 0) {
    console.log(
      `axe (${label}, ${test.info().project.name}): ${mild.length} non-blocking finding(s):\n` +
        mild.map((v) => `  ${summarize(v)}`).join("\n"),
    );
  }
  if (knownBugs.length > 0) {
    console.log(
      `axe (${label}, ${test.info().project.name}): KNOWN APP BUG (see fixme test):\n` +
        knownBugs.map((v) => `  ${summarize(v)}`).join("\n"),
    );
  }
  expect(
    unexpected.map(summarize),
    `critical/serious axe violations on ${label}`,
  ).toEqual([]);
}

test.describe("automated axe scans", () => {
  test("home page has no critical or serious axe violations", async ({ page }) => {
    test.skip(
      test.info().project.name !== "chromium-reduced",
      "full-page axe scan runs once against the stable reduced-motion DOM",
    );
    await gotoHome(page);
    // Walk the whole page so lazy/scroll-gated content (concierge button,
    // in-view reveals) is mounted before the scan, then let the once-only
    // reveal fades reach steady state — axe must judge resting contrast.
    await walkThePage(page);
    await page.waitForTimeout(2_000);
    await expectNoSevereAxeViolations(page, "home");
  });

  for (const { path, h1 } of [
    { path: "/privacy", h1: "Privacy" },
    { path: "/terms", h1: "The Fine Print" },
    { path: "/accessibility", h1: "Accessibility" },
  ]) {
    test(`legal page ${path} has no critical or serious axe violations`, async ({ page }) => {
      await page.goto(path);
      await expect(
        page.getByRole("heading", { level: 1, name: h1 }),
      ).toBeVisible();
      await expectNoSevereAxeViolations(page, path);
    });
  }

  test("low-opacity text tints meet WCAG AA color contrast", async ({ page }) => {
    // Regression guard for the corrected tint palette. Runs once against the
    // stable reduced-motion DOM (mid-reveal opacity states would false-alarm).
    test.skip(
      test.info().project.name !== "chromium-reduced",
      "contrast scan runs once against the stable reduced-motion DOM",
    );
    await gotoHome(page);
    await walkThePage(page);
    // Let the once-only reveal fades finish — resting contrast is the claim.
    await page.waitForTimeout(2_000);
    const results = await new AxeBuilder({ page })
      .withRules(["color-contrast"])
      .exclude(DECORATIVE)
      .analyze();
    expect(results.violations.map(summarize)).toEqual([]);
  });
});

test.describe("heading structure", () => {
  test("home carries exactly one h1 — the hero headline", async ({ page }) => {
    await gotoHome(page);
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText("garden");
  });

  test("WordsReveal headlines expose their full copy to the accessibility tree", async ({
    page,
  }) => {
    await gotoHome(page);
    // Each of these is rendered by WordsReveal, whose visible words are
    // aria-hidden spans; the real copy must live in the sr-only twin.
    // No scrolling: the copy must be in the tree from first paint.
    const headlines = [
      "Days worth waking for.",
      "Food is the first medicine.",
      "The paperwork tends itself.",
      "Where the circle grows.",
      "Memory may wander. Belonging stays.",
      "Join the circle.",
    ];
    for (const name of headlines) {
      await expect(
        page.getByRole("heading", { name, exact: true }),
        `heading "${name}" exposed via accessible name`,
      ).toHaveCount(1);
    }
  });
});

test.describe("images", () => {
  test("every img element has an alt attribute after a full scroll", async ({ page }) => {
    await gotoHome(page);
    await walkThePage(page);
    const missing = await page.evaluate(() =>
      Array.from(document.querySelectorAll("img"))
        .filter((img) => !img.hasAttribute("alt"))
        .map((img) => img.getAttribute("src") ?? img.outerHTML.slice(0, 120)),
    );
    expect(missing, "img elements missing an alt attribute").toEqual([]);
  });
});

test.describe("keyboard", () => {
  type FocusStop = {
    tag: string;
    inHeader: boolean;
    outlineStyle: string;
    outlineWidth: number;
    label: string;
  };

  test("tab focus starts in the header and always shows a visible indicator", async ({
    page,
  }) => {
    await gotoHome(page);
    // WebKit follows Safari's convention: plain Tab skips links/buttons,
    // Option(Alt)+Tab walks every focusable — the keyboard-user reality there.
    const tabKey = test.info().project.name.includes("webkit") ? "Alt+Tab" : "Tab";
    const stops: FocusStop[] = [];
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press(tabKey);
      const stop = await page.evaluate((): FocusStop | null => {
        const el = document.activeElement;
        if (!el || el === document.body || el === document.documentElement) {
          return null;
        }
        const cs = getComputedStyle(el);
        return {
          tag: el.tagName,
          inHeader: el.closest("header") !== null,
          outlineStyle: cs.outlineStyle,
          outlineWidth: parseFloat(cs.outlineWidth) || 0,
          label: (el.getAttribute("aria-label") ?? el.textContent ?? "")
            .trim()
            .slice(0, 48),
        };
      });
      if (stop) stops.push(stop);
    }

    // The fixed header (logo, then nav links / CTA / hamburger depending on
    // breakpoint) must be the first thing a keyboard user reaches.
    expect(
      stops.slice(0, 2).map((s) => s.inHeader),
      `first tab stops in header — saw ${JSON.stringify(stops.slice(0, 2))}`,
    ).toEqual([true, true]);

    const interactive = stops.filter((s) => s.tag === "A" || s.tag === "BUTTON");
    expect(interactive.length, "keyboard reaches links/buttons").toBeGreaterThan(0);
    for (const s of interactive) {
      expect(
        s.outlineStyle !== "none" || s.outlineWidth > 0,
        `visible focus indicator on ${s.tag} "${s.label}" ` +
          `(outline-style: ${s.outlineStyle}, outline-width: ${s.outlineWidth})`,
      ).toBe(true);
    }
  });
});

test.describe("accessible names", () => {
  test("every visible button and link has a non-empty accessible name", async ({
    page,
  }) => {
    await gotoHome(page);
    // Scroll deep enough that the scroll-gated concierge button mounts too.
    await jumpToSection(page, "begin");
    await expect(
      page.getByRole("button", { name: /concierge/i }),
    ).toBeVisible();

    for (const role of ["button", "link"] as const) {
      const elements = await page.getByRole(role).all();
      expect(elements.length, `at least one ${role} on the page`).toBeGreaterThan(0);
      for (const element of elements) {
        if (!(await element.isVisible())) continue;
        await expect(element, `${role} accessible name`).toHaveAccessibleName(/\S/);
      }
    }
  });
});
