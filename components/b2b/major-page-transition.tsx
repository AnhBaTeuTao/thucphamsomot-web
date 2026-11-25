"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Leaf } from "lucide-react";
import { brandAssets } from "@/lib/brand";
import { isMajorPageTransitionSuppressed } from "@/lib/category-transition-config";

export type MajorNavMeta = {
  title: string;
  subtitle: string;
  pills: [string, string, string];
  badge?: string;
};

export const MAJOR_NAV_PAGES: Record<string, MajorNavMeta> = {
  "/gioi-thieu": {
    title: "Giới Thiệu",
    subtitle: "Nguồn thực phẩm sạch từ nông trại đến gian bếp từ năm 2017",
    pills: ["Chuẩn ISO 22000 & HACCP", "100% Rõ nguồn gốc", "Bảo hiểm 5 tỷ đồng"],
  },
  "/san-pham": {
    title: "Danh Mục Hàng Hóa",
    subtitle: "Rau củ quả Đà Lạt, thịt cá tươi sống & hơn 5.000 mặt hàng sạch",
    pills: ["Rau củ tươi mỗi sáng", "Thịt cá kiểm dịch", "Đồ khô & Gia vị chính ngạch"],
  },
  "/nganh-hang": {
    title: "Ngành Hàng",
    subtitle: "Thực phẩm tươi sạch tuyển chọn cho từng loại hình bếp ăn",
    pills: ["Bếp công nghiệp & Nhà máy", "Trường học & Bệnh viện", "Nhà hàng & Chuỗi F&B"],
  },
  "/quy-trinh": {
    title: "Quy Trình Giao Nhận",
    subtitle: "Chuỗi xe lạnh chuyên dụng giữ trọn độ tươi đến tận bếp",
    pills: ["Tuyển chọn tại nguồn", "Xe lạnh chuyên dụng", "Giao đúng giờ mở bếp"],
  },
  "/blog": {
    title: "Blog & Kiến Thức",
    subtitle: "Cẩm nang an toàn thực phẩm & dinh dưỡng cho người quản lý bếp",
    pills: ["An toàn thực phẩm", "Truy xuất nguồn gốc", "Kinh nghiệm bếp tập thể"],
  },
  "/lien-he": {
    title: "Liên Hệ",
    subtitle: "Đồng hành cung ứng nguồn thực phẩm sạch & ổn định mỗi ngày",
    pills: ["Xác nhận trong 2 giờ làm việc", "Báo giá trong 24 giờ", "Hóa đơn VAT đầy đủ"],
  },
  "/en/about": {
    title: "About TPS1",
    subtitle: "Farm-to-kitchen clean food supply chain since 2017",
    pills: ["ISO 22000 & HACCP", "100% Traceable Origin", "5B VND Food Safety Insurance"],
    badge: "FRESH CLEAN FOOD NO.1 · DAILY HARVEST",
  },
  "/en/products": {
    title: "Product Catalog",
    subtitle: "Dalat fresh produce, inspected meats & 5,000+ clean food SKUs",
    pills: ["Morning Fresh Produce", "Inspected Meats & Seafood", "Authentic Dry Goods & Spices"],
    badge: "FRESH CLEAN FOOD NO.1 · DAILY HARVEST",
  },
  "/en/delivery": {
    title: "Delivery Process",
    subtitle: "Dedicated cold-chain fleet preserving peak freshness to your kitchen",
    pills: ["Selected at Source", "Dedicated Cold Trucks", "On-Time Kitchen Delivery"],
    badge: "FRESH CLEAN FOOD NO.1 · DAILY HARVEST",
  },
  "/en/news": {
    title: "Insights & Blog",
    subtitle: "Food safety handbook & nutrition insights for kitchen managers",
    pills: ["Food Safety Standards", "Full Traceability", "Industrial Kitchen Operations"],
    badge: "FRESH CLEAN FOOD NO.1 · DAILY HARVEST",
  },
  "/en/contact": {
    title: "Contact Us",
    subtitle: "Your trusted partner for clean, stable daily food supply",
    pills: ["2-Hour Confirmation", "24-Hour Quotation", "Full VAT Invoices"],
    badge: "FRESH CLEAN FOOD NO.1 · DAILY HARVEST",
  },
};

export type RealFoodCutout = {
  id: string;
  src: string;
  alt: string;
  weight: "heavy" | "light";
};

export const FOOD_CUTOUT_POOL: RealFoodCutout[] = [
  { id: "raw-beef-steak", src: "/images/food-cutouts/raw-beef-steak.png", alt: "Thịt thăn bò tươi", weight: "heavy" },
  { id: "fresh-pork-belly", src: "/images/food-cutouts/fresh-pork-belly.png", alt: "Thịt heo ba rọi tươi", weight: "heavy" },
  { id: "raw-chicken-drumstick", src: "/images/food-cutouts/raw-chicken-drumstick.png", alt: "Đùi gà tươi sống", weight: "light" },
  { id: "salmon-fillet", src: "/images/food-cutouts/salmon-fillet.png", alt: "Khúc cá hồi tươi", weight: "heavy" },
  { id: "fresh-sea-fish", src: "/images/food-cutouts/fresh-sea-fish.png", alt: "Cá biển tươi", weight: "light" },
  { id: "fresh-prawn", src: "/images/food-cutouts/fresh-prawn.png", alt: "Tôm sú tươi", weight: "light" },
  { id: "fresh-squid", src: "/images/food-cutouts/fresh-squid.png", alt: "Mực ống tươi", weight: "light" },
  { id: "fresh-bok-choy", src: "/images/food-cutouts/fresh-bok-choy.png", alt: "Rau cải thìa tươi", weight: "light" },
  { id: "fresh-broccoli", src: "/images/food-cutouts/fresh-broccoli.png", alt: "Bông cải xanh Đà Lạt", weight: "heavy" },
  { id: "fresh-carrot", src: "/images/food-cutouts/fresh-carrot.png", alt: "Cà rốt Đà Lạt tươi", weight: "light" },
  { id: "fresh-tomato", src: "/images/food-cutouts/fresh-tomato.png", alt: "Cà chua chín đỏ", weight: "heavy" },
  { id: "fresh-lettuce", src: "/images/food-cutouts/fresh-lettuce.png", alt: "Rau xà lách xanh tươi", weight: "light" },
  { id: "red-bell-pepper", src: "/images/food-cutouts/red-bell-pepper.png", alt: "Ớt chuông đỏ Đà Lạt", weight: "light" },
  { id: "sweet-corn", src: "/images/food-cutouts/sweet-corn.png", alt: "Bắp ngọt tươi", weight: "heavy" },
  { id: "purple-cabbage", src: "/images/food-cutouts/purple-cabbage.png", alt: "Bắp cải tím tươi", weight: "heavy" },
  { id: "fresh-avocado", src: "/images/food-cutouts/fresh-avocado.png", alt: "Bơ sáp Đà Lạt tươi", weight: "heavy" },
  { id: "fresh-mushroom", src: "/images/food-cutouts/fresh-mushroom.png", alt: "Nấm đùi gà tươi", weight: "light" },
  { id: "fresh-citrus", src: "/images/food-cutouts/fresh-citrus.png", alt: "Cam tươi mọng nước", weight: "heavy" },
  { id: "fresh-cabbage-green", src: "/images/food-cutouts/fresh-cabbage-green.png", alt: "Bắp cải xanh Đà Lạt tươi", weight: "heavy" },
  { id: "fresh-cucumber", src: "/images/food-cutouts/fresh-cucumber.png", alt: "Dưa leo xanh tươi", weight: "light" },
  { id: "fresh-potato", src: "/images/food-cutouts/fresh-potato.png", alt: "Khoai tây Đà Lạt tươi", weight: "heavy" },
  { id: "fresh-ginger-garlic", src: "/images/food-cutouts/fresh-ginger-garlic.png", alt: "Củ gừng và tỏi tươi", weight: "light" },
  { id: "fresh-eggs-pair", src: "/images/food-cutouts/fresh-eggs-pair.png", alt: "Trứng gà tươi sạch", weight: "light" },
  { id: "fresh-pineapple-lemon", src: "/images/food-cutouts/fresh-pineapple-lemon.png", alt: "Chanh vàng tươi mọng nước", weight: "light" },
];

type DepthLayer = "macro" | "mid" | "far";
type FoodGroup = "top" | "bottom";

type ScatteredFood = RealFoodCutout & {
  group: FoodGroup;
  depth: DepthLayer;
  x: number;
  y: number;
  delayMs: number;
  durationMs: number;
  travelVh: number;
  swayPx: number;
  overshootPx: number;
  scale: number;
  rotStart: number;
  rotSettle: number;
  rotFloat: number;
  mobileHide: boolean;
};

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

export function getEffectiveZoomPercent(): number {
  if (typeof window === "undefined") return 100;
  // Method 1: Desktop browser outerWidth / innerWidth ratio when actively zoomed
  if (window.outerWidth > 0 && window.innerWidth > 0) {
    const ratio = (window.outerWidth / window.innerWidth) * 100;
    if (ratio >= 20 && ratio <= 400 && Math.abs(ratio - 100) > 6) {
      return Math.round(ratio);
    }
  }
  // Method 2: Fallback based on expanded viewport width relative to standard 1536px Desktop
  if (window.innerWidth >= 2400) return 60;
  if (window.innerWidth >= 1950) return 75;
  return 100;
}

function getZoomDensityConfig(zoomPct: number): {
  totalCount: number;
  minDist: number;
  zoomBoost: number;
} {
  if (zoomPct < 65) {
    return { totalCount: 24, minDist: 8.8, zoomBoost: 1.38 };
  }
  if (zoomPct < 80) {
    return { totalCount: 18, minDist: 10.5, zoomBoost: 1.18 };
  }
  return { totalCount: 12, minDist: 13.5, zoomBoost: 1 };
}

/** Fisher-Yates shuffle without replacement — 100% unique real food cutouts per transition */
export function pickUniqueRandomFoods(count = 12): RealFoodCutout[] {
  return shuffle(FOOD_CUTOUT_POOL).slice(0, Math.min(count, FOOD_CUTOUT_POOL.length));
}

function isInsideForbiddenCenter(x: number, y: number, compactCard: boolean): boolean {
  if (compactCard) {
    // At zoomed-out viewports (<80%), the 700px center card occupies a narrower % band
    return x >= 28 && x <= 72 && y >= 27 && y <= 73;
  }
  return x >= 23 && x <= 77 && y >= 23 && y <= 77;
}

function sampleSafeCandidate(group: FoodGroup, compactCard: boolean): { x: number; y: number } {
  const x = rand(6.5, 93.5);
  const inCenterBand = compactCard ? x >= 28 && x <= 72 : x >= 23 && x <= 77;
  const bandMaxY = compactCard ? 24 : 20.5;
  if (group === "top") {
    const y = inCenterBand ? rand(8, bandMaxY) : rand(9, 45);
    return { x, y };
  }
  const bottomPct = inCenterBand ? rand(8, bandMaxY) : rand(9, 45);
  return { x, y: 100 - bottomPct };
}

/**
 * Generates zoom-responsive bounded safe-zone scatter placements:
 * - >= 80% zoom: 12 unique items (6 top + 6 bottom), minDist 13.5%, zoomBoost 1.0
 * - 65%..79% zoom: 18 unique items (9 top + 9 bottom), minDist 10.5%, zoomBoost 1.18
 * - < 65% zoom: 24 unique items (12 top + 12 bottom), minDist 8.8%, zoomBoost 1.38
 */
export function generateBoundedRandomPlacements(zoomPct = 100): {
  foods: ScatteredFood[];
  zoomBoost: number;
} {
  const { totalCount, minDist, zoomBoost } = getZoomDensityConfig(zoomPct);
  const half = totalCount / 2;
  const compactCard = zoomPct < 80;

  const picked = pickUniqueRandomFoods(totalCount);

  const perLayer = Math.floor(totalCount / 3);
  const depths: DepthLayer[] = shuffle([
    ...Array<DepthLayer>(perLayer).fill("macro"),
    ...Array<DepthLayer>(perLayer).fill("mid"),
    ...Array<DepthLayer>(totalCount - perLayer * 2).fill("far"),
  ]);

  const baseDelays = shuffle(
    Array.from({ length: totalCount }, (_, idx) =>
      Math.round(15 + idx * (325 / Math.max(1, totalCount - 1)) + rand(-10, 10))
    )
  ).map((d) => Math.max(15, Math.min(340, d)));

  const placedCoords: Array<{ x: number; y: number }> = [];
  const results: ScatteredFood[] = [];

  for (let i = 0; i < totalCount; i += 1) {
    const food = picked[i];
    const group: FoodGroup = i < half ? "top" : "bottom";
    const groupIdx = i < half ? i : i - half;

    let chosen: { x: number; y: number } | null = null;
    for (const targetDist of [minDist + 1.8, minDist, Math.max(7.2, minDist - 1.2)]) {
      for (let attempt = 0; attempt < 220; attempt += 1) {
        const cand = sampleSafeCandidate(group, compactCard);
        if (isInsideForbiddenCenter(cand.x, cand.y, compactCard)) continue;
        const farEnough = placedCoords.every(
          (p) => Math.hypot(cand.x - p.x, cand.y - p.y) >= targetDist
        );
        if (farEnough) {
          chosen = cand;
          break;
        }
      }
      if (chosen) break;
    }

    if (!chosen) {
      // Deterministic safe perimeter fallback
      const t = (groupIdx + 0.5) / half;
      const fx = 8 + t * 84;
      const fy = group === "top" ? (fx >= 26 && fx <= 74 ? 13 : 28) : (fx >= 26 && fx <= 74 ? 87 : 72);
      chosen = { x: fx, y: fy };
    }

    placedCoords.push(chosen);

    const depth = depths[i];
    const baseScale =
      depth === "macro"
        ? rand(1.14, 1.28)
        : depth === "mid"
          ? rand(0.96, 1.12)
          : rand(0.82, 0.94);
    const scale = Number((baseScale * zoomBoost).toFixed(2));

    const durationMs = Math.round(
      food.weight === "heavy" ? rand(660, 820) : rand(540, 700)
    );
    const delayMs = Math.max(15, Math.min(baseDelays[i], 1015 - durationMs));
    const travelVh = Math.round(rand(52, 88));
    const swayPx = Math.round(rand(-38, 38));
    const overshootPx = Math.round(rand(10, 18));

    const rotStart = Math.round(rand(-44, 44));
    const rotSettle = Math.round(rand(-16, 16));
    const rotFloat = Math.round(rotSettle + rand(-9, 9));

    results.push({
      ...food,
      group,
      depth,
      x: Number(chosen.x.toFixed(2)),
      y: Number(chosen.y.toFixed(2)),
      delayMs,
      durationMs,
      travelVh,
      swayPx,
      overshootPx,
      scale,
      rotStart,
      rotSettle,
      rotFloat,
      mobileHide: groupIdx >= 4,
    });
  }

  return { foods: results, zoomBoost };
}

export function normalizeMajorPath(rawHref: string): string {
  const withoutHash = rawHref.split("#")[0] || "/";
  const withoutQuery = withoutHash.split("?")[0] || "/";
  const trimmed = withoutQuery.replace(/\/+$/, "");
  return trimmed || "/";
}

export function dispatchMajorPageTransition(rawHref: string, currentPathname: string) {
  if (typeof window === "undefined") return;
  const target = normalizeMajorPath(rawHref);
  const current = normalizeMajorPath(currentPathname);
  if (target === current) return;
  if (!Object.prototype.hasOwnProperty.call(MAJOR_NAV_PAGES, target)) return;

  window.dispatchEvent(
    new CustomEvent("tps1:major-page-transition", {
      detail: { href: target },
    })
  );
}

type TransitionRun = {
  id: number;
  href: string;
  zoomPct: number;
  zoomBoost: number;
  title: string;
  subtitle: string;
  pills: [string, string, string];
  badge: string;
  foods: ScatteredFood[];
};

const DEFAULT_BADGE = "THỰC PHẨM SẠCH SỐ 1 · TƯƠI MỚI MỖI NGÀY";

export function MajorPageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [transition, setTransition] = useState<TransitionRun | null>(null);
  const [pageEntering, setPageEntering] = useState(false);

  const prevPathRef = useRef<string>(normalizeMajorPath(pathname || "/"));
  const lastTriggerRef = useRef<{ href: string; time: number }>({ href: "", time: 0 });
  const timersRef = useRef<number[]>([]);
  const seqRef = useRef(0);

  // Idle preload all 24 static cutout PNGs into browser cache for instant 0ms reveal & 0% server lag
  useEffect(() => {
    const preloadAll = () => {
      FOOD_CUTOUT_POOL.forEach((item) => {
        const img = new window.Image();
        img.decoding = "async";
        img.src = item.src;
      });
    };

    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof win.requestIdleCallback === "function") {
      const idleId = win.requestIdleCallback(preloadAll, { timeout: 2200 });
      return () => {
        if (typeof win.cancelIdleCallback === "function") {
          win.cancelIdleCallback(idleId);
        }
      };
    }

    const timerId = window.setTimeout(preloadAll, 900);
    return () => window.clearTimeout(timerId);
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const runTransition = useCallback(
    (rawHref: string) => {
      const cleanPath = normalizeMajorPath(rawHref);
      if (isMajorPageTransitionSuppressed(cleanPath)) return;
      const meta = MAJOR_NAV_PAGES[cleanPath];
      if (!meta) return;

      const now = Date.now();
      if (
        lastTriggerRef.current.href === cleanPath &&
        now - lastTriggerRef.current.time < 1600
      ) {
        return;
      }

      lastTriggerRef.current = { href: cleanPath, time: now };
      clearTimers();
      seqRef.current += 1;
      const runId = seqRef.current;

      const zoomPct = getEffectiveZoomPercent();
      const { foods, zoomBoost } = generateBoundedRandomPlacements(zoomPct);

      setPageEntering(false);
      setTransition({
        id: runId,
        href: cleanPath,
        zoomPct,
        zoomBoost,
        title: meta.title,
        subtitle: meta.subtitle,
        pills: meta.pills,
        badge: meta.badge ?? DEFAULT_BADGE,
        foods,
      });

      const glideTimer = window.setTimeout(() => {
        setPageEntering(true);
      }, 1020);

      const doneTimer = window.setTimeout(() => {
        setTransition((prev) => (prev && prev.id === runId ? null : prev));
      }, 1540);

      const clearEnterTimer = window.setTimeout(() => {
        setPageEntering(false);
      }, 1580);

      timersRef.current.push(glideTimer, doneTimer, clearEnterTimer);
    },
    [clearTimers]
  );

  useEffect(() => {
    const handleCustomEvent = (ev: Event) => {
      const customEv = ev as CustomEvent<{ href?: string }>;
      if (customEv.detail?.href) {
        runTransition(customEv.detail.href);
      }
    };
    window.addEventListener("tps1:major-page-transition", handleCustomEvent);
    return () => {
      window.removeEventListener("tps1:major-page-transition", handleCustomEvent);
    };
  }, [runTransition]);

  useEffect(() => {
    const nextPath = normalizeMajorPath(pathname || "/");
    const prevPath = prevPathRef.current;
    prevPathRef.current = nextPath;

    if (nextPath === prevPath) return;
    if (!Object.prototype.hasOwnProperty.call(MAJOR_NAV_PAGES, nextPath)) return;

    const id = window.requestAnimationFrame(() => {
      runTransition(nextPath);
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname, runTransition]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  return (
    <>
      {transition && (
        <div
          key={transition.id}
          className="tps1-mpt"
          data-major-transition-href={transition.href}
          data-zoom-pct={transition.zoomPct}
          data-zoom-boost={transition.zoomBoost}
          aria-hidden="true"
        >
          {/* Leading Young-Leaf Horizontal Wave (z-index: 0) */}
          <div className="tps1-mpt__lead">
            <svg
              className="tps1-mpt__lead-wave-left"
              viewBox="0 0 120 1440"
              preserveAspectRatio="none"
            >
              <path
                d="M120,0 L120,1440 L40,1440 C98,1180 10,940 62,720 C108,460 16,220 52,0 Z"
                fill="#a7f3d0"
              />
            </svg>
            <svg
              className="tps1-mpt__lead-wave-right"
              viewBox="0 0 120 1440"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 L68,0 C114,260 22,500 74,720 C118,980 28,1220 76,1440 L0,1440 Z"
                fill="#10b981"
              />
            </svg>
          </div>

          {/* Main Porcelain & Fresh Mint Studio Light Curtain (z-index: 1) */}
          <div className="tps1-mpt__curtain">
            <svg
              className="tps1-mpt__wave-left"
              viewBox="0 0 120 1440"
              preserveAspectRatio="none"
            >
              <path
                d="M120,0 L120,1440 L48,1440 C104,1200 18,960 66,720 C112,480 22,240 58,0 Z"
                fill="#f9fdfb"
              />
            </svg>

            <svg
              className="tps1-mpt__wave-right"
              viewBox="0 0 120 1440"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 L62,0 C108,240 16,480 68,720 C114,960 20,1200 72,1440 L0,1440 Z"
                fill="#e0f5ea"
              />
            </svg>

            {/* 2 Subtle Silk Emerald Wave Lines for Artistic Studio Depth */}
            <svg
              className="tps1-mpt__silk-lines"
              viewBox="0 0 1440 900"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M-60,260 C240,140 520,380 860,230 C1120,115 1310,270 1500,190"
                stroke="#059669"
                strokeOpacity="0.06"
                strokeWidth="3"
              />
              <path
                d="M-60,670 C280,550 580,780 940,620 C1180,515 1340,690 1500,610"
                stroke="#059669"
                strokeOpacity="0.06"
                strokeWidth="3"
              />
            </svg>
          </div>

          {/* 2-Layer Decoupled Food Physics Stage (12 / 18 / 24 unique real cutouts by zoom level) */}
          <div className="tps1-mpt__foods">
            {transition.foods.map((food) => (
              <div
                key={food.id}
                className={`tps1-mpt__food-carrier tps1-mpt__food--${food.group} tps1-mpt__food--${food.depth}${food.mobileHide ? " tps1-mpt__food--edge" : ""}`}
                data-food-id={food.id}
                data-food-group={food.group}
                data-food-depth={food.depth}
                data-food-x={food.x}
                data-food-y={food.y}
                data-food-delay={food.delayMs}
                data-food-dur={food.durationMs}
                style={{
                  left: `${food.x}%`,
                  top: `${food.y}%`,
                }}
              >
                <div
                  className="tps1-mpt__food-body"
                  style={
                    {
                      "--food-delay": `${food.delayMs}ms`,
                      "--food-dur": `${food.durationMs}ms`,
                      "--travel-y": `${food.travelVh}vh`,
                      "--sway-x": `${food.swayPx}px`,
                      "--overshoot-y": `${food.overshootPx}px`,
                      "--food-scale": food.scale,
                      "--rot-start": `${food.rotStart}deg`,
                      "--rot-settle": `${food.rotSettle}deg`,
                      "--rot-float": `${food.rotFloat}deg`,
                    } as CSSProperties
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={food.src}
                    alt={food.alt}
                    className="tps1-mpt__real-food-img"
                    decoding="sync"
                    fetchPriority="high"
                  />
                  <span className="tps1-mpt__splash-drop tps1-mpt__splash-drop--1" />
                  <span className="tps1-mpt__splash-drop tps1-mpt__splash-drop--2" />
                </div>
              </div>
            ))}
          </div>

          {/* Centerpiece Morning Dew Brand Card Stage (z-index: 4) */}
          <div className="tps1-mpt__center-stage">
            <div className="tps1-mpt__center">
              <div className="tps1-mpt__brand-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brandAssets.logoTransparent}
                  alt="Thực Phẩm Số Một"
                  className="tps1-mpt__logo"
                  width={126}
                  height={40}
                  decoding="sync"
                  fetchPriority="high"
                />

                <div className="tps1-mpt__badge">
                  <span className="tps1-mpt__emblem">
                    <span className="tps1-mpt__emblem-ring" />
                    <Leaf size={13} strokeWidth={2.4} />
                  </span>
                  <span>{transition.badge}</span>
                </div>
              </div>

              <div className="tps1-mpt__title">{transition.title}</div>
              <div className="tps1-mpt__subtitle">{transition.subtitle}</div>

              <div className="tps1-mpt__pills">
                {transition.pills.map((pill, idx) => (
                  <span
                    key={pill}
                    className={`tps1-mpt__pill tps1-mpt__pill--${idx + 1}`}
                  >
                    <span className="tps1-mpt__pill-dot" />
                    <span>{pill}</span>
                  </span>
                ))}
              </div>

              <div className="tps1-mpt__dew-bar">
                <span className="tps1-mpt__dew-bar-fill" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={pageEntering ? "tps1-major-page-enter" : undefined}>{children}</div>
    </>
  );
}
