/**
 * Captures the Swiggy dashboard with client identities and revenue redacted.
 *
 * The live page exposes named client outlets and their real sales figures.
 * The portfolio needs to show that the interface exists and updates daily —
 * it does not need to show whose money it is. Names and every numeric cell
 * are blurred in-page before the screenshot is taken, so no readable client
 * data ever reaches the image file.
 */
import { chromium } from "playwright";

const b = await chromium.launch({ channel: "msedge" });
const ctx = await b.newContext({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 2,
});
const p = await ctx.newPage();

await p.goto("https://os.platefulconsulting.com/Swiggy", {
  waitUntil: "networkidle",
  timeout: 45000,
});
await p.waitForTimeout(3500);

await p.addStyleTag({
  content: `
    /* Outlet identity */
    table tbody .nm   { filter: blur(6px) !important; }
    table tbody .meta { filter: blur(5px) !important; }
    /* Every revenue column */
    table tbody td:nth-child(n+2) { filter: blur(6px) !important; }
    /* Search box can echo an outlet name */
    input { filter: blur(4px) !important; }
  `,
});
await p.waitForTimeout(600);

await p.screenshot({ path: "public/shots/swiggy-analytics.png" });
console.log("captured redacted swiggy-analytics.png");

await b.close();
