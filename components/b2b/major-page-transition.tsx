"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Leaf } from "lucide-react";
import { brandAssets } from "@/lib/brand";
import { isMajorPageTransitionSuppressed } from "@/lib/category-transition-config";
import {
  FOOD_CUTOUT_POOL,
  computeTightPackedFoodLayout,
  drawPackedFoodsFrame,
  preloadAllFoodCutouts,
  type RealFoodCutout,
} from "@/lib/food-packing-engine";

export type { RealFoodCutout };
export { FOOD_CUTOUT_POOL };

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
    subtitle: "Da Lat fresh produce, inspected meats & 5,000+ clean food SKUs",
    pills: ["Morning Fresh Produce", "Inspected Meats & Seafood", "Authentic Dry Goods & Spices"],
    badge: "FRESH CLEAN FOOD NO.1 · DAILY HARVEST",
  },
  "/en/ingredients": {
    title: "Industries We Serve",
    subtitle: "Fresh, traceable ingredients tailored to every commercial kitchen model",
    pills: ["Industrial & Factory Canteens", "Schools & Hospitals", "Restaurants & F&B Chains"],
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
  if (window.outerWidth > 0 && window.innerWidth > 0) {
    const ratio = (window.outerWidth / window.innerWidth) * 100;
    if (ratio >= 20 && ratio <= 400 && Math.abs(ratio - 100) > 6) {
      return Math.round(ratio);
    }
  }
  if (window.innerWidth >= 2400) return 60;
  if (window.innerWidth >= 1950) return 75;
  return 100;
}

export function pickUniqueRandomFoods(count = 12): RealFoodCutout[] {
  return shuffle(FOOD_CUTOUT_POOL).slice(0, Math.min(count, FOOD_CUTOUT_POOL.length));
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

type TransitionPhase = "pack" | "disperse";

type TransitionRun = {
  id: number;
  href: string;
  phase: TransitionPhase;
  zoomPct: number;
  title: string;
  subtitle: string;
  pills: [string, string, string];
  badge: string;
};

const DEFAULT_BADGE = "THỰC PHẨM SẠCH SỐ 1 · TƯƠI MỚI MỖI NGÀY";
const PACK_STAGE_MS = 860;
const DISPERSE_DURATION_MS = 640;

export function MajorPageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [transition, setTransition] = useState<TransitionRun | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootMptRef = useRef<HTMLDivElement>(null);
  const prevPathRef = useRef<string>(normalizeMajorPath(pathname || "/"));
  const lastTriggerRef = useRef<{ href: string; time: number }>({ href: "", time: 0 });
  const timersRef = useRef<number[]>([]);
  const rafRef = useRef<number>(0);
  const seqRef = useRef(0);

  // Defer preloading & baking 27 food cutouts until AFTER the homepage Logo Intro finishes
  // so 27 canvas shadowBlur bakes never compete with the Phase 1 Logo Intro animation on page load!
  useEffect(() => {
    let timerId = 0;
    const startPreload = () => {
      window.clearTimeout(timerId);
      preloadAllFoodCutouts();
    };

    if (document.documentElement.classList.contains("tps1-intro-docking")) {
      window.addEventListener("tps1-intro-finished", startPreload, { once: true });
      timerId = window.setTimeout(startPreload, 2600);
      return () => {
        window.removeEventListener("tps1-intro-finished", startPreload);
        window.clearTimeout(timerId);
      };
    }

    timerId = window.setTimeout(startPreload, 400);
    return () => window.clearTimeout(timerId);
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const runTransition = useCallback(
    (rawHref: string) => {
      const cleanPath = normalizeMajorPath(rawHref);
      if (isMajorPageTransitionSuppressed(cleanPath)) return;
      const meta = MAJOR_NAV_PAGES[cleanPath];
      if (!meta) return;

      const now = Date.now();
      if (lastTriggerRef.current.href === cleanPath && now - lastTriggerRef.current.time < 1600) {
        return;
      }

      lastTriggerRef.current = { href: cleanPath, time: now };
      clearTimers();
      seqRef.current += 1;
      const runId = seqRef.current;

      setTransition({
        id: runId,
        href: cleanPath,
        phase: "pack",
        zoomPct: getEffectiveZoomPercent(),
        title: meta.title,
        subtitle: meta.subtitle,
        pills: meta.pills,
        badge: meta.badge ?? DEFAULT_BADGE,
      });

      // Failsafe unmount
      const safetyTimer = window.setTimeout(() => {
        setTransition((prev) => (prev && prev.id === runId ? null : prev));
      }, PACK_STAGE_MS + DISPERSE_DURATION_MS + 650);
      timersRef.current.push(safetyTimer);
    },
    [clearTimers]
  );

  const activeRunId = transition?.id ?? null;
  const activeZoomPct = transition?.zoomPct ?? 100;

  // Phase 1 (0ms -> 860ms): Full-viewport 3-Tier Tight Packing Elastic Pop-In -> Phase 2 (860ms -> 1500ms): Card exits first, then In-Place Circular Wave Reveal
  useEffect(() => {
    if (activeRunId === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const runId = activeRunId;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // Cap DPR cleanly (1.25 Desktop / 1.5 Mobile) to eliminate redundant fill-rate overdraw on large screens
    const dpr = Math.min(window.devicePixelRatio || 1, vw >= 1024 ? 1.25 : 1.5);

    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);

    const pieces = computeTightPackedFoodLayout(vw, vh, activeZoomPct);
    const startMs = performance.now();
    let dispersed = false;
    let frozenStaticFrame = false;

    if (rootMptRef.current) {
      rootMptRef.current.dataset.mptPieces = String(pieces.length);
      rootMptRef.current.dataset.mptDrawn = "0";
    }

    const triggerDisperse = () => {
      if (dispersed) return;
      dispersed = true;

      if (!frozenStaticFrame) {
        drawPackedFoodsFrame(ctx, vw, vh, dpr, pieces, PACK_STAGE_MS, { instantReveal: true });
      }

      setTransition((prev) => (prev && prev.id === runId ? { ...prev, phase: "disperse" } : prev));

      const disperseStartMs = performance.now();
      const tickDisperse = (nowMs: number) => {
        const dispElapsed = nowMs - disperseStartMs;
        const res = drawPackedFoodsFrame(ctx, vw, vh, dpr, pieces, PACK_STAGE_MS, {
          mode: "disperse",
          disperseElapsedMs: dispElapsed,
        });
        if (rootMptRef.current) {
          rootMptRef.current.dataset.mptDrawn = String(res.visibleCount);
        }
        if (dispElapsed >= DISPERSE_DURATION_MS || res.allSettled) {
          setTransition((prev) => (prev && prev.id === runId ? null : prev));
          return;
        }
        rafRef.current = window.requestAnimationFrame(tickDisperse);
      };
      rafRef.current = window.requestAnimationFrame(tickDisperse);
    };

    const tick = (nowMs: number) => {
      const elapsed = nowMs - startMs;

      if (elapsed >= PACK_STAGE_MS) {
        triggerDisperse();
        return;
      }

      if (!frozenStaticFrame) {
        const res = drawPackedFoodsFrame(ctx, vw, vh, dpr, pieces, elapsed);
        if (rootMptRef.current) {
          rootMptRef.current.dataset.mptDrawn = String(res.visibleCount);
        }
        if (res.allSettled && res.visibleCount === pieces.length) {
          frozenStaticFrame = true;
          rafRef.current = 0;
          const remaining = Math.max(0, PACK_STAGE_MS - elapsed);
          const waitTimer = window.setTimeout(triggerDisperse, remaining);
          timersRef.current.push(waitTimer);
          return;
        }
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };
  }, [activeRunId, activeZoomPct]);

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
          ref={rootMptRef}
          key={transition.id}
          className="tps1-mpt"
          data-major-transition-href={transition.href}
          data-mpt-phase={transition.phase}
          data-zoom-pct={transition.zoomPct}
          aria-hidden="true"
        >
          <div className={`tps1-mpt__stage${transition.phase === "disperse" ? " is-dispersing" : ""}`}>
            {/* Deep Forest Emerald Backdrop Curtain (z-index: 1) */}
            <div className="tps1-mpt__curtain" />

            {/* 60fps Retina 2D Tightly-Packed Food Pop-In & Circular Dispersal Canvas Layer (z-index: 4) */}
            <canvas ref={canvasRef} className="tps1-mpt__physics-canvas" />

            {/* Centerpiece TPS1 Target Card floating cleanly on Top (z-index: 6) */}
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
                    <span key={pill} className={`tps1-mpt__pill tps1-mpt__pill--${idx + 1}`}>
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
        </div>
      )}

      {children}
    </>
  );
}
