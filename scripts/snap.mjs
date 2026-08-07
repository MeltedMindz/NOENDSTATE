import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const url = process.argv[2] || "http://localhost:3105/";
const name = process.argv[3] || "home";
for (const [label, vp] of [["desktop", {width:1440,height:1000}], ["mobile", {width:390,height:844}]]) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `artifacts/verification/${name}-${label}-fold.png` });
  await page.evaluate(async () => { let y=0; await new Promise(r=>{const s=()=>{y+=700;window.scrollTo({top:y,behavior:'instant'}); if(y<document.body.scrollHeight+700) setTimeout(s,80); else r();};s();}); window.scrollTo({top:0,behavior:'instant'});});
  await page.waitForTimeout(600);
  await page.screenshot({ path: `artifacts/verification/${name}-${label}-full.png`, fullPage: true });
  await ctx.close();
}
await browser.close();
console.log("done");
