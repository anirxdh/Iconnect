import { Page, expect } from "@playwright/test";

/** Section anchors on the single page, in document order. */
export const SECTIONS = [
  "top",
  "vision",
  "circle",
  "programs",
  "nourishment",
  "houses",
  "caregivers",
  "begin",
] as const;

/** Animation budgets (ms). Hero entrance is deliberately slow and stately. */
export const BUDGET = {
  preloader: 4_500, // counter + curtain lift
  heroEntrance: 4_000, // last hero word lands ~3.6s after preloader
  reveal: 2_000, // typical in-view reveal
  settle: 700, // micro-interactions
};

/**
 * Load the home page and wait until the preloader has fully lifted and
 * scrolling is unlocked. Under reduced motion the preloader never mounts.
 */
export async function gotoHome(page: Page) {
  await page.goto("/");
  // The preloader locks <html> overflow while visible; wait for release.
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

/** Instantly park the viewport at a section (bypasses Lenis smoothing). */
export async function jumpToSection(page: Page, id: string, offset = 0) {
  await page.evaluate(
    ({ id, offset }) => {
      const el = document.getElementById(id);
      if (!el) throw new Error(`no section #${id}`);
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo(0, top);
    },
    { id, offset },
  );
}

/** Current scroll position. */
export function scrollY(page: Page) {
  return page.evaluate(() => window.scrollY);
}

/** Assert the page never grows a horizontal scrollbar. */
export async function expectNoHorizontalOverflow(page: Page) {
  const { scrollW, innerW } = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    innerW: window.innerWidth,
  }));
  expect(scrollW, "horizontal overflow").toBeLessThanOrEqual(innerW + 1);
}

/**
 * Scroll the whole page in viewport-sized steps (down then optionally back
 * up), asserting no horizontal overflow at every stop. Returns stop count.
 */
export async function walkThePage(
  page: Page,
  { backUp = false, stepDelay = 250 }: { backUp?: boolean; stepDelay?: number } = {},
) {
  const stops: number[] = await page.evaluate(() => {
    const step = window.innerHeight * 0.85;
    const max = document.body.scrollHeight - window.innerHeight;
    const list: number[] = [];
    for (let y = 0; y < max; y += step) list.push(Math.round(y));
    list.push(max);
    return list;
  });
  const sequence = backUp ? [...stops, ...[...stops].reverse()] : stops;
  for (const y of sequence) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(stepDelay);
    await expectNoHorizontalOverflow(page);
  }
  return sequence.length;
}

/**
 * Assert a WordsReveal-driven heading has fully arrived: the sr-only copy
 * carries the text, and no animated word is still translated out of its slot.
 */
export async function expectHeadingRevealed(
  page: Page,
  container: string,
  text: string,
) {
  const heading = page.locator(container).getByText(text, { exact: false }).first();
  await expect(heading).toBeAttached();
  await expect
    .poll(
      () =>
        page.evaluate(
          ({ container }) => {
            const root = document.querySelector(container);
            if (!root) return "missing container";
            const words = root.querySelectorAll<HTMLElement>(
              "span[aria-hidden] span span span, span[aria-hidden] > span > span",
            );
            let stuck = 0;
            words.forEach((w) => {
              const t = getComputedStyle(w).transform;
              if (t !== "none") {
                try {
                  if (Math.abs(new DOMMatrix(t).f) > 4) stuck++;
                } catch {
                  /* non-matrix transform — ignore */
                }
              }
            });
            return stuck;
          },
          { container },
        ),
      { timeout: 8_000 },
    )
    .toBe(0);
}
