/**
 * Renders the 1200x630 Open Graph card to public/og.png.
 *
 * Built from the site's own design tokens so a shared link looks like the page
 * it points at. Re-run after changing the headline or the stats.
 *
 *   node scripts/make-og.mjs
 */
import { chromium } from "playwright";

const STATS = [
  ["70+", "Outlets live"],
  ["4", "Production agents"],
  ["~5 hrs", "Saved daily"],
  ["150+", "Client consultancy"],
];

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#08090a;color:#ecedee;
       font-family:Inter,sans-serif;position:relative;overflow:hidden}
  .grid{position:absolute;inset:0;
        background-image:linear-gradient(to right,rgba(255,255,255,.035) 1px,transparent 1px),
                         linear-gradient(to bottom,rgba(255,255,255,.035) 1px,transparent 1px);
        background-size:60px 60px;
        -webkit-mask-image:radial-gradient(ellipse 80% 70% at 30% 40%,#000 20%,transparent 100%)}
  .glow{position:absolute;right:-120px;top:-100px;width:700px;height:700px;border-radius:50%;
        background:radial-gradient(circle,rgba(74,222,128,.17) 0%,rgba(74,222,128,.05) 35%,transparent 65%)}
  .wrap{position:relative;padding:74px 80px;height:100%;display:flex;flex-direction:column}
  .kicker{font-family:'JetBrains Mono',monospace;font-size:15px;letter-spacing:.16em;
          text-transform:uppercase;color:#5f666c;display:flex;align-items:center;gap:12px}
  .pip{width:8px;height:8px;border-radius:50%;background:#4ade80;display:inline-block}
  h1{font-size:88px;font-weight:500;letter-spacing:-.035em;line-height:.98;margin-top:34px}
  h1 span{color:#9ba1a6}
  .role{font-size:23px;color:#9ba1a6;margin-top:26px;letter-spacing:-.01em}
  .stats{margin-top:auto;display:flex;gap:64px;border-top:1px solid rgba(255,255,255,.09);padding-top:30px}
  .v{font-family:'JetBrains Mono',monospace;font-size:31px;line-height:1}
  .l{font-size:14px;color:#5f666c;margin-top:9px}
</style></head><body>
  <div class="grid"></div><div class="glow"></div>
  <div class="wrap">
    <div class="kicker"><span class="pip"></span>Delhi, India · Available for work</div>
    <h1>I ship production AI<br><span>end-to-end. Solo.</span></h1>
    <div class="role">Nishant Shekhar — AI Systems Engineer · AI Agents · LLM Applications</div>
    <div class="stats">
      ${STATS.map(([v, l]) => `<div><div class="v">${v}</div><div class="l">${l}</div></div>`).join("")}
    </div>
  </div>
</body></html>`;

const b = await chromium.launch({ channel: "msedge" });
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html, { waitUntil: "networkidle" });
// Let the webfonts paint before capturing, or the card renders in fallback type.
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(1200);
await p.screenshot({ path: "public/og.png" });
console.log("wrote public/og.png (1200x630)");
await b.close();
