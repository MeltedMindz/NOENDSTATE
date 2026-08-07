import { expect, test } from "@playwright/test";

test.describe("reduced motion", () => {
  test("hero renders static field and reveals are visible", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    // Reveal elements must be visible without scrolling/animation.
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" as ScrollBehavior }));
    await page.waitForTimeout(300);
    const hidden = await page.$$eval(".reveal", (els) =>
      els.filter((el) => getComputedStyle(el).opacity === "0").length
    );
    expect(hidden).toBe(0);
    // Canvas exists (static drawing) and page remains interactive.
    await expect(page.locator("canvas")).toHaveCount(1);
    await expect(page.getByRole("link", { name: /Explore the studio/i })).toBeVisible();
  });
});

test.describe("machine-readable surfaces", () => {
  test("sitemap lists primary routes", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    for (const path of ["/studio", "/chronicle", "/state-zero", "/chronicle/NES-0000"]) {
      expect(xml).toContain(`https://noendstate.com${path}`);
    }
    expect(xml).not.toContain("/state-zero/0");
  });

  test("robots allows crawl, disallows fixtures, links sitemap", async ({ request }) => {
    const res = await request.get("/robots.txt");
    const text = await res.text();
    expect(text).toContain("Allow: /");
    expect(text).toContain("Disallow: /state-zero/0");
    expect(text).toContain("sitemap.xml");
  });

  test("feed.xml is valid-shaped RSS with real records", async ({ request }) => {
    const res = await request.get("/feed.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain("<rss");
    expect(xml).toContain("NES-0000");
    expect(xml).toContain("BUILD-000");
  });

  test("llms.txt states the honest facts", async ({ request }) => {
    const res = await request.get("/llms.txt");
    const text = await res.text();
    expect(text).toContain("Minting is NOT active");
    expect(text).toContain("noendstate.com");
  });

  test("json apis serve validated content", async ({ request }) => {
    const projects = await (await request.get("/api/projects")).json();
    expect(projects.count).toBe(0);
    const chronicle = await (await request.get("/api/chronicle")).json();
    expect(chronicle.count).toBeGreaterThanOrEqual(3);
    expect(chronicle.events[0].eventId).toMatch(/^NES-\d{4}$/);
    const status = await (await request.get("/api/status")).json();
    expect(status.features.mint).toBe("disabled");
    expect(status.features.claims).toBe("disabled");
  });

  test("pages carry canonical urls and OG metadata", async ({ page }) => {
    await page.goto("/studio");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://noendstate.com/studio"
    );
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      "content",
      "NO END STATE"
    );
    await page.goto("/");
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute(
      "content",
      /opengraph-image/
    );
  });

  test("security headers are present", async ({ request }) => {
    const res = await request.get("/");
    const headers = res.headers();
    expect(headers["content-security-policy"]).toContain("default-src 'self'");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  });
});
