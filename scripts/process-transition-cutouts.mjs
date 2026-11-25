import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const RAW_DIR = path.join(ROOT, "scratch", "cutouts_raw");
const OUT_DIR = path.join(ROOT, "public", "images", "transition-cutouts");

const TARGET_MAX_SIDE = 840;
const PAD_PX = 12;

const METAL_FILES = new Set(["tool-chef-knife", "tool-stainless-pot"]);
const INTERIOR_HOLE_FILES = new Set(["tool-stainless-pot"]);

/**
 * Flood-fills pure/near-white studio background starting from outer image borders,
 * applies smooth anti-aliased edge feathering + white fringe decontamination,
 * trims tightly, and exports 840px longest-side RGBA WebP.
 */
async function processCutout(inputPath, outputPath) {
  const baseName = path.parse(inputPath).name;
  const strictMetal = METAL_FILES.has(baseName);
  const punchInteriorHoles = INTERIOR_HOLE_FILES.has(baseName);

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const total = width * height;
  const buf = Buffer.from(data);

  // 1. Border BFS flood-fill for studio white / ultra-light neutral backdrop
  const bgMask = new Uint8Array(total);
  const queue = new Int32Array(total);
  let qHead = 0;
  let qTail = 0;

  const isBgPixel = (idx) => {
    const p = idx * 4;
    const r = buf[p];
    const g = buf[p + 1];
    const b = buf[p + 2];
    const a = buf[p + 3];
    if (a < 16) return true;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (strictMetal) {
      // Preserve bright metallic specular highlights on brushed stainless steel
      return lum >= 249 && chroma <= 8;
    }
    // Pure white & very faint studio backdrop grey without eating colored/warm subjects
    return (lum >= 234 && chroma <= 26) || (lum >= 224 && chroma <= 14);
  };

  const enqueue = (x, y) => {
    const idx = y * width + x;
    if (bgMask[idx]) return;
    if (!isBgPixel(idx)) return;
    bgMask[idx] = 1;
    queue[qTail++] = idx;
  };

  for (let x = 0; x < width; x++) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  while (qHead < qTail) {
    const idx = queue[qHead++];
    const x = idx % width;
    const y = (idx - x) / width;

    if (x > 0) enqueue(x - 1, y);
    if (x < width - 1) enqueue(x + 1, y);
    if (y > 0) enqueue(x, y - 1);
    if (y < height - 1) enqueue(x, y + 1);
  }

  // Optional pass for enclosed handle loops (e.g. stockpot side & lid handles):
  // flood interior pure-white pockets (lum >= 251, chroma <= 5) of moderate area.
  if (punchInteriorHoles) {
    const visited = new Uint8Array(total);
    const comp = [];
    for (let i = 0; i < total; i++) {
      if (bgMask[i] || visited[i]) continue;
      const p = i * 4;
      const r = buf[p], g = buf[p + 1], b = buf[p + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      if (lum < 250 || chroma > 6) continue;

      comp.length = 0;
      qHead = 0;
      qTail = 0;
      visited[i] = 1;
      queue[qTail++] = i;
      let minX = width, maxX = 0, minY = height, maxY = 0;
      while (qHead < qTail) {
        const cur = queue[qHead++];
        comp.push(cur);
        const cx = cur % width;
        const cy = (cur - cx) / width;
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;
        const neighbors = [
          cx > 0 ? cur - 1 : -1,
          cx < width - 1 ? cur + 1 : -1,
          cy > 0 ? cur - width : -1,
          cy < height - 1 ? cur + width : -1,
        ];
        for (const nb of neighbors) {
          if (nb < 0 || bgMask[nb] || visited[nb]) continue;
          const np = nb * 4;
          const nr = buf[np], ng = buf[np + 1], nbv = buf[np + 2];
          const nLum = 0.299 * nr + 0.587 * ng + 0.114 * nbv;
          const nChroma = Math.max(nr, ng, nbv) - Math.min(nr, ng, nbv);
          if (nLum >= 242 && nChroma <= 10) {
            visited[nb] = 1;
            queue[qTail++] = nb;
          }
        }
      }
      // Handle openings only occur inside side handles (outer left/right) or lid handle (top)
      const inHandleZone =
        maxX < width * 0.22 || minX > width * 0.72 || maxY < height * 0.24;
      if (comp.length >= 60 && comp.length <= 25000 && inHandleZone) {
        for (const cIdx of comp) bgMask[cIdx] = 1;
      }
    }
  }

  // Zero out confirmed background pixels
  for (let i = 0; i < total; i++) {
    if (bgMask[i]) {
      buf[i * 4 + 3] = 0;
    }
  }

  // 2. Soft edge matting & white-halo decontamination (within 2px of background)
  const nearBg = new Uint8Array(total);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      if (bgMask[idx]) continue;
      if (
        bgMask[idx - 1] ||
        bgMask[idx + 1] ||
        bgMask[idx - width] ||
        bgMask[idx + width] ||
        bgMask[idx - width - 1] ||
        bgMask[idx - width + 1] ||
        bgMask[idx + width - 1] ||
        bgMask[idx + width + 1]
      ) {
        nearBg[idx] = 1;
      }
    }
  }

  // Expand ring by 1 more pixel for smooth feathering
  const nearBg2 = new Uint8Array(nearBg);
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      if (bgMask[idx] || nearBg[idx]) continue;
      if (
        nearBg[idx - 1] ||
        nearBg[idx + 1] ||
        nearBg[idx - width] ||
        nearBg[idx + width]
      ) {
        nearBg2[idx] = 2;
      }
    }
  }

  for (let i = 0; i < total; i++) {
    const ring = nearBg2[i];
    if (!ring) continue;
    const p = i * 4;
    const r = buf[p];
    const g = buf[p + 1];
    const b = buf[p + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const chroma = max - min;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    const lumThreshold = strictMetal ? (ring === 1 ? 236 : 244) : ring === 1 ? 196 : 218;
    const chromaMax = strictMetal ? 14 : ring === 1 ? 38 : 26;

    if (lum >= lumThreshold && chroma <= chromaMax) {
      // Smoothly ramp alpha down as pixel approaches white
      const ceiling = strictMetal ? 250 : 246;
      const t = Math.max(0, Math.min(1, (ceiling - lum) / (ceiling - lumThreshold)));
      const newAlpha = Math.round(t * t * 255);
      if (newAlpha <= 14) {
        buf[p + 3] = 0;
      } else {
        buf[p + 3] = newAlpha;
        // Decontaminate white halo: C_true = (C - 255 * (1 - a)) / a
        const a = Math.max(newAlpha / 255, 0.22);
        const inv = 1 - a;
        buf[p] = Math.max(0, Math.min(255, Math.round((r - 255 * inv) / a)));
        buf[p + 1] = Math.max(0, Math.min(255, Math.round((g - 255 * inv) / a)));
        buf[p + 2] = Math.max(0, Math.min(255, Math.round((b - 255 * inv) / a)));
      }
    }
  }

  // 3. Find tight bounding box of non-transparent subject pixels
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = buf[(y * width + x) * 4 + 3];
      if (a > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    throw new Error(`No foreground detected in ${inputPath}`);
  }

  const cropLeft = Math.max(0, minX - PAD_PX);
  const cropTop = Math.max(0, minY - PAD_PX);
  const cropWidth = Math.min(width - cropLeft, maxX - minX + 1 + PAD_PX * 2);
  const cropHeight = Math.min(height - cropTop, maxY - minY + 1 + PAD_PX * 2);

  await sharp(buf, { raw: { width, height, channels: 4 } })
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .resize(TARGET_MAX_SIDE, TARGET_MAX_SIDE, {
      fit: "inside",
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    })
    .webp({ quality: 88, alphaQuality: 96, effort: 6 })
    .toFile(outputPath);

  const stat = fs.statSync(outputPath);
  const meta = await sharp(outputPath).metadata();
  return {
    file: path.basename(outputPath),
    width: meta.width,
    height: meta.height,
    kb: +(stat.size / 1024).toFixed(1),
  };
}

async function main() {
  if (!fs.existsSync(RAW_DIR)) {
    console.error(`Missing raw dir: ${RAW_DIR}`);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const filterNames = process.argv.slice(2);
  const files = fs
    .readdirSync(RAW_DIR)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .filter((f) => filterNames.length === 0 || filterNames.some((n) => f.startsWith(n)));

  const results = [];
  for (const file of files) {
    const base = path.parse(file).name;
    const inPath = path.join(RAW_DIR, file);
    const outPath = path.join(OUT_DIR, `${base}.webp`);
    const res = await processCutout(inPath, outPath);
    results.push(res);
  }
  console.table(results);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
