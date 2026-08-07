import { expect, test } from "@playwright/test";
import { PRIMARY_ROUTES, hasHorizontalOverflow, trackConsoleErrors } from "./helpers";

for (const route of PRIMARY_ROUTES) {
  test(`route ${route} renders clean`, async ({ page }) => {
    const errors = trackConsoleErrors(page);
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("load");

    // Every page shows the wordmark and footer closing line.
    await expect(page.locator("header").getByText("NO END STATE").first()).toBeVisible();
    await expect(page.getByText("The work continues.")).toBeVisible();

    // h1 exists and is unique.
    await expect(page.locator("h1")).toHaveCount(1);

    // No horizontal overflow.
    expect(await hasHorizontalOverflow(page)).toBe(false);

    // No console or runtime errors.
    expect(errors).toEqual([]);
  });
}

test("404 page renders for unknown routes", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("No such record")).toBeVisible();
  await expect(page.getByRole("link", { name: /Return to the beginning/i })).toBeVisible();
});

test("fixture token pages are not served in production", async ({ page }) => {
  const response = await page.goto("/state-zero/0");
  expect(response?.status()).toBe(404);
});

test("chronicle filter narrows the list", async ({ page }) => {
  await page.goto("/chronicle");
  await page.getByRole("link", { name: "studio founded", exact: true }).click();
  await expect(page).toHaveURL(/type=studio_founded/);
  const items = page.locator("ol[aria-label*='Chronicle'] li");
  await expect(items).toHaveCount(1);
  await expect(page.getByText("NES-0000")).toBeVisible();
});

test("chronicle event detail shows record table", async ({ page }) => {
  await page.goto("/chronicle/NES-0002");
  await expect(page.locator("h1")).toContainText("BUILD 000");
  await expect(page.getByText("Studio disclosed").first()).toBeVisible();
  await expect(page.getByText("Sequence")).toBeVisible();
});

test("projects zero state is honest and complete", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByText("No projects registered yet.")).toBeVisible();
  await expect(page.getByText("0 registered")).toBeVisible();
});

test("treasury shows uninitialized state, no fake numbers", async ({ page }) => {
  await page.goto("/treasury");
  await expect(page.getByText("Treasury not yet initialized.")).toBeVisible();
  await expect(page.getByText("Not deployed").first()).toBeVisible();
  // No dollar or ETH figures anywhere.
  const body = await page.locator("main").innerText();
  expect(body).not.toMatch(/\$\d/);
});

test("state zero explains gates and has no mint CTA", async ({ page }) => {
  await page.goto("/state-zero");
  const main = page.locator("main");
  await expect(main.getByText("Mint not active")).toBeVisible();
  const text = await main.innerText();
  expect(text.toLowerCase()).not.toContain("buy now");
  expect(text).not.toMatch(/mint now/i);
  await expect(main.getByText("No tokens exist.")).toBeVisible();
});

test("community links are honest — no dead links", async ({ page }) => {
  await page.goto("/community");
  await expect(page.getByText("Not yet public").first()).toBeVisible();
  // GitHub is the only live external surface.
  const github = page.getByRole("link", { name: /Open GitHub/i });
  await expect(github).toHaveAttribute("href", /github\.com\/MeltedMindz\/NOENDSTATE/);
});

test("faq disclosures open and close", async ({ page }) => {
  await page.goto("/faq");
  const first = page.locator("details.disclosure").first();
  const summary = first.locator("summary");
  await summary.click();
  await expect(first).toHaveAttribute("open", "");
  await summary.click();
  await expect(first).not.toHaveAttribute("open", "");
});

test("all internal links on primary routes resolve", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const route of ["/", "/community", "/legal"]) {
    await page.goto(route);
    const hrefs = await page.$$eval("a[href^='/']", (as) =>
      as.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? "")
    );
    for (const href of hrefs) {
      const path = href.split("#")[0].split("?")[0];
      if (!path || seen.has(path)) continue;
      seen.add(path);
      const res = await request.get(path);
      expect(res.status(), `${path} linked from ${route}`).toBe(200);
    }
  }
});
