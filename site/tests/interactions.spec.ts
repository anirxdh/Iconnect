import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";
import { gotoHome, jumpToSection } from "./utils";

/**
 * Interactions: the Toolkit accordion, the Concierge,
 * strips, and the Houses map + ledger.
 */

/** Exact drawer titles from components/Toolkit.tsx (curly apostrophe intact). */
const DRAWERS = [
  "Work & Admin",
  "Training & Certification",
  "The Caretaker’s Own Wellbeing",
  "Medication",
  "Meals & Nutrition",
  "Money & Movement",
] as const;

function drawerButton(page: Page, title: string) {
  return page.getByRole("button", { name: title, exact: true });
}

test.describe("Toolkit accordion — For Caretakers", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await jumpToSection(page, "caregivers");
  });

  test("shows six drawers with Work & Admin open by default", async ({
    page,
  }) => {
    const buttons = page.locator("#caregivers h3 button");
    await expect(buttons).toHaveText([...DRAWERS]);

    for (const [i, title] of DRAWERS.entries()) {
      await expect(drawerButton(page, title)).toHaveAttribute(
        "aria-expanded",
        i === 0 ? "true" : "false",
      );
    }

    // The default drawer's panel is present and holds its first item.
    const firstPanel = page.locator("#toolkit-panel-0");
    await expect(firstPanel).toBeVisible();
    await expect(firstPanel).toContainText("Automated administration organizer");
  });

  test("opening Medication closes Work & Admin — one drawer at a time", async ({
    page,
  }) => {
    await drawerButton(page, "Medication").click();

    await expect(drawerButton(page, "Medication")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(drawerButton(page, "Work & Admin")).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    const panel = page.locator("#toolkit-panel-3");
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("Medication inventory");
    await expect(panel).toContainText("Routine check-lists");
    await expect(panel).toContainText("Trackers that never forget a dose");

    // The Work & Admin panel leaves the DOM once its exit animation ends.
    await expect(page.locator("#toolkit-panel-0")).not.toBeAttached();

    // Every other drawer stays shut.
    for (const title of DRAWERS.filter((t) => t !== "Medication")) {
      await expect(drawerButton(page, title)).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    }
  });

  test("a drawer opens from the keyboard with Enter", async ({ page }) => {
    const meals = drawerButton(page, "Meals & Nutrition");
    await meals.focus();
    await expect(meals).toBeFocused();

    await page.keyboard.press("Enter");

    await expect(meals).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#toolkit-panel-4")).toContainText(
      "Meal-plan trackers",
    );
    // Enter-opening still honours one-drawer-at-a-time.
    await expect(drawerButton(page, "Work & Admin")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });
});

test.describe("Concierge", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !["chromium-desktop", "mobile-webkit"].includes(test.info().project.name),
      "Concierge flow is exercised on flagship desktop and mobile",
    );
    await gotoHome(page);
  });

  test("waits offstage at the top and appears once the reader scrolls in", async ({
    page,
  }) => {
    const openButton = page.getByRole("button", {
      name: "Open concierge",
      exact: true,
    });
    // At the top of the page the button is not even mounted.
    await expect(openButton).toHaveCount(0);

    await jumpToSection(page, "programs");
    await expect(openButton).toBeVisible();
  });

  test("opens with phone and email, closes on Escape, then via its own button", async ({
    page,
  }) => {
    await jumpToSection(page, "programs");

    const openButton = page.getByRole("button", {
      name: "Open concierge",
      exact: true,
    });
    const dialog = page.getByRole("dialog", { name: "Reach the concierge" });

    await openButton.click();
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('a[href="tel:+17632331350"]')).toBeVisible();
    await expect(
      dialog.locator('a[href="mailto:hello@iconnect.care"]'),
    ).toBeVisible();

    // Escape dismisses the panel.
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(openButton).toBeVisible();

    // Reopen, then close via the button — whose label flips to Close.
    await openButton.click();
    await expect(dialog).toBeVisible();
    const closeButton = page.getByRole("button", {
      name: "Close concierge",
      exact: true,
    });
    await expect(closeButton).toContainText("Close");
    await closeButton.click();
    await expect(dialog).not.toBeVisible();
    await expect(openButton).toBeVisible();
  });
});

test.describe("The Houses — map and ledger", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await jumpToSection(page, "houses");
  });

  test("the US map is labelled for screen readers with every city", async ({
    page,
  }) => {
    const map = page.locator('#houses svg[role="img"]');
    await expect(map).toBeVisible();
    await expect(map).toHaveAttribute(
      "aria-label",
      "Map of the United States marking iConnect headquarters in San Francisco and houses taking root in Portland, Seattle, Denver, Minneapolis, Chicago, Austin and Boston",
    );
  });

  test("the ledger lists eight cities — headquarters plus seven taking root", async ({
    page,
  }) => {
    const entries = page.locator("#houses ul > li");
    await expect(entries).toHaveCount(8);

    await expect(page.locator("#houses ul > li h3")).toHaveText([
      "San Francisco",
      "Portland",
      "Seattle",
      "Denver",
      "Minneapolis",
      "Chicago",
      "Austin",
      "Boston",
    ]);

    // Nothing has opened yet: home is the only brass node, everything
    // else is still taking root.
    await expect(
      entries.getByText("Headquarters", { exact: true }),
    ).toHaveCount(1);
    await expect(
      entries.getByText("Taking root", { exact: true }),
    ).toHaveCount(7);
  });
});
