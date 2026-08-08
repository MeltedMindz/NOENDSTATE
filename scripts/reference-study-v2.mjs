// V2 reference capture: token.works at seven viewports + "before" captures
// of the current production NO END STATE site. All output is gitignored.
// Usage: node scripts/reference-study-v2.mjs
import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "fs";

const TW_OUT = "artifacts/reference/tokenworks";
const BEFORE_OUT = "artifacts/before/noendstate";
mkdirSync(TW_OUT, { recursive: true });
mkdirSync(BEFORE_OUT, { recursive: true });

const TW_VIEWPORTS = [
  { name: "1600x1000", width: 1600, height: 1000 },
  { name: "1440x1000", width: 1440, height: 1000 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "390x844", width: 390, height: 844 },
  { name: "360x800", width: 360, height: 800 },
];

const NES_ROUTES = [
  "", "studio", "projects", "state-zero", "chronicle", "treasury", "build",
  "manifesto", "community", "faq", "legal", "privacy", "terms", "risk", "status",
];

const notes = [];
const browser = await chromium.launch();

async function capture(page, base, fullPage = true) {
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${base}-fold.png` });
  if (fullPage) {
    await page.evaluate(async () => {
      let y = 0;
      await new Promise((r) => {
        const s = () => {
          y += 700;
          window.scrollTo({ top: y, behavior: "instant" });
          if (y < document.body.scrollHeight + 700) setTimeout(s, 90);
          else r();
        };
        s();
      });
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(700);
    try {
      await page.screenshot({ path: `${base}-full.png`, fullPage: true, timeout: 20000 });
    } catch {
      notes.push(`${base}: full capture failed`);
    }
  }
}

// ── token.works ──────────────────────────────────────────────────
for (const vp of TW_VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  try {
    await page.goto("https://www.token.works/", { waitUntil: "load", timeout: 45000 });
    await capture(page, `${TW_OUT}/home-${vp.name}`);
    notes.push(`tokenworks ${vp.name}: consoleErrors=${errors.length}`);
  } catch (e) {
    notes.push(`tokenworks ${vp.name}: FAILED ${String(e).slice(0, 120)}`);
  }
  await ctx.close();
}

// structural probe on token.works desktop
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await ctx.newPage();
  await page.goto("https://www.token.works/", { waitUntil: "load", timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(2000);
  const probe = await page.evaluate(() => {
    const pick = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName,
        fontFamily: cs.fontFamily.slice(0, 60),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        color: cs.color,
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        text: (el.textContent || "").trim().slice(0, 90),
      };
    };
    const body = getComputedStyle(document.body);
    const headings = [...document.querySelectorAll("h1,h2,h3")].slice(0, 6).map(pick);
    const links = [...document.querySelectorAll("a")].slice(0, 10).map(pick);
    return {
      bodyBackground: body.backgroundColor,
      bodyFont: body.fontFamily.slice(0, 80),
      bodyColor: body.color,
      headings,
      links,
      docHeight: document.body.scrollHeight,
      imgs: document.querySelectorAll("img").length,
      videos: document.querySelectorAll("video").length,
      canvases: document.querySelectorAll("canvas").length,
    };
  });
  writeFileSync(`${TW_OUT}/structural-probe.json`, JSON.stringify(probe, null, 2));
  await ctx.close();
}

// ── before: production noendstate.com ────────────────────────────
for (const [label, vp] of [
  ["desktop", { width: 1440, height: 1000 }],
  ["mobile", { width: 390, height: 844 }],
]) {
  for (const route of NES_ROUTES) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    const slug = route === "" ? "home" : route.replace(/\//g, "-");
    try {
      await page.goto(`https://noendstate.com/${route}`, { waitUntil: "load", timeout: 45000 });
      await capture(page, `${BEFORE_OUT}/${slug}-${label}`, route === "" || route === "chronicle" || route === "state-zero");
    } catch (e) {
      notes.push(`before ${slug} ${label}: FAILED ${String(e).slice(0, 120)}`);
    }
    await ctx.close();
  }
}

await browser.close();
writeFileSync(`${TW_OUT}/capture-notes.txt`, notes.join("\n"));
console.log(notes.join("\n"));
console.log("done");
