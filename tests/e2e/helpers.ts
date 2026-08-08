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

/**
 * Collect console errors — errors fail tests. Single narrow allowlist entry:
 * Vercel injects its Live feedback script into Preview deployments only, and
 * our CSP correctly blocks it. That block is desired behavior, not an app
 * error; production never injects the script, so it stays zero-tolerance.
 */
const PLATFORM_NOISE = [/vercel\.live\/_next-live/];

export function trackConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (PLATFORM_NOISE.some((re) => re.test(text))) return;
    errors.push(text);
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
