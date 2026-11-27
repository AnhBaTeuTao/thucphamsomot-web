"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  clearMajorPageTransitionSuppression,
  getCategoryTransitionConfig,
  suppressMajorPageTransition,
  type CategoryCutoutAsset,
} from "@/lib/category-transition-config";
import { isTps1FxDisabled, TPS1_FX_CHANGE_EVENT } from "@/lib/fx-preference";
import {
  advanceTransitionPhase,
  cancelReadyWaiter,
  createTransitionReadyWaiter,
  finishTransitionState,
  getCategoryTransitionSnapshot,
  markTransitionReady,
  MAX_TRANSITION_WAIT_MS,
  MIN_TRANSITION_MS,
  nextTransitionId,
  normalizeTransitionPath,
  normalizeTransitionUrl,
  startTransitionState,
  subscribeCategoryTransition,
  type CategoryTransitionSnapshot,
} from "@/lib/category-transition-store";

export { MIN_TRANSITION_MS, MAX_TRANSITION_WAIT_MS };

export type CategoryTransitionTrigger = {
  slug: string;
  href: string;
  originRect?: { left: number; top: number; width: number; height: number } | null;
  isEnglish?: boolean;
  dispatchSelectEvent?: boolean;
};

type CategoryTransitionContextValue = {
  triggerCategoryTransition: (params: CategoryTransitionTrigger) => boolean;
  preloadCategory: (slug: string, href?: string) => void;
  transitionState: CategoryTransitionSnapshot;
};

const CategoryTransitionContext = createContext<CategoryTransitionContextValue | null>(null);

export function useCategoryTransition(): CategoryTransitionContextValue {
  const ctx = useContext(CategoryTransitionContext);
  if (!ctx) {
    return {
      triggerCategoryTransition: () => false,
      preloadCategory: () => {},
      transitionState: getCategoryTransitionSnapshot(),
    };
  }
  return ctx;
}

type DepthLayer = "back" | "mid" | "front";
type Quadrant = "TL" | "TR" | "BR" | "BL";

type SlotTemplate = {
  id: string;
  depth: DepthLayer;
  quadrant: Quadrant;
  xPct: number;
  yPct: number;
};

type ZoomDensityProfile = {
  front: number;
  mid: number;
  back: number;
  sizeScale: number;
  centerScale: number;
};

type ParticleSpec = {
  slotId: string;
  depth: DepthLayer;
  cutout: CategoryCutoutAsset;
  instanceIndex: number;
  flipX: boolean;
  size: number;
  restOpacity: number;
  originX: number;
  originY: number;
  ctrlX: number;
  ctrlY: number;
  midX: number;
  midY: number;
  driftDx: number;
  driftDy: number;
  driftRot: number;
  driftMs: number;
  driftReverse: boolean;
  endX: number;
  endY: number;
  endScale: number;
  rotStart: number;
  rotMid: number;
  rotEnd: number;
  delayMs: number;
  burstMs: number;
};

const QUADRANT_ORDER: Quadrant[] = ["TL", "TR", "BR", "BL"];

// 30-slot concentric 3-layer composition strictly outside the center safe zone,
// evenly distributed across TL / TR / BR / BL quadrants.
// F4 & F5 (top/bottom center-edge anchors) are reserved exclusively for zoom <= 62%.
const DESKTOP_SLOTS: Record<DepthLayer, SlotTemplate[]> = {
  front: [
    { id: "F0", depth: "front", quadrant: "TL", xPct: 0.08, yPct: 0.15 },
    { id: "F1", depth: "front", quadrant: "TR", xPct: 0.92, yPct: 0.15 },
    { id: "F2", depth: "front", quadrant: "BR", xPct: 0.92, yPct: 0.85 },
    { id: "F3", depth: "front", quadrant: "BL", xPct: 0.08, yPct: 0.85 },
    { id: "F4", depth: "front", quadrant: "TL", xPct: 0.44, yPct: 0.1 },
    { id: "F5", depth: "front", quadrant: "BR", xPct: 0.56, yPct: 0.9 },
  ],
  mid: [
    // TL (3)
    { id: "M0", depth: "mid", quadrant: "TL", xPct: 0.21, yPct: 0.23 },
    { id: "M1", depth: "mid", quadrant: "TL", xPct: 0.41, yPct: 0.16 },
    { id: "M2", depth: "mid", quadrant: "TL", xPct: 0.12, yPct: 0.42 },
    // TR (4)
    { id: "M3", depth: "mid", quadrant: "TR", xPct: 0.79, yPct: 0.23 },
    { id: "M4", depth: "mid", quadrant: "TR", xPct: 0.59, yPct: 0.16 },
    { id: "M5", depth: "mid", quadrant: "TR", xPct: 0.88, yPct: 0.42 },
    { id: "M6", depth: "mid", quadrant: "TR", xPct: 0.7, yPct: 0.13 },
    // BR (3)
    { id: "M7", depth: "mid", quadrant: "BR", xPct: 0.79, yPct: 0.77 },
    { id: "M8", depth: "mid", quadrant: "BR", xPct: 0.59, yPct: 0.84 },
    { id: "M9", depth: "mid", quadrant: "BR", xPct: 0.88, yPct: 0.58 },
    // BL (3)
    { id: "M10", depth: "mid", quadrant: "BL", xPct: 0.21, yPct: 0.77 },
    { id: "M11", depth: "mid", quadrant: "BL", xPct: 0.41, yPct: 0.84 },
    { id: "M12", depth: "mid", quadrant: "BL", xPct: 0.12, yPct: 0.58 },
  ],
  back: [
    // TL (3)
    { id: "B0", depth: "back", quadrant: "TL", xPct: 0.33, yPct: 0.17 },
    { id: "B1", depth: "back", quadrant: "TL", xPct: 0.17, yPct: 0.34 },
    { id: "B2", depth: "back", quadrant: "TL", xPct: 0.28, yPct: 0.31 },
    // TR (3)
    { id: "B3", depth: "back", quadrant: "TR", xPct: 0.67, yPct: 0.17 },
    { id: "B4", depth: "back", quadrant: "TR", xPct: 0.83, yPct: 0.34 },
    { id: "B5", depth: "back", quadrant: "TR", xPct: 0.72, yPct: 0.31 },
    // BR (2)
    { id: "B6", depth: "back", quadrant: "BR", xPct: 0.67, yPct: 0.83 },
    { id: "B7", depth: "back", quadrant: "BR", xPct: 0.83, yPct: 0.66 },
    // BL (3)
    { id: "B8", depth: "back", quadrant: "BL", xPct: 0.33, yPct: 0.83 },
    { id: "B9", depth: "back", quadrant: "BL", xPct: 0.17, yPct: 0.66 },
    { id: "B10", depth: "back", quadrant: "BL", xPct: 0.28, yPct: 0.69 },
  ],
};

const MOBILE_SLOTS: Record<DepthLayer, SlotTemplate[]> = {
  front: [
    { id: "MF0", depth: "front", quadrant: "TL", xPct: 0.11, yPct: 0.13 },
    { id: "MF1", depth: "front", quadrant: "TR", xPct: 0.89, yPct: 0.14 },
    { id: "MF2", depth: "front", quadrant: "BR", xPct: 0.89, yPct: 0.86 },
    { id: "MF3", depth: "front", quadrant: "BL", xPct: 0.11, yPct: 0.87 },
  ],
  mid: [
    { id: "MM0", depth: "mid", quadrant: "TL", xPct: 0.26, yPct: 0.24 },
    { id: "MM1", depth: "mid", quadrant: "TR", xPct: 0.74, yPct: 0.24 },
    { id: "MM2", depth: "mid", quadrant: "BR", xPct: 0.74, yPct: 0.76 },
    { id: "MM3", depth: "mid", quadrant: "BL", xPct: 0.26, yPct: 0.76 },
    { id: "MM4", depth: "mid", quadrant: "TL", xPct: 0.4, yPct: 0.14 },
    { id: "MM5", depth: "mid", quadrant: "BR", xPct: 0.6, yPct: 0.86 },
  ],
  back: [
    { id: "MB0", depth: "back", quadrant: "TL", xPct: 0.36, yPct: 0.19 },
    { id: "MB1", depth: "back", quadrant: "TR", xPct: 0.64, yPct: 0.2 },
    { id: "MB2", depth: "back", quadrant: "BR", xPct: 0.64, yPct: 0.8 },
    { id: "MB3", depth: "back", quadrant: "BL", xPct: 0.36, yPct: 0.81 },
  ],
};

function createSeededRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randRange(rng: () => number, min: number, max: number) {
  return min + rng() * (max - min);
}

function shuffleWithRng<T>(arr: readonly T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function quadBezier(p0: number, p1: number, p2: number, t: number) {
  const inv = 1 - t;
  return inv * inv * p0 + 2 * inv * t * p1 + t * t * p2;
}

function sleep(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function waitTwoFrames(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

function overlapRatio(
  ax: number,
  ay: number,
  aSize: number,
  bx: number,
  by: number,
  bSize: number
): number {
  const aHalf = aSize * 0.44;
  const bHalf = bSize * 0.44;
  const ox = Math.max(0, Math.min(ax + aHalf, bx + bHalf) - Math.max(ax - aHalf, bx - bHalf));
  const oy = Math.max(0, Math.min(ay + aHalf, by + bHalf) - Math.max(ay - aHalf, by - bHalf));
  const inter = ox * oy;
  const minArea = Math.min(aHalf * 2 * (aHalf * 2), bHalf * 2 * (bHalf * 2));
  return minArea > 0 ? inter / minArea : 0;
}

function getCategoryEffectiveZoomPct(vw: number, isMobile: boolean): number {
  if (isMobile) return 100;
  const testZoom = (window as Window & { __tps1TestZoomPct?: unknown }).__tps1TestZoomPct;
  if (typeof testZoom === "number" && Number.isFinite(testZoom)) {
    return Math.round(Math.max(35, Math.min(250, testZoom)));
  }

  const rawOuter = window.outerWidth > 0 ? window.outerWidth : vw;
  const outerRatio = Math.round((rawOuter / Math.max(1, vw)) * 100);
  const viewportZoom = Math.round((1536 / Math.max(640, vw)) * 100);

  let detected: number;
  if (vw >= 1820) {
    detected = Math.min(outerRatio, viewportZoom);
  } else if (vw <= 1320) {
    detected = Math.max(outerRatio, viewportZoom);
  } else {
    detected = outerRatio >= 35 && outerRatio <= 240 && Math.abs(outerRatio - 100) > 6 ? outerRatio : 100;
  }

  return Math.max(35, Math.min(250, detected));
}

function getCategoryZoomDensityProfile(zoomPct: number, isMobile: boolean): ZoomDensityProfile {
  if (isMobile) {
    return { front: 2, mid: 4, back: 2, sizeScale: 1.0, centerScale: 1.0 };
  }
  if (zoomPct >= 135) {
    return { front: 3, mid: 3, back: 2, sizeScale: 0.8, centerScale: 0.92 };
  }
  if (zoomPct >= 112) {
    return { front: 3, mid: 4, back: 3, sizeScale: 0.9, centerScale: 0.96 };
  }
  if (zoomPct >= 92) {
    return { front: 3, mid: 5, back: 4, sizeScale: 1.0, centerScale: 1.0 };
  }
  if (zoomPct >= 78) {
    return { front: 4, mid: 7, back: 5, sizeScale: 1.15, centerScale: 1.12 };
  }
  if (zoomPct >= 63) {
    return { front: 4, mid: 10, back: 8, sizeScale: 1.34, centerScale: 1.28 };
  }
  return { front: 6, mid: 13, back: 11, sizeScale: 1.58, centerScale: 1.48 };
}

function clampToQuadrant(
  x: number,
  y: number,
  quadrant: Quadrant,
  vw: number,
  vh: number,
  margin: number
): { x: number; y: number } {
  const halfVw = vw * 0.5;
  const halfVh = vh * 0.5;
  const isLeft = quadrant === "TL" || quadrant === "BL";
  const isTop = quadrant === "TL" || quadrant === "TR";

  const minX = isLeft ? margin : halfVw + 6;
  const maxX = isLeft ? halfVw - 6 : vw - margin;
  const minY = isTop ? margin : halfVh + 6;
  const maxY = isTop ? halfVh - 6 : vh - margin;

  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
}

function enforceCenterSafeZone(
  x: number,
  y: number,
  size: number,
  vw: number,
  vh: number,
  depth: DepthLayer,
  centerScale: number,
  isMobile: boolean,
  quadrant: Quadrant
): { x: number; y: number } {
  // Real-pixel center typography safe zone (tight fit around .tps1-cat-transition__center)
  const halfW = isMobile
    ? Math.min(vw * 0.44, 175)
    : Math.min(vw * 0.23, Math.round(290 * centerScale));
  const halfH = isMobile
    ? Math.min(vh * 0.16, 115)
    : Math.min(vh * 0.18, Math.round(125 * centerScale));

  const safeLeft = vw * 0.5 - halfW;
  const safeRight = vw * 0.5 + halfW;
  const safeTop = vh * 0.5 - halfH;
  const safeBottom = vh * 0.5 + halfH;
  // Use 0.54 of size so rotated square bounding boxes never graze the center label
  const half = size * 0.54;

  const overlapsCenter =
    x + half > safeLeft &&
    x - half < safeRight &&
    y + half > safeTop &&
    y - half < safeBottom;

  if (!overlapsCenter) return { x, y };

  const dx = x - vw * 0.5;
  const dy = y - vh * 0.5;
  const pushPad = depth === "front" ? 26 : 18;

  // Push along whichever axis exits the safe box with least displacement (keeping quadrant if possible)
  const distLeft = Math.abs(x + half - safeLeft);
  const distRight = Math.abs(safeRight - (x - half));
  const distTop = Math.abs(y + half - safeTop);
  const distBottom = Math.abs(safeBottom - (y - half));
  const minDist = Math.min(distLeft, distRight, distTop, distBottom);

  let nx = x;
  let ny = y;
  if (minDist === distTop) {
    ny = safeTop - half - pushPad;
  } else if (minDist === distBottom) {
    ny = safeBottom + half + pushPad;
  } else if (minDist === distLeft || dx < 0) {
    nx = safeLeft - half - pushPad;
  } else {
    nx = safeRight + half + pushPad;
  }

  const margin = depth === "front" ? size * 0.24 : size * 0.48;
  ({ x: nx, y: ny } = clampToQuadrant(nx, ny, quadrant, vw, vh, margin));
  if (dy === 0 && dx === 0) ny = Math.max(margin, safeTop - half - pushPad);
  return { x: nx, y: ny };
}

function selectQuadrantBalancedSlots(
  slots: readonly SlotTemplate[],
  count: number,
  rng: () => number,
  startQuadOffset: number
): { picked: SlotTemplate[]; nextQuadOffset: number } {
  if (count <= 0 || slots.length === 0) {
    return { picked: [], nextQuadOffset: startQuadOffset };
  }

  const buckets: Record<Quadrant, SlotTemplate[]> = {
    TL: shuffleWithRng(slots.filter((s) => s.quadrant === "TL"), rng),
    TR: shuffleWithRng(slots.filter((s) => s.quadrant === "TR"), rng),
    BR: shuffleWithRng(slots.filter((s) => s.quadrant === "BR"), rng),
    BL: shuffleWithRng(slots.filter((s) => s.quadrant === "BL"), rng),
  };

  const picked: SlotTemplate[] = [];
  let cursor = ((startQuadOffset % 4) + 4) % 4;
  let guard = 0;

  while (picked.length < count && guard < slots.length * 4 + 8) {
    guard += 1;
    const q = QUADRANT_ORDER[cursor % 4];
    cursor = (cursor + 1) % 4;
    const next = buckets[q].shift();
    if (next) {
      picked.push(next);
    }
  }

  return { picked, nextQuadOffset: cursor };
}

type PickedCutoutInstance = {
  asset: CategoryCutoutAsset;
  instanceIndex: number;
};

function pickAssetsForRun(
  pool: CategoryCutoutAsset[],
  count: number,
  rng: () => number
): PickedCutoutInstance[] {
  if (count <= 0) return [];
  const uniqueMap = new Map<string, CategoryCutoutAsset>();
  for (const item of pool) {
    if (!uniqueMap.has(item.id)) uniqueMap.set(item.id, item);
  }
  const unique = Array.from(uniqueMap.values());
  if (unique.length === 0) return [];

  const garnishes = shuffleWithRng(
    unique.filter((c) => c.isGarnish),
    rng
  );
  const mains = shuffleWithRng(
    unique.filter((c) => !c.isGarnish),
    rng
  );

  // When count <= unique.length, use strictly unique assets (2-3 garnishes + mains)
  if (count <= unique.length) {
    const desiredGarnishes = Math.min(
      garnishes.length,
      count >= 10 ? (rng() > 0.45 ? 3 : 2) : Math.min(2, garnishes.length)
    );
    const pickedGarnishes = garnishes.slice(0, desiredGarnishes);
    const remaining = count - pickedGarnishes.length;
    const pickedMains = mains.slice(0, remaining);
    const combined = [...pickedMains, ...pickedGarnishes];
    if (combined.length < count) {
      const extras = garnishes.slice(desiredGarnishes, desiredGarnishes + (count - combined.length));
      combined.push(...extras);
    }
    return combined.slice(0, count).map((asset) => ({ asset, instanceIndex: 0 }));
  }

  // Pass 1: use every unique asset in the group once
  const firstPass = shuffleWithRng(unique, rng);
  const seenCount = new Map<string, number>();
  const result: PickedCutoutInstance[] = firstPass.map((asset) => {
    seenCount.set(asset.id, 1);
    return { asset, instanceIndex: 0 };
  });

  // Pass 2+: refill ~75% from main items and ~25% from garnishes until reaching targetCount
  const needed = count - result.length;
  const targetGarnishExtras = garnishes.length > 0 ? Math.round(needed * 0.25) : 0;
  const targetMainExtras = needed - targetGarnishExtras;

  const drawFromBucket = (bucket: CategoryCutoutAsset[], qty: number) => {
    if (qty <= 0 || bucket.length === 0) return;
    let deck = shuffleWithRng(bucket, rng);
    for (let i = 0; i < qty; i += 1) {
      if (deck.length === 0) deck = shuffleWithRng(bucket, rng);
      const asset = deck.shift()!;
      const prev = seenCount.get(asset.id) ?? 0;
      seenCount.set(asset.id, prev + 1);
      result.push({ asset, instanceIndex: prev });
    }
  };

  if (mains.length > 0) {
    drawFromBucket(mains, targetMainExtras);
    drawFromBucket(garnishes.length > 0 ? garnishes : mains, targetGarnishExtras);
  } else {
    drawFromBucket(garnishes, needed);
  }

  return result.slice(0, count);
}

function buildCinematicParticles(
  validCutouts: CategoryCutoutAsset[],
  vw: number,
  vh: number,
  isMobile: boolean,
  profile: ZoomDensityProfile,
  zoomPct: number,
  seed: number
): ParticleSpec[] {
  if (validCutouts.length === 0) return [];
  const rng = createSeededRng(seed);
  const totalCount = profile.front + profile.mid + profile.back;
  if (totalCount === 0) return [];

  const slotBank = isMobile ? MOBILE_SLOTS : DESKTOP_SLOTS;
  // F4 & F5 (top/bottom center-edge anchors) are ONLY unlocked at zoom <= 62%
  const availableFrontSlots =
    !isMobile && zoomPct > 62 ? slotBank.front.slice(0, 4) : slotBank.front;

  const startOffset = Math.floor(rng() * 4);
  const frontSel = selectQuadrantBalancedSlots(availableFrontSlots, profile.front, rng, startOffset);
  const midSel = selectQuadrantBalancedSlots(slotBank.mid, profile.mid, rng, frontSel.nextQuadOffset);
  const backSel = selectQuadrantBalancedSlots(slotBank.back, profile.back, rng, midSel.nextQuadOffset);
  const selectedSlots: SlotTemplate[] = [...frontSel.picked, ...midSel.picked, ...backSel.picked];

  // Compute jittered coordinates with center-safe-zone, quadrant lock & <= 24% overlap protection
  const placed: Array<{ slot: SlotTemplate; x: number; y: number; size: number }> = [];

  for (const slot of selectedSlots) {
    const baseSize = isMobile
      ? slot.depth === "front"
        ? randRange(rng, 148, 186)
        : slot.depth === "mid"
          ? randRange(rng, 114, 144)
          : randRange(rng, 106, 124)
      : slot.depth === "front"
        ? randRange(rng, 232, 320)
        : slot.depth === "mid"
          ? randRange(rng, 148, 204)
          : randRange(rng, 108, 142);

    const size = Math.round(baseSize * profile.sizeScale);

    // Controlled jitter ±3.5% of viewport, clamped inside its quadrant
    const jitterX = randRange(rng, -0.035, 0.035) * vw;
    const jitterY = randRange(rng, -0.035, 0.035) * vh;
    const margin = slot.depth === "front" ? size * 0.24 : size * 0.48;

    let { x, y } = clampToQuadrant(
      slot.xPct * vw + jitterX,
      slot.yPct * vh + jitterY,
      slot.quadrant,
      vw,
      vh,
      margin
    );
    ({ x, y } = enforceCenterSafeZone(
      x,
      y,
      size,
      vw,
      vh,
      slot.depth,
      profile.centerScale,
      isMobile,
      slot.quadrant
    ));

    // Resolve any >24% overlap with already placed elements while respecting quadrant & safe zone
    for (let iter = 0; iter < 12; iter += 1) {
      let pushed = false;
      for (const other of placed) {
        if (overlapRatio(x, y, size, other.x, other.y, other.size) > 0.24) {
          const dx = x - other.x || (rng() > 0.5 ? 1 : -1);
          const dy = y - other.y || (rng() > 0.5 ? 1 : -1);
          const len = Math.hypot(dx, dy) || 1;
          ({ x, y } = clampToQuadrant(
            x + (dx / len) * 26,
            y + (dy / len) * 26,
            slot.quadrant,
            vw,
            vh,
            margin
          ));
          ({ x, y } = enforceCenterSafeZone(
            x,
            y,
            size,
            vw,
            vh,
            slot.depth,
            profile.centerScale,
            isMobile,
            slot.quadrant
          ));
          pushed = true;
        }
      }
      if (!pushed) break;
    }

    placed.push({ slot, x, y, size });
  }

  // Assign assets to placed slots:
  // 1) Keep duplicate asset.id far apart & in different depth layers
  // 2) Never put same `kind` in adjacent slots
  // 3) Prefer bold main subjects on front/mid slots, mix shapes across neighbors
  const chosenAssets = pickAssetsForRun(validCutouts, placed.length, rng);
  const unassigned = [...chosenAssets];
  const assignments: Array<{ pos: (typeof placed)[number]; picked: PickedCutoutInstance }> = [];
  const neighborThreshold = Math.min(vw, vh) * 0.36;
  const viewportDiag = Math.max(1, Math.hypot(vw, vh));

  for (const pos of placed) {
    let bestIdx = 0;
    let bestScore = -Infinity;

    for (let i = 0; i < unassigned.length; i += 1) {
      const cand = unassigned[i];
      let score = rng() * 1.2;

      if (pos.slot.depth === "front" && !cand.asset.isGarnish) score += 3.0;
      if (pos.slot.depth === "back" && cand.asset.isGarnish) score += 1.4;
      if (pos.slot.depth === "front" && cand.instanceIndex === 0) score += 4.5;

      for (const prev of assignments) {
        const d = Math.hypot(pos.x - prev.pos.x, pos.y - prev.pos.y);

        // Heavy distance & same-depth penalty for duplicate instances so copies land opposite & layered
        if (prev.picked.asset.id === cand.asset.id) {
          const nd = d / viewportDiag;
          score -= 360 * Math.max(0, 1 - nd * 1.35);
          if (prev.pos.slot.depth === pos.slot.depth) score -= 75;
        }

        if (d < neighborThreshold) {
          if (prev.picked.asset.kind === cand.asset.kind) score -= 50;
          if (prev.picked.asset.shape === cand.asset.shape) score -= 2.2;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    const [picked] = unassigned.splice(bestIdx, 1);
    assignments.push({ pos, picked });
  }

  return assignments.map(({ pos, picked }, idx) => {
    const { slot, x: midX, y: midY, size } = pos;
    const depth = slot.depth;
    const { asset, instanceIndex } = picked;

    // ── PHASE 1 ENTRY: Glide smoothly INWARD from the nearest outer viewport edge (zero explosion!) ──
    let entryX: number;
    let entryY: number;

    if (depth === "front") {
      entryX = midX < vw * 0.5 ? -size * 0.75 : vw + size * 0.75;
      entryY = midY < vh * 0.5 ? -size * 0.38 : vh + size * 0.38;
    } else {
      const dLeft = midX;
      const dRight = vw - midX;
      const dTop = midY;
      const dBottom = vh - midY;
      const minEdge = Math.min(dLeft, dRight, dTop, dBottom);

      if (minEdge === dLeft) {
        entryX = -size * 0.72;
        entryY = midY + (midY - vh * 0.5) * 0.2;
      } else if (minEdge === dRight) {
        entryX = vw + size * 0.72;
        entryY = midY + (midY - vh * 0.5) * 0.2;
      } else if (minEdge === dTop) {
        entryX = midX + (midX - vw * 0.5) * 0.2;
        entryY = -size * 0.72;
      } else {
        entryX = midX + (midX - vw * 0.5) * 0.2;
        entryY = vh + size * 0.72;
      }
    }

    const chordX = midX - entryX;
    const chordY = midY - entryY;
    const perpLen = Math.hypot(chordX, chordY) || 1;
    const perpSign = idx % 2 === 0 ? 1 : -1;
    const softArc = randRange(rng, 16, 38) * (isMobile ? 0.5 : 1);
    const ctrlX = entryX + chordX * 0.54 + (-chordY / perpLen) * softArc * perpSign;
    const ctrlY = entryY + chordY * 0.54 + (chordX / perpLen) * softArc * perpSign;

    // Layer-specific optical rest opacity & calm weightless hover drift
    const restOpacity = depth === "back" ? 0.78 : depth === "front" ? 0.94 : 1;
    const driftAmp = depth === "back" ? 8 : depth === "mid" ? 12 : 18;
    const driftAngle = randRange(rng, 0, Math.PI * 2);
    const driftDx = Math.round(Math.cos(driftAngle) * driftAmp);
    const driftDy = Math.round(Math.sin(driftAngle) * driftAmp);
    const driftRot = Number(randRange(rng, 2.2, 3.6).toFixed(1));
    const driftMs = Math.round(
      depth === "back"
        ? randRange(rng, 4600, 6000)
        : depth === "mid"
          ? randRange(rng, 3800, 5000)
          : randRange(rng, 3200, 4400)
    );

    const pullFactor = depth === "front" ? 1.18 : depth === "mid" ? 0.98 : 0.8;
    const subtleDriftX = depth === "front" ? (midX < vw * 0.5 ? -22 : 22) : depth === "mid" ? (midX < vw * 0.5 ? -10 : 10) : 0;
    const endX = midX + subtleDriftX;
    const endY = midY - vh * pullFactor;
    const endScale = depth === "front" ? 1.06 : depth === "mid" ? 0.98 : 0.95;

    // Controlled rotation -25° to +25°; duplicate copies shift by ±18° & odd copies flip horizontally
    const baseRotMid = Math.round(randRange(rng, -25, 25));
    const dupRotOffset = instanceIndex > 0 ? (instanceIndex % 2 === 1 ? 18 : -18) : 0;
    const rotMid = baseRotMid + dupRotOffset;
    const rotStart = Math.round(rotMid + (entryX < midX ? -10 : 10));
    const rotEnd = Math.round(rotMid + (midX < vw * 0.5 ? -5 : 5));
    const flipX = instanceIndex > 0 && instanceIndex % 2 === 1;

    const delayMs = Math.round(
      depth === "back"
        ? randRange(rng, 40, 130)
        : depth === "mid"
          ? randRange(rng, 110, 220)
          : randRange(rng, 180, 275)
    );
    const burstMs = Math.round(
      depth === "back"
        ? randRange(rng, 520, 600)
        : depth === "mid"
          ? randRange(rng, 540, 620)
          : randRange(rng, 560, 640)
    );

    return {
      slotId: slot.id,
      depth,
      cutout: asset,
      instanceIndex,
      flipX,
      size,
      restOpacity,
      originX: entryX,
      originY: entryY,
      ctrlX,
      ctrlY,
      midX,
      midY,
      driftDx,
      driftDy,
      driftRot,
      driftMs,
      driftReverse: idx % 2 === 1,
      endX,
      endY,
      endScale,
      rotStart,
      rotMid,
      rotEnd,
      delayMs,
      burstMs,
    };
  });
}

function lockScrollWithoutShift(): () => void {
  const html = document.documentElement;
  const body = document.body;
  const scrollbarW = Math.max(0, window.innerWidth - html.clientWidth);

  const prevHtmlOverflow = html.style.overflow;
  const prevBodyOverflow = body.style.overflow;
  const prevBodyPadRight = body.style.paddingRight;
  const prevScrollBehavior = html.style.scrollBehavior;

  html.style.scrollBehavior = "auto";
  html.style.overflow = "hidden";
  body.style.overflow = "hidden";

  if (scrollbarW > 0) {
    const computedPadRight = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${computedPadRight + scrollbarW}px`;
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    html.style.overflow = prevHtmlOverflow;
    body.style.overflow = prevBodyOverflow;
    body.style.paddingRight = prevBodyPadRight;
    html.style.scrollBehavior = prevScrollBehavior;
  };
}

function decodeCutoutAsset(
  src: string,
  cache: Map<string, Promise<boolean>>
): Promise<boolean> {
  const existing = cache.get(src);
  if (existing) return existing;

  const promise = new Promise<boolean>((resolve) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      if (typeof img.decode === "function") {
        img
          .decode()
          .then(() => resolve(img.naturalWidth > 0))
          .catch(() => resolve(img.naturalWidth > 0));
      } else {
        resolve(img.naturalWidth > 0);
      }
    };
    img.onerror = () => resolve(false);
    img.src = src;
    if (img.complete && img.naturalWidth > 0) {
      if (typeof img.decode === "function") {
        img
          .decode()
          .then(() => resolve(true))
          .catch(() => resolve(true));
      } else {
        resolve(true);
      }
    }
  });

  cache.set(src, promise);
  return promise;
}

export function CategoryTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const transitionState = useSyncExternalStore(
    subscribeCategoryTransition,
    getCategoryTransitionSnapshot,
    getCategoryTransitionSnapshot
  );

  // Imperative refs — immune to React Strict Mode double-mount & route template remounts
  const activeRunIdRef = useRef<number>(0);
  const overlayElRef = useRef<HTMLDivElement | null>(null);
  const activeAnimsRef = useRef<Animation[]>([]);
  const unlockScrollRef = useRef<(() => void) | null>(null);
  const watchdogTimerRef = useRef<number | null>(null);
  const enterTimerRef = useRef<number | null>(null);
  const decodedCacheRef = useRef<Map<string, Promise<boolean>>>(new Map());
  const prefetchedHrefsRef = useRef<Set<string>>(new Set());
  const warnedSlugsRef = useRef<Set<string>>(new Set());

  const getCurrentUrl = useCallback(() => {
    if (typeof window !== "undefined") {
      return normalizeTransitionUrl(`${window.location.pathname}${window.location.search}`);
    }
    return normalizeTransitionUrl(pathname || "/");
  }, [pathname]);

  const cleanupRun = useCallback((transitionId?: number, resetStore = true) => {
    if (transitionId !== undefined && activeRunIdRef.current !== transitionId) {
      return;
    }

    if (watchdogTimerRef.current !== null) {
      window.clearTimeout(watchdogTimerRef.current);
      watchdogTimerRef.current = null;
    }

    if (transitionId !== undefined) {
      cancelReadyWaiter(transitionId);
    } else if (activeRunIdRef.current > 0) {
      cancelReadyWaiter(activeRunIdRef.current);
    }

    activeAnimsRef.current.forEach((anim) => {
      try {
        anim.cancel();
      } catch {
        // Ignore already finished animations
      }
    });
    activeAnimsRef.current = [];

    if (overlayElRef.current) {
      overlayElRef.current.remove();
      overlayElRef.current = null;
    }

    document.querySelectorAll(".tps1-cat-transition").forEach((node) => node.remove());

    if (unlockScrollRef.current) {
      unlockScrollRef.current();
      unlockScrollRef.current = null;
    }

    clearMajorPageTransitionSuppression();

    if (resetStore) {
      activeRunIdRef.current = 0;
      finishTransitionState(transitionId);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const activeId = activeRunIdRef.current;
      cleanupRun(activeId > 0 ? activeId : undefined, true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (enterTimerRef.current !== null) {
        window.clearTimeout(enterTimerRef.current);
        enterTimerRef.current = null;
      }
      delete document.documentElement.dataset.catEntering;
      if (activeRunIdRef.current === 0) {
        cleanupRun(undefined, false);
      }
    };
  }, [cleanupRun]);

  // Fallback ready signal ONLY for routes that do not mount <TransitionReady />
  useEffect(() => {
    const snap = getCategoryTransitionSnapshot();
    if (snap.phase === "idle" || snap.transitionId === 0) return;

    const currentUrl = getCurrentUrl();
    const currentPath = normalizeTransitionPath(currentUrl);
    const hasExplicitMarker = currentPath.startsWith("/danh-muc/") || currentPath === "/san-pham";
    if (hasExplicitMarker) return;

    if (snap.targetPath && currentPath === snap.targetPath) {
      const t = window.setTimeout(() => {
        markTransitionReady(currentUrl);
      }, 240);
      return () => window.clearTimeout(t);
    }
  }, [getCurrentUrl, pathname]);

  const preloadCategory = useCallback(
    (slug: string, href?: string) => {
      if (typeof window === "undefined") return;
      if (!isTps1FxDisabled()) {
        const cfg = getCategoryTransitionConfig(slug);
        if (cfg) {
          for (const c of cfg.cutouts) {
            void decodeCutoutAsset(c.src, decodedCacheRef.current);
          }
        }
      }
      if (href && !prefetchedHrefsRef.current.has(href)) {
        prefetchedHrefsRef.current.add(href);
        try {
          router.prefetch(href);
        } catch {
          // Ignore prefetch failure
        }
      }
    },
    [router]
  );

  const runTransitionAsync = useCallback(
    async (
      transitionId: number,
      params: CategoryTransitionTrigger,
      initialUrl: string
    ) => {
      const { slug, href, originRect, isEnglish = false, dispatchSelectEvent = false } = params;
      const config = getCategoryTransitionConfig(slug);
      if (!config) {
        cleanupRun(transitionId, true);
        return;
      }

      const isStale = () => activeRunIdRef.current !== transitionId;
      const targetUrl = normalizeTransitionUrl(href);
      const targetPath = normalizeTransitionPath(href);

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const smallPhysical = (window.screen?.width ?? 9999) < 768;
      const isMobile = (vw < 768 && (coarse || smallPhysical)) || vw < 520;
      const zoomPct = getCategoryEffectiveZoomPct(vw, isMobile);
      const densityProfile = getCategoryZoomDensityProfile(zoomPct, isMobile);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const displayLabel = isEnglish ? config.labelEn : config.label;

      const originX = originRect
        ? originRect.left + originRect.width * 0.5
        : vw * 0.5;
      const originY = originRect
        ? originRect.top + originRect.height * 0.5
        : Math.min(180, vh * 0.25);

      const maxRadius = Math.ceil(
        Math.hypot(Math.max(originX, vw - originX), Math.max(originY, vh - originY)) + 48
      );

      const maxWaitMs =
        typeof (window as Window & { __tps1TestTimeoutMs?: number }).__tps1TestTimeoutMs === "number"
          ? (window as Window & { __tps1TestTimeoutMs?: number }).__tps1TestTimeoutMs!
          : MAX_TRANSITION_WAIT_MS;

      watchdogTimerRef.current = window.setTimeout(() => {
        if (!isStale()) {
          cleanupRun(transitionId, true);
        }
      }, maxWaitMs + 1600);

      try {
        if (targetPath === "/san-pham" || targetPath === "/en/products") {
          suppressMajorPageTransition(maxWaitMs + 1000, targetPath);
        }

        unlockScrollRef.current = lockScrollWithoutShift();

        // Pre-decode group cutouts before showing particles (skip broken images cleanly)
        // Always decode & render full 3-layer composition even under Windows MinAnimate=0 (prefers-reduced-motion: reduce)
        const decodeResults = await Promise.race([
          Promise.all(
            config.cutouts.map(async (c) => ({
              cutout: c,
              ok: await decodeCutoutAsset(c.src, decodedCacheRef.current),
            }))
          ),
          sleep(450).then(() =>
            config.cutouts.map((c) => ({ cutout: c, ok: true }))
          ),
        ]);
        if (isStale()) return;

        const validCutouts = decodeResults.filter((r) => r.ok).map((r) => r.cutout);

        if (
          process.env.NODE_ENV !== "production" &&
          validCutouts.length < 11 &&
          !warnedSlugsRef.current.has(slug)
        ) {
          warnedSlugsRef.current.add(slug);
          console.warn(
            `[CategoryTransition] Nhóm "${slug}" hiện có ${validCutouts.length}/11 ảnh hợp lệ (thiếu: ${config.missingCutouts.join(", ")}). Xem docs/transition-assets-needed.md để bổ sung đủ bộ ảnh.`
          );
        }

        // Fresh random seed per run so consecutive runs produce genuinely distinct balanced layouts
        const runSeed =
          ((Date.now() & 0xffffffff) ^ Math.imul(transitionId, 2654435761) ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
        const particles = buildCinematicParticles(
          validCutouts,
          vw,
          vh,
          isMobile,
          densityProfile,
          zoomPct,
          runSeed
        );

        // Mount fresh overlay portal directly onto document.body
        const overlay = document.createElement("div");
        overlay.className = `tps1-cat-transition is-active${isMobile ? " is-mobile" : ""}${reducedMotion ? " is-reduced" : ""}`;
        overlay.setAttribute("aria-hidden", "true");
        overlay.setAttribute("data-cat-transition-id", String(transitionId));
        overlay.setAttribute("data-cat-transition-slug", slug);
        overlay.setAttribute("data-cat-transition-color", config.overlayColor);
        overlay.setAttribute("data-cat-transition-phase", "entering");
        overlay.setAttribute("data-cat-zoom-pct", String(zoomPct));
        overlay.setAttribute("data-cat-particle-count", String(particles.length));

        // ── Layer 1 (z-index: 1): 100% OPAQUE 2-tone radial backdrop + vignette + grain + center aura ──
        const backdrop = document.createElement("div");
        backdrop.className = "tps1-cat-transition__backdrop";
        backdrop.style.backgroundColor = config.overlayColor;
        backdrop.style.backgroundImage = [
          "radial-gradient(ellipse 92% 88% at 50% 50%, transparent 44%, rgba(0, 0, 0, 0.46) 100%)",
          `radial-gradient(circle at 50% 48%, ${config.overlayCenterColor} 0%, ${config.overlayColor} 78%)`,
        ].join(", ");
        backdrop.style.clipPath = `circle(0px at ${originX}px ${originY}px)`;
        backdrop.style.willChange = "clip-path";

        const grain = document.createElement("div");
        grain.className = "tps1-cat-transition__grain";
        backdrop.appendChild(grain);

        const aura = document.createElement("div");
        aura.className = "tps1-cat-transition__aura";
        aura.style.background = `radial-gradient(circle, ${config.overlayGlowColor} 0%, transparent 70%)`;
        backdrop.appendChild(aura);
        overlay.appendChild(backdrop);

        // ── Depth Stages: Back (z:2), Mid (z:3), Center Typography (z:4), Front Lens Bokeh (z:5) ──
        const stageBack = document.createElement("div");
        stageBack.className = "tps1-cat-transition__stage tps1-cat-transition__stage--back";
        const stageMid = document.createElement("div");
        stageMid.className = "tps1-cat-transition__stage tps1-cat-transition__stage--mid";
        const stageFront = document.createElement("div");
        stageFront.className = "tps1-cat-transition__stage tps1-cat-transition__stage--front";

        const center = document.createElement("div");
        center.className = "tps1-cat-transition__center";
        center.style.setProperty("--cat-center-scale", String(densityProfile.centerScale));
        center.style.opacity = "0";
        center.style.willChange = "transform, opacity";

        const eyebrow = document.createElement("span");
        eyebrow.className = "tps1-cat-transition__eyebrow";
        eyebrow.textContent = isEnglish ? "WHOLESALE CATEGORY" : "DANH MỤC NGUỒN HÀNG";

        const title = document.createElement("span");
        title.className = "tps1-cat-transition__title";
        title.textContent = displayLabel;

        const statusLine = document.createElement("span");
        statusLine.className = "tps1-cat-transition__status";
        statusLine.textContent = isEnglish
          ? `Preparing ${displayLabel} for your kitchen`
          : `Đang chuẩn bị ${displayLabel} cho bếp của bạn`;

        const progressTrack = document.createElement("div");
        progressTrack.className = "tps1-cat-transition__progress";
        const progressBar = document.createElement("span");
        progressBar.className = "tps1-cat-transition__progress-bar";
        progressTrack.appendChild(progressBar);

        center.appendChild(eyebrow);
        center.appendChild(title);
        center.appendChild(statusLine);
        center.appendChild(progressTrack);

        const particleNodes: HTMLDivElement[] = particles.map((p) => {
          const el = document.createElement("div");
          el.className = `tps1-cat-transition__particle tps1-cat-transition__particle--${p.depth}`;
          el.setAttribute("data-cutout-id", p.cutout.id);
          el.setAttribute("data-cutout-kind", p.cutout.kind);
          el.setAttribute("data-depth", p.depth);
          el.setAttribute("data-slot", p.slotId);
          el.setAttribute("data-instance-index", String(p.instanceIndex));
          el.style.width = `${p.size}px`;
          el.style.height = `${p.size}px`;
          el.style.opacity = "0";
          el.style.willChange = "transform, opacity";

          const img = document.createElement("img");
          img.src = p.cutout.src;
          img.alt = "";
          img.className = "tps1-cat-transition__img";
          if (p.flipX) {
            img.style.transform = "scaleX(-1)";
          }
          img.decoding = "sync";
          img.onerror = () => {
            el.style.display = "none";
          };
          el.appendChild(img);

          if (p.depth === "back") stageBack.appendChild(el);
          else if (p.depth === "mid") stageMid.appendChild(el);
          else stageFront.appendChild(el);

          return el;
        });

        overlay.appendChild(stageBack);
        overlay.appendChild(stageMid);
        overlay.appendChild(center);
        overlay.appendChild(stageFront);
        document.body.appendChild(overlay);
        overlayElRef.current = overlay;

        // Measure visible duration strictly from when overlay actually mounts (guarantees >= 1000ms even after cold decode)
        const tOverlayVisible = performance.now();

        // ── PHASE 1 (BUNG RA: 0–700ms): Opaque circle reveal + layered curved burst ──
        // Run real 3-phase cinematic motion on all desktops (including Windows PCs with MinAnimate=0),
        // gently moderating drift amplitude if prefers-reduced-motion is reported by OS.
        const motionScale = reducedMotion ? 0.72 : 1;

        const bgExpandAnim = backdrop.animate(
          [
            { clipPath: `circle(0px at ${originX}px ${originY}px)` },
            { clipPath: `circle(${maxRadius}px at ${originX}px ${originY}px)` },
          ],
          {
            duration: 600,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "both",
          }
        );

        const cs = densityProfile.centerScale;
        const centerInAnim = center.animate(
          [
            {
              opacity: 0,
              transform: `translate3d(-50%, calc(-50% + 22px), 0) scale(${(cs * 0.95).toFixed(3)})`,
            },
            {
              opacity: 1,
              transform: `translate3d(-50%, -50%, 0) scale(${cs.toFixed(3)})`,
            },
          ],
          {
            duration: 440,
            delay: 110,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "both",
          }
        );

        // Progress bar appears ONLY after 400ms so fast responses never flicker
        const progressRevealAnim = progressTrack.animate(
          [{ opacity: 0 }, { opacity: 1 }],
          {
            duration: 240,
            delay: 400,
            easing: "ease-out",
            fill: "both",
          }
        );

        activeAnimsRef.current.push(bgExpandAnim, centerInAnim, progressRevealAnim);

        const stops = [0, 0.16, 0.35, 0.58, 0.8, 1];
        const burstAnims: Animation[] = particles.map((p, idx) => {
          const el = particleNodes[idx];
          const baseX = p.midX - p.size / 2;
          const baseY = p.midY - p.size / 2;

          const keyframes: Keyframe[] = stops.map((t) => {
            const x = quadBezier(p.originX, p.ctrlX, p.midX, t) - p.size / 2;
            const y = quadBezier(p.originY, p.ctrlY, p.midY, t) - p.size / 2;
            const rot = p.rotStart + (p.rotMid - p.rotStart) * t;
            const scale = 0.86 + 0.14 * t;
            const opacity = t === 0 ? 0 : t < 0.25 ? p.restOpacity * (t / 0.25) : p.restOpacity;
            return {
              offset: t,
              transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`,
              opacity,
            };
          });

          const anim = el.animate(keyframes, {
            duration: p.burstMs,
            delay: p.delayMs,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "both",
          });
          activeAnimsRef.current.push(anim);

          // ── PHASE 2 (CHỜ): Smooth independent GPU compositor breathing drift (8-18px, ±4°, 3-6s) ──
          anim.finished
            .then(() => {
              if (
                isStale() ||
                !el.isConnected ||
                overlay.getAttribute("data-cat-transition-phase") === "leaving"
              ) {
                return;
              }
              const s = p.driftReverse ? -1 : 1;
              const dx = p.driftDx * motionScale * s;
              const dy = p.driftDy * motionScale * s;
              const drot = p.driftRot * motionScale * s;
              const loopAnim = el.animate(
                [
                  {
                    transform: `translate3d(${baseX.toFixed(1)}px, ${baseY.toFixed(1)}px, 0) rotate(${p.rotMid}deg) scale(1)`,
                    opacity: p.restOpacity,
                  },
                  {
                    transform: `translate3d(${(baseX + dx).toFixed(1)}px, ${(baseY + dy).toFixed(1)}px, 0) rotate(${(p.rotMid + drot).toFixed(1)}deg) scale(1.02)`,
                    opacity: p.restOpacity,
                  },
                  {
                    transform: `translate3d(${(baseX - dx * 0.72).toFixed(1)}px, ${(baseY - dy * 0.78).toFixed(1)}px, 0) rotate(${(p.rotMid - drot * 0.85).toFixed(1)}deg) scale(0.985)`,
                    opacity: p.restOpacity,
                  },
                  {
                    transform: `translate3d(${baseX.toFixed(1)}px, ${baseY.toFixed(1)}px, 0) rotate(${p.rotMid}deg) scale(1)`,
                    opacity: p.restOpacity,
                  },
                ],
                {
                  duration: p.driftMs,
                  iterations: Infinity,
                  easing: "ease-in-out",
                }
              );
              activeAnimsRef.current.push(loopAnim);
            })
            .catch(() => {});

          return anim;
        });

        // Guarantee first frame paints BEFORE kicking off Next.js navigation
        await waitTwoFrames();
        if (isStale()) return;

        const readyPromise = createTransitionReadyWaiter(
          transitionId,
          targetUrl,
          initialUrl,
          maxWaitMs
        );

        if (dispatchSelectEvent) {
          window.dispatchEvent(new CustomEvent("tps1-select-category", { detail: slug }));
        }
        startTransition(() => {
          router.push(href);
        });

        await bgExpandAnim.finished.catch(() => {});
        if (isStale()) return;

        // Lock backdrop to clean full inset clip-path so Phase 3 curtain reveal interpolates seamlessly
        backdrop.style.clipPath = "inset(0% 0% 0% 0%)";
        bgExpandAnim.cancel();

        overlay.setAttribute("data-cat-transition-phase", "waiting");
        advanceTransitionPhase(transitionId, "waiting");

        const minFloorMs = Math.max(0, MIN_TRANSITION_MS + 20 - (performance.now() - tOverlayVisible));
        const [readyOutcome] = await Promise.all([
          readyPromise,
          sleep(minFloorMs),
          Promise.all(burstAnims.map((a) => a.finished.catch(() => {}))),
        ]);
        if (isStale() || readyOutcome === "cancelled") return;

        if (readyOutcome === "timeout") {
          statusLine.textContent = isEnglish
            ? "Opening page…"
            : "Đang mở trang…";
          await sleep(300);
          if (isStale()) return;
        }

        // ── PHASE 3 (THOÁT >= 500ms): Unified upward curtain pull — backdrop, title & all 3 layers rise together ──
        overlay.setAttribute("data-cat-transition-phase", "leaving");
        advanceTransitionPhase(transitionId, "leaving");

        if (enterTimerRef.current !== null) window.clearTimeout(enterTimerRef.current);
        document.documentElement.dataset.catEntering = "true";
        enterTimerRef.current = window.setTimeout(() => {
          delete document.documentElement.dataset.catEntering;
        }, 720);

        const exitDur = 580;
        const exitEasing = "cubic-bezier(0.76, 0, 0.24, 1)";
        const exitAnims: Animation[] = [];

        // Cinematic vertical curtain lift (clip-path inset) — pulls cleanly upward to unveil destination
        const bgOut = backdrop.animate(
          [
            { clipPath: "inset(0% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 100% 0%)" },
          ],
          {
            duration: exitDur,
            delay: 40,
            easing: exitEasing,
            fill: "both",
          }
        );

        // Typography glides smoothly upward in lockstep with the lifting curtain
        const centerOut = center.animate(
          [
            {
              opacity: 1,
              transform: `translate3d(-50%, -50%, 0) scale(${cs.toFixed(3)})`,
            },
            {
              opacity: 0,
              transform: `translate3d(-50%, calc(-50% - ${Math.round(vh * 0.28)}px), 0) scale(${(cs * 0.98).toFixed(3)})`,
            },
          ],
          {
            duration: Math.round(exitDur * 0.86),
            delay: 20,
            easing: exitEasing,
            fill: "both",
          }
        );
        exitAnims.push(bgOut, centerOut);

        // All 3 depth layers are pulled smoothly UPWARD along the curtain exit direction with depth parallax
        particles.forEach((p, idx) => {
          const el = particleNodes[idx];
          const computed = window.getComputedStyle(el);
          const fromTransform =
            computed.transform && computed.transform !== "none"
              ? computed.transform
              : `translate3d(${(p.midX - p.size / 2).toFixed(1)}px, ${(p.midY - p.size / 2).toFixed(1)}px, 0) rotate(${p.rotMid}deg) scale(1)`;
          const fromOpacity = Number(computed.opacity || String(p.restOpacity));
          const verticalLag = Math.round(Math.max(0, Math.min(50, (p.midY / Math.max(1, vh)) * 45)));

          const pOut = el.animate(
            [
              { transform: fromTransform, opacity: fromOpacity },
              {
                transform: `translate3d(${(p.endX - p.size / 2).toFixed(1)}px, ${(p.endY - p.size / 2).toFixed(1)}px, 0) rotate(${p.rotEnd}deg) scale(${p.endScale})`,
                opacity: 0,
              },
            ],
            {
              duration: exitDur,
              delay: verticalLag,
              easing: exitEasing,
              fill: "both",
            }
          );
          exitAnims.push(pOut);
        });

        activeAnimsRef.current.push(...exitAnims);
        await Promise.all(exitAnims.map((a) => a.finished.catch(() => {})));
        if (isStale()) return;

        backdrop.style.willChange = "auto";
        center.style.willChange = "auto";
        particleNodes.forEach((el) => {
          el.style.willChange = "auto";
        });
      } finally {
        if (activeRunIdRef.current === transitionId) {
          cleanupRun(transitionId, true);
        }
      }
    },
    [cleanupRun, router]
  );

  const triggerCategoryTransition = useCallback(
    (params: CategoryTransitionTrigger) => {
      if (typeof window === "undefined") return false;
      if (isTps1FxDisabled()) return false;

      const config = getCategoryTransitionConfig(params.slug);
      if (!config) return false;

      const currentUrl = getCurrentUrl();
      const targetUrl = normalizeTransitionUrl(params.href);

      if (targetUrl === currentUrl) {
        return false;
      }

      const snap = getCategoryTransitionSnapshot();
      if (snap.phase === "entering" || snap.phase === "waiting") {
        if (snap.targetUrl === targetUrl) {
          return true;
        }
        cleanupRun(snap.transitionId, false);
      } else if (snap.phase === "leaving") {
        cleanupRun(snap.transitionId, false);
      }

      const transitionId = nextTransitionId();
      activeRunIdRef.current = transitionId;
      startTransitionState({
        transitionId,
        slug: params.slug,
        targetUrl,
      });

      void runTransitionAsync(transitionId, params, currentUrl);
      return true;
    },
    [cleanupRun, getCurrentUrl, runTransitionAsync]
  );

  const value = useMemo<CategoryTransitionContextValue>(
    () => ({
      triggerCategoryTransition,
      preloadCategory,
      transitionState,
    }),
    [preloadCategory, transitionState, triggerCategoryTransition]
  );

  return (
    <CategoryTransitionContext.Provider value={value}>
      {children}
    </CategoryTransitionContext.Provider>
  );
}
