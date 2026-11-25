"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const LOGO_SRC = "/images/tps1-logo-transparent.png";
const LOGO_NATURAL_W = 1024;
const LOGO_NATURAL_H = 366;
const LOGO_ASPECT = LOGO_NATURAL_H / LOGO_NATURAL_W;
const SPLIT_RATIO = 0.261;
const EMBLEM_CENTER_RATIO = 0.1548;

type IntroPhase =
  | "idle"
  | "emblem"
  | "wordmark"
  | "medals"
  | "converge"
  | "docking"
  | "skipping"
  | "merged"
  | "done";

type RectBox = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type MedalSlot = {
  id: string;
  label: string;
  image: string;
  accent: "emerald" | "orange";
  baseAngleDeg: number;
};

type StageMetrics = {
  vw: number;
  vh: number;
  stageScale: number;
  stageW: number;
  stageH: number;
  emblemW: number;
  wordmarkW: number;
  stageLeft: number;
  stageTop: number;
  emblemStartX: number;
  taglineTop: number;
  taglineMaxW: number;
  pillsTop: number;
  pillsMaxW: number;
  baseTaglineMaxW: number;
  basePillsMaxW: number;
  progressTop: number;
  estCenterMetaH: number;
  visualLogoTopOffset: number;
  visualLogoBottomOffset: number;
  metaGap: number;
  isMobile: boolean;
  isTablet: boolean;
  medalSize: number;
  orbitCenterX: number;
  orbitCenterY: number;
  orbitR: number;
  orbitRx: number;
  orbitRy: number;
  logoCenterX: number;
  logoCenterY: number;
  slots: MedalSlot[];
  target: RectBox;
};

const LEFT_WALL_COL_A = [
  "/images/intro/wall-produce.webp",
  "/images/intro/wall-seafood.webp",
  "/images/intro/wall-spices.webp",
  "/images/intro/wall-veggies.webp",
];

const LEFT_WALL_COL_B = [
  "/images/intro/wall-meat.webp",
  "/images/intro/wall-frozen.webp",
  "/images/intro/wall-vegan.webp",
  "/images/intro/wall-produce.webp",
];

const RIGHT_WALL_COL_A = [
  "/images/intro/wall-truck.webp",
  "/images/intro/wall-warehouse.webp",
  "/images/intro/wall-restaurant.webp",
  "/images/intro/wall-catering.webp",
];

const RIGHT_WALL_COL_B = [
  "/images/intro/wall-loading.webp",
  "/images/intro/wall-canteen.webp",
  "/images/intro/wall-school.webp",
  "/images/intro/wall-truck.webp",
];

const MOBILE_TOP_STRIP = [
  "/images/intro/wall-produce.webp",
  "/images/intro/wall-meat.webp",
  "/images/intro/wall-seafood.webp",
  "/images/intro/wall-frozen.webp",
  "/images/intro/wall-spices.webp",
  "/images/intro/wall-vegan.webp",
];

const MOBILE_BOTTOM_STRIP = [
  "/images/intro/wall-truck.webp",
  "/images/intro/wall-loading.webp",
  "/images/intro/wall-warehouse.webp",
  "/images/intro/wall-canteen.webp",
  "/images/intro/wall-restaurant.webp",
  "/images/intro/wall-school.webp",
];

const MEDALLIONS: Array<{
  id: string;
  label: string;
  image: string;
  accent: "emerald" | "orange";
}> = [
  {
    id: "produce",
    label: "Rau củ quả Đà Lạt",
    image: "/images/intro/medal-produce.webp",
    accent: "emerald",
  },
  {
    id: "meat",
    label: "Thịt heo và thịt bò",
    image: "/images/intro/medal-meat.webp",
    accent: "orange",
  },
  {
    id: "seafood",
    label: "Thủy hải sản mỗi ngày",
    image: "/images/intro/medal-seafood.webp",
    accent: "emerald",
  },
  {
    id: "frozen",
    label: "Hàng đông lạnh chuẩn kho lạnh",
    image: "/images/intro/medal-frozen.webp",
    accent: "emerald",
  },
  {
    id: "spices",
    label: "Gia vị và đồ khô",
    image: "/images/intro/medal-spices.webp",
    accent: "orange",
  },
  {
    id: "vegan",
    label: "Thực phẩm chay",
    image: "/images/intro/medal-vegan.webp",
    accent: "emerald",
  },
];

const TRUST_PILLS = [
  { id: "iso", label: "Chuẩn ISO 22000:2018 & HACCP" },
  { id: "sku", label: "5.000+ Mặt hàng tươi sạch" },
  { id: "ontime", label: "Giao đúng giờ mở bếp" },
];

// 12 micro-leaves & golden/emerald light sparks floating around the sprouting canopy in Phase 1 (0.26s–0.90s)
const CANOPY_PARTICLES: Array<{
  id: string;
  kind: "leaf" | "spark";
  dx: string;
  dy: string;
  rot: string;
  delay: string;
  size: number;
  color: string;
}> = [
  { id: "cp01", kind: "leaf", dx: "-52px", dy: "-80px", rot: "-32deg", delay: "0.04s", size: 12, color: "#00a651" },
  { id: "cp02", kind: "leaf", dx: "54px", dy: "-86px", rot: "28deg", delay: "0.05s", size: 11, color: "#10b981" },
  { id: "cp03", kind: "spark", dx: "-24px", dy: "-104px", rot: "0deg", delay: "0.07s", size: 7, color: "#f5c84c" },
  { id: "cp04", kind: "leaf", dx: "28px", dy: "-98px", rot: "22deg", delay: "0.08s", size: 10, color: "#00a651" },
  { id: "cp05", kind: "spark", dx: "-72px", dy: "-52px", rot: "0deg", delay: "0.09s", size: 6, color: "#34d399" },
  { id: "cp06", kind: "leaf", dx: "74px", dy: "-58px", rot: "38deg", delay: "0.11s", size: 10, color: "#f37021" },
  { id: "cp07", kind: "spark", dx: "4px", dy: "-114px", rot: "0deg", delay: "0.12s", size: 8, color: "#f5c84c" },
  { id: "cp08", kind: "leaf", dx: "-44px", dy: "-108px", rot: "-24deg", delay: "0.13s", size: 9, color: "#34d399" },
  { id: "cp09", kind: "spark", dx: "60px", dy: "-26px", rot: "0deg", delay: "0.15s", size: 7, color: "#f37021" },
  { id: "cp10", kind: "spark", dx: "-64px", dy: "-22px", rot: "0deg", delay: "0.16s", size: 6, color: "#f5c84c" },
  { id: "cp11", kind: "leaf", dx: "42px", dy: "-110px", rot: "18deg", delay: "0.17s", size: 9, color: "#00a651" },
  { id: "cp12", kind: "spark", dx: "-14px", dy: "-86px", rot: "0deg", delay: "0.18s", size: 6, color: "#10b981" },
];

const SPEED_STREAKS = [
  { id: "st1", top: "18%", dir: -1, delay: "0.02s", width: "26vw" },
  { id: "st2", top: "34%", dir: 1, delay: "0.06s", width: "32vw" },
  { id: "st3", top: "52%", dir: -1, delay: "0.04s", width: "28vw" },
  { id: "st4", top: "68%", dir: 1, delay: "0.08s", width: "30vw" },
  { id: "st5", top: "82%", dir: -1, delay: "0.10s", width: "24vw" },
];

let hasPlayedInSpaSession = false;

function measureHeaderLogoTarget(vw: number): RectBox {
  const imgEl = document.querySelector<HTMLElement>(".site-header .site-brand__mark img");
  const markEl = document.querySelector<HTMLElement>(".site-header .site-brand__mark");
  const el = imgEl ?? markEl;

  if (el) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 20 && rect.height > 10) {
      const naturalH = rect.width * LOGO_ASPECT;
      const topAdjust = imgEl ? rect.top : rect.top + (rect.height - naturalH) / 2;
      return {
        left: rect.left,
        top: topAdjust,
        width: rect.width,
        height: imgEl ? rect.height : naturalH,
      };
    }
  }

  const fallbackW = vw <= 480 ? 108 : vw <= 768 ? 114 : 158;
  return {
    left: vw <= 768 ? 16 : 32,
    top: 44,
    width: fallbackW,
    height: fallbackW * LOGO_ASPECT,
  };
}

function computeStageMetrics(): StageMetrics {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isCoarsePointer =
    typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
  const isSmallPhysicalScreen =
    (window.screen && window.screen.width > 0 && window.screen.width < 768) ||
    (window.outerWidth > 0 && window.outerWidth < 768);
  const isMobile = (vw <= 640 && (isCoarsePointer || isSmallPhysicalScreen)) || vw < 480;
  const isTablet =
    !isMobile &&
    vw <= 900 &&
    (isCoarsePointer || (window.outerWidth > 0 && window.outerWidth <= 960));

  let stageScale: number;
  let orbitR: number;
  let stageW: number;
  let medalSize: number;
  let metaGap: number;
  let baseTaglineMaxW: number;
  let basePillsMaxW: number;
  let baseMetaH: number;

  if (isMobile) {
    stageScale = Number(Math.min(vw / 390, (vh * 0.72) / 560).toFixed(4));
    orbitR = Math.round(138 * stageScale);
    stageW = Math.round(176 * stageScale);
    medalSize = Math.round(56 * stageScale);
    metaGap = Math.round(8 * stageScale);
    baseTaglineMaxW = 280;
    basePillsMaxW = 290;
    baseMetaH = 142;
  } else if (isTablet) {
    stageScale = Number(Math.min(vw / 820, vh / 960).toFixed(4));
    orbitR = Math.round(220 * stageScale);
    stageW = Math.round(238 * stageScale);
    medalSize = Math.round(80 * stageScale);
    metaGap = Math.round(9 * stageScale);
    baseTaglineMaxW = 368;
    basePillsMaxW = 260;
    baseMetaH = 110;
  } else {
    stageScale = Number(Math.min(vh / 864, vw / 1536).toFixed(4));
    orbitR = Math.round(256 * stageScale);
    stageW = Math.round(284 * stageScale);
    medalSize = Math.round(96 * stageScale);
    metaGap = Math.round(9 * stageScale);
    baseTaglineMaxW = 368;
    basePillsMaxW = 260;
    baseMetaH = 110;
  }

  const stageH = Math.round(stageW * LOGO_ASPECT);
  const emblemW = stageW * SPLIT_RATIO;
  const wordmarkW = stageW - emblemW;
  const stageLeft = (vw - stageW) / 2;

  const orbitCenterX = Math.round(vw / 2);
  const orbitCenterY = Math.round(vh / 2);
  const visualLogoTopOffset = Math.round(stageH * 0.155);
  const visualLogoBottomOffset = Math.round(stageH * 0.78);
  const visualLogoH = visualLogoBottomOffset - visualLogoTopOffset;
  const estCenterMetaH = Math.round(baseMetaH * stageScale);
  const visualCenterH = visualLogoH + metaGap + estCenterMetaH;

  const desiredVisualTop = Math.round(orbitCenterY - visualCenterH / 2);
  const stageTop = desiredVisualTop - visualLogoTopOffset;
  const taglineTop = Math.round(stageTop + visualLogoBottomOffset + metaGap);
  const logoCenterX = Math.round(stageLeft + stageW / 2);
  const logoCenterY = Math.round(stageTop + (visualLogoTopOffset + visualLogoBottomOffset) / 2);

  const emblemStartX = vw / 2 - EMBLEM_CENTER_RATIO * stageW;
  const taglineMaxW = Math.round(baseTaglineMaxW * stageScale);
  const pillsTop = 0;
  const pillsMaxW = Math.round(basePillsMaxW * stageScale);
  const progressTop = 0;

  const orbitRx = orbitR;
  const orbitRy = orbitR;

  const slots: MedalSlot[] = MEDALLIONS.map((m, idx) => ({
    ...m,
    baseAngleDeg: idx * 60 - 60,
  }));

  return {
    vw,
    vh,
    stageScale,
    stageW,
    stageH,
    emblemW,
    wordmarkW,
    stageLeft,
    stageTop,
    emblemStartX,
    taglineTop,
    taglineMaxW,
    pillsTop,
    pillsMaxW,
    baseTaglineMaxW,
    basePillsMaxW,
    progressTop,
    estCenterMetaH,
    visualLogoTopOffset,
    visualLogoBottomOffset,
    metaGap,
    isMobile,
    isTablet,
    medalSize,
    orbitCenterX,
    orbitCenterY,
    orbitR,
    orbitRx,
    orbitRy,
    logoCenterX,
    logoCenterY,
    slots,
    target: measureHeaderLogoTarget(vw),
  };
}

function warmDecodeAssets(): void {
  const urls = [LOGO_SRC, ...MEDALLIONS.map((m) => m.image)];
  urls.forEach((src) => {
    const img = new window.Image();
    img.src = src;
    if (typeof img.decode === "function") {
      img.decode().catch(() => {});
    }
  });
}

function sampleOrbitPose(
  startRad: number,
  orbitCenterX: number,
  orbitCenterY: number,
  orbitR: number,
  logoCenterX: number,
  logoCenterY: number,
  t: number
): { transform: string; opacity: number } {
  const totalSpinRad = Math.PI * 0.44; // ~80 độ: trôi vòng tròn chậm rãi, sang trọng
  let radiusFactor = 1;
  let cx = orbitCenterX;
  let cy = orbitCenterY;
  let scale = 1;
  let opacity = 1;

  if (t <= 0.16) {
    const p = t / 0.16;
    const easeOutCubic = 1 - Math.pow(1 - p, 3);
    radiusFactor = 0.9 + 0.1 * easeOutCubic;
    scale = 0.76 + 0.24 * easeOutCubic;
    opacity = p;
  } else if (t > 0.7) {
    const c = (t - 0.7) / 0.3;
    const pull = Math.min(1, c / 0.8);
    const easeInOutPull = pull < 0.5 ? 2 * pull * pull : 1 - Math.pow(-2 * pull + 2, 2) / 2;
    radiusFactor = Math.max(0, 1 - easeInOutPull);
    cx = orbitCenterX + (logoCenterX - orbitCenterX) * easeInOutPull;
    cy = orbitCenterY + (logoCenterY - orbitCenterY) * easeInOutPull;
    scale = 1 - 0.86 * Math.pow(c, 1.6);
    opacity = t >= 0.91 ? 0 : c < 0.45 ? 1 : Math.max(0, 1 - (c - 0.45) / 0.25);
  }

  const spinProgress = 0.78 * t + 0.22 * (t * t);
  const theta = startRad + totalSpinRad * spinProgress;
  const r = orbitR * radiusFactor;
  const x = cx + Math.cos(theta) * r;
  const y = cy + Math.sin(theta) * r;

  return {
    transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
    opacity: Number(opacity.toFixed(3)),
  };
}

function dispatchIntroFinished() {
  window.dispatchEvent(new Event("tps1-intro-finished"));
}

function WallCard({ src }: { src: string }) {
  return (
    <div className="tps1-intro__wall-card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={360}
        height={450}
        decoding="async"
        className="tps1-intro__wall-img"
      />
    </div>
  );
}

export function HomeIntroLoader() {
  const [phase, setPhase] = useState<IntroPhase>("idle");
  const [metrics, setMetrics] = useState<StageMetrics | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const centerMetaRef = useRef<HTMLDivElement>(null);
  const medalAnchorRefs = useRef<Array<HTMLDivElement | null>>([]);
  const orbitAnimsRef = useRef<Animation[]>([]);
  const orbitLaunchedRef = useRef(false);
  const finishedDispatchedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const phaseRef = useRef<IntroPhase>("idle");

  const setPhaseSync = useCallback((next: IntroPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const stopOrbitAnimations = useCallback(() => {
    orbitAnimsRef.current.forEach((anim) => {
      try {
        anim.cancel();
      } catch {
        // ignore animation cancel errors
      }
    });
    orbitAnimsRef.current = [];
    medalAnchorRefs.current.forEach((el) => {
      if (el) {
        el.style.opacity = "0";
      }
    });
  }, []);

  const cleanupDom = useCallback(() => {
    document.documentElement.classList.remove("tps1-intro-docking");
    document.body.style.overflow = "";
  }, []);

  const accelerateWallScroll = useCallback((rate: number) => {
    const root = rootRef.current;
    if (!root) return;
    const tracks = root.querySelectorAll<HTMLElement>(".tps1-intro__wall-track");
    tracks.forEach((track) => {
      if (typeof track.getAnimations === "function") {
        track.getAnimations().forEach((anim) => {
          try {
            anim.updatePlaybackRate(rate);
          } catch {
            // ignore unsupported playback rate changes
          }
        });
      }
    });
  }, []);

  const finishImmediately = useCallback(() => {
    hasPlayedInSpaSession = true;
    clearTimers();
    stopOrbitAnimations();
    cleanupDom();
    setPhaseSync("done");
  }, [clearTimers, cleanupDom, setPhaseSync, stopOrbitAnimations]);

  const triggerSkip = useCallback(() => {
    const current = phaseRef.current;
    if (current === "idle" || current === "done" || current === "merged" || current === "skipping") {
      return;
    }
    hasPlayedInSpaSession = true;
    clearTimers();
    stopOrbitAnimations();
    setPhaseSync("skipping");

    const tMerge = window.setTimeout(() => {
      document.documentElement.classList.remove("tps1-intro-docking");
      setPhaseSync("merged");
    }, 220);

    const tDone = window.setTimeout(() => {
      cleanupDom();
      setPhaseSync("done");
    }, 420);

    timersRef.current.push(tMerge, tDone);
  }, [clearTimers, cleanupDom, setPhaseSync, stopOrbitAnimations]);

  useLayoutEffect(() => {
    if (phase !== "done" || finishedDispatchedRef.current) return;
    finishedDispatchedRef.current = true;
    dispatchIntroFinished();
  }, [phase]);

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forceIntro = params.get("intro") === "1";

    if (hasPlayedInSpaSession && !forceIntro) {
      if (!finishedDispatchedRef.current) {
        finishedDispatchedRef.current = true;
        dispatchIntroFinished();
      }
      return;
    }

    let cancelled = false;
    orbitLaunchedRef.current = false;
    finishedDispatchedRef.current = false;

    document.documentElement.classList.add("tps1-intro-docking");
    document.body.style.overflow = "hidden";
    warmDecodeAssets();

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timersRef.current.push(id);
    };

    let raf1 = 0;
    let raf2 = 0;

    // Failsafe cứng: 5200ms
    schedule(() => {
      finishImmediately();
    }, 5200);

    schedule(() => {
      const initialMetrics = computeStageMetrics();
      setMetrics(initialMetrics);
      // Nhịp 1 (0ms -> 680ms): Biểu tượng lá & vòng cung cam nảy mầm tại tâm (xong sạch trước 600ms, 80ms nhịp dừng)
      setPhaseSync("emblem");

      // Bắt đầu đếm nhịp 2..5 ngay sau khi khung hình đầu tiên của Nhịp 1 được paint xong,
      // tránh trình duyệt hydrate/paint trễ làm hụt thời lượng Nhịp 1 hoặc dồn CSS sang Nhịp 2.
      raf1 = window.requestAnimationFrame(() => {
        if (cancelled) return;
        raf2 = window.requestAnimationFrame(() => {
          if (cancelled) return;

          // Nhịp 2 (680ms -> 1360ms): Emblem trượt trái + mở chữ + Khẩu hiệu + 3 viên thuốc (xong sạch ở 1200ms, 160ms nhịp dừng)
          schedule(() => {
            setPhaseSync("wordmark");
          }, 680);

          // Nhịp 3 (1360ms -> 2520ms, 1160ms): 6 icon tròn xuất hiện trên đường tròn, quay chậm rồi xoắn ốc gộp vào tâm Logo
          schedule(() => {
            setPhaseSync("medals");
          }, 1360);

          // Beat 3.3 (2170ms -> 2520ms): 6 icon tròn thu xoắn ốc gộp vào tâm Logo + phát sóng xung kích kép (tắt sạch ở ~2415–2520ms)
          schedule(() => {
            setPhaseSync("converge");
            accelerateWallScroll(2.6);
          }, 2170);

          // Nhịp 4 (2520ms -> 2910ms): Tường ảnh mở ra + Logo bay lên góc trái Header
          schedule(() => {
            setPhaseSync("docking");
          }, 2520);

          // Nhịp 5a (2910ms): Khớp 0px vào Header + xung sáng
          schedule(() => {
            hasPlayedInSpaSession = true;
            document.documentElement.classList.remove("tps1-intro-docking");
            setPhaseSync("merged");
          }, 2910);

          // Nhịp 5b (3050ms ~ 3.0s): Hoàn tất & mở khóa trang
          schedule(() => {
            hasPlayedInSpaSession = true;
            cleanupDom();
            setPhaseSync("done");
          }, 3050);
        });
      });
    }, 0);

    return () => {
      cancelled = true;
      if (raf1) window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
      clearTimers();
      stopOrbitAnimations();
      cleanupDom();
    };
  }, [accelerateWallScroll, clearTimers, cleanupDom, finishImmediately, setPhaseSync, stopOrbitAnimations]);

  // Auto-calibrate center cluster vertical symmetry inside orbit circle from real rendered DOM height
  useLayoutEffect(() => {
    if (!metrics || !centerMetaRef.current || phase === "idle" || phase === "done") return;
    const actualMetaH = Math.round(centerMetaRef.current.getBoundingClientRect().height);
    if (actualMetaH <= 20 || Math.abs(actualMetaH - metrics.estCenterMetaH) <= 2) return;

    setMetrics((prev) => {
      if (!prev || Math.abs(actualMetaH - prev.estCenterMetaH) <= 2) return prev;
      const visualLogoH = prev.visualLogoBottomOffset - prev.visualLogoTopOffset;
      const visualCenterH = visualLogoH + prev.metaGap + actualMetaH;
      const desiredVisualTop = Math.round(prev.orbitCenterY - visualCenterH / 2);
      const nextStageTop = desiredVisualTop - prev.visualLogoTopOffset;
      const nextTaglineTop = Math.round(nextStageTop + prev.visualLogoBottomOffset + prev.metaGap);
      const nextLogoCenterY = Math.round(
        nextStageTop + (prev.visualLogoTopOffset + prev.visualLogoBottomOffset) / 2,
      );
      return {
        ...prev,
        estCenterMetaH: actualMetaH,
        stageTop: nextStageTop,
        taglineTop: nextTaglineTop,
        logoCenterY: nextLogoCenterY,
      };
    });
  }, [metrics, phase]);

  // Launch continuous 1350ms GPU WAAPI circular-orbit -> spiral-convergence keyframes once Phase 3 starts
  useLayoutEffect(() => {
    if (!metrics) return;

    if (phase === "docking" || phase === "merged" || phase === "skipping" || phase === "done") {
      stopOrbitAnimations();
      return;
    }

    if (phase !== "medals" || orbitLaunchedRef.current) return;
    orbitLaunchedRef.current = true;
    stopOrbitAnimations();

    const { orbitCenterX, orbitCenterY, orbitR, logoCenterX, logoCenterY, slots } = metrics;
    const anims: Animation[] = [];
    const launchedAt = performance.now();
    let pendingReady = 0;
    let fallbackRafId = 0;

    void rootRef.current?.offsetHeight;

    slots.forEach((slot, idx) => {
      const el = medalAnchorRefs.current[idx];
      if (!el || typeof el.animate !== "function") return;

      const startRad = (slot.baseAngleDeg * Math.PI) / 180;
      const keyframes: Keyframe[] = [];

      for (let step = 0; step < 28; step++) {
        const t = step / 27;
        const pose = sampleOrbitPose(
          startRad,
          orbitCenterX,
          orbitCenterY,
          orbitR,
          logoCenterX,
          logoCenterY,
          t
        );
        keyframes.push({
          offset: Number(t.toFixed(4)),
          transform: pose.transform,
          opacity: pose.opacity,
        });
      }

      const anim = el.animate(keyframes, {
        duration: 1160,
        easing: "linear",
        fill: "forwards",
      });
      pendingReady += 1;
      void anim.ready
        .then(() => {
          pendingReady = Math.max(0, pendingReady - 1);
          if (pendingReady === 0 && fallbackRafId) {
            window.cancelAnimationFrame(fallbackRafId);
            fallbackRafId = 0;
          }
          if (anim.playState !== "running") return;
          const drift = performance.now() - launchedAt;
          if (drift > 16 && drift < 1100) {
            anim.currentTime = drift;
          }
        })
        .catch(() => {
          pendingReady = Math.max(0, pendingReady - 1);
        });
      anims.push(anim);
    });

    // While Chromium waits for first-paint compositor .ready on cold loads, keep medals moving on wall time
    const tickPreReady = () => {
      if (pendingReady <= 0 || (phaseRef.current !== "medals" && phaseRef.current !== "converge")) {
        fallbackRafId = 0;
        return;
      }
      const t = Math.max(0, Math.min(1, (performance.now() - launchedAt) / 1160));
      slots.forEach((slot, idx) => {
        const el = medalAnchorRefs.current[idx];
        if (!el) return;
        const startRad = (slot.baseAngleDeg * Math.PI) / 180;
        const pose = sampleOrbitPose(
          startRad,
          orbitCenterX,
          orbitCenterY,
          orbitR,
          logoCenterX,
          logoCenterY,
          t
        );
        el.style.transform = pose.transform;
        el.style.opacity = String(pose.opacity);
      });
      fallbackRafId = window.requestAnimationFrame(tickPreReady);
    };
    fallbackRafId = window.requestAnimationFrame(tickPreReady);

    orbitAnimsRef.current = anims;
    return () => {
      if (fallbackRafId) window.cancelAnimationFrame(fallbackRafId);
    };
  }, [metrics, phase, stopOrbitAnimations]);

  useEffect(() => {
    if (phase === "idle" || phase === "done") return;

    const handleResize = () => {
      setMetrics(computeStageMetrics());
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") triggerSkip();
    };
    const handleVisibility = () => {
      if (!rootRef.current) return;
      rootRef.current.classList.toggle("tps1-intro--paused", document.hidden);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [phase, triggerSkip]);

  if (phase === "idle" || phase === "done" || !metrics) {
    return null;
  }

  const {
    vw,
    vh,
    stageScale,
    stageW,
    stageH,
    emblemW,
    wordmarkW,
    stageLeft,
    stageTop,
    emblemStartX,
    taglineTop,
    pillsTop,
    baseTaglineMaxW,
    basePillsMaxW,
    progressTop,
    isMobile,
    isTablet,
    medalSize,
    orbitCenterX,
    orbitCenterY,
    orbitR,
    logoCenterX,
    logoCenterY,
    slots,
    target,
  } = metrics;

  const dockScale = target.width / stageW;
  const targetWordmarkX = target.left + emblemW * dockScale;

  const isPhase1 = phase === "emblem";
  const isWordmarkVisible = phase !== "emblem";
  const isConverging = phase === "converge";
  const isDocking = phase === "docking" || phase === "merged";
  const isSkipping = phase === "skipping";
  const isMerged = phase === "merged";
  const isCurtainOpen = isDocking || isSkipping;
  const showTagline = phase === "wordmark" || phase === "medals" || phase === "converge";

  // Pure GPU CSS compositor transforms for Emblem & Wordmark
  const emblemX = isPhase1
    ? emblemStartX
    : isDocking || isSkipping
      ? target.left
      : stageLeft;
  const emblemY = isDocking || isSkipping ? target.top : stageTop;
  const emblemScale = isDocking || isSkipping ? dockScale : 1;

  const wordmarkX = isPhase1
    ? stageLeft + emblemW + Math.round(26 * stageScale)
    : isDocking || isSkipping
      ? targetWordmarkX
      : stageLeft + emblemW;
  const wordmarkY = isDocking || isSkipping ? target.top : stageTop;
  const wordmarkScale = isDocking || isSkipping ? dockScale : 1;
  const wordmarkOpacity = isPhase1 ? 0 : 1;

  const orbSize = Math.round(stageW * 0.78);
  const orbX = (isPhase1 ? vw / 2 : stageLeft + emblemW * 0.58) - orbSize / 2;
  const orbY = stageTop + stageH / 2 - orbSize / 2;
  const rippleSize = Math.round(190 * stageScale);
  const rippleHalf = Math.round(rippleSize / 2);

  const partStateClass = isPhase1
    ? "is-phase1"
    : isDocking
      ? "is-docking"
      : isSkipping
        ? "is-skipping"
        : "is-stage";

  // Active constellation lines during Phase 3 dwell (connecting each visible medallion to TPS1 Logo center)
  const showConstellation = phase === "medals" || phase === "converge";

  return (
    <div
      ref={rootRef}
      className="tps1-intro"
      data-intro-phase={phase}
      data-dock-target={`${Math.round(target.left)},${Math.round(target.top)},${Math.round(target.width)},${Math.round(target.height)}`}
      role="dialog"
      aria-modal="true"
      aria-label="Hiệu ứng chào mừng Thực Phẩm Số Một"
    >
      {/* Warm pearl-white luminous backdrop */}
      <div
        className={`tps1-intro__stage-bg${isMerged ? " is-fading" : ""}`}
        aria-hidden="true"
      />

      {/* TWO 3D EDGE PHOTO WALLS */}
      <div
        className={`tps1-intro__walls${isCurtainOpen ? " is-curtain-open" : ""}`}
        aria-hidden="true"
      >
        {isMobile ? (
          <>
            <div className="tps1-intro__hwall tps1-intro__hwall--top" data-wall="top">
              <div className="tps1-intro__wall-track tps1-intro__wall-track--h-ltr">
                {[...MOBILE_TOP_STRIP, ...MOBILE_TOP_STRIP].map((src, i) => (
                  <WallCard key={`mt-${i}`} src={src} />
                ))}
              </div>
              <div className="tps1-intro__wall-fade tps1-intro__wall-fade--top" />
            </div>
            <div className="tps1-intro__hwall tps1-intro__hwall--bottom" data-wall="bottom">
              <div className="tps1-intro__wall-track tps1-intro__wall-track--h-rtl">
                {[...MOBILE_BOTTOM_STRIP, ...MOBILE_BOTTOM_STRIP].map((src, i) => (
                  <WallCard key={`mb-${i}`} src={src} />
                ))}
              </div>
              <div className="tps1-intro__wall-fade tps1-intro__wall-fade--bottom" />
            </div>
          </>
        ) : (
          <>
            <div className="tps1-intro__vwall tps1-intro__vwall--left" data-wall="left">
              <div className="tps1-intro__vwall-cols">
                <div className="tps1-intro__wall-col">
                  <div className="tps1-intro__wall-track tps1-intro__wall-track--v-up">
                    {[...LEFT_WALL_COL_A, ...LEFT_WALL_COL_A].map((src, i) => (
                      <WallCard key={`la-${i}`} src={src} />
                    ))}
                  </div>
                </div>
                {!isTablet && (
                  <div className="tps1-intro__wall-col">
                    <div className="tps1-intro__wall-track tps1-intro__wall-track--v-down">
                      {[...LEFT_WALL_COL_B, ...LEFT_WALL_COL_B].map((src, i) => (
                        <WallCard key={`lb-${i}`} src={src} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="tps1-intro__wall-fade tps1-intro__wall-fade--left" />
            </div>

            <div className="tps1-intro__vwall tps1-intro__vwall--right" data-wall="right">
              <div className="tps1-intro__vwall-cols">
                <div className="tps1-intro__wall-col">
                  <div className="tps1-intro__wall-track tps1-intro__wall-track--v-down">
                    {[...RIGHT_WALL_COL_A, ...RIGHT_WALL_COL_A].map((src, i) => (
                      <WallCard key={`ra-${i}`} src={src} />
                    ))}
                  </div>
                </div>
                {!isTablet && (
                  <div className="tps1-intro__wall-col">
                    <div className="tps1-intro__wall-track tps1-intro__wall-track--v-up">
                      {[...RIGHT_WALL_COL_B, ...RIGHT_WALL_COL_B].map((src, i) => (
                        <WallCard key={`rb-${i}`} src={src} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="tps1-intro__wall-fade tps1-intro__wall-fade--right" />
            </div>
          </>
        )}
      </div>

      {/* Phase 1.1: Emerald Seed Pulse expanding from center stage */}
      {isPhase1 && (
        <div
          className="tps1-intro__seed-pulse"
          style={{
            width: 160,
            height: 160,
            transform: `translate3d(${vw / 2 - 80}px, ${stageTop + stageH / 2 - 80}px, 0)`,
          }}
          aria-hidden="true"
        >
          <span className="tps1-intro__seed-ring tps1-intro__seed-ring--1" />
          <span className="tps1-intro__seed-ring tps1-intro__seed-ring--2" />
        </div>
      )}

      {/* Dual-Layer Emerald-Orange Radiant Halo behind Emblem (0.0000 CLS via GPU translate3d) */}
      <div
        className={`tps1-intro__orb${isCurtainOpen ? " is-hidden" : isPhase1 ? " is-phase1-bloom" : ""}`}
        style={{
          width: orbSize,
          height: orbSize,
          transform: `translate3d(${orbX}px, ${orbY}px, 0)`,
        }}
        aria-hidden="true"
      >
        <span className="tps1-intro__orb-inner tps1-intro__orb-inner--emerald" />
        <span className="tps1-intro__orb-inner tps1-intro__orb-inner--orange" />
      </div>

      {/* Phase 1.2: 12 Floating Micro-Leaves & Golden/Emerald Sparks */}
      {isPhase1 && (
        <div
          className="tps1-intro__particles"
          style={{ transform: `translate3d(${vw / 2}px, ${stageTop + stageH * 0.36}px, 0)` }}
          aria-hidden="true"
        >
          {CANOPY_PARTICLES.map((p) =>
            p.kind === "leaf" ? (
              <svg
                key={p.id}
                viewBox="0 0 16 16"
                width={p.size}
                height={p.size}
                className="tps1-intro__particle"
                style={
                  {
                    "--lp-dx": p.dx,
                    "--lp-dy": p.dy,
                    "--lp-rot": p.rot,
                    animationDelay: p.delay,
                  } as React.CSSProperties
                }
              >
                <path d="M8 1 C12 5 13 10 8 15 C3 10 4 5 8 1 Z" fill={p.color} />
              </svg>
            ) : (
              <span
                key={p.id}
                className="tps1-intro__particle tps1-intro__spark"
                style={
                  {
                    width: p.size,
                    height: p.size,
                    background: p.color,
                    "--lp-dx": p.dx,
                    "--lp-dy": p.dy,
                    "--lp-rot": p.rot,
                    animationDelay: p.delay,
                  } as React.CSSProperties
                }
              />
            ),
          )}
        </div>
      )}

      {/* Phase 3.2: Glowing Dashed Orbital Halo around Logo (scales in during converge) */}
      {showConstellation && (
        <svg
          className={`tps1-intro__constellation${isConverging ? " is-converging" : ""}`}
          viewBox={`0 0 ${vw} ${vh}`}
          width={vw}
          height={vh}
          style={{ transformOrigin: `${orbitCenterX}px ${orbitCenterY}px` }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="tps1-energy-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00a651" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#f37021" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <circle
            cx={orbitCenterX}
            cy={orbitCenterY}
            r={orbitR}
            fill="none"
            stroke="url(#tps1-energy-emerald)"
            strokeWidth={Number((1.8 * stageScale).toFixed(2))}
            strokeLinecap="round"
            strokeDasharray={`${Math.max(3, Math.round(6 * stageScale))} ${Math.max(4, Math.round(8 * stageScale))}`}
            className="tps1-intro__energy-line tps1-intro__orbit-ring"
          />
        </svg>
      )}

      {/* Phase 3.3: Dual Emerald-Orange Energy Convergence Shockwave */}
      {isConverging && (
        <div
          className="tps1-intro__ripple"
          style={{
            width: rippleSize,
            height: rippleSize,
            transform: `translate3d(${logoCenterX - rippleHalf}px, ${logoCenterY - rippleHalf}px, 0)`,
          }}
          aria-hidden="true"
        >
          <span className="tps1-intro__ripple-ring tps1-intro__ripple-ring--emerald" />
          <span className="tps1-intro__ripple-ring tps1-intro__ripple-ring--orange" />
        </div>
      )}

      {/* Phase 4: Horizontal Speed Streaks */}
      {isDocking && !isMerged && (
        <div className="tps1-intro__streaks" aria-hidden="true">
          {SPEED_STREAKS.map((st) => (
            <span
              key={st.id}
              className={`tps1-intro__streak ${st.dir < 0 ? "tps1-intro__streak--left" : "tps1-intro__streak--right"}`}
              style={{ top: st.top, width: st.width, animationDelay: st.delay }}
            />
          ))}
        </div>
      )}

      {/* PHASE 3: 6 SOURCING MEDALLIONS — Circular Orbit -> Spiral Convergence via GPU WAAPI */}
      <div className="tps1-intro__medals-layer">
        {slots.map((slot, idx) => (
          <div
            key={slot.id}
            ref={(el) => {
              medalAnchorRefs.current[idx] = el;
            }}
            data-intro-medal={slot.id}
            className="tps1-intro__medal-anchor"
            style={{
              transform: `translate3d(${orbitCenterX}px, ${orbitCenterY}px, 0) scale(0.01)`,
              opacity: 0,
            }}
          >
            <div className={`tps1-intro__medal tps1-intro__medal--${slot.accent}`}>
              <div
                className="tps1-intro__medal-ring"
                style={{
                  width: medalSize,
                  height: medalSize,
                  borderWidth: `${Math.max(1.5, Number((2.5 * stageScale).toFixed(2)))}px`,
                  padding: `${Math.max(2, Number((3 * stageScale).toFixed(2)))}px`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slot.image}
                  alt={slot.label}
                  width={160}
                  height={160}
                  loading="eager"
                  decoding="sync"
                  className="tps1-intro__medal-img"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LOGO PART 1: EMBLEM CROP BOX (Dual-axis GPU compositor -> curved arc docking!) */}
      <div
        className={`tps1-intro__logo-x tps1-intro__logo-x--emblem ${partStateClass}`}
        style={{
          zIndex: 6,
          transform: `translate3d(${emblemX}px, 0, 0)`,
        }}
      >
        <div
          data-intro-part="emblem"
          className={`tps1-intro__logo-layer tps1-intro__logo-y--emblem ${partStateClass}`}
          style={{
            width: emblemW,
            height: stageH,
            transformOrigin: "top left",
            transform: `translate3d(0, ${emblemY}px, 0) scale(${emblemScale})`,
          }}
        >
          {/* Phase 1.3 Breathing Bloom wrapper (scale 1 -> 1.07 -> 1 at 1.22s–1.48s) */}
          <div className={`tps1-intro__emblem-bloom${isPhase1 ? " is-blooming" : ""}`}>
            <svg
              viewBox="0 0 1024 366"
              className={`tps1-intro__emblem-svg${isPhase1 ? "" : " is-hidden"}`}
              style={{ width: stageW, height: stageH }}
              aria-hidden="true"
            >
              {/* Beat 1.1 (0.0s–0.45s): Center leaf sprouts + luminous emerald outline stroke */}
              <path
                d="M 157 57 C 176 88 182 118 164 152 C 160 160 157 166 156 170 C 154 164 148 152 142 140 C 132 115 140 84 157 57 Z"
                fill="#00a651"
                stroke="#10b981"
                strokeWidth="4.5"
                strokeLinejoin="round"
                pathLength={1}
                className="tps1-intro__leaf-center"
              />
              {/* Beat 1.2 (0.38s–0.92s): Symmetrical left & right leaves unfurl */}
              <path
                d="M 121 95 C 97 122 93 155 113 184 C 127 203 142 215 149 230 C 151 208 148 184 139 160 C 130 137 122 116 121 95 Z"
                fill="#00a651"
                className="tps1-intro__leaf-left"
              />
              <path
                d="M 197 94 C 218 122 221 156 200 185 C 186 204 172 216 166 230 C 164 208 167 184 176 160 C 185 137 195 116 197 94 Z"
                fill="#00a651"
                className="tps1-intro__leaf-right"
              />
              {/* Beat 1.3 (0.82s–1.34s): Luminous orange arc sweeps smoothly around base */}
              <path
                d="M 96.8 155.9 A 83 83 0 1 0 218.2 155.9"
                fill="none"
                stroke="#f37021"
                strokeWidth="19"
                strokeLinecap="butt"
                pathLength={1}
                className="tps1-intro__orange-arc"
              />
            </svg>

            <div
              className={`tps1-intro__crop-inner tps1-intro__emblem-png${isPhase1 ? " is-delayed-reveal" : isMerged ? " is-merged" : " is-visible"}`}
              style={{ width: stageW, height: stageH, left: 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOGO_SRC}
                alt=""
                width={LOGO_NATURAL_W}
                height={LOGO_NATURAL_H}
                decoding="async"
                className="tps1-intro__png-img"
              />
            </div>
          </div>
        </div>
      </div>

      {/* LOGO PART 2: WORDMARK CROP BOX (3D unfold + Dual Metallic Light Sheen + Staggered +150ms curved docking!) */}
      <div
        className={`tps1-intro__logo-x tps1-intro__logo-x--wordmark ${partStateClass}`}
        style={{
          zIndex: 7,
          transform: `translate3d(${wordmarkX}px, 0, 0)`,
          opacity: wordmarkOpacity,
        }}
      >
        <div
          data-intro-part="wordmark"
          className={`tps1-intro__logo-layer tps1-intro__logo-y--wordmark ${partStateClass}`}
          style={{
            width: wordmarkW,
            height: stageH,
            transformOrigin: "top left",
            transform: `translate3d(0, ${wordmarkY}px, 0) scale(${wordmarkScale})`,
          }}
        >
          <div
            className={`tps1-intro__crop-inner tps1-intro__wordmark-3d${isWordmarkVisible && !isCurtainOpen ? " is-unfolded" : ""}${isMerged ? " is-merged" : ""}`}
            style={{ width: stageW, height: stageH, left: -emblemW }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_SRC}
              alt="Thực Phẩm Số Một"
              width={LOGO_NATURAL_W}
              height={LOGO_NATURAL_H}
              decoding="async"
              className="tps1-intro__png-img"
            />
            {isWordmarkVisible && !isCurtainOpen && (
              <span className="tps1-intro__wordmark-sheen tps1-intro__wordmark-sheen--1" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>

      {/* PHASE 2.2: Unified Flex-Column Center Meta (Kinetic Tagline + 3 Micro-Trust Pills + Progress Hairline -> ZERO overlap on any row wrap!) */}
      <div
        ref={centerMetaRef}
        className={`tps1-intro__center-meta${isMobile ? " tps1-intro__center-meta--mobile" : ""}${showTagline ? " is-visible" : ""}`}
        style={{
          top: taglineTop,
          maxWidth: Math.max(baseTaglineMaxW, basePillsMaxW),
          transform: `translate3d(-50%, 0, 0) scale(${stageScale})`,
          transformOrigin: "top center",
        }}
        data-stage-scale={stageScale}
        data-orbit-r={orbitR}
        data-stage-w={stageW}
        data-medal-size={medalSize}
        data-pills-top={pillsTop}
        data-progress-top={progressTop}
      >
        <p className="tps1-intro__tagline" style={{ maxWidth: baseTaglineMaxW }}>
          <span className="tps1-intro__tagline-chunk tps1-intro__tagline-chunk--1">Gửi trọn</span>{" "}
          <span className="tps1-intro__tagline-chunk tps1-intro__tagline-chunk--2">
            <span className="tps1-intro__tagline-accent">
              an tâm
              <span className="tps1-intro__tagline-underline" aria-hidden="true" />
            </span>
          </span>{" "}
          <span className="tps1-intro__tagline-chunk tps1-intro__tagline-chunk--3">trong từng bữa ăn</span>
        </p>

        <div
          className="tps1-intro__trust-pills"
          style={{ maxWidth: basePillsMaxW }}
          aria-label="Bảo chứng chất lượng Thực Phẩm Số Một"
        >
          {TRUST_PILLS.map((pill, idx) => (
            <span
              key={pill.id}
              className={`tps1-intro__trust-pill tps1-intro__trust-pill--${idx + 1}`}
            >
              <CheckCircle2 size={13} className="tps1-intro__trust-icon" aria-hidden="true" />
              <span>{pill.label}</span>
            </span>
          ))}
        </div>

        <div
          className="tps1-intro__progress-wrap"
          style={{ width: 180 }}
          aria-hidden="true"
        >
          <span className={`tps1-intro__progress-bar${isWordmarkVisible ? " is-running" : ""}`} />
        </div>
      </div>

      {/* Pure CSS Header Logo Merge Pulse */}
      {isMerged && (
        <div
          className="tps1-intro__dock-pulse"
          style={{
            width: target.width + 16,
            height: target.height + 12,
            transform: `translate3d(${target.left - 8}px, ${target.top - 6}px, 0)`,
          }}
          aria-hidden="true"
        >
          <span className="tps1-intro__dock-pulse-ring" />
        </div>
      )}

      {/* Skip Button (<= 0.55s dismiss + Escape key) */}
      {!isMerged && !isSkipping && (
        <button type="button" onClick={triggerSkip} className="tps1-intro__skip">
          <span>Bỏ qua chuyển cảnh</span>
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
