import { Page } from "@playwright/test";
import { test, expect } from "./fixtures";
import { BUDGET, gotoHome, jumpToSection } from "./utils";

/** Exact hero headline copy (Hero.tsx: HEADLINE_TOP + ITALIC + BOTTOM). */
const HERO_HEADLINE = "Growing old is a garden. We tend it.";

/** Exact chapter headlines from Journey.tsx CHAPTERS, in track order. */
const CHAPTER_HEADLINES = [
  "Seventy-five.",
  "A companion on the wrist.",
  "The circle connects.",
  "Care that never breaks.",
] as const;

/**
 * The preloader is the only fixed, aria-hidden <div> carrying the wordmark
 * (the Nav wordmark lives in a <header>, the Marquee is not fixed).
 */
function preloaderOverlay(page: Page) {
  return page.locator('div[aria-hidden="true"].fixed', { hasText: "iConnect" });
}

/** documentElement scroll lock state (set/cleared by the preloader). */
function overflowLocked(page: Page) {
  return page.evaluate(
    () => document.documentElement.style.overflow === "hidden",
  );
}

/**
 * Which of the four chapter headlines currently intersect the viewport?
 * Zero-sized rects (e.g. the display:none stage below lg, or the hidden
 * stack at lg+) never count.
 */
function chapterHeadlinesInView(page: Page) {
  return page.evaluate((headlines: readonly string[]) => {
    const h3s = Array.from(
      document.querySelectorAll<HTMLElement>("#circle h3"),
    );
    return headlines.filter((text) =>
      h3s.some((h3) => {
        if (!(h3.textContent ?? "").includes(text)) return false;
        const r = h3.getBoundingClientRect();
        return (
          r.width > 0 &&
          r.height > 0 &&
          r.right > 0 &&
          r.left < window.innerWidth &&
          r.bottom > 0 &&
          r.top < window.innerHeight
        );
      }),
    );
  }, CHAPTER_HEADLINES);
}

test.describe("Hero preloader", () => {
  test("preloader shows the wordmark and counter, locks scroll, then lifts within budget", async ({
    page,
  }) => {
    test.skip(
      !["chromium-desktop", "mobile-webkit"].includes(test.info().project.name),
      "full-motion preloader is exercised on flagship desktop and mobile",
    );

    await page.goto("/");
    const overlay = preloaderOverlay(page);

    // The curtain is up: wordmark and the climbing three-digit counter.
    await expect(overlay).toBeVisible();
    await expect(overlay.getByText("iConnect", { exact: true })).toBeVisible();
    const counter = overlay.locator(".tabular-nums");
    await expect(counter).toBeVisible();
    await expect(counter).toHaveText(/^\d{3}$/);

    // While the veil is down, <html> overflow is locked.
    await expect
      .poll(() => overflowLocked(page), { timeout: 3_000 })
      .toBe(true);

    // The veil lifts and unmounts within the preloader budget…
    await expect(overlay).toHaveCount(0, { timeout: BUDGET.preloader + 2_000 });

    // …and scrolling is unlocked again.
    await expect.poll(() => overflowLocked(page), { timeout: 2_000 }).toBe(false);
  });

  test("preloader never runs under reduced motion and scroll is never locked", async ({
    page,
  }) => {
    test.skip(
      test.info().project.name !== "chromium-reduced",
      "reduced-motion behaviour only",
    );

    await page.goto("/");

    // The SSR shell may briefly contain the overlay, but it must be gone
    // shortly after hydration — no counter run, no curtain.
    await expect(preloaderOverlay(page)).toHaveCount(0, { timeout: 5_000 });
    expect(await overflowLocked(page)).toBe(false);
  });
});

test.describe("Hero headline", () => {
  test("headline copy is intact with a space between every word", async ({
    page,
  }) => {
    await gotoHome(page);
    await page.waitForTimeout(BUDGET.heroEntrance);

    const h1 = page.locator("#top h1");
    await expect(h1).toBeVisible();

    // Regression: word-spacing bug. The inter-word spaces must exist as text
    // nodes between the clipped inline-block slots (spaces placed inside a
    // slot get trimmed and the words render glued together). Whisper hover
    // notes ([data-whisper-note], aria-hidden) are stripped before reading.
    const textContent = await h1.evaluate((el) => {
      const clone = el.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[data-whisper-note]").forEach((n) => n.remove());
      return clone.textContent ?? "";
    });
    expect(textContent.replace(/\s+/g, " ").trim()).toBe(HERO_HEADLINE);

    // And the words arrive in order, one per slot: the leaf spans that
    // remain once the whisper notes are removed.
    const words = await h1.evaluate((el) => {
      const clone = el.cloneNode(true) as HTMLElement;
      clone.querySelectorAll("[data-whisper-note]").forEach((n) => n.remove());
      return Array.from(clone.querySelectorAll("span"))
        .filter((s) => s.children.length === 0 && (s.textContent ?? "").trim())
        .map((s) => s.textContent);
    });
    expect(words.join(" ")).toBe(HERO_HEADLINE);

    // innerText reflects the *rendered* spacing. WebKit drops the collapsed
    // space at a soft line-wrap between inline-blocks ("a" / "garden." break),
    // producing "agarden." from a perfectly rendered layout — so this rendered
    // check runs on the Chromium projects only (browser quirk, not app bug).
    if (test.info().project.name !== "mobile-webkit") {
      const text = await h1.innerText();
      expect(text.replace(/\s+/g, " ").trim()).toBe(HERO_HEADLINE);
    }
  });

  test("every hero word settles into its slot after the entrance", async ({
    page,
  }) => {
    // Regression guard: under prefers-reduced-motion the reduced animate
    // target must still zero the SSR transform (translateY(112%)) — a plain
    // opacity fade would leave every word clipped out of its slot.
    await gotoHome(page);
    await page.waitForTimeout(BUDGET.heroEntrance);

    // Regression: stuck words — no word span may remain translated out of
    // its clipped slot (|translateY| > 4px) once the entrance has played.
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const words = document.querySelectorAll<HTMLElement>(
              "#top h1 span > span",
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
          }),
        { timeout: 6_000 },
      )
      .toBe(0);
  });
});

test.describe("Hero scene", () => {
  test("the framed photograph renders at or below its native size — never soft", async ({
    page,
  }) => {
    await gotoHome(page);
    const scene = page.locator('#top img[src*="swing-tree"]');
    await expect(scene).toBeVisible();
    // The sharpness contract: a framed photo may shrink but never stretch
    // past its own pixels (CSS px vs natural width; small DPR headroom).
    const { rendered, natural } = await scene.evaluate((el) => {
      const img = el as HTMLImageElement;
      return { rendered: img.clientWidth, natural: img.naturalWidth };
    });
    expect(natural, "image decoded").toBeGreaterThan(0);
    expect(rendered, "never upscaled beyond the source").toBeLessThanOrEqual(
      natural * 1.05,
    );
  });
});

test.describe("Journey — the pinned horizontal circle", () => {
  test("track glides monotonically leftward and shows all four chapters", async ({
    page,
  }) => {
    test.skip(
      !["chromium-desktop", "chromium-reduced"].includes(
        test.info().project.name,
      ),
      "the pinned horizontal stage only exists at lg and up",
    );

    await gotoHome(page);
    await jumpToSection(page, "circle");
    await page.waitForTimeout(BUDGET.settle);

    // The stage is the h-[420vh] grandparent of the w-max track.
    const range = await page.evaluate(() => {
      const track = document.querySelector<HTMLElement>("#circle div.w-max");
      if (!track) throw new Error("no journey track");
      const stage = track.parentElement!.parentElement!;
      const top = stage.getBoundingClientRect().top + window.scrollY;
      return { start: top, end: top + stage.offsetHeight - window.innerHeight };
    });
    expect(range.end).toBeGreaterThan(range.start);

    const STOPS = 9; // ~8 increments across the 420vh outer section
    const xs: number[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < STOPS; i++) {
      const y = range.start + ((range.end - range.start) * i) / (STOPS - 1);
      await page.evaluate((v) => window.scrollTo(0, v), y);
      // Let scroll-linked springs glide toward the new target.
      await page.waitForTimeout(450);

      const tx = await page.evaluate(() => {
        const track = document.querySelector<HTMLElement>("#circle div.w-max");
        if (!track) throw new Error("no journey track");
        const t = getComputedStyle(track).transform;
        return t === "none" ? 0 : new DOMMatrix(t).m41;
      });
      xs.push(tx);

      for (const headline of await chapterHeadlinesInView(page)) {
        seen.add(headline);
      }
    }

    // Starts parked at the first chapter…
    expect(Math.abs(xs[0]), `track x at stop 0 (xs=${xs.join(", ")})`)
      .toBeLessThan(40);

    // …and only ever moves left (small tolerance for spring jitter).
    for (let i = 1; i < xs.length; i++) {
      expect(
        xs[i],
        `track x regressed rightward at stop ${i} (xs=${xs.join(", ")})`,
      ).toBeLessThanOrEqual(xs[i - 1] + 2);
    }

    // Overall traversal is substantial — the whole track glides past.
    expect(
      xs[0] - xs[xs.length - 1],
      `total leftward travel (xs=${xs.join(", ")})`,
    ).toBeGreaterThan(1_000);

    for (const headline of CHAPTER_HEADLINES) {
      expect(
        seen.has(headline),
        `chapter headline "${headline}" never entered the viewport`,
      ).toBe(true);
    }
  });

  test("chapters stack vertically on mobile with no pinned stage", async ({
    page,
  }) => {
    test.skip(
      test.info().project.name !== "mobile-webkit",
      "the vertical stack is the below-lg presentation",
    );

    await gotoHome(page);

    // The lg-only pinned stage (with its sideways hint) is hidden.
    await expect(page.getByText("The story moves sideways")).toBeHidden();

    // Four chapter cards render in the flow.
    await expect(page.locator("#circle article")).toHaveCount(4);

    // Walk the section top to bottom; every headline must pass through view.
    const range = await page.evaluate(() => {
      const el = document.getElementById("circle");
      if (!el) throw new Error("no #circle section");
      const top = el.getBoundingClientRect().top + window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      return {
        start: Math.max(0, Math.min(top, max)),
        end: Math.min(top + el.offsetHeight - window.innerHeight, max),
        step: window.innerHeight * 0.8,
      };
    });

    const seen = new Set<string>();
    const stops: number[] = [];
    for (let y = range.start; y < range.end; y += range.step) stops.push(y);
    stops.push(range.end);

    for (const y of stops) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(250);
      for (const headline of await chapterHeadlinesInView(page)) {
        seen.add(headline);
      }
    }

    for (const headline of CHAPTER_HEADLINES) {
      expect(
        seen.has(headline),
        `chapter headline "${headline}" never appeared while walking the stack`,
      ).toBe(true);
    }
  });
});
