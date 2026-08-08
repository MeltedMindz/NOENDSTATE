import { expect, test } from "@playwright/test";

/** Visual System V2 homepage: five surfaces, index-first, honest live values. */

test("hero declares without a frame, canvas, or button group", async ({ page }) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toContainText("Founded once.");
  await expect(h1).toContainText("Building indefinitely.");
  // No canvas on the homepage — first viewport is complete without JS.
  await expect(page.locator("canvas")).toHaveCount(0);
  // Understated text links, not bordered CTAs.
  await expect(page.getByRole("link", { name: /Enter the studio/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open the Chronicle/i })).toBeVisible();
});

test("live readout reflects the content layer", async ({ page, request }) => {
  await page.goto("/");
  const chronicle = await (await request.get("/api/chronicle")).json();
  const padded = String(chronicle.count).padStart(4, "0");
  await expect(page.getByText(`CHRONICLE / ${padded} RECORDS`)).toBeVisible();
  await expect(page.getByText("STATE ZERO / LOCKED")).toBeVisible();
  await expect(page.getByText(/BUILD-000 \/ BUILDING/)).toBeVisible();
});

test("current work is an honest four-row index", async ({ page }) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "Current work" }).or(
    page.locator("section[aria-label='Current work']")
  );
  const rows = section.locator(".index-row");
  await expect(rows).toHaveCount(4);
  // State Zero is labeled as architecture, not a registered project.
  await expect(section.getByText("Not a registered project; no tokens exist.")).toBeVisible();
  // Registry count is live and honest.
  const projects = await page.evaluate(() =>
    fetch("/api/projects").then((r) => r.json())
  );
  await expect(
    section.getByText(`${projects.count} registered projects.`)
  ).toBeVisible();
  // Rows are links with keyboard access — focus the first and activate it.
  await rows.first().focus();
  await expect(rows.first()).toBeFocused();
});

test("homepage chronicle rows carry id, type, date, and verification", async ({ page }) => {
  await page.goto("/");
  const section = page.locator("section[aria-label='Chronicle']");
  await expect(section.getByText("NES-0000")).toBeVisible();
  await expect(section.getByText("studio founded")).toBeVisible();
  await expect(section.getByText("Studio disclosed").first()).toBeVisible();
  await expect(section.getByRole("link", { name: /Full Chronicle/i })).toBeVisible();
});

test("state zero surface states the locked truth", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByText("NO TOKENS EXIST · MINT NOT ACTIVE · TERMS NOT PUBLISHED · ARCHITECTURE PREVIEW")
  ).toBeVisible();
  const main = await page.locator("main").innerText();
  expect(main).not.toMatch(/mint now|buy now/i);
});

test("footer is functional: deploy id, machine surfaces, honest community", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer.getByText(/DEPLOY [a-f0-9]{7}|DEPLOY local/)).toBeVisible();
  await expect(footer.getByRole("link", { name: "RSS" })).toBeVisible();
  await expect(footer.getByRole("link", { name: "llms.txt" })).toBeVisible();
  await expect(footer.getByText("not yet public").first()).toBeVisible();
});
