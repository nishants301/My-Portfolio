/**
 * Blurs explicit rectangular regions of an image, in place.
 *
 * Used to redact business metrics from product screenshots before they are
 * published. Rects are given as fractions of width/height so the same call
 * survives a re-capture at a different resolution.
 *
 *   node scripts/blur-regions.mjs <in.png> <out.png> \
 *     --rect=x,y,w,h --rect=x,y,w,h --blur=14
 *
 * Fractions are 0–1. Example: --rect=0.20,0.39,0.17,0.03
 */
import { chromium } from "playwright";
import { readFile, writeFile } from "node:fs/promises";

const args = process.argv.slice(2);
const files = args.filter((a) => !a.startsWith("--"));
const rects = args
  .filter((a) => a.startsWith("--rect="))
  .map((a) => a.slice(7).split(",").map(Number));
const blurArg = args.find((a) => a.startsWith("--blur="));
const BLUR = blurArg ? Number(blurArg.slice(7)) : 14;

const [input, output] = files;
if (!input || !output || rects.length === 0) {
  console.error(
    "usage: node scripts/blur-regions.mjs <in.png> <out.png> --rect=x,y,w,h [...]"
  );
  process.exit(1);
}

const dataUrl =
  "data:image/png;base64," + (await readFile(input)).toString("base64");

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage();

await page.evaluate(
  async ({ dataUrl, rects, BLUR }) => {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();

    const W = img.naturalWidth;
    const H = img.naturalHeight;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    for (const [fx, fy, fw, fh] of rects) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(fx * W, fy * H, fw * W, fh * H);
      ctx.clip();
      ctx.filter = `blur(${BLUR}px)`;
      // Redraw the source through the clip so the blur samples real pixels.
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    }
  },
  { dataUrl, rects, BLUR }
);

const out = await page.evaluate(() =>
  document.querySelector("canvas").toDataURL("image/png")
);
await browser.close();

await writeFile(output, Buffer.from(out.split(",")[1], "base64"));
console.log(`blurred ${rects.length} region(s) at ${BLUR}px -> ${output}`);
