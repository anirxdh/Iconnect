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
  return page.locator('div[aria-hidden="true"].fixed', { hasText: "Rua" });
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
    await expect(overlay.getByText("Rua", { exact: true })).toBeVisible();
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
  test("the photograph presents at or below native size — never soft", async ({
    page,
  }) => {
    await gotoHome(page);
    const scene = page.locator('#top img[src*="swing-tree"]');
    await expect(scene).toBeVisible();
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

test.describe("The Companion — pinned phone", () => {
  test("scrolling the section turns the screens", async ({ page }) => {
    test.skip(
      test.info().project.name === "chromium-reduced",
      "reduced motion shows the three-up static layout instead",
    );
    await gotoHome(page);
    await jumpToSection(page, "companion");
    const section = page.locator("#companion");
    await expect(section.getByText("Good morning,")).toBeAttached();
    // Deep-scrolling the tall outer reveals the circle screen.
    await page.evaluate(() => {
      const el = document.getElementById("companion")!;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + el.scrollHeight * 0.8);
    });
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const el = Array.from(
              document.querySelectorAll("#companion p"),
            ).find((n) => n.textContent?.includes("Maya is on"));
            if (!el) return 0;
            let node: HTMLElement | null = el as HTMLElement;
            let opacity = 1;
            while (node && node.id !== "companion") {
              opacity *= parseFloat(getComputedStyle(node).opacity || "1");
              node = node.parentElement;
            }
            return opacity;
          }),
        { timeout: 10_000 },
      )
      .toBeGreaterThan(0.85);
  });

  test("reduced motion gets all three screens, still", async ({ page }) => {
    test.skip(
      test.info().project.name !== "chromium-reduced",
      "static three-up is the reduced-motion layout",
    );
    await gotoHome(page);
    await jumpToSection(page, "companion");
    const section = page.locator("#companion");
    await expect(section.getByText("Good morning,")).toBeVisible();
    await expect(section.getByText("All taken,")).toBeVisible();
    await expect(section.getByText("Maya is on")).toBeVisible();
  });
});

test.describe("Journey — the chapter stack", () => {
  test("chapters stack vertically and every headline takes the screen", async ({
    page,
  }) => {
    await gotoHome(page);
    await jumpToSection(page, "circle");

    // Walk the section from top to bottom; every chapter headline must
    // hold the viewport at some stop, with no horizontal movement.
    const seen = new Set<string>();
    const steps = 14;
    for (let i = 0; i <= steps; i++) {
      await page.evaluate(
        ({ i, steps }) => {
          const el = document.getElementById("circle");
          if (!el) throw new Error("no #circle");
          const top = el.getBoundingClientRect().top + window.scrollY;
          const span = el.scrollHeight - window.innerHeight;
          window.scrollTo(0, top + (span * i) / steps);
        },
        { i, steps },
      );
      await page.waitForTimeout(220);
      for (const h of await chapterHeadlinesInView(page)) seen.add(h);
      const { scrollW, innerW } = await page.evaluate(() => ({
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
      }));
      expect(scrollW, "no sideways movement").toBeLessThanOrEqual(innerW + 1);
    }
    expect([...seen].sort()).toEqual([...CHAPTER_HEADLINES].sort());
  });

  test("the pinned frame crossfades through the chapters", async ({ page }) => {
    test.skip(
      test.info().project.name !== "chromium-desktop",
      "the pinned frame only exists at lg and up",
    );
    await gotoHome(page);
    await jumpToSection(page, "circle");

    // The frame is sticky and holds all four photographs.
    const frame = await page.evaluate(() => {
      const imgs = document.querySelectorAll("#circle [data-frame-index]");
      const sticky = document.querySelector("#circle .sticky");
      return {
        imgs: imgs.length,
        position: sticky ? getComputedStyle(sticky).position : "missing",
      };
    });
    expect(frame.imgs).toBe(4);
    expect(frame.position).toBe("sticky");

    // Walking the chapters swaps which photograph is visible.
    const visibleAt = async () =>
      page.evaluate(() => {
        const imgs = Array.from(
          document.querySelectorAll<HTMLElement>("#circle [data-frame-index]"),
        );
        const on = imgs.find((el) => getComputedStyle(el).opacity === "1");
        return on?.dataset.frameIndex ?? "none";
      });
    const seen = new Set<string>();
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      await page.evaluate(
        ({ i, steps }) => {
          const el = document.getElementById("circle");
          if (!el) throw new Error("no #circle");
          const top = el.getBoundingClientRect().top + window.scrollY;
          const span = el.scrollHeight - window.innerHeight;
          window.scrollTo(0, top + (span * i) / steps);
        },
        { i, steps },
      );
      await page.waitForTimeout(400);
      seen.add(await visibleAt());
    }
    seen.delete("none");
    expect(seen.size, "frame crossfades through multiple chapters").toBeGreaterThanOrEqual(3);
  });
});
