import type { Locator, Page } from "@playwright/test";
import { test, expect } from "./fixtures";
import { BUDGET, gotoHome, jumpToSection } from "./utils";

/** The ten programs exactly as authored in components/Programs.tsx. */
const PROGRAM_NAMES = [
  "Social Club",
  "Laughter Therapy",
  "Fitness & Wellness",
  "Mental Health & Emotional Support",
  "Learning & Skill Development",
  "Hobby & Recreation Clubs",
  "Health Services",
  "Intergenerational Programs",
  "Community Outings",
  "Volunteer & Purpose",
] as const;

/**
 * The cursor-following photograph frame. It is the only aria-hidden,
 * fixed-position direct child of the section, and it mounts only when
 * frameEnabled (fine pointer AND full motion) is true.
 */
const FRAME = '#programs > div.fixed[aria-hidden="true"]';

/** Computed opacity of the floating frame; -1 when it is not in the DOM. */
function frameOpacity(page: Page) {
  return page.evaluate((sel) => {
    const el = document.querySelector<HTMLElement>(sel);
    return el ? Number(getComputedStyle(el).opacity) : -1;
  }, FRAME);
}

/** Viewport-relative center of a locator's bounding box. */
async function center(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error("element has no bounding box");
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/**
 * Hover a row until the frame has fully faded in. Late layout shifts (web
 * fonts, in-view reveals) can slide a row out from under a just-parked
 * cursor, so re-hover on retry rather than polling a single hover.
 */
async function hoverUntilFramed(page: Page, row: Locator) {
  await expect(async () => {
    await row.hover();
    expect(await frameOpacity(page)).toBeGreaterThan(0.9);
  }).toPass({ timeout: 15_000 });
}

/** Web fonts settle text metrics; wait so rows stop reflowing under the cursor. */
async function fontsReady(page: Page) {
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

test.describe("Programs index", () => {
  test("renders exactly ten rows numbered 01-10 with the exact program names", async ({
    page,
  }) => {
    await gotoHome(page);
    await jumpToSection(page, "programs");

    const rows = page.locator("#programs li[data-program-index]");
    await expect(rows).toHaveCount(10);

    for (let i = 0; i < PROGRAM_NAMES.length; i++) {
      const row = rows.nth(i);
      await expect(row).toHaveAttribute("data-program-index", String(i));
      await expect(row).toContainText(String(i + 1).padStart(2, "0"));
      await expect(row).toContainText(PROGRAM_NAMES[i]);
    }
  });

  test("the specialized-focus callout carries both the dementia care and caregiver columns", async ({
    page,
  }) => {
    await gotoHome(page);
    await jumpToSection(page, "programs");
    const section = page.locator("#programs");

    await expect(section.getByText("Specialized focus", { exact: true })).toBeVisible();
    // WordsReveal renders the copy twice (sr-only + animated words) — either is fine.
    await expect(
      section.getByText("Memory may wander. Belonging stays.", { exact: true }).first(),
    ).toBeAttached();

    await expect(section.getByText("Dementia care", { exact: true })).toBeVisible();
    await expect(
      section.getByText(/Dementia-friendly activities. Gentle, familiar/).first(),
    ).toBeAttached();

    await expect(section.getByText("For caregivers", { exact: true })).toBeVisible();
    await expect(
      section.getByText(/families carrying Alzheimer/).first(),
    ).toBeAttached();
  });
});

test.describe("Programs cursor-following frame (fine pointer, full motion)", () => {
  test.beforeEach(() => {
    test.skip(
      test.info().project.name !== "chromium-desktop",
      "the floating frame exists only with a fine pointer and full motion",
    );
  });

  test("hovering rows summons the frame, swaps its photograph per row, and hides it outside the index", async ({
    page,
  }) => {
    await gotoHome(page);
    await fontsReady(page);
    const rows = page.locator("#programs li[data-program-index]");

    // Row 0 — Social Club — brings the frame in with the park-bench photo.
    await hoverUntilFramed(page, rows.nth(0));
    await expect(page.locator(`${FRAME} img`).last()).toHaveAttribute(
      "src",
      /park-bench-ladies/,
    );

    // Row 6 — Health Services — crossfades to the apothecary photo.
    await hoverUntilFramed(page, rows.nth(6));
    await expect(page.locator(`${FRAME} img[src*="apothecary"]`)).toBeAttached();

    // Leave the index: park the cursor above the <ul> (section padding when the
    // top of the index is on screen, otherwise the fixed nav band at the top).
    const ulBox = await page.locator("#programs ul").boundingBox();
    if (!ulBox) throw new Error("programs <ul> not laid out");
    const restY = ulBox.y > 80 ? ulBox.y - 40 : 20;
    await page.mouse.move(ulBox.x + ulBox.width / 2, restY);
    await expect
      .poll(() => frameOpacity(page), { timeout: 5_000 })
      .toBeLessThan(0.05);
  });

  test("stuck-frame regression: the frame releases when the page scrolls the index away under a still cursor", async ({
    page,
  }) => {
    await gotoHome(page);
    await fontsReady(page);
    await hoverUntilFramed(
      page,
      page.locator('#programs li[data-program-index="3"]'),
    );

    // Without moving the mouse, throw the page far past the index. The scroll
    // handler must re-resolve the element under the pointer and let go.
    await page.evaluate(() => window.scrollTo(0, window.scrollY + 2500));
    await expect
      .poll(() => frameOpacity(page), { timeout: 5_000 })
      .toBeLessThan(0.05);
    // The frame stays mounted (pointer is still fine) — only faded out.
    await expect(page.locator(FRAME)).toHaveCount(1);
  });

  test("a small scroll slides the next row under the still cursor and the photograph swaps", async ({
    page,
  }) => {
    await gotoHome(page);
    await fontsReady(page);
    const rows = page.locator("#programs li[data-program-index]");

    // Row 2 — Fitness & Wellness — spa-day.
    await hoverUntilFramed(page, rows.nth(2));
    await expect(
      page.locator(`${FRAME} img[src*="spa-day"]`),
    ).toBeAttached();

    // Scroll exactly one row pitch so row 3 lands where row 2 was.
    const c2 = await center(rows.nth(2));
    const c3 = await center(rows.nth(3));
    const delta = Math.round(c3.y - c2.y);
    await page.evaluate((d) => window.scrollBy(0, d), delta);

    // Row 3 — Mental Health & Emotional Support — pigeon-window.
    await expect(
      page.locator(`${FRAME} img[src*="pigeon-window"]`),
    ).toBeAttached();
    await expect
      .poll(() => frameOpacity(page), { timeout: 5_000 })
      .toBeGreaterThan(0.9);
  });
});

test.describe("Programs frame stays unmounted without a fine pointer + motion", () => {
  test("reduced motion: hovering a row never mounts the floating frame", async ({
    page,
  }) => {
    test.skip(
      test.info().project.name !== "chromium-reduced",
      "covers the prefers-reduced-motion project only",
    );
    await gotoHome(page);
    await page.locator('#programs li[data-program-index="0"]').hover();
    // Give any (incorrect) mount a moment to happen before asserting absence.
    await page.waitForTimeout(BUDGET.settle);
    await expect(page.locator(FRAME)).toHaveCount(0);
  });

  test("touch device: tapping a row never mounts the floating frame", async ({
    page,
  }) => {
    test.skip(
      test.info().project.name !== "mobile-webkit",
      "covers the touch project only",
    );
    await gotoHome(page);
    await page.locator('#programs li[data-program-index="0"]').tap();
    await page.waitForTimeout(BUDGET.settle);
    await expect(page.locator(FRAME)).toHaveCount(0);
  });
});
