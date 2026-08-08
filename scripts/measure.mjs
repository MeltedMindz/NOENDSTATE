import { chromium } from "@playwright/test";
const browser = await chromium.launch();
async function measure(url) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  let bytes = 0, js = 0, jsCount = 0, fonts = 0, reqs = 0;
  page.on("response", async (r) => {
    try {
      const b = (await r.body()).length; bytes += b; reqs++;
      const u = r.url();
      if (u.endsWith(".js") || r.headers()["content-type"]?.includes("javascript")) { js += b; jsCount++; }
      if (u.match(/\.(woff2?|ttf)/) || r.headers()["content-type"]?.includes("font")) fonts++;
    } catch {}
  });
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const words = await page.evaluate(() => {
    const main = document.querySelector("main");
    return main ? main.innerText.trim().split(/\s+/).length : 0;
  });
  const canvases = await page.evaluate(() => document.querySelectorAll("canvas").length);
  await ctx.close();
  return { url, totalKB: Math.round(bytes/1024), jsKB: Math.round(js/1024), jsFiles: jsCount, fonts, reqs, mainWords: words, canvases };
}
console.log("BEFORE (production V1):", JSON.stringify(await measure("https://noendstate.com/")));
console.log("AFTER  (local V2):     ", JSON.stringify(await measure("http://localhost:3105/")));
await browser.close();
