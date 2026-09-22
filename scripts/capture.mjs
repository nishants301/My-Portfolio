/**
 * Captures hero screenshots of the live project sites into /public/shots.
 *
 * Read-only: it loads each public page, waits for fonts/animation to settle,
 * and screenshots the viewport. Auth-gated URLs will fail and are reported
 * rather than retried with credentials.
 *
 *   node scripts/capture.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const TARGETS = [
  { slug: "replyji", url: "https://replyji.com" },
  { slug: "plateful-technologies", url: "https://platefultechnologies.com" },
  { slug: "propalate-os", url: "https://os.platefulconsulting.com" },
  { slug: "swiggy-analytics", url: "https://os.platefulconsulting.com/Swiggy" },
];

const OUT = "public/shots";

const main = async () => {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || "msedge" });
  const ctx = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 2,
  });

  const results = [];

  for (const t of TARGETS) {
    const page = await ctx.newPage();
    try {
      await page.goto(t.url, { waitUntil: "networkidle", timeout: 45000 });
      // Let entrance animations and webfonts settle before capturing.
      await page.waitForTimeout(4000);
      await page.screenshot({ path: `${OUT}/${t.slug}.png` });
      results.push({ ...t, ok: true, title: await page.title() });
    } catch (err) {
      results.push({ ...t, ok: false, error: err.message.split("\n")[0] });
    } finally {
      await page.close();
    }
  }

  await browser.close();

  for (const r of results) {
    console.log(
      r.ok
        ? `OK    ${r.slug.padEnd(24)} "${r.title}"`
        : `FAIL  ${r.slug.padEnd(24)} ${r.error}`
    );
  }
};

main();
