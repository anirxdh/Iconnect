import { test, expect } from "./fixtures";
import { gotoHome, jumpToSection } from "./utils";

/** Exact program names from Programs.tsx, in order. */
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

test.describe("Programs — the photograph wall", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await jumpToSection(page, "programs");
  });

  test("ten named photograph cards, no numbering anywhere", async ({
    page,
  }) => {
    const cards = page.locator("#programs li[data-program-index]");
    await expect(cards).toHaveCount(10);

    for (let i = 0; i < PROGRAM_NAMES.length; i++) {
      const card = cards.nth(i);
      await expect(card).toHaveAttribute("data-program-index", String(i));
      await expect(
        card.getByRole("heading", { name: PROGRAM_NAMES[i] }),
      ).toBeAttached();
      // The client asked for no index numbers anywhere.
      await expect(card).not.toContainText(String(i + 1).padStart(2, "0"));
    }
  });

  test("every card carries a real, loaded photograph", async ({ page }) => {
    // Scroll through the grid so lazy images load, then verify decode.
    await page.evaluate(() =>
      document
        .querySelector('#programs li[data-program-index="9"]')
        ?.scrollIntoView({ block: "center" }),
    );
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            Array.from(
              document.querySelectorAll<HTMLImageElement>(
                "#programs li[data-program-index] img",
              ),
            ).filter((img) => img.complete && img.naturalWidth > 0).length,
          ),
        { timeout: 15_000 },
      )
      .toBe(10);
  });

  test("the specialized-focus callout keeps both columns", async ({
    page,
  }) => {
    const section = page.locator("#programs");
    await expect(
      section.getByRole("heading", {
        name: "Memory may wander. Belonging stays.",
      }),
    ).toBeAttached();
    await expect(section.getByText("Dementia care")).toBeAttached();
    await expect(section.getByText("For caregivers")).toBeAttached();
  });
});
