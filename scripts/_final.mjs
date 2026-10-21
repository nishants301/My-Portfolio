import { chromium } from "playwright";
const U = "https://my-portfolio-hsirm5wcz-nshekhar301-8161s-projects.vercel.app";
const b = await chromium.launch({ channel: "msedge" });
for (const [w,h] of [[1440,900],[768,1024],[390,844]]) {
  const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 });
  const p = await ctx.newPage();
  await p.goto(U, { waitUntil:"networkidle", timeout:90000 });
  await p.waitForTimeout(3000);
  await p.evaluate(async () => {
    const s = window.innerHeight*0.7;
    for (let y=0;y<document.body.scrollHeight;y+=s){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,300));}
    window.scrollTo(0,0);
  });
  await p.waitForTimeout(2000);
  await p.screenshot({ path:`d:/tmp/final-${w}.png`, fullPage:true });
  const hs = await p.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
  console.log(`${w}: height ${await p.evaluate(()=>document.body.scrollHeight)} | hscroll ${hs}`);
  await ctx.close();
}
await b.close();
