"use client";

import { FOOD_CUTOUT_HITBOXES, type FoodCutoutHitbox } from "@/lib/food-cutout-hitboxes";

export type RealFoodCutout = {
  id: string;
  src: string;
  alt: string;
  weight: "heavy" | "light";
  pocketFriendly?: boolean;
  broadSeal?: boolean;
};

/** 100% single solid food items (zero clusters / multiple separate pieces) */
export const FOOD_CUTOUT_POOL: RealFoodCutout[] = [
  { id: "beef-brisket-slab", src: "/images/transition-cutouts/beef-brisket-slab.webp", alt: "Gầu bò tươi nguyên tảng", weight: "heavy", broadSeal: true },
  { id: "beef-flank-strip", src: "/images/transition-cutouts/beef-flank-strip.webp", alt: "Nạm bò tươi nguyên miếng", weight: "heavy" },
  { id: "beef-ribeye-steak", src: "/images/transition-cutouts/beef-ribeye-steak.webp", alt: "Thăn ngoại bò Úc", weight: "heavy", broadSeal: true },
  { id: "beef-shank-cross", src: "/images/transition-cutouts/beef-shank-cross.webp", alt: "Bắp bò hoa cắt khoanh", weight: "heavy", pocketFriendly: true, broadSeal: true },
  { id: "beef-tenderloin-medallion", src: "/images/transition-cutouts/beef-tenderloin-medallion.webp", alt: "Thăn nội bò cắt khoanh", weight: "heavy", pocketFriendly: true, broadSeal: true },
  { id: "fresh-pork-belly-hq", src: "/images/transition-cutouts/fresh-pork-belly.webp", alt: "Thịt ba rọi heo nguyên khối", weight: "heavy", broadSeal: true },
  { id: "pork-baby-back-ribs", src: "/images/transition-cutouts/pork-baby-back-ribs.webp", alt: "Dải sườn non heo liền khối", weight: "heavy" },
  { id: "pork-chop-cutlet", src: "/images/transition-cutouts/pork-chop-cutlet.webp", alt: "Miếng sườn cốt lết heo", weight: "heavy", broadSeal: true },
  { id: "pork-tenderloin", src: "/images/transition-cutouts/pork-tenderloin.webp", alt: "Thăn nội heo sạch", weight: "heavy" },
  { id: "poultry-chicken-breast", src: "/images/transition-cutouts/poultry-chicken-breast.webp", alt: "Miếng ức gà phi lê tươi", weight: "light", broadSeal: true },
  { id: "raw-chicken-drumstick-hq", src: "/images/transition-cutouts/raw-chicken-drumstick.webp", alt: "Đùi gà tỏi tươi", weight: "light", pocketFriendly: true },
  { id: "salmon-fillet-hq", src: "/images/transition-cutouts/salmon-fillet.webp", alt: "Cá hồi phi lê Na Uy", weight: "heavy", broadSeal: true },
  { id: "fresh-squid-hq", src: "/images/transition-cutouts/fresh-squid.webp", alt: "Mực ống tươi nguyên con", weight: "light" },
  { id: "seafood-scallop-shell", src: "/images/transition-cutouts/seafood-scallop-shell.webp", alt: "Con sò điệp biển tươi", weight: "heavy", pocketFriendly: true, broadSeal: true },
  { id: "fresh-prawn", src: "/images/food-cutouts/fresh-prawn.png", alt: "Tôm sú biển tươi nguyên con", weight: "light", pocketFriendly: true },
  { id: "fresh-broccoli-hq", src: "/images/transition-cutouts/fresh-broccoli.webp", alt: "Bông cải xanh Đà Lạt", weight: "heavy", pocketFriendly: true, broadSeal: true },
  { id: "fresh-carrot-hq", src: "/images/transition-cutouts/fresh-carrot.webp", alt: "Củ cà rốt Đà Lạt", weight: "light", pocketFriendly: true },
  { id: "fresh-citrus-hq", src: "/images/transition-cutouts/fresh-citrus.webp", alt: "Nửa quả cam sành tươi", weight: "heavy", pocketFriendly: true, broadSeal: true },
  { id: "fresh-tomato-hq", src: "/images/transition-cutouts/fresh-tomato.webp", alt: "Quả cà chua chín đỏ Đà Lạt", weight: "heavy", pocketFriendly: true, broadSeal: true },
  { id: "purple-cabbage-hq", src: "/images/transition-cutouts/purple-cabbage.webp", alt: "Nửa bắp cải tím Đà Lạt", weight: "heavy", broadSeal: true },
  { id: "sweet-corn-hq", src: "/images/transition-cutouts/sweet-corn.webp", alt: "Trái bắp Mỹ ngọt tươi", weight: "heavy", pocketFriendly: true },
  { id: "fresh-avocado", src: "/images/food-cutouts/fresh-avocado.png", alt: "Nửa quả bơ sáp Đà Lạt", weight: "heavy", pocketFriendly: true, broadSeal: true },
  { id: "fresh-bok-choy", src: "/images/food-cutouts/fresh-bok-choy.png", alt: "Cây cải thìa xanh non", weight: "light", pocketFriendly: true },
  { id: "fresh-cabbage-green", src: "/images/food-cutouts/fresh-cabbage-green.png", alt: "Bắp cải xanh Đà Lạt", weight: "heavy", broadSeal: true },
  { id: "fresh-lettuce", src: "/images/food-cutouts/fresh-lettuce.png", alt: "Cây xà lách tươi thủy canh", weight: "light", broadSeal: true },
  { id: "single-mushroom", src: "/images/transition-cutouts/single-mushroom.webp", alt: "Nấm đùi gà tươi", weight: "light", pocketFriendly: true },
  { id: "single-bell-pepper", src: "/images/food-cutouts/single-bell-pepper.png", alt: "Quả ớt chuông ngọt", weight: "light", pocketFriendly: true },
];

const POCKET_FILLERS = FOOD_CUTOUT_POOL.filter((item) => item.pocketFriendly);
const BROAD_SEAL_POOL = FOOD_CUTOUT_POOL.filter((item) => item.broadSeal);

export type BakedFoodSprite = {
  drawable: ImageBitmap | HTMLCanvasElement | HTMLImageElement;
  padRatio: number;
};

const SPRITE_MAX_DIM = 280;
const SPRITE_PAD = 14;
const bakedSprites = new Map<string, BakedFoodSprite>();
let preloadTriggered = false;

function bakeSpriteCanvas(img: HTMLImageElement): BakedFoodSprite | null {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh) return null;

  const maxDim = Math.max(nw, nh);
  const scale = Math.min(1, SPRITE_MAX_DIM / maxDim);
  const innerW = Math.max(1, Math.round(nw * scale));
  const innerH = Math.max(1, Math.round(nh * scale));
  const pad = Math.round(SPRITE_PAD * (Math.max(innerW, innerH) / SPRITE_MAX_DIM));

  const offscreen = document.createElement("canvas");
  offscreen.width = innerW + pad * 2;
  offscreen.height = innerH + pad * 2;
  const octx = offscreen.getContext("2d");
  if (!octx) {
    return { drawable: img, padRatio: 0 };
  }

  octx.shadowColor = "rgba(4, 18, 12, 0.42)";
  octx.shadowBlur = 10;
  octx.shadowOffsetY = 4;
  octx.drawImage(img, pad, pad, innerW, innerH);

  return {
    drawable: offscreen,
    padRatio: pad / Math.max(innerW, innerH),
  };
}

export function ensureFoodImagePreloaded(src: string): void {
  if (typeof window === "undefined" || bakedSprites.has(src)) return;
  const img = new window.Image();
  img.decoding = "async";
  img.onload = () => {
    const baked = bakeSpriteCanvas(img);
    if (!baked) return;
    bakedSprites.set(src, baked);

    if (typeof window.createImageBitmap === "function" && baked.drawable instanceof HTMLCanvasElement) {
      const { padRatio } = baked;
      window
        .createImageBitmap(baked.drawable)
        .then((bmp) => {
          bakedSprites.set(src, { drawable: bmp, padRatio });
        })
        .catch(() => {});
    }
  };
  img.src = src;
}

export function preloadAllFoodCutouts(): void {
  if (preloadTriggered || typeof window === "undefined") return;
  preloadTriggered = true;
  FOOD_CUTOUT_POOL.forEach((item) => ensureFoodImagePreloaded(item.src));
}

export function getReadyFoodSprite(src: string): BakedFoodSprite | null {
  const hit = bakedSprites.get(src);
  if (hit) return hit;
  ensureFoodImagePreloaded(src);
  return null;
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

type WorldCircle = { x: number; y: number; r: number };

export type PackedFoodPiece = {
  id: number;
  src: string;
  layer: 0 | 1 | 2;
  x: number;
  y: number;
  anchorX: number;
  anchorY: number;
  angle: number;
  cosA: number;
  sinA: number;
  size: number;
  renderW: number;
  renderH: number;
  appearAtMs: number;
  popDurationMs: number;
  disperseDelayMs: number;
  disperseDurationMs: number;
  worldCircles: WorldCircle[];
  aabbMinX: number;
  aabbMaxX: number;
  aabbMinY: number;
  aabbMaxY: number;
  invMass: number;
  hitbox: FoodCutoutHitbox;
};

const HITBOX_RELAX_TIGHTEN = 0.85;
/** Center card disappears completely during 0ms..180ms BEFORE food icons begin disappearing */
export const CARD_FIRST_EXIT_MS = 180;

function syncPieceCircles(p: PackedFoodPiece) {
  const cosA = Math.cos(p.angle);
  const sinA = Math.sin(p.angle);
  p.cosA = cosA;
  p.sinA = sinA;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  const circles = p.hitbox.circles;
  for (let i = 0; i < circles.length; i += 1) {
    const c = circles[i];
    const wc = p.worldCircles[i];
    const wx = p.x + (c.ox * cosA - c.oy * sinA) * p.size;
    const wy = p.y + (c.ox * sinA + c.oy * cosA) * p.size;
    const wr = c.r * HITBOX_RELAX_TIGHTEN * p.size;
    wc.x = wx;
    wc.y = wy;
    wc.r = wr;
    if (wx - wr < minX) minX = wx - wr;
    if (wx + wr > maxX) maxX = wx + wr;
    if (wy - wr < minY) minY = wy - wr;
    if (wy + wr > maxY) maxY = wy + wr;
  }

  p.aabbMinX = minX;
  p.aabbMaxX = maxX;
  p.aabbMinY = minY;
  p.aabbMaxY = maxY;
}

/**
 * Assigns an in-place circular radial wave disappearance delay from the center (vw/2, vh/2) out to the 4 corners.
 * Every food item stays at its exact (x, y) position and vanishes in-place after the center card disappears.
 */
function assignCircularInPlaceDispersal(p: PackedFoodPiece, vw: number, vh: number, maxRadius: number) {
  const cx = vw * 0.5;
  const cy = vh * 0.5;
  const distFromCenter = Math.hypot(p.x - cx, p.y - cy);
  const distNorm = Math.min(1, distFromCenter / Math.max(1, maxRadius));

  const layerStagger = p.layer === 1 ? 0 : p.layer === 2 ? 10 : 20;
  p.disperseDelayMs = CARD_FIRST_EXIT_MS + Math.round(distNorm * 230 + layerStagger);
  p.disperseDurationMs = Math.round(rand(165, 195));
}

export function computeTightPackedFoodLayout(
  vw: number,
  vh: number,
  zoomPct = 100
): PackedFoodPiece[] {
  preloadAllFoodCutouts();

  const isCompact = vw < 768;
  const zoomScale = zoomPct < 65 ? 1.42 : zoomPct < 80 ? 1.2 : 1;
  const baseUnitScale = zoomScale * 1.08;
  const maxRadius = Math.hypot(vw * 0.5, vh * 0.5);

  // ============================================================================
  // TIER 0: Large Broad-Shape Seal Layer (Covers full viewport including behind center card)
  // ============================================================================
  const sealPieces: PackedFoodPiece[] = [];
  const sealStepX = (isCompact ? 142 : 232) * baseUnitScale;
  const sealStepY = sealStepX * 0.78;
  const sealPool: RealFoodCutout[] = [];
  let sealPoolIdx = 0;
  let sealRow = 0;

  for (let sy = -sealStepY * 0.38; sy <= vh + sealStepY * 0.38; sy += sealStepY) {
    const rowOffset = sealRow % 2 === 1 ? sealStepX * 0.5 : 0;
    for (let sx = -sealStepX * 0.38 + rowOffset; sx <= vw + sealStepX * 0.38; sx += sealStepX) {
      const px = sx + rand(-sealStepX * 0.14, sealStepX * 0.14);
      const py = sy + rand(-sealStepY * 0.14, sealStepY * 0.14);

      if (sealPoolIdx >= sealPool.length) {
        sealPool.push(...shuffle(BROAD_SEAL_POOL));
      }
      const food = sealPool[sealPoolIdx++];
      const hb = FOOD_CUTOUT_HITBOXES[food.src];
      if (!hb) continue;

      const rawSize = isCompact ? rand(220, 272) : rand(345, 405);
      const size = Math.round(rawSize * baseUnitScale);
      const maxDim = Math.max(hb.width, hb.height);
      const angle = rand(-Math.PI, Math.PI);

      sealPieces.push({
        id: 20000 + sealPieces.length,
        src: food.src,
        layer: 0,
        x: px,
        y: py,
        anchorX: px,
        anchorY: py,
        angle,
        cosA: Math.cos(angle),
        sinA: Math.sin(angle),
        size,
        renderW: (hb.width / maxDim) * size,
        renderH: (hb.height / maxDim) * size,
        appearAtMs: 0,
        popDurationMs: Math.round(rand(145, 175)),
        disperseDelayMs: CARD_FIRST_EXIT_MS,
        disperseDurationMs: 180,
        worldCircles: [],
        aabbMinX: 0,
        aabbMaxX: 0,
        aabbMinY: 0,
        aabbMaxY: 0,
        invMass: 1,
        hitbox: hb,
      });
    }
    sealRow += 1;
  }

  // ============================================================================
  // TIER 1: Oversized Primary Hero Hex Lattice
  // ============================================================================
  const avgDiam = (isCompact ? 232 : 352) * baseUnitScale;
  const spacingX = avgDiam * 0.61;
  const spacingY = spacingX * 0.84;

  const startX = -spacingX * 0.32;
  const endX = vw + spacingX * 0.32;
  const startY = -spacingY * 0.32;
  const endY = vh + spacingY * 0.32;

  const gridCoords: Array<{ x: number; y: number }> = [];
  let row = 0;
  for (let gy = startY; gy <= endY; gy += spacingY) {
    const offsetX = row % 2 === 1 ? spacingX * 0.5 : 0;
    for (let gx = startX + offsetX; gx <= endX; gx += spacingX) {
      const px = gx + rand(-spacingX * 0.14, spacingX * 0.14);
      const py = gy + rand(-spacingY * 0.14, spacingY * 0.14);
      gridCoords.push({ x: px, y: py });
    }
    row += 1;
  }

  const primaryPool: RealFoodCutout[] = [];
  while (primaryPool.length < gridCoords.length) {
    primaryPool.push(...shuffle(FOOD_CUTOUT_POOL));
  }

  const primaryPieces: PackedFoodPiece[] = [];
  for (let i = 0; i < gridCoords.length; i += 1) {
    const pt = gridCoords[i];
    const food = primaryPool[i];
    const hb = FOOD_CUTOUT_HITBOXES[food.src];
    if (!hb) continue;

    const rawSize = isCompact ? rand(198, 256) : rand(300, 378);
    const size = Math.round(rawSize * baseUnitScale);
    const maxDim = Math.max(hb.width, hb.height);
    const angle = rand(-Math.PI, Math.PI);
    const piece: PackedFoodPiece = {
      id: i,
      src: food.src,
      layer: 1,
      x: pt.x,
      y: pt.y,
      anchorX: pt.x,
      anchorY: pt.y,
      angle,
      cosA: Math.cos(angle),
      sinA: Math.sin(angle),
      size,
      renderW: (hb.width / maxDim) * size,
      renderH: (hb.height / maxDim) * size,
      appearAtMs: 0,
      popDurationMs: Math.round(rand(155, 185)),
      disperseDelayMs: CARD_FIRST_EXIT_MS,
      disperseDurationMs: 180,
      worldCircles: hb.circles.map(() => ({ x: 0, y: 0, r: 10 })),
      aabbMinX: 0,
      aabbMaxX: 0,
      aabbMinY: 0,
      aabbMaxY: 0,
      invMass: 1 / Math.pow(size / 250, 2),
      hitbox: hb,
    };
    syncPieceCircles(piece);
    primaryPieces.push(piece);
  }

  const RELAX_ITERS = 4;
  for (let iter = 0; iter < RELAX_ITERS; iter += 1) {
    for (let i = 0; i < primaryPieces.length; i += 1) {
      const a = primaryPieces[i];
      for (let j = i + 1; j < primaryPieces.length; j += 1) {
        const b = primaryPieces[j];
        if (
          a.aabbMaxX < b.aabbMinX ||
          a.aabbMinX > b.aabbMaxX ||
          a.aabbMaxY < b.aabbMinY ||
          a.aabbMinY > b.aabbMaxY
        ) {
          continue;
        }

        const invSum = a.invMass + b.invMass;
        for (let caIdx = 0; caIdx < a.worldCircles.length; caIdx += 1) {
          const ca = a.worldCircles[caIdx];
          for (let cbIdx = 0; cbIdx < b.worldCircles.length; cbIdx += 1) {
            const cb = b.worldCircles[cbIdx];
            const dx = cb.x - ca.x;
            const dy = cb.y - ca.y;
            const minDist = ca.r + cb.r;
            const d2 = dx * dx + dy * dy;
            if (d2 >= minDist * minDist) continue;

            const dist = d2 > 1e-6 ? Math.sqrt(d2) : 0.001;
            const nx = d2 > 1e-6 ? dx / dist : 0.707;
            const ny = d2 > 1e-6 ? dy / dist : 0.707;
            const pen = minDist - dist;
            const corr = (pen * 0.52) / invSum;

            a.x -= nx * corr * a.invMass;
            a.y -= ny * corr * a.invMass;
            b.x += nx * corr * b.invMass;
            b.y += ny * corr * b.invMass;
            syncPieceCircles(a);
            syncPieceCircles(b);
          }
        }
      }

      a.x += (a.anchorX - a.x) * 0.16;
      a.y += (a.anchorY - a.y) * 0.16;
      a.x = Math.max(-a.size * 0.24, Math.min(vw + a.size * 0.24, a.x));
      a.y = Math.max(-a.size * 0.24, Math.min(vh + a.size * 0.24, a.y));
      syncPieceCircles(a);
    }
  }

  // ============================================================================
  // TIER 2: Medium & Small Gap Fillers
  // ============================================================================
  const pocketPieces: PackedFoodPiece[] = [];
  const sampleStep = (isCompact ? 74 : 112) * baseUnitScale;
  const fillerPool: RealFoodCutout[] = [];
  let fillerIdx = 0;

  for (let sy = -sampleStep * 0.2; sy <= vh + sampleStep * 0.2; sy += sampleStep) {
    for (let sx = -sampleStep * 0.2; sx <= vw + sampleStep * 0.2; sx += sampleStep) {
      const px = sx + rand(-sampleStep * 0.22, sampleStep * 0.22);
      const py = sy + rand(-sampleStep * 0.22, sampleStep * 0.22);

      let minClearance = Infinity;
      for (let i = 0; i < primaryPieces.length; i += 1) {
        const pr = primaryPieces[i];
        if (px < pr.aabbMinX - 50 || px > pr.aabbMaxX + 50 || py < pr.aabbMinY - 50 || py > pr.aabbMaxY + 50) {
          continue;
        }
        for (let c = 0; c < pr.worldCircles.length; c += 1) {
          const wc = pr.worldCircles[c];
          const clear = Math.hypot(px - wc.x, py - wc.y) - wc.r;
          if (clear < minClearance) minClearance = clear;
        }
      }

      let tooCloseToFiller = false;
      const minFillerDist = (isCompact ? 72 : 110) * baseUnitScale;
      for (let k = 0; k < pocketPieces.length; k += 1) {
        if (Math.hypot(px - pocketPieces[k].x, py - pocketPieces[k].y) < minFillerDist) {
          tooCloseToFiller = true;
          break;
        }
      }

      if (!tooCloseToFiller && minClearance > (isCompact ? -16 : -24)) {
        if (fillerIdx >= fillerPool.length) {
          fillerPool.push(...shuffle(POCKET_FILLERS));
        }
        const food = fillerPool[fillerIdx++];
        const hb = FOOD_CUTOUT_HITBOXES[food.src];
        if (!hb) continue;

        const rawSize = isCompact ? rand(114, 164) : rand(158, 232);
        const size = Math.round(rawSize * baseUnitScale);
        const maxDim = Math.max(hb.width, hb.height);
        const angle = rand(-Math.PI, Math.PI);

        pocketPieces.push({
          id: 10000 + pocketPieces.length,
          src: food.src,
          layer: 2,
          x: px,
          y: py,
          anchorX: px,
          anchorY: py,
          angle,
          cosA: Math.cos(angle),
          sinA: Math.sin(angle),
          size,
          renderW: (hb.width / maxDim) * size,
          renderH: (hb.height / maxDim) * size,
          appearAtMs: 0,
          popDurationMs: Math.round(rand(150, 180)),
          disperseDelayMs: CARD_FIRST_EXIT_MS,
          disperseDurationMs: 180,
          worldCircles: [],
          aabbMinX: 0,
          aabbMaxX: 0,
          aabbMinY: 0,
          aabbMaxY: 0,
          invMass: 1,
          hitbox: hb,
        });
      }
    }
  }

  const allPieces = [...sealPieces, ...pocketPieces, ...primaryPieces];
  for (let i = 0; i < allPieces.length; i += 1) {
    const p = allPieces[i];
    const yNorm = Math.max(0, Math.min(1, 1 - p.y / Math.max(1, vh)));
    const baseDelay = yNorm * 260 + rand(0, 80);
    const layerOffset = p.layer === 0 ? 0 : p.layer === 2 ? 16 : 28;
    p.appearAtMs = Math.max(0, Math.min(390, Math.round(baseDelay + layerOffset)));
    assignCircularInPlaceDispersal(p, vw, vh, maxRadius);
  }

  return allPieces;
}

export type DrawPackedFoodsResult = {
  visibleCount: number;
  allSettled: boolean;
};

export type DrawPackedFoodsOptions = {
  instantReveal?: boolean;
  mode?: "pack" | "disperse";
  disperseElapsedMs?: number;
};

export function drawPackedFoodsFrame(
  ctx: CanvasRenderingContext2D,
  vw: number,
  vh: number,
  dpr: number,
  pieces: PackedFoodPiece[],
  elapsedMs: number,
  options?: DrawPackedFoodsOptions
): DrawPackedFoodsResult {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, vw, vh);

  const mode = options?.mode ?? "pack";
  const instant = options?.instantReveal === true;
  const disperseElapsed = options?.disperseElapsedMs ?? 0;
  let visibleCount = 0;
  let allSettled = true;

  for (let i = 0; i < pieces.length; i += 1) {
    const p = pieces[i];
    const sprite = getReadyFoodSprite(p.src);
    if (!sprite) {
      allSettled = false;
      continue;
    }

    let scale = 1;
    let alpha = 1;

    if (mode === "disperse") {
      const localDisp = disperseElapsed - p.disperseDelayMs;
      if (localDisp >= p.disperseDurationMs) {
        // Piece has vanished in-place
        continue;
      }
      allSettled = false;
      if (localDisp > 0) {
        const t = localDisp / p.disperseDurationMs;
        const easeIn = t * t;
        scale = Math.max(0.28, 1 - 0.72 * easeIn);
        alpha = Math.max(0, 1 - t * (1.15 - 0.15 * t));
      }
    } else if (!instant) {
      const localElapsed = elapsedMs - p.appearAtMs;
      if (localElapsed <= 0) {
        allSettled = false;
        continue;
      }

      if (localElapsed < p.popDurationMs) {
        allSettled = false;
        const t = localElapsed / p.popDurationMs;
        alpha = Math.min(1, t * 2.85);
        if (t < 0.72) {
          const u = t / 0.72;
          const easeOut = 1 - Math.pow(1 - u, 3);
          scale = 0.22 + 0.84 * easeOut;
        } else {
          const u = (t - 0.72) / 0.28;
          scale = 1.06 - 0.06 * u;
        }
      }
    }

    if (alpha <= 0.01) continue;

    visibleCount += 1;
    const padPx = sprite.padRatio * p.size;
    const drawW = p.renderW + padPx * 2;
    const drawH = p.renderH + padPx * 2;

    // Stationary in-place transform using precomputed cosA / sinA (zero trig in render loop!)
    const mScale = scale * dpr;
    ctx.globalAlpha = alpha;
    ctx.setTransform(p.cosA * mScale, p.sinA * mScale, -p.sinA * mScale, p.cosA * mScale, p.x * dpr, p.y * dpr);
    ctx.drawImage(sprite.drawable, -drawW * 0.5, -drawH * 0.5, drawW, drawH);
  }

  ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return { visibleCount, allSettled };
}
