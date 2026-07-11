import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";
import { BUDGET, gotoHome, expectNoHorizontalOverflow } from "./utils";

/**
 * The three legal pages (/privacy, /terms, /accessibility) share the
 * LegalShell frame: one h1, a "Last updated" line, a contact block that
 * links ishanagu0601@gmail.com and +1 (763) 233-1350, a cross-nav to the
 * other legal pages, and a "Return to the garden" link home.
 */

const LEGAL_PAGES = [
  { path: "/privacy", title: "Privacy Notice" },
  { path: "/terms", title: "Terms of Service" },
  { path: "/accessibility", title: "Accessibility" },
] as const;

const LAST_UPDATED = "Last updated: July 8, 2026";

/** The single <nav> on a legal page — the Privacy/Terms/Accessibility cross-nav. */
function crossNav(page: Page) {
  return page.locator("nav");
}

function h1(page: Page) {
  return page.getByRole("heading", { level: 1 });
}

/**
 * gotoHome-style settle after navigating home via link or history: the
 * preloader (motion projects) locks <html> overflow while visible — wait
 * for the release. Under reduced motion it never mounts, so this passes
 * immediately.
 */
async function waitForHomeUnlocked(page: Page) {
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

test.describe("legal page frames on desktop and mobile", () => {
  test.beforeEach(() => {
    test.skip(
      !["chromium-desktop", "mobile-webkit"].includes(test.info().project.name),
      "per-page legal frame checks run on chromium-desktop and mobile-webkit only",
    );
  });

  for (const { path, title } of LEGAL_PAGES) {
    test(`${path} shows the "${title}" heading, updated date, and contact block`, async ({
      page,
    }) => {
      await page.goto(path);

      await expect(h1(page)).toHaveText(title);
      await expect(page.getByText(LAST_UPDATED)).toBeVisible();

      // The shared contact block links the privacy inbox and the phone line.
      const contact = page.locator("p", {
        hasText: "Questions about this document?",
      });
      await expect(contact).toBeVisible();
      await expect(
        contact.locator('a[href="mailto:ishanagu0601@gmail.com"]'),
      ).toHaveText("ishanagu0601@gmail.com");
      await expect(contact.locator('a[href="tel:+17632331350"]')).toHaveText(
        "+1 (763) 233-1350",
      );

      // Cross-nav lists all three legal destinations with the right hrefs.
      const nav = crossNav(page);
      await expect(
        nav.getByRole("link", { name: "Privacy", exact: true }),
      ).toHaveAttribute("href", "/privacy");
      await expect(
        nav.getByRole("link", { name: "Terms", exact: true }),
      ).toHaveAttribute("href", "/terms");
      await expect(
        nav.getByRole("link", { name: "Accessibility", exact: true }),
      ).toHaveAttribute("href", "/accessibility");

      await expectNoHorizontalOverflow(page);
    });
  }

  test("cross-nav walks privacy → terms → accessibility → privacy", async ({
    page,
  }) => {
    await page.goto("/privacy");
    await expect(h1(page)).toHaveText("Privacy Notice");

    await crossNav(page).getByRole("link", { name: "Terms", exact: true }).click();
    await expect(page).toHaveURL("/terms");
    await expect(h1(page)).toHaveText("Terms of Service");

    await crossNav(page)
      .getByRole("link", { name: "Accessibility", exact: true })
      .click();
    await expect(page).toHaveURL("/accessibility");
    await expect(h1(page)).toHaveText("Accessibility");

    await crossNav(page)
      .getByRole("link", { name: "Privacy", exact: true })
      .click();
    await expect(page).toHaveURL("/privacy");
    await expect(h1(page)).toHaveText("Privacy Notice");
  });
});

test.describe("terms of service copy", () => {
  test("the medical disclaimer tells readers to always call 911", async ({
    page,
  }) => {
    await page.goto("/terms");
    await expect(
      page.getByText(
        "Our devices alert responders automatically, but if you are able to call 911, always call 911.",
      ),
    ).toBeVisible();
  });
});

test.describe("round-trips between the garden and the fine print", () => {
  test('"Return to the garden" navigates home and the hero arrives', async ({
    page,
  }) => {
    await page.goto("/privacy");
    await expect(h1(page)).toHaveText("Privacy Notice");

    await page.getByRole("link", { name: "Return to the garden" }).click();
    await expect(page).toHaveURL("/");
    await waitForHomeUnlocked(page);
    await expect(page.locator("#top h1")).toBeVisible();
    await expect(page.locator("#top h1")).toContainText("Growing");
  });

  test('the home footer "Privacy Notice" link lands on /privacy', async ({
    page,
  }) => {
    await gotoHome(page);

    // Park at the bottom of the page where the site footer lives.
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight - window.innerHeight),
    );
    const link = page
      .locator("footer")
      .getByRole("link", { name: "Privacy Notice" });
    await link.click();

    await expect(page).toHaveURL("/privacy");
    await expect(h1(page)).toHaveText("Privacy Notice");
  });

  test("browser history survives home → privacy → back → forward", async ({
    page,
    errors,
  }) => {
    // WebKit cancels in-flight RSC fetches on history navigation; Next logs
    // the failure and falls back to a full browser navigation by design.
    // The navigation itself is asserted below — the log line is benign.
    errors.allow(
      /Failed to fetch RSC payload .* Falling back to browser navigation/,
    );
    await gotoHome(page);
    await expect(page.locator("#top h1")).toBeAttached();

    await page.goto("/privacy");
    await expect(h1(page)).toHaveText("Privacy Notice");

    await page.goBack();
    await expect(page).toHaveURL("/");
    await waitForHomeUnlocked(page);
    await expect(page.locator("#top h1")).toBeAttached();

    // WebKit can restore forward-navigations from the back/forward cache
    // slowly; poll the URL rather than racing a single navigation event.
    await page.goForward();
    await expect(page).toHaveURL("/privacy", { timeout: 15_000 });
    await expect(h1(page)).toHaveText("Privacy Notice", { timeout: 15_000 });
  });
});
