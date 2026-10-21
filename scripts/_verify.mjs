import { chromium } from "playwright";
const BPS = [[1440,900],[768,1024],[390,844]];
const b = await chromium.launch({ channel: "msedge" });
for (const [w,h] of BPS) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
  const p = await ctx.newPage();
  await p.goto("http://localhost:4321/", { waitUntil:"networkidle", timeout:90000 });
  await p.waitForTimeout(3500);
  await p.evaluate(async () => {
    const step = window.innerHeight * 0.75;
    for (let y=0; y<document.body.scrollHeight; y+=step) { window.scrollTo(0,y); await new Promise(r=>setTimeout(r,260)); }
    window.scrollTo(0,0);
  });
  await p.waitForTimeout(2000);
  await p.screenshot({ path:`d:/tmp/build-${w}.png`, fullPage:true });
  const height = await p.evaluate(()=>document.body.scrollHeight);
  const broken = await p.evaluate(()=>[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src));
  const hscroll = await p.evaluate(()=>document.documentElement.scrollWidth > window.innerWidth + 1);
  console.log(`${w}px -> height ${height} | horizontal-scroll: ${hscroll} | broken imgs: ${broken.length}`);
  await ctx.close();
}
await b.close();
