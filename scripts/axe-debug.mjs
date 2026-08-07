import { chromium, devices } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 14"] });
const page = await ctx.newPage();
await page.goto("http://localhost:3105/", { waitUntil: "load" });
const results = await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag22aa"]).analyze();
for (const v of results.violations) {
  console.log(`== ${v.id} (${v.impact}) ${v.nodes.length} nodes`);
  for (const n of v.nodes.slice(0, 20)) {
    console.log("  ", n.target[0]);
  }
}
console.log("done");
await browser.close();
