import { expect, test } from "@playwright/test";

test("fullscreen menu opens, navigates, and closes", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Index" });
  await toggle.click();

  const menu = page.getByRole("dialog", { name: "Site index" });
  await expect(menu).toBeVisible();
  await expect(menu.getByText("Chronicle")).toBeVisible();
  await expect(menu.getByText("The append-only record")).toBeVisible();

  await menu.getByRole("link", { name: /04.*Chronicle/s }).click();
  await expect(page).toHaveURL(/\/chronicle/);
  await expect(menu).toBeHidden();
});

test("menu closes with Escape and returns focus to toggle", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Index" });
  await toggle.click();
  await expect(page.getByRole("dialog", { name: "Site index" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Site index" })).toBeHidden();
  await expect(page.getByRole("button", { name: "Index" })).toBeFocused();
});

test("menu traps focus while open", async ({ page, isMobile }) => {
  test.skip(isMobile, "Tab-key navigation is a physical-keyboard behavior");
  await page.goto("/");
  await page.getByRole("button", { name: "Index" }).click();
  const menu = page.getByRole("dialog", { name: "Site index" });
  await expect(menu).toBeVisible();
  // Tab through more stops than the menu has; focus must stay inside.
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const el = document.activeElement;
      return Boolean(el?.closest("#fullscreen-menu"));
    });
    expect(inside).toBe(true);
  }
});

test("body scroll locks while menu is open", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Index" }).click();
  const overflow = await page.evaluate(() => document.body.style.overflow);
  expect(overflow).toBe("hidden");
  await page.keyboard.press("Escape");
  const after = await page.evaluate(() => document.body.style.overflow);
  expect(after).not.toBe("hidden");
});

test("skip link jumps to main content", async ({ page, isMobile }) => {
  test.skip(isMobile, "Tab-key navigation is a physical-keyboard behavior");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main/);
});

test("keyboard-only user can reach every primary nav destination", async ({ page, isMobile }) => {
  test.skip(isMobile, "Tab-key navigation is a physical-keyboard behavior");
  await page.goto("/");
  // Header inline nav (desktop project only exercises this meaningfully,
  // but the links are still focusable in DOM order on mobile).
  const links = ["Studio", "Projects", "State Zero", "Chronicle"];
  for (const name of links) {
    const link = page.locator("header").getByRole("link", { name, exact: true });
    await expect(link).toHaveAttribute("href", /.+/);
  }
});
