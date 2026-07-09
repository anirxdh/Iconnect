import { test as base, expect } from "@playwright/test";

/**
 * Every test runs with an error trap: any uncaught page error or console
 * error fails the test at the end. Individual tests may allow specific
 * messages via `errors.allow(/pattern/)`.
 */
export type ErrorTrap = {
  pageErrors: string[];
  consoleErrors: string[];
  allow: (pattern: RegExp) => void;
};

export const test = base.extend<{ errors: ErrorTrap }>({
  errors: [
    async ({ page }, use) => {
      const trap: ErrorTrap = {
        pageErrors: [],
        consoleErrors: [],
        allow(pattern) {
          allowed.push(pattern);
        },
      };
      const allowed: RegExp[] = [];

      page.on("pageerror", (err) => trap.pageErrors.push(String(err)));
      page.on("console", (msg) => {
        if (msg.type() === "error") trap.consoleErrors.push(msg.text());
      });

      await use(trap);

      const isAllowed = (m: string) => allowed.some((p) => p.test(m));
      expect
        .soft(trap.pageErrors.filter((m) => !isAllowed(m)), "uncaught page errors")
        .toEqual([]);
      expect
        .soft(trap.consoleErrors.filter((m) => !isAllowed(m)), "console errors")
        .toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
