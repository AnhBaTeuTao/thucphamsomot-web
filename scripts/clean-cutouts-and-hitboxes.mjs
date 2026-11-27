import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const TARGET_DIRS = [
  { dir: "public/images/food-cutouts", urlPrefix: "/images/food-cutouts", format: "png" },
  { dir: "public/images/transition-cutouts", urlPrefix: "/images/transition-cutouts", format: "webp" },
];
const OUTPUT_TS = path.join(ROOT, "lib/food-cutout-hitboxes.ts");

/** 2D Exact Euclidean Distance Transform (Felzenszwalb & Huttenlocher squared distance -> sqrt) */
function computeEDT(binaryMask, width, height, targetVal) {
  const INF = 1e12;
  const f = new Float64Array(width * height);
  const d = new Float64Array(width * height);
  const v = new Int32Array(Math.max(width, height));
  const z = new Float64Array(Math.max(width, height) + 1);

  // Column pass
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      f[y * width + x] = binaryMask[y * width + x] === targetVal ? 0 : INF;
    }
    let k = 0;
    v[0] = 0;
    z[0] = -INF;
    z[1] = INF;
    for (let q = 1; q < height; q++) {
      let s;
      while (true) {
        const r = v[k];
        const fr = f[r * width + x];
        const fq = f[q * width + x];
        s = ((fq + q * q) - (fr + r * r)) / (2 * q - 2 * r);
        if (s <= z[k]) {
          k--;
        } else {
          break;
        }
      }
      k++;
      v[k] = q;
      z[k] = s;
      z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < height; q++) {
      while (z[k + 1] < q) k++;
      const r = v[k];
      d[q * width + x] = (q - r) * (q - r) + f[r * width + x];
    }
  }

  // Row pass
  const rowIn = new Float64Array(width);
  for (let y = 0; y < height; y++) {
    const off = y * width;
    for (let x = 0; x < width; x++) rowIn[x] = d[off + x];
    let k = 0;
    v[0] = 0;
    z[0] = -INF;
    z[1] = INF;
    for (let q = 1; q < width; q++) {
      let s;
      while (true) {
        const r = v[k];
        s = ((rowIn[q] + q * q) - (rowIn[r] + r * r)) / (2 * q - 2 * r);
        if (s <= z[k]) {
          k--;
        } else {
          break;
        }
      }
      k++;
      v[k] = q;
      z[k] = s;
      z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < width; q++) {
      while (z[k + 1] < q) k++;
      const r = v[k];
      d[off + q] = Math.sqrt((q - r) * (q - r) + rowIn[r]);
    }
  }

  return d;
}

/** Smoothly remove studio white/grey halos, brighten crisp edges & crop with exact 4px transparent padding */
async function cleanAndTrimImage(absPath, format) {
  const inputBuf = fs.readFileSync(absPath);
  const raw = await sharp(inputBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = raw.info;
  const buf = new Uint8Array(raw.data);

  // Pad 2px transparent border around mask during EDT so canvas-touching rims also count as exterior
  const pw = w + 4;
  const ph = h + 4;
  const paddedTransMask = new Uint8Array(pw * ph); // 1 = transparent
  for (let py = 0; py < ph; py++) {
    for (let px = 0; px < pw; px++) {
      if (px < 2 || px >= w + 2 || py < 2 || py >= h + 2) {
        paddedTransMask[py * pw + px] = 1;
      } else {
        const a = buf[((py - 2) * w + (px - 2)) * 4 + 3];
        paddedTransMask[py * pw + px] = a < 48 ? 1 : 0;
      }
    }
  }

  // Distance of every foreground pixel to nearest exterior/transparent hole
  const distToBg = computeEDT(paddedTransMask, pw, ph, 1);

  // First identify interior pockets of neutral bright white/grey touching transparent crevices
  const studioPocketRemoved = new Uint8Array(w * h);
  const queue = [];
  const visited = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const p4 = idx * 4;
      const a = buf[p4 + 3];
      if (a < 40) {
        visited[idx] = 1;
        // check 4-neighbors for neutral light halo pixels
        for (const [nx, ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]) {
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
          const nIdx = ny * w + nx;
          if (visited[nIdx]) continue;
          const np4 = nIdx * 4;
          const r = buf[np4], g = buf[np4 + 1], b = buf[np4 + 2], na = buf[np4 + 3];
          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          const chroma = maxC - minC;
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;
          const d = distToBg[(ny + 2) * pw + (nx + 2)];
          // Strip outer 1.5px neutral white/grey shadow rim OR weak translucent halo pixels
          if (na > 0 && d <= 2.4 && ((chroma < 26 && luma > 188) || na < 135)) {
            visited[nIdx] = 1;
            studioPocketRemoved[nIdx] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  // Shallow BFS (max 2px inward into pure studio neutral bright rim crevices)
  let qHead = 0;
  while (qHead < queue.length) {
    const x = queue[qHead++];
    const y = queue[qHead++];
    for (const [nx, ny] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]) {
      if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
      const nIdx = ny * w + nx;
      if (visited[nIdx]) continue;
      const np4 = nIdx * 4;
      const r = buf[np4], g = buf[np4 + 1], b = buf[np4 + 2], na = buf[np4 + 3];
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      const d = distToBg[(ny + 2) * pw + (nx + 2)];
      if (d <= 2.2 && chroma < 20 && luma > 212 && na < 252) {
        visited[nIdx] = 1;
        studioPocketRemoved[nIdx] = 1;
        queue.push(nx, ny);
      }
    }
  }

  // Apply morphological erosion (~1.2px on thick regions while keeping thin dark/colored wisps like shrimp antennae)
  // Recompute binary mask excluding stripped studio rim
  const cleanMask = new Uint8Array(pw * ph);
  for (let py = 0; py < ph; py++) {
    for (let px = 0; px < pw; px++) {
      if (px < 2 || px >= w + 2 || py < 2 || py >= h + 2) {
        cleanMask[py * pw + px] = 1;
      } else {
        const idx = (py - 2) * w + (px - 2);
        const a = buf[idx * 4 + 3];
        cleanMask[py * pw + px] = a < 48 || studioPocketRemoved[idx] ? 1 : 0;
      }
    }
  }
  const distClean = computeEDT(cleanMask, pw, ph, 1);

  // Measure local foreground feature thickness around each pixel (is it a thin wisp vs solid body edge?)
  const out = new Uint8Array(buf);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const p4 = idx * 4;
      const a = buf[p4 + 3];
      if (studioPocketRemoved[idx] || a < 28) {
        out[p4 + 3] = 0;
        continue;
      }

      const d = distClean[(y + 2) * pw + (x + 2)];
      const r = buf[p4], g = buf[p4 + 1], b = buf[p4 + 2];
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;

      // Preserve thin colored prawn whiskers / herb stems while shaving white/grey fringe & hard step edges
      let hasSolidCoreNearby = false;
      if (d > 0 && d <= 2.4) {
        for (let dy = -3; dy <= 3 && !hasSolidCoreNearby; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
              if (distClean[(ny + 2) * pw + (nx + 2)] >= 3.2) {
                hasSolidCoreNearby = true;
                break;
              }
            }
          }
        }
      }

      let newA = a;
      if (hasSolidCoreNearby) {
        // Eroding ~1.25px + soft 1px AA ramp for solid object boundaries (eliminates jagged studio edges)
        if (d < 1.15) {
          newA = 0;
        } else if (d < 2.15) {
          const feather = (d - 1.15) / 1.0;
          newA = Math.min(a, Math.round(255 * feather));
        }
      } else {
        // Thin isolated detail (e.g. shrimp antennae/legs): kill neutral white/grey bleed, keep colored fiber
        if (chroma < 20 && luma > 200 && a < 230) {
          newA = 0;
        }
      }

      // Color decontamination for semi-transparent edge pixels (removes white/grey background halo tint)
      if (newA > 0 && (newA < 246 || d < 2.6)) {
        let sumR = 0, sumG = 0, sumB = 0, count = 0;
        let bestDist2 = 999;
        for (let dy = -3; dy <= 3; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
            const nd = distClean[(ny + 2) * pw + (nx + 2)];
            const np4 = (ny * w + nx) * 4;
            if (nd >= 2.6 && buf[np4 + 3] >= 245) {
              const d2 = dx * dx + dy * dy;
              if (d2 <= bestDist2 + 2) {
                bestDist2 = Math.min(bestDist2, d2);
                const weight = 1 / (1 + d2);
                sumR += buf[np4] * weight;
                sumG += buf[np4 + 1] * weight;
                sumB += buf[np4 + 2] * weight;
                count += weight;
              }
            }
          }
        }
        if (count > 0) {
          const fgR = sumR / count;
          const fgG = sumG / count;
          const fgB = sumB / count;
          // If outer edge is contaminated bright white/neutral halo, pull RGB strongly toward foreground pigment
          const isWhiteBleed = luma > 180 && (fgR * 0.299 + fgG * 0.587 + fgB * 0.114) < luma - 14;
          const blend = newA < 235 || isWhiteBleed ? 0.88 : 0.45;
          out[p4] = Math.round(r * (1 - blend) + fgR * blend);
          out[p4 + 1] = Math.round(g * (1 - blend) + fgG * blend);
          out[p4 + 2] = Math.round(b * (1 - blend) + fgB * blend);
        }
      }

      out[p4 + 3] = newA;
    }
  }

  // Find tight alpha bounding box (alpha > 20)
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (out[(y * w + x) * 4 + 3] > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < minX || maxY < minY) {
    minX = 0; minY = 0; maxX = w - 1; maxY = h - 1;
  }

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const pad = 4;
  const outW = cropW + pad * 2;
  const outH = cropH + pad * 2;
  const croppedBuf = Buffer.alloc(outW * outH * 4, 0);

  for (let y = 0; y < cropH; y++) {
    const srcStart = ((minY + y) * w + minX) * 4;
    const dstStart = ((y + pad) * outW + pad) * 4;
    croppedBuf.set(out.subarray(srcStart, srcStart + cropW * 4), dstStart);
  }

  // Mild RGB contrast/detail sharpen without halos: sharpen RGB on temporary opaque premultiplied buffer then reapply alpha
  const rgbOnly = Buffer.alloc(outW * outH * 3);
  for (let i = 0; i < outW * outH; i++) {
    rgbOnly[i * 3] = croppedBuf[i * 4];
    rgbOnly[i * 3 + 1] = croppedBuf[i * 4 + 1];
    rgbOnly[i * 3 + 2] = croppedBuf[i * 4 + 2];
  }
  const sharpRgb = await sharp(rgbOnly, { raw: { width: outW, height: outH, channels: 3 } })
    .sharpen({ sigma: 0.75, m1: 0.4, m2: 1.4 })
    .raw()
    .toBuffer();

  for (let i = 0; i < outW * outH; i++) {
    if (croppedBuf[i * 4 + 3] >= 200) {
      croppedBuf[i * 4] = sharpRgb[i * 3];
      croppedBuf[i * 4 + 1] = sharpRgb[i * 3 + 1];
      croppedBuf[i * 4 + 2] = sharpRgb[i * 3 + 2];
    }
  }

  const pipeline = sharp(croppedBuf, { raw: { width: outW, height: outH, channels: 4 } });
  const outBuf =
    format === "png"
      ? await pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer()
      : await pipeline.webp({ quality: 92, alphaQuality: 100 }).toBuffer();
  fs.writeFileSync(absPath, outBuf);

  return { width: outW, height: outH, rgba: croppedBuf };
}

/** Andrew's Monotone Chain convex hull */
function convexHull(points) {
  if (points.length <= 3) return points;
  const sorted = [...points].sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }
  const upper = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return [...lower, ...upper];
}

/** Subsample convex hull to at most maxPts evenly spaced vertices */
function simplifyHull(hull, maxPts = 14) {
  if (hull.length <= maxPts) return hull;
  const out = [];
  const step = hull.length / maxPts;
  for (let i = 0; i < maxPts; i++) {
    out.push(hull[Math.floor(i * step)]);
  }
  return out;
}

/** Extract true shape centerOfMass, compound multi-circle hitbox, and convex hull from cleaned Alpha mask */
async function extractHitbox(rgba, origW, origH) {
  // Downsample mask to analysis grid ~180px max dim for crisp Medial-Axis / EDT multi-circle coverage
  const scale = Math.min(1, 180 / Math.max(origW, origH));
  const aw = Math.max(32, Math.round(origW * scale));
  const ah = Math.max(32, Math.round(origH * scale));

  const small = await sharp(rgba, { raw: { width: origW, height: origH, channels: 4 } })
    .resize(aw, ah, { kernel: "lanczos3" })
    .raw()
    .toBuffer();

  const fgMask = new Uint8Array(aw * ah); // 1 = fg (alpha > 40), 0 = bg
  const bgTarget = new Uint8Array(aw * ah); // 1 = bg (for EDT of foreground)
  let fgCount = 0;
  let sumX = 0;
  let sumY = 0;
  const boundaryPts = [];

  for (let y = 0; y < ah; y++) {
    for (let x = 0; x < aw; x++) {
      const idx = y * aw + x;
      const a = small[idx * 4 + 3];
      if (a > 40) {
        fgMask[idx] = 1;
        bgTarget[idx] = 0;
        fgCount++;
        sumX += x + 0.5;
        sumY += y + 0.5;
      } else {
        fgMask[idx] = 0;
        bgTarget[idx] = 1;
      }
    }
  }

  // Distance to nearest background pixel inside fg (and zero at image edges)
  const paddedBg = new Uint8Array((aw + 2) * (ah + 2)).fill(1);
  for (let y = 0; y < ah; y++) {
    for (let x = 0; x < aw; x++) {
      paddedBg[(y + 1) * (aw + 2) + (x + 1)] = bgTarget[y * aw + x];
    }
  }
  const edtPadded = computeEDT(paddedBg, aw + 2, ah + 2, 1);
  const edt = new Float64Array(aw * ah);
  for (let y = 0; y < ah; y++) {
    for (let x = 0; x < aw; x++) {
      edt[y * aw + x] = edtPadded[(y + 1) * (aw + 2) + (x + 1)];
      if (fgMask[y * aw + x] === 1 && edt[y * aw + x] <= 1.5) {
        boundaryPts.push({ x: x + 0.5, y: y + 0.5 });
      }
    }
  }

  const maxDim = Math.max(aw, ah);
  const comX = fgCount > 0 ? sumX / fgCount : aw / 2;
  const comY = fgCount > 0 ? sumY / fgCount : ah / 2;

  const covered = new Uint8Array(aw * ah);
  let coveredCount = 0;
  const circles = [];

  // High-resolution Medial Axis / EDT Coverage: 10..16 inscribed circles hug 98% of silhouette (including corners/stems/tips)
  const minCircles = 10;
  const maxCircles = 16;

  while (
    circles.length < maxCircles &&
    (circles.length < minCircles || coveredCount < fgCount * 0.975)
  ) {
    let bestScore = -1;
    let bestX = 0;
    let bestY = 0;
    let bestR = 0;

    for (let y = 0; y < ah; y++) {
      for (let x = 0; x < aw; x++) {
        const idx = y * aw + x;
        const r = edt[idx];
        if (r < 1.5) continue;
        // Encourage exploring uncovered perimeter/corners once core circles are placed
        if (covered[idx] && circles.length > 0 && r < maxDim * 0.1) continue;

        const rr = r * r;
        let newlyCovered = 0;
        const minYx = Math.max(0, Math.floor(y - r));
        const maxYx = Math.min(ah - 1, Math.ceil(y + r));
        const minXx = Math.max(0, Math.floor(x - r));
        const maxXx = Math.min(aw - 1, Math.ceil(x + r));
        const step = r > 18 ? 2 : 1;
        for (let py = minYx; py <= maxYx; py += step) {
          for (let px = minXx; px <= maxXx; px += step) {
            const pIdx = py * aw + px;
            if (fgMask[pIdx] && !covered[pIdx]) {
              const d2 = (px - x) * (px - x) + (py - y) * (py - y);
              if (d2 <= rr) newlyCovered++;
            }
          }
        }
        const weighted = newlyCovered * (step * step) * (0.72 + 0.28 * (r / maxDim));
        if (weighted > bestScore) {
          bestScore = weighted;
          bestX = x + 0.5;
          bestY = y + 0.5;
          bestR = r;
        }
      }
    }

    if (bestScore <= 0 || bestR < Math.max(1.4, maxDim * 0.018)) break;

    const snappedR = Math.max(1.4, bestR * 0.99);
    circles.push({
      ox: Number(((bestX - aw / 2) / maxDim).toFixed(4)),
      oy: Number(((bestY - ah / 2) / maxDim).toFixed(4)),
      r: Number((snappedR / maxDim).toFixed(4)),
    });

    // Only mark inner 96% radius covered so corner/concavity pockets still attract fitting circles 6..16
    const coverR2 = (bestR * 0.96) ** 2;
    const minYx = Math.max(0, Math.floor(bestY - bestR));
    const maxYx = Math.min(ah - 1, Math.ceil(bestY + bestR));
    const minXx = Math.max(0, Math.floor(bestX - bestR));
    const maxXx = Math.min(aw - 1, Math.ceil(bestX + bestR));
    for (let py = minYx; py <= maxYx; py++) {
      for (let px = minXx; px <= maxXx; px++) {
        const pIdx = py * aw + px;
        if (fgMask[pIdx] && !covered[pIdx]) {
          const d2 = (px + 0.5 - bestX) ** 2 + (py + 0.5 - bestY) ** 2;
          if (d2 <= coverR2) {
            covered[pIdx] = 1;
            coveredCount++;
          }
        }
      }
    }
  }

  if (circles.length === 0) {
    circles.push({ ox: 0, oy: 0, r: Number((Math.min(aw, ah) * 0.42 / maxDim).toFixed(4)) });
  }

  const rawHull = simplifyHull(convexHull(boundaryPts), 14);
  const normHull = rawHull.map((p) => ({
    x: Number(((p.x - aw / 2) / maxDim).toFixed(4)),
    y: Number(((p.y - ah / 2) / maxDim).toFixed(4)),
  }));

  return {
    width: origW,
    height: origH,
    aspectRatio: Number((origW / origH).toFixed(4)),
    centerOfMass: {
      x: Number(((comX - aw / 2) / maxDim).toFixed(4)),
      y: Number(((comY - ah / 2) / maxDim).toFixed(4)),
    },
    circles,
    hull: normHull,
  };
}

async function main() {
  const hitboxesOnly = process.argv.includes("--hitboxes-only");
  const hitboxes = {};

  for (const target of TARGET_DIRS) {
    const absDir = path.join(ROOT, target.dir);
    const files = fs.readdirSync(absDir).sort();
    for (const file of files) {
      const absPath = path.join(absDir, file);
      const urlPath = `${target.urlPrefix}/${file}`;
      let cleaned;
      if (hitboxesOnly) {
        const raw = await sharp(fs.readFileSync(absPath)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
        cleaned = { width: raw.info.width, height: raw.info.height, rgba: raw.data };
      } else {
        cleaned = await cleanAndTrimImage(absPath, target.format);
      }
      const hb = await extractHitbox(cleaned.rgba, cleaned.width, cleaned.height);
      hitboxes[urlPath] = { src: urlPath, ...hb };
      console.log(`Processed ${urlPath}: ${cleaned.width}x${cleaned.height}, circles=${hb.circles.length}, hull=${hb.hull.length}`);
    }
  }

  const tsContent = `// AUTO-GENERATED BY scripts/clean-cutouts-and-hitboxes.mjs — DO NOT EDIT MANUALLY

export type HitboxCircle = {
  /** Normalized X offset from trimmed image center in units of max(width, height) */
  ox: number;
  /** Normalized Y offset from trimmed image center in units of max(width, height) */
  oy: number;
  /** Normalized inscribed circle radius in units of max(width, height) */
  r: number;
};

export type FoodCutoutHitbox = {
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  centerOfMass: { x: number; y: number };
  circles: HitboxCircle[];
  hull: Array<{ x: number; y: number }>;
};

export const FOOD_CUTOUT_HITBOXES: Record<string, FoodCutoutHitbox> = ${JSON.stringify(hitboxes, null, 2)};

export function getFoodCutoutHitbox(src: string): FoodCutoutHitbox | undefined {
  return FOOD_CUTOUT_HITBOXES[src];
}
`;

  fs.writeFileSync(OUTPUT_TS, tsContent, "utf8");
  console.log(`\nGenerated ${Object.keys(hitboxes).length} hitboxes -> ${OUTPUT_TS}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
