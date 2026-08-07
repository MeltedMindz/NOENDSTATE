import type { Page } from "@playwright/test";

export const PRIMARY_ROUTES = [
  "/",
  "/studio",
  "/projects",
  "/state-zero",
  "/chronicle",
  "/chronicle/NES-0000",
  "/treasury",
  "/build",
  "/manifesto",
  "/community",
  "/faq",
  "/legal",
  "/privacy",
  "/terms",
  "/risk",
  "/status",
];

/** Collect console errors, ignoring nothing — errors fail tests. */
export function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => {
    errors.push(`pageerror: ${err.message}`);
  });
  return errors;
}

export async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  );
}
