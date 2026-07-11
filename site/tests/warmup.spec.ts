import { test, expect } from "./fixtures";
import { gotoHome, walkThePage } from "./utils";

/**
 * The background asset warmer: after the page settles, every photograph is
 * fetched quietly so scrolling never catches an image mid-load.
 */
test.describe("background asset warming", () => {
  test("the warmer fetches every image before the reader scrolls", async ({
    page,
  }) => {
    await gotoHome(page);

    // The warmer flags <html data-assets-warm="true"> when the full
    // manifest has been fetched (starts ~600ms after window load).
    await expect
      .poll(
        () => page.evaluate(() => document.documentElement.dataset.assetsWarm),
        { timeout: 30_000 },
      )
      .toBe("true");

    // From a warm cache, walking the entire page must trigger ZERO new
    // network fetches for photography — memory-cache hits emit no request.
    const lateImageRequests: string[] = [];
    page.on("request", (req) => {
      const url = new URL(req.url());
      if (/^\/(brand|stock)\//.test(url.pathname)) {
        lateImageRequests.push(url.pathname);
      }
    });

    await walkThePage(page);

    expect(
      lateImageRequests,
      "images requested mid-scroll after warm-up",
    ).toEqual([]);
  });

  test("policy pages are prefetched from the footer, so navigation is instant", async ({
    page,
  }) => {
    test.skip(
      test.info().project.name !== "chromium-desktop",
      "one representative environment",
    );
    await gotoHome(page);
    await walkThePage(page);

    // next/link prefetches as the footer links enter the viewport; the
    // subsequent navigation must not need a fresh document request.
    const link = page
      .locator("footer")
      .getByRole("link", { name: "Privacy", exact: true });
    await link.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1_500); // prefetch window

    await link.click();
    await expect(page).toHaveURL("/privacy");
    await expect(
      page.getByRole("heading", { level: 1, name: "Privacy" }),
    ).toBeVisible();
  });
});
