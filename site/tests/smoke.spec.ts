import { test, expect } from "./fixtures";
import { BUDGET, gotoHome, walkThePage } from "./utils";

/**
 * Smoke: the foundation of every route.
 *
 * Verifies that all four pages respond, carry their exact titles, that the
 * home document is structurally sound (lang, single h1, landmarks, JSON-LD,
 * social meta, icon), and that every /brand and /stock image the home page
 * references actually exists on the server. Console/page errors on plain
 * load are enforced automatically by the errors fixture.
 */

const HOME_TITLE = "Rua: A circle of care for life after 75";

const LEGAL_ROUTES = [
  { path: "/privacy", title: "Privacy · Rua" },
  { path: "/terms", title: "The Fine Print · Rua" },
  { path: "/accessibility", title: "Accessibility · Rua" },
] as const;

test.describe("every route responds with its exact title", () => {
  test("home responds 200, titles itself, and boots without errors", async ({
    page,
  }) => {
    const response = await page.goto("/");
    expect(response, "navigation response").not.toBeNull();
    expect(response!.status()).toBe(200);
    await expect(page).toHaveTitle(HOME_TITLE);

    // Wait out the preloader (skipped under reduced motion) so the whole
    // boot sequence runs under the error trap before the page closes.
    await expect
      .poll(
        () =>
          page.evaluate(
            () => document.documentElement.style.overflow !== "hidden",
          ),
        { timeout: BUDGET.preloader + 5_000 },
      )
      .toBe(true);
    await page.waitForTimeout(BUDGET.settle);
  });

  for (const route of LEGAL_ROUTES) {
    test(`${route.path} responds 200, titles itself, and loads without errors`, async ({
      page,
    }) => {
      const response = await page.goto(route.path);
      expect(response, "navigation response").not.toBeNull();
      expect(response!.status()).toBe(200);
      await expect(page).toHaveTitle(route.title);

      // Idle briefly so hydration has a chance to surface any errors.
      await page.waitForTimeout(BUDGET.settle);
    });
  }
});

test.describe("home document foundations", () => {
  test("declares English, one h1, and the main/header/footer landmarks", async ({
    page,
  }) => {
    await gotoHome(page);

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("header").first()).toBeAttached();
    await expect(page.locator("footer")).toHaveCount(1);
  });

  test("organization JSON-LD parses and carries the concierge phone number", async ({
    page,
  }) => {
    await gotoHome(page);

    const raw = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    expect(raw, "JSON-LD script content").toBeTruthy();

    const parsed = JSON.parse(raw!) as Record<string, unknown>;
    expect(parsed["@type"]).toBe("Organization");
    expect(parsed["telephone"]).toBe("+1-763-233-1350");
  });

  test("social sharing meta tags are present", async ({ page }) => {
    await gotoHome(page);

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveCount(1);
    const ogContent = await ogImage.getAttribute("content");
    expect(ogContent, "og:image content").toBeTruthy();
    expect(ogContent).toContain("/people/swing-tree.jpg");

    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
  });

  test("the site icon serves as an SVG image", async ({ request }) => {
    const response = await request.get("/icon.svg");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/svg");
  });
});

test.describe("home imagery inventory", () => {
  test("every /brand and /stock image referenced on the home page fetches 200", async ({
    page,
    request,
  }) => {
    await gotoHome(page);
    // Walk the full page so lazily mounted sections attach their <img>s
    // (this also asserts no horizontal overflow at every stop).
    await walkThePage(page);

    const srcs: string[] = await page.evaluate(() =>
      Array.from(
        new Set(
          Array.from(document.querySelectorAll("img"))
            .map((img) => img.getAttribute("src") ?? "")
            .filter(
              (src) => src.startsWith("/brand/") || src.startsWith("/stock/"),
            ),
        ),
      ).sort(),
    );

    expect(srcs.length, "home page should reference brand/stock imagery")
      .toBeGreaterThan(0);

    for (const src of srcs) {
      const response = await request.get(src);
      expect(response.status(), `${src} should fetch 200`).toBe(200);
    }
  });
});
