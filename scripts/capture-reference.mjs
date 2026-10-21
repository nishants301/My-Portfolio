/**
 * Phase 1 reference capture.
 *
 * Screenshots the template at the three target breakpoints and extracts its
 * structure, design tokens and declared motion (CSS transitions + keyframes).
 * Writes everything to refs/ which is gitignored — the reference's own assets
 * must never end up in this repo.
 */
import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const URL = "https://21stdev-my-components-one.vercel.app/#folder-tab-portfolio-template";
const BREAKPOINTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "768", width: 768, height: 1024 },
  { name: "390", width: 390, height: 844 },
];

const browser = await chromium.launch({ channel: "msedge" });

// ---------- Screenshots ----------
for (const bp of BREAKPOINTS) {
  const ctx = await browser.newContext({
    viewport: { width: bp.width, height: bp.height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(4000);

  // Scroll the whole page so lazy/scroll-triggered content paints before the
  // full-page shot, then return to top.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1600);

  await page.screenshot({ path: `refs/ref-${bp.name}.png`, fullPage: true });
  console.log(`captured refs/ref-${bp.name}.png`);
  await ctx.close();
}

// ---------- Structure + tokens ----------
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(URL, { waitUntil: "networkidle", timeout: 90000 });
await page.waitForTimeout(4000);

const data = await page.evaluate(() => {
  const px = (v) => parseFloat(v) || 0;

  // --- Sections in document order ---
  const sections = [...document.querySelectorAll("section, main > div > div, [id]")]
    .filter((el) => el.getBoundingClientRect().height > 240)
    .slice(0, 30)
    .map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const heading = el.querySelector("h1,h2,h3");
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        cls: (el.className || "").toString().slice(0, 90),
        heading: heading ? heading.textContent.trim().slice(0, 70) : null,
        height: Math.round(r.height),
        padTop: cs.paddingTop,
        padBottom: cs.paddingBottom,
        bg: cs.backgroundColor,
      };
    });

  // --- Type scale actually in use ---
  const typeMap = new Map();
  for (const el of document.querySelectorAll("h1,h2,h3,h4,p,span,a,button,li")) {
    const cs = getComputedStyle(el);
    if (!el.textContent.trim()) continue;
    const key = `${el.tagName.toLowerCase()}|${cs.fontSize}|${cs.fontWeight}|${cs.lineHeight}|${cs.letterSpacing}`;
    typeMap.set(key, (typeMap.get(key) || 0) + 1);
  }
  const typeScale = [...typeMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 22)
    .map(([k, count]) => {
      const [tag, size, weight, lh, ls] = k.split("|");
      return { tag, size, weight, lineHeight: lh, letterSpacing: ls, count };
    });

  // --- Fonts ---
  const fonts = [...new Set(
    [...document.querySelectorAll("h1,h2,h3,p,body,button")]
      .map((el) => getComputedStyle(el).fontFamily)
  )].slice(0, 6);

  // --- Radii + shadows ---
  const radii = {};
  const shadows = {};
  for (const el of document.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if (px(cs.borderRadius) > 0) radii[cs.borderRadius] = (radii[cs.borderRadius] || 0) + 1;
    if (cs.boxShadow && cs.boxShadow !== "none")
      shadows[cs.boxShadow.slice(0, 60)] = (shadows[cs.boxShadow.slice(0, 60)] || 0) + 1;
  }

  // --- CSS custom properties on :root ---
  const rootVars = {};
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of rules || []) {
      if (rule.selectorText === ":root" || rule.selectorText === "html") {
        for (const prop of rule.style) {
          if (prop.startsWith("--")) rootVars[prop] = rule.style.getPropertyValue(prop).trim();
        }
      }
    }
  }

  // --- Declared motion: transitions + keyframes ---
  const transitions = {};
  for (const el of document.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if (cs.transitionDuration && cs.transitionDuration !== "0s") {
      const key = `${cs.transitionProperty} | ${cs.transitionDuration} | ${cs.transitionTimingFunction}`;
      transitions[key] = (transitions[key] || 0) + 1;
    }
  }
  const keyframes = [];
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    for (const rule of rules || []) {
      if (rule.type === CSSRule.KEYFRAMES_RULE) {
        keyframes.push({
          name: rule.name,
          steps: [...rule.cssRules].map((k) => `${k.keyText}{${k.style.cssText.slice(0, 110)}}`),
        });
      }
    }
  }
  const animated = {};
  for (const el of document.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if (cs.animationName && cs.animationName !== "none") {
      const key = `${cs.animationName} | ${cs.animationDuration} | ${cs.animationTimingFunction} | delay:${cs.animationDelay}`;
      animated[key] = (animated[key] || 0) + 1;
    }
  }

  const top = (obj, n) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n)
      .map(([k, v]) => ({ value: k, count: v }));

  return {
    pageHeight: document.body.scrollHeight,
    sections,
    typeScale,
    fonts,
    radii: top(radii, 10),
    shadows: top(shadows, 6),
    rootVars,
    transitions: top(transitions, 16),
    animated: top(animated, 12),
    keyframes: keyframes.slice(0, 14),
  };
});

await writeFile("refs/ref-analysis.json", JSON.stringify(data, null, 2));
console.log("wrote refs/ref-analysis.json");
console.log("page height:", data.pageHeight, "| sections:", data.sections.length);

await browser.close();
