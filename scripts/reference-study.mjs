// Reference-site study capture. Screenshots land in artifacts/reference/creativeglu/
// which is gitignored — third-party captures are never committed.
// Usage: node scripts/reference-study.mjs
import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";
import { writeFileSync } from "fs";

const OUT = "artifacts/reference/creativeglu";
mkdirSync(OUT, { recursive: true });

const PAGES = [
  { slug: "home", url: "https://creativeglu.ai/home" },
  { slug: "ai-transformation", url: "https://creativeglu.ai/ai-transformation" },
  { slug: "portfolio", url: "https://creativeglu.ai/portfolio" },
  { slug: "contact-us", url: "https://creativeglu.ai/contact-us" },
];

const VIEWPORTS = [
  { name: "1440x1000", width: 1440, height: 1000 },
  { name: "1728x1117", width: 1728, height: 1117 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "390x844", width: 390, height: 844 },
  { name: "360x800", width: 360, height: 800 },
];

const notes = [];

const browser = await chromium.launch();
try {
  for (const pageDef of PAGES) {
    // Full sweep on home; primary desktop + mobile on secondary pages.
    const viewports =
      pageDef.slug === "home"
        ? VIEWPORTS
        : VIEWPORTS.filter((v) => v.name === "1440x1000" || v.name === "390x844");

    for (const vp of viewports) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        userAgent:
          vp.width < 500
            ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
            : undefined,
      });
      const page = await ctx.newPage();
      const consoleErrors = [];
      page.on("console", (m) => {
        if (m.type() === "error") consoleErrors.push(m.text());
      });
      try {
        await page.goto(pageDef.url, { waitUntil: "networkidle", timeout: 45000 });
      } catch {
        await page.waitForTimeout(3000);
      }
      await page.waitForTimeout(2500);
      const base = `${OUT}/${pageDef.slug}-${vp.name}`;
      await page.screenshot({ path: `${base}-fold.png` });
      // Scroll through to trigger reveals, then full-page capture
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let y = 0;
          const step = () => {
            y += 600;
            window.scrollTo(0, y);
            if (y < document.body.scrollHeight + 600) setTimeout(step, 120);
            else resolve(undefined);
          };
          step();
        });
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1200);
      try {
        await page.screenshot({ path: `${base}-full.png`, fullPage: true, timeout: 30000 });
      } catch {
        notes.push(`${pageDef.slug} ${vp.name}: full-page capture failed`);
      }

      // On home desktop, try opening the menu
      if (pageDef.slug === "home" && vp.name === "1440x1000") {
        const menuCandidates = [
          "button[aria-label*='menu' i]",
          "[class*='menu' i][class*='button' i]",
          "[class*='hamburger' i]",
          "nav button",
          "header button",
        ];
        for (const sel of menuCandidates) {
          const el = page.locator(sel).first();
          if ((await el.count()) > 0 && (await el.isVisible().catch(() => false))) {
            await el.click().catch(() => {});
            await page.waitForTimeout(1500);
            await page.screenshot({ path: `${OUT}/home-1440x1000-menu.png` });
            break;
          }
        }
      }
      notes.push(
        `${pageDef.slug} ${vp.name}: consoleErrors=${consoleErrors.length}${
          consoleErrors.length ? " :: " + consoleErrors.slice(0, 3).join(" | ").slice(0, 300) : ""
        }`
      );
      await ctx.close();
    }
  }

  // Structural probe on home desktop: fonts, heading sizes, colors
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  await page.goto("https://creativeglu.ai/home", { waitUntil: "networkidle", timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const probe = await page.evaluate(() => {
    const pick = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        textSample: (el.textContent || "").trim().slice(0, 80),
      };
    };
    const body = getComputedStyle(document.body);
    return {
      bodyBackground: body.backgroundColor,
      bodyFont: body.fontFamily,
      h1: pick(document.querySelector("h1")),
      h2: pick(document.querySelector("h2")),
      h3: pick(document.querySelector("h3")),
      p: pick(document.querySelector("main p, p")),
      a: pick(document.querySelector("a")),
      videoCount: document.querySelectorAll("video").length,
      canvasCount: document.querySelectorAll("canvas").length,
      sectionCount: document.querySelectorAll("section").length,
      docHeight: document.body.scrollHeight,
    };
  });
  writeFileSync(`${OUT}/structural-probe.json`, JSON.stringify(probe, null, 2));
  await ctx.close();
} finally {
  await browser.close();
}
writeFileSync(`${OUT}/capture-notes.txt`, notes.join("\n"));
console.log(notes.join("\n"));
console.log("done");
