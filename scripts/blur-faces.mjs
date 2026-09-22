/**
 * Blurs the video thumbnails in a HeyGen project-library screenshot so no
 * presenter face is recognizable, while leaving the app chrome legible.
 *
 * The grid is found rather than hard-coded: the card gutters are near-uniform
 * dark background, so scanning for low-variance columns and rows recovers the
 * cell boundaries at any resolution or scroll position. Each cell's upper
 * portion (the video still) is then blurred in place.
 *
 *   node scripts/blur-faces.mjs <input.png> [output.png]
 *
 * Flags:
 *   --thumb=0.74   fraction of each cell height treated as thumbnail
 *   --blur=26      blur radius in px at the image's native scale
 *   --all          skip detection, blur everything right of the sidebar
 */
import { chromium } from "playwright";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const flags = Object.fromEntries(
  args.filter((a) => a.startsWith("--")).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);
const files = args.filter((a) => !a.startsWith("--"));

const input = files[0];
if (!input) {
  console.error("usage: node scripts/blur-faces.mjs <input.png> [output.png]");
  process.exit(1);
}
const output = files[1] ?? path.join("public/shots", "reel-pipeline.png");

const THUMB = Number(flags.thumb ?? 0.74);
const BLUR = Number(flags.blur ?? 26);
const ALL = Boolean(flags.all);

const dataUrl =
  "data:image/png;base64," + (await readFile(input)).toString("base64");

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage();

const result = await page.evaluate(
  async ({ dataUrl, THUMB, BLUR, ALL }) => {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();

    const W = img.naturalWidth;
    const H = img.naturalHeight;

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    // Attached so the export step below can find it via querySelector.
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);

    const { data } = ctx.getImageData(0, 0, W, H);
    const lum = (x, y) => {
      const i = (y * W + x) * 4;
      return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    };

    // --- Find the sidebar: the first tall column band whose content stops. ---
    // Sample every 4th row for speed; a gutter column has near-zero variance.
    const colVar = new Float64Array(W);
    const rows = [];
    for (let y = 0; y < H; y += 4) rows.push(y);

    for (let x = 0; x < W; x++) {
      let sum = 0;
      let sum2 = 0;
      for (const y of rows) {
        const v = lum(x, y);
        sum += v;
        sum2 += v * v;
      }
      const n = rows.length;
      colVar[x] = sum2 / n - (sum / n) ** 2;
    }

    const QUIET = 12; // variance below this reads as flat background
    const isQuietCol = (x) => colVar[x] < QUIET;

    // Content region starts after the widest quiet run in the left 35%.
    let contentX = 0;
    {
      let run = 0;
      let best = { len: 0, end: 0 };
      for (let x = 0; x < Math.floor(W * 0.35); x++) {
        if (isQuietCol(x)) {
          run++;
          if (run > best.len) best = { len: run, end: x };
        } else run = 0;
      }
      contentX = best.len > W * 0.01 ? best.end + 1 : 0;
    }

    const blurRegion = (x, y, w, h) => {
      if (w <= 0 || h <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      ctx.filter = `blur(${BLUR}px)`;
      // Redraw the source through the clip so the blur samples real pixels.
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    };

    if (ALL) {
      blurRegion(contentX, 0, W - contentX, H);
      return { W, H, contentX, cells: -1, mode: "all" };
    }

    // --- Column runs = card columns, split by quiet gutters. ---
    const runs = (isQuiet, start, end) => {
      const out = [];
      let s = null;
      for (let i = start; i < end; i++) {
        if (!isQuiet(i)) {
          if (s === null) s = i;
        } else if (s !== null) {
          out.push([s, i - 1]);
          s = null;
        }
      }
      if (s !== null) out.push([s, end - 1]);
      return out;
    };

    const colRuns = runs(isQuietCol, contentX, W).filter(
      ([a, b]) => b - a > W * 0.06
    );

    // --- Row variance measured only inside the content columns. ---
    const rowVar = new Float64Array(H);
    const sampleX = [];
    for (const [a, b] of colRuns) {
      for (let x = a; x <= b; x += 4) sampleX.push(x);
    }
    for (let y = 0; y < H; y++) {
      let sum = 0;
      let sum2 = 0;
      for (const x of sampleX) {
        const v = lum(x, y);
        sum += v;
        sum2 += v * v;
      }
      const n = sampleX.length || 1;
      rowVar[y] = sum2 / n - (sum / n) ** 2;
    }
    const isQuietRow = (y) => rowVar[y] < QUIET;
    const rowRuns = runs(isQuietRow, 0, H).filter(([a, b]) => b - a > H * 0.06);

    let cells = 0;
    for (const [ry0, ry1] of rowRuns) {
      const cellH = ry1 - ry0 + 1;
      // A row clipped by the bottom edge has no visible caption, so the
      // thumbnail fraction would leave the lower part of a face sharp.
      const clipped = ry1 >= H - 3;
      const h = clipped ? cellH : Math.round(cellH * THUMB);
      for (const [cx0, cx1] of colRuns) {
        blurRegion(cx0, ry0, cx1 - cx0 + 1, h);
        cells++;
      }
    }

    // Nothing detected — fail safe by blurring the whole content region.
    if (cells === 0) {
      blurRegion(contentX, 0, W - contentX, H);
      return { W, H, contentX, cells: 0, mode: "fallback-all" };
    }

    return {
      W,
      H,
      contentX,
      cells,
      cols: colRuns.length,
      rows: rowRuns.length,
      mode: "grid",
    };
  },
  { dataUrl, THUMB, BLUR, ALL }
);

// toDataURL is re-read here so the fallback paths also export.
const out = await page.evaluate(() => {
  const c = document.querySelector("canvas");
  return c ? c.toDataURL("image/png") : null;
});

await browser.close();

if (!out) {
  console.error("no canvas produced");
  process.exit(1);
}

await writeFile(output, Buffer.from(out.split(",")[1], "base64"));
console.log(
  `mode=${result.mode} cols=${result.cols ?? "-"} rows=${result.rows ?? "-"} ` +
    `cells=${result.cells} sidebar=${result.contentX}px blur=${BLUR}px`
);
console.log("wrote", output);
