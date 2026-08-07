import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { PRIMARY_ROUTES } from "./helpers";

for (const route of PRIMARY_ROUTES) {
  test(`axe: ${route} has no serious or critical violations`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("load");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );
    expect(
      serious.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`)
    ).toEqual([]);
  });
}

test("menu open state passes axe", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Index" }).click();
  await expect(page.getByRole("dialog", { name: "Site index" })).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical"
  );
  expect(serious.map((v) => v.id)).toEqual([]);
});
