/**
 * Propalate OS is auth-gated and slow to settle, so it needs a longer budget
 * and a domcontentloaded wait rather than networkidle (a dashboard that polls
 * never reaches network idle).
 */
import { chromium } from "playwright";

const b = await chromium.launch({ channel: "msedge" });
const ctx = await b.newContext({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 2,
});
const p = await ctx.newPage();

try {
  await p.goto("https://os.platefulconsulting.com/", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await p.waitForTimeout(6000);
  console.log("title:", await p.title());
  console.log("url  :", p.url());
  const text = (await p.evaluate(() => document.body.innerText)).slice(0, 400);
  console.log("--- visible text ---\n" + text);
  await p.screenshot({ path: "public/shots/_propalate-raw.png" });
  console.log("captured _propalate-raw.png");
} catch (e) {
  console.log("FAILED:", e.message.split("\n")[0]);
}

await b.close();
