import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";
import {
  BUDGET,
  expectNoHorizontalOverflow,
  gotoHome,
  jumpToSection,
  scrollY,
  walkThePage,
} from "./utils";

/**
 * The chaos suite. Scroll up, scroll above, go back, do this, use that,
 * come back — and nothing may break. The auto error-trap fixture is the
 * real assertion behind every test here; the interactions stay realistic.
 */

/** Distance (px) from an anchored section's top to the viewport top. */
function sectionTop(page: Page, id: string): Promise<number> {
  return page.evaluate((id) => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`no section #${id}`);
    return el.getBoundingClientRect().top;
  }, id);
}

/** Poll until a section has (smooth-)scrolled to rest near the viewport top. */
async function expectSectionNearTop(
  page: Page,
  id: string,
  tolerance = 150,
  timeout = 8_000,
) {
  await expect
    .poll(async () => Math.abs(await sectionTop(page, id)), { timeout })
    .toBeLessThanOrEqual(tolerance);
}

/**
 * After a reload / history navigation the preloader may mount again and
 * lock <html> overflow. Give hydration a beat, then wait for release.
 * (No-op when the page came back from bfcache or skips the preloader.)
 */
async function awaitScrollUnlock(page: Page) {
  await page.waitForTimeout(600);
  await expect
    .poll(
      () =>
        page.evaluate(
          () => document.documentElement.style.overflow !== "hidden",
        ),
      { timeout: BUDGET.preloader + 5_000 },
    )
    .toBe(true);
}

test.describe("Resilience — the chaos suite", () => {
  test("walking the whole page down and back up never breaks the layout", async ({
    page,
  }) => {
    test.slow(); // long page × four devices × both directions
    await gotoHome(page);
    const stops = await walkThePage(page, { backUp: true });
    expect(stops, "walk should cover a long page in both directions").toBeGreaterThan(6);
    expect(await scrollY(page), "walk ends back at the very top").toBeLessThanOrEqual(2);
  });

  test("an anchor-click storm settles on the last target and the logo still answers", async ({
    page,
  }) => {
    test.skip(
      test.info().project.name !== "chromium-desktop",
      "desktop nav links only exist at lg+ with full motion",
    );
    await gotoHome(page);

    const header = page.locator("header");
    const storm = [
      "Programs",
      "The Vision",
      "Caretakers",
      "The Circle",
      "Nourishment",
      "Begin at 75",
    ];
    for (let round = 0; round < 2; round++) {
      for (const name of storm) {
        await header.getByRole("link", { name, exact: true }).click();
        await page.waitForTimeout(150);
      }
    }

    // Let Lenis finish whatever animation won the fight, then the last
    // clicked target must be the one on screen.
    await page.waitForTimeout(3_000);
    await expectSectionNearTop(page, "begin");

    // The page must still respond: the wordmark takes us home.
    await header.getByRole("link", { name: "Rua", exact: true }).click();
    await expect
      .poll(() => scrollY(page), { timeout: 8_000 })
      .toBeLessThanOrEqual(2);
  });

  test("a wheel storm down and back up returns to the top and anchors still land", async ({
    page,
  }) => {
    test.skip(
      test.info().project.name !== "chromium-desktop",
      "mouse wheel input is a fine-pointer, full-motion scenario",
    );
    await gotoHome(page);
    await page.mouse.move(720, 480);

    for (let i = 0; i < 30; i++) {
      await page.mouse.wheel(0, 900);
      await page.waitForTimeout(50);
    }
    // Sanity: the storm actually carried us well past the hero.
    await expect
      .poll(() => scrollY(page), { timeout: 8_000 })
      .toBeGreaterThan(900 * 2);

    for (let i = 0; i < 30; i++) {
      await page.mouse.wheel(0, -900);
      await page.waitForTimeout(50);
    }
    // Lenis eases out after the last wheel tick — wait for a full return.
    await expect
      .poll(() => scrollY(page), { timeout: 10_000 })
      .toBeLessThanOrEqual(2);

    // Regression: clicking an anchor immediately after a wheel storm must
    // not be swallowed by a mid-flight Lenis animation.
    await page
      .locator("header")
      .getByRole("link", { name: "Nourishment", exact: true })
      .click();
    await expectSectionNearTop(page, "nourishment");
  });

  test("rotating to landscape mid-scroll keeps the layout intact", async ({
    page,
  }) => {
    test.skip(
      test.info().project.name !== "mobile-webkit",
      "device rotation is a phone scenario",
    );
    const portrait = page.viewportSize() ?? { width: 390, height: 664 };
    await gotoHome(page);

    // Settle in about 40% of the way down, then rotate.
    await page.evaluate(() => {
      const max = document.body.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.round(max * 0.4));
    });
    await page.waitForTimeout(BUDGET.settle);

    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(BUDGET.settle);
    await expectNoHorizontalOverflow(page);

    // Back at the top, the hero headline must fit the short viewport.
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => scrollY(page)).toBeLessThanOrEqual(1);
    await page.waitForTimeout(BUDGET.settle);
    const h1 = page.locator("#top h1");
    await expect(h1).toBeVisible();
    const box = await h1.boundingBox();
    expect(box, "hero headline should have a box").not.toBeNull();
    expect(box!.y, "headline not clipped above the fold").toBeGreaterThanOrEqual(-2);
    expect(
      box!.y + box!.height,
      "headline fits within the landscape viewport",
    ).toBeLessThanOrEqual(392);

    // Rotate back and take a few more stops — still no overflow anywhere.
    await page.setViewportSize(portrait);
    await page.waitForTimeout(BUDGET.settle);
    await expectNoHorizontalOverflow(page);
    for (const fraction of [0.3, 0.6, 0.9]) {
      await page.evaluate((f) => {
        const max = document.body.scrollHeight - window.innerHeight;
        window.scrollTo(0, Math.round(max * f));
      }, fraction);
      await page.waitForTimeout(250);
      await expectNoHorizontalOverflow(page);
    }
  });

  test("reloading deep into the page comes back functional", async ({ page }) => {
    test.skip(
      test.info().project.name !== "chromium-desktop",
      "one deep-reload scenario on the flagship project is enough",
    );
    await gotoHome(page);
    await jumpToSection(page, "houses");
    await page.waitForTimeout(BUDGET.settle);
    expect(await scrollY(page), "we are actually deep in the page").toBeGreaterThan(1_000);

    await page.reload();
    await awaitScrollUnlock(page);

    // The hero canvas re-mounted and scrolling works in both directions.
    await expect(page.locator('#top img[src*="swing-tree"]')).toBeAttached();
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect.poll(() => scrollY(page)).toBeLessThanOrEqual(1);
    await page.evaluate(() => window.scrollTo(0, 1_500));
    await expect.poll(() => scrollY(page)).toBeGreaterThan(1_200);
  });

  test("hammering the mobile menu never wedges the page", async ({ page }) => {
    test.skip(
      test.info().project.name !== "mobile-webkit",
      "the hamburger veil is a below-lg phone scenario",
    );
    await gotoHome(page);

    // Landscape: the veil's content is taller than the viewport, so its
    // own overflow scrolling gets exercised too.
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(BUDGET.settle);

    const burger = page.locator('button[aria-controls="mobile-menu"]');
    for (let i = 0; i < 10; i++) {
      await burger.click();
      await page.waitForTimeout(100);
    }
    // Under CPU contention WebKit may swallow a mid-animation tap, so the
    // parity of the count is not the claim — the claim is "never wedges":
    // whatever state the hammering left, one more deliberate tap must
    // still work and the menu must settle closed.
    if ((await burger.getAttribute("aria-expanded")) === "true") {
      await burger.click();
    }
    await expect(burger, "menu settles closed and stays operable").toHaveAttribute(
      "aria-expanded",
      "false",
    );

    // Open for real, let the links land, and scroll the veil itself.
    await burger.click();
    await expect(burger).toHaveAttribute("aria-expanded", "true");
    await page.waitForTimeout(BUDGET.reveal);
    const veilScrollTop = await page.evaluate(() => {
      const veil = document.getElementById("mobile-menu");
      if (!veil) throw new Error("no #mobile-menu");
      veil.scrollTop = 9_999;
      return veil.scrollTop;
    });
    expect(veilScrollTop, "veil overflows and scrolls in landscape").toBeGreaterThan(40);

    // Navigate from inside the veil.
    await page
      .locator("#mobile-menu")
      .getByRole("link", { name: "Programs", exact: true })
      .click();
    await expect(burger).toHaveAttribute("aria-expanded", "false");
    await expectSectionNearTop(page, "programs");

    // And the body must still scroll after all that. Retry the scroll as a
    // unit: a programmatic scrollBy issued while Lenis is still settling its
    // anchor animation gets overwritten by the next animation frame (user
    // input interrupts Lenis; synthetic scrollBy does not).
    const before = await scrollY(page);
    await expect(async () => {
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(250);
      expect(await scrollY(page)).toBeGreaterThan(before + 200);
    }).toPass({ timeout: 10_000 });
  });

  test("churning between home and the privacy page keeps everything alive", async ({
    page,
  }) => {
    test.skip(
      test.info().project.name !== "chromium-desktop",
      "history churn plus desktop anchors is a lg+ full-motion scenario",
    );
    await gotoHome(page);

    await page.goto("/privacy");
    await expect(
      page.getByRole("heading", { name: "Privacy", exact: true }),
    ).toBeVisible();

    await page.goBack();
    await awaitScrollUnlock(page);
    await expect(page.locator('#top img[src*="swing-tree"]')).toBeAttached();

    await page.goForward();
    await expect(
      page.getByRole("heading", { name: "Privacy", exact: true }),
    ).toBeVisible();

    await page.goBack();
    await awaitScrollUnlock(page);

    // After all that churn, the home page must still answer to its anchors.
    const header = page.locator("header");
    await header.getByRole("link", { name: "The Circle", exact: true }).click();
    await expectSectionNearTop(page, "circle");
    await header.getByRole("link", { name: "Programs", exact: true }).click();
    await expectSectionNearTop(page, "programs");
    await header.getByRole("link", { name: "Rua", exact: true }).click();
    await expect
      .poll(() => scrollY(page), { timeout: 8_000 })
      .toBeLessThanOrEqual(2);
  });
});
