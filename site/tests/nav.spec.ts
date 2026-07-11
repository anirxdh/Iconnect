import { Page } from "@playwright/test";
import { test, expect } from "./fixtures";
import { BUDGET, gotoHome, scrollY } from "./utils";

/**
 * Navigation coverage: the fixed header on desktop (anchor links routed
 * through Lenis on motion projects, native jumps under reduced motion),
 * and the hamburger + full-screen veil below the lg breakpoint.
 */

const DESKTOP_PROJECTS = ["chromium-desktop", "chromium-reduced"];
const HAMBURGER_PROJECTS = ["mobile-webkit", "tablet-chromium"];

/** The five header links, in display order, with their target section ids. */
const NAV_LINKS = [
  { label: "The Vision", id: "vision" },
  { label: "The Circle", id: "circle" },
  { label: "Programs", id: "programs" },
  { label: "Nourishment", id: "nourishment" },
  { label: "Caretakers", id: "caregivers" },
] as const;

/** Where an anchored section's top must settle, relative to the viewport. */
const LANDING_WINDOW = { min: -20, max: 200 };

function sectionViewportTop(page: Page, id: string): Promise<number> {
  return page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) throw new Error(`no section #${sectionId} on the page`);
    return Math.round(el.getBoundingClientRect().top);
  }, id);
}

/**
 * Poll until the section has arrived near the viewport top. The check is
 * two-sided inside the poll so a target far *above* the viewport (large
 * negative top) can never pass while the scroll is still travelling.
 */
async function expectAnchorLanded(page: Page, id: string, timeout = 15_000) {
  await expect
    .poll(
      async () => {
        const top = await sectionViewportTop(page, id);
        return top >= LANDING_WINDOW.min && top <= LANDING_WINDOW.max
          ? "landed"
          : `still travelling, top=${top}px`;
      },
      {
        timeout,
        message: `section #${id} should settle within [${LANDING_WINDOW.min}, ${LANDING_WINDOW.max}]px of the viewport top`,
      },
    )
    .toBe("landed");
}

test.describe("desktop header navigation", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !DESKTOP_PROJECTS.includes(test.info().project.name),
      "the header link list only renders at the lg breakpoint",
    );
    await gotoHome(page);
  });

  test("each of the five header links scrolls its section under the header", async ({
    page,
  }) => {
    const header = page.locator("header");
    for (const { label, id } of NAV_LINKS) {
      await header.getByRole("link", { name: label, exact: true }).click();
      await expectAnchorLanded(page, id);
    }
  });

  test("the Begin at 75 pill reaches the tiers and the wordmark returns home", async ({
    page,
  }) => {
    const header = page.locator("header");

    // Retry click-and-land as one unit: under full-suite CPU load a long
    // Lenis glide can starve past a single poll window.
    await expect(async () => {
      await header.getByRole("link", { name: "Begin at 75" }).click();
      await expectAnchorLanded(page, "begin", 6_000);
    }).toPass({ timeout: 20_000 });

    await header.getByRole("link", { name: "Rua", exact: true }).click();
    await expect
      .poll(() => scrollY(page), {
        timeout: 15_000,
        message: "the wordmark should return the page to the very top",
      })
      .toBeLessThanOrEqual(20);
  });

  test("clicking the same anchor twice in a row is idempotent", async ({
    page,
  }) => {
    const link = page
      .locator("header")
      .getByRole("link", { name: "Programs", exact: true });

    await link.click();
    await expectAnchorLanded(page, "programs");

    // A second click on an anchor we are already parked at must not move
    // the page anywhere else.
    await link.click();
    await page.waitForTimeout(BUDGET.settle);
    await expectAnchorLanded(page, "programs");
  });

  test("an anchor clicked mid wheel-scroll still lands (Lenis anchors regression)", async ({
    page,
  }) => {
    test.skip(
      test.info().project.name !== "chromium-desktop",
      "needs a mouse wheel and Lenis smooth scrolling (disabled under reduced motion)",
    );

    const link = page
      .locator("header")
      .getByRole("link", { name: "Nourishment", exact: true });
    // Wait out the header entrance so the click below fires instantly.
    await link.hover();

    // Kick off wheel momentum, then click the anchor while Lenis is still
    // animating — the hash navigation must win over the in-flight scroll.
    await page.mouse.move(720, 500);
    await page.mouse.wheel(0, 1400);
    await page.mouse.wheel(0, 1400);
    await link.click();

    // Under parallel-suite CPU load a click can race the wheel momentum;
    // retry the click-and-land as one unit. A genuinely swallowed anchor
    // (the regression this guards) still fails every attempt.
    await expect(async () => {
      await expectAnchorLanded(page, "nourishment", 6_000);
    }).toPass({ timeout: 20_000 });
  });
});

test.describe("mobile veil navigation", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !HAMBURGER_PROJECTS.includes(test.info().project.name),
      "the hamburger menu only renders below the lg breakpoint",
    );
    await gotoHome(page);
  });

  test("hamburger starts collapsed and the closed veil is inert", async ({
    page,
  }) => {
    const burger = page.locator("header button[aria-controls='mobile-menu']");
    await expect(burger).toBeVisible();
    await expect(burger).toHaveAttribute("aria-label", "Open menu");
    await expect(burger).toHaveAttribute("aria-expanded", "false");

    const veil = page.locator("#mobile-menu");
    await expect(veil).toHaveJSProperty("inert", true);

    // Belt and braces: an inert subtree must refuse programmatic focus.
    const focusResult = await page.evaluate(() => {
      const link = document.querySelector<HTMLAnchorElement>("#mobile-menu a");
      if (!link) return "no links found in the veil";
      link.focus();
      return document.activeElement === link ? "link took focus" : "focus refused";
    });
    expect(focusResult, "closed veil links must not be focusable").toBe(
      "focus refused",
    );
  });

  test("the veil opens, Programs navigates and closes it, then Begin at 75 works after reopening", async ({
    page,
  }) => {
    const burger = page.locator("header button[aria-controls='mobile-menu']");
    const veil = page.locator("#mobile-menu");

    await burger.click();
    await expect(burger).toHaveAttribute("aria-expanded", "true");
    await expect(burger).toHaveAttribute("aria-label", "Close menu");
    await expect(veil).toHaveJSProperty("inert", false);
    for (const { label } of NAV_LINKS) {
      await expect(veil.getByRole("link", { name: label, exact: true })).toBeVisible();
    }

    await veil.getByRole("link", { name: "Programs", exact: true }).click();
    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await expectAnchorLanded(page, "programs");
    await expect(veil).toHaveJSProperty("inert", true);

    // Reopen from further down the page and take the veil's own CTA.
    await burger.click();
    await expect(burger).toHaveAttribute("aria-expanded", "true");
    await veil.getByRole("link", { name: "Begin at 75" }).click();
    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await expectAnchorLanded(page, "begin");
  });

  test("phone layout hides the desktop link list and the header pill", async ({
    page,
  }) => {
    test.skip(
      test.info().project.name !== "mobile-webkit",
      "the md tablet band intentionally keeps the Begin at 75 pill",
    );

    await expect(page.locator("header nav ul")).toBeHidden();
    await expect(page.locator("header nav a[href='#begin']")).toBeHidden();
    // The hamburger is the only navigation affordance left on phones.
    await expect(
      page.locator("header button[aria-controls='mobile-menu']"),
    ).toBeVisible();
  });
});
