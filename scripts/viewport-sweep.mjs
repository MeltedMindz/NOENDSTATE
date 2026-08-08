import { chromium } from "@playwright/test";
const VPS = [[1600,1000],[1440,1000],[1280,800],[1024,768],[768,1024],[390,844],[360,800]];
const browser = await chromium.launch();
for (const [w,h] of VPS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3105/", { waitUntil: "load" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `artifacts/verification/v2-home-${w}x${h}.png` });
  await ctx.close();
}
for (const route of ["state-zero","chronicle","community","build","manifesto","studio"]) {
  for (const [label,vp] of [["d",{width:1440,height:1000}],["m",{width:390,height:844}]]) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:3105/${route}`, { waitUntil: "load" });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `artifacts/verification/v2-${route}-${label}.png`, fullPage: route !== "chronicle" });
    await ctx.close();
  }
}
await browser.close();
console.log("sweep done");
