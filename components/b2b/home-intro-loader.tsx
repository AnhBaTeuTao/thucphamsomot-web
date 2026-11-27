"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { isTps1FxDisabled, TPS1_FX_CHANGE_EVENT } from "@/lib/fx-preference";

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
  emblemStartY: number;
  taglineTop: number;
  baseTaglineMaxW: number;
  basePillsMaxW: number;
  visualLogoCenterOffset: number;
  isMobile: boolean;
  isTablet: boolean;
  orbitCenterX: number;
  orbitCenterY: number;
  orbitR: number;
  plinthSize: number;
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

const TRUST_PILLS = [
  { id: "iso", label: "Chuẩn ISO 22000:2018 & HACCP" },
  { id: "sku", label: "5.000+ Mặt hàng tươi sạch" },
  { id: "ontime", label: "Giao đúng giờ mở bếp" },
];

// 8 balanced micro-leaves & golden/emerald light sparks crowning the sprouting emblem in Phase 1
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
  { id: "cp01", kind: "leaf", dx: "-34px", dy: "-48px", rot: "-28deg", delay: "0.02s", size: 10, color: "#00a651" },
  { id: "cp02", kind: "leaf", dx: "36px", dy: "-50px", rot: "26deg", delay: "0.04s", size: 10, color: "#10b981" },
  { id: "cp03", kind: "spark", dx: "-16px", dy: "-64px", rot: "0deg", delay: "0.06s", size: 6, color: "#f5c84c" },
  { id: "cp04", kind: "leaf", dx: "18px", dy: "-62px", rot: "18deg", delay: "0.08s", size: 9, color: "#00a651" },
  { id: "cp05", kind: "spark", dx: "-46px", dy: "-30px", rot: "0deg", delay: "0.09s", size: 5, color: "#34d399" },
  { id: "cp06", kind: "leaf", dx: "48px", dy: "-32px", rot: "34deg", delay: "0.11s", size: 9, color: "#f37021" },
  { id: "cp07", kind: "spark", dx: "2px", dy: "-70px", rot: "0deg", delay: "0.12s", size: 6, color: "#f5c84c" },
  { id: "cp08", kind: "spark", dx: "-38px", dy: "-14px", rot: "0deg", delay: "0.14s", size: 5, color: "#f37021" },
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
  const isMobile = vw <= 640;
  const isTablet = !isMobile && vw <= 1023;

  let stageScale: number;
  let orbitR: number;
  let stageW: number;
  let metaGap: number;
  let baseTaglineMaxW: number;
  let basePillsMaxW: number;

  if (isMobile) {
    stageScale = Number(Math.min(vw / 390, (vh * 0.64) / 520, 1.05).toFixed(4));
    stageW = Math.round(168 * stageScale);
    metaGap = Math.round(7 * stageScale);
    baseTaglineMaxW = 232;
    basePillsMaxW = 232;
    orbitR = Math.round(160 * stageScale);
  } else if (isTablet) {
    stageScale = Number(Math.min(vw / 820, vh / 960).toFixed(4));
    orbitR = Math.round(220 * stageScale);
    stageW = Math.round(238 * stageScale);
    metaGap = Math.round(9 * stageScale);
    baseTaglineMaxW = 368;
    basePillsMaxW = 260;
  } else {
    stageScale = Number(Math.min(vh / 864, vw / 1536).toFixed(4));
    orbitR = Math.round(256 * stageScale);
    stageW = Math.round(284 * stageScale);
    metaGap = Math.round(9 * stageScale);
    baseTaglineMaxW = 368;
    basePillsMaxW = 260;
  }

  const baseMetaH = isMobile ? 132 : 110;
  const stageH = Math.round(stageW * LOGO_ASPECT);
  const emblemW = stageW * SPLIT_RATIO;
  const wordmarkW = stageW - emblemW;
  const stageLeft = (vw - stageW) / 2;

  const orbitCenterX = Math.round(vw / 2);
  const orbitCenterY = Math.round(vh / 2);
  const visualLogoTopOffset = Math.round(stageH * 0.155);
  const visualLogoBottomOffset = Math.round(stageH * 0.78);
  const visualLogoH = visualLogoBottomOffset - visualLogoTopOffset;
  const visualLogoCenterOffset = Math.round((visualLogoTopOffset + visualLogoBottomOffset) * 0.5);
  const estCenterMetaH = Math.round(baseMetaH * stageScale);
  const visualCenterH = visualLogoH + metaGap + estCenterMetaH;

  const desiredVisualTop = Math.round(orbitCenterY - visualCenterH / 2);
  const stageTop = desiredVisualTop - visualLogoTopOffset;
  const taglineTop = Math.round(stageTop + visualLogoBottomOffset + metaGap);
  const emblemStartX = vw / 2 - EMBLEM_CENTER_RATIO * stageW;
  const emblemStartY = Math.round(orbitCenterY - visualLogoCenterOffset);

  const plinthSize = isMobile
    ? Math.round(Math.min(vw - 28, Math.max(308 * stageScale, visualCenterH + 62)))
    : Math.round(Math.max(orbitR * 1.46, visualCenterH + 88));

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
    emblemStartY,
    taglineTop,
    baseTaglineMaxW,
    basePillsMaxW,
    visualLogoCenterOffset,
    isMobile,
    isTablet,
    orbitCenterX,
    orbitCenterY,
    orbitR,
    plinthSize,
    target: measureHeaderLogoTarget(vw),
  };
}

function warmDecodeLogo(): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = LOGO_SRC;
    const done = () => resolve();
    const timeoutId = window.setTimeout(done, 110);
    if (typeof img.decode === "function") {
      img
        .decode()
        .then(() => {
          window.clearTimeout(timeoutId);
          resolve();
        })
        .catch(() => {
          window.clearTimeout(timeoutId);
          resolve();
        });
    } else {
      img.onload = () => {
        window.clearTimeout(timeoutId);
        resolve();
      };
      img.onerror = () => {
        window.clearTimeout(timeoutId);
        resolve();
      };
    }
  });
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
        width={264}
        height={192}
        loading="eager"
        decoding="async"
        className="tps1-intro__wall-img"
      />
    </div>
  );
}

export function HomeIntroLoader() {
  const [phase, setPhase] = useState<IntroPhase>(() => {
    if (typeof window === "undefined") return "idle";
    const forceIntro = new URLSearchParams(window.location.search).get("intro") === "1";
    return hasPlayedInSpaSession && !forceIntro ? "done" : "idle";
  });
  const [metrics, setMetrics] = useState<StageMetrics | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const finishedDispatchedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const phaseRef = useRef<IntroPhase>(phase);

  const setPhaseSync = useCallback((next: IntroPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
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
    cleanupDom();
    setPhaseSync("done");
  }, [clearTimers, cleanupDom, setPhaseSync]);

  const triggerSkip = useCallback(() => {
    const current = phaseRef.current;
    if (current === "idle" || current === "done" || current === "merged" || current === "skipping") {
      return;
    }
    hasPlayedInSpaSession = true;
    clearTimers();
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
  }, [clearTimers, cleanupDom, setPhaseSync]);

  useLayoutEffect(() => {
    if (phase !== "done" || finishedDispatchedRef.current) return;
    finishedDispatchedRef.current = true;
    dispatchIntroFinished();
  }, [phase]);

  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forceIntro = params.get("intro") === "1";

    if (isTps1FxDisabled() || (hasPlayedInSpaSession && !forceIntro)) {
      hasPlayedInSpaSession = true;
      cleanupDom();
      setPhaseSync("done");
      if (!finishedDispatchedRef.current) {
        finishedDispatchedRef.current = true;
        dispatchIntroFinished();
      }
      return;
    }

    let cancelled = false;
    finishedDispatchedRef.current = false;

    document.documentElement.classList.add("tps1-intro-docking");
    document.body.style.overflow = "hidden";

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timersRef.current.push(id);
    };

    let raf1 = 0;
    let raf2 = 0;

    // Failsafe cứng: 3400ms
    schedule(() => {
      finishImmediately();
    }, 3400);

    // Đo kích thước khung hình đồng bộ trước paint đầu tiên
    const initialMetrics = computeStageMetrics();
    /* eslint-disable react-hooks/set-state-in-effect -- Measure viewport/header DOM synchronously before first paint */
    setMetrics(initialMetrics);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Đợi giải mã xong ảnh Logo (<=110ms) + 2 nhịp rAF để trình duyệt hoàn tất layout ban đầu rồi mới kích hoạt Pha 1
    // Giúp hiệu ứng mọc 3 lá + vòng cam chạy mượt 100% ở 60/120fps, không bao giờ bị khựng hay cắt xén
    warmDecodeLogo().then(() => {
      if (cancelled) return;
      raf1 = window.requestAnimationFrame(() => {
        if (cancelled) return;
        setPhaseSync("emblem");
        raf2 = window.requestAnimationFrame(() => {
          if (cancelled) return;

          // Nhịp 2 (740ms -> 1620ms): Sau khi 3 chiếc lá + vòng cam nở trọn vẹn & mượt mà (0ms..720ms), trượt Emblem + mở chữ + Slogan + 3 viên thuốc
          schedule(() => {
            setPhaseSync("wordmark");
          }, 740);

          // Tăng tốc 2 tường ảnh trước khi mở màn
          schedule(() => {
            accelerateWallScroll(2.2);
          }, 1360);

          // Nhịp 3 (1620ms -> 1950ms): Tường ảnh mở ra + Logo bay lên góc trái Header
          schedule(() => {
            setPhaseSync("docking");
          }, 1620);

          // Nhịp 4a (1950ms): Khớp 0px vào Header + xung sáng
          schedule(() => {
            hasPlayedInSpaSession = true;
            document.documentElement.classList.remove("tps1-intro-docking");
            setPhaseSync("merged");
          }, 1950);

          // Nhịp 4b (2080ms): Hoàn tất & mở khóa trang (~3.1s - 3.3s tổng thời gian kể cả tải trang)
          schedule(() => {
            hasPlayedInSpaSession = true;
            cleanupDom();
            setPhaseSync("done");
          }, 2080);
        });
      });
    });

    return () => {
      cancelled = true;
      if (raf1) window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
      clearTimers();
      cleanupDom();
    };
  }, [accelerateWallScroll, clearTimers, cleanupDom, finishImmediately, setPhaseSync]);

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
    const handleFxChange = (e: Event) => {
      const detail = (e as CustomEvent<{ disabled: boolean }>).detail;
      if (detail?.disabled) {
        finishImmediately();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener(TPS1_FX_CHANGE_EVENT, handleFxChange);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener(TPS1_FX_CHANGE_EVENT, handleFxChange);
    };
  }, [phase, triggerSkip]);

  if (phase === "done") {
    return null;
  }

  if (phase === "idle" || !metrics) {
    return (
      <div ref={rootRef} className="tps1-intro" data-intro-phase="idle" aria-hidden="true">
        <div className="tps1-intro__stage-bg" />
      </div>
    );
  }

  const {
    vw,
    stageScale,
    stageW,
    stageH,
    emblemW,
    wordmarkW,
    stageLeft,
    stageTop,
    emblemStartX,
    emblemStartY,
    taglineTop,
    baseTaglineMaxW,
    basePillsMaxW,
    visualLogoCenterOffset,
    isMobile,
    isTablet,
    orbitCenterX,
    orbitCenterY,
    orbitR,
    plinthSize,
    target,
  } = metrics;

  const dockScale = target.width / stageW;
  const targetWordmarkX = target.left + emblemW * dockScale;

  const isPhase1 = phase === "emblem";
  const isWordmarkVisible = phase !== "emblem";
  const isDocking = phase === "docking" || phase === "merged";
  const isSkipping = phase === "skipping";
  const isMerged = phase === "merged";
  const isCurtainOpen = isDocking || isSkipping;
  const showTagline = phase === "wordmark";

  // Pure GPU CSS compositor transforms for Emblem & Wordmark (centered inside Porcelain Disc at Phase 1)
  const phase1Scale = isMobile ? 1.36 : 1.2;
  const emblemX = isPhase1
    ? Math.round(emblemStartX - EMBLEM_CENTER_RATIO * stageW * (phase1Scale - 1))
    : isDocking || isSkipping
      ? target.left
      : stageLeft;
  const emblemY = isPhase1
    ? Math.round(emblemStartY - visualLogoCenterOffset * (phase1Scale - 1))
    : isDocking || isSkipping
      ? target.top
      : stageTop;
  const emblemScale = isPhase1
    ? phase1Scale
    : isDocking || isSkipping
      ? dockScale
      : 1;

  const wordmarkX = isPhase1
    ? stageLeft + emblemW + Math.round(26 * stageScale)
    : isDocking || isSkipping
      ? targetWordmarkX
      : stageLeft + emblemW;
  const wordmarkY = isDocking || isSkipping ? target.top : stageTop;
  const wordmarkScale = isDocking || isSkipping ? dockScale : 1;
  const wordmarkOpacity = isPhase1 ? 0 : 1;

  const orbSize = Math.round(stageW * 0.78);
  const orbX = (isPhase1 ? orbitCenterX : stageLeft + emblemW * 0.58) - orbSize / 2;
  const orbY = (isPhase1 ? orbitCenterY : stageTop + stageH / 2) - orbSize / 2;

  const partStateClass = isPhase1
    ? "is-phase1"
    : isDocking
      ? "is-docking"
      : isSkipping
        ? "is-skipping"
        : "is-stage";

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
      {/* Soft mint-jade radial stage backdrop fading into pure white at Logo center */}
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

      {/* Phase 1.1: Emerald Seed Pulse expanding from center stage (Proportional on Mobile & Desktop) */}
      {isPhase1 && (
        <div
          className="tps1-intro__seed-pulse"
          style={{
            width: isMobile ? Math.round(96 * stageScale) : Math.round(144 * stageScale),
            height: isMobile ? Math.round(96 * stageScale) : Math.round(144 * stageScale),
            transform: `translate3d(${orbitCenterX - (isMobile ? Math.round(48 * stageScale) : Math.round(72 * stageScale))}px, ${orbitCenterY - (isMobile ? Math.round(48 * stageScale) : Math.round(72 * stageScale))}px, 0)`,
          }}
          aria-hidden="true"
        >
          <span className="tps1-intro__seed-ring tps1-intro__seed-ring--1" />
          <span className="tps1-intro__seed-ring tps1-intro__seed-ring--2" />
        </div>
      )}

      {/* Center 3D Porcelain Disc framing Logo + Slogan + 3 Trust Pills */}
      <div
        className={`tps1-intro__plinth${isCurtainOpen ? " is-hidden" : isPhase1 ? " is-phase1" : " is-active"}`}
        style={{
          width: plinthSize,
          height: plinthSize,
          transform: `translate3d(${orbitCenterX - Math.round(plinthSize / 2)}px, ${orbitCenterY - Math.round(plinthSize / 2)}px, 0) scale(${isPhase1 ? 0.72 : 1})`,
        }}
        aria-hidden="true"
      />

      {/* Dual-Layer Emerald-Orange Radiant Halo behind Emblem */}
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

      {/* Phase 1.2: 8 Balanced Micro-Leaves & Golden/Emerald Sparks (Proportional to Emblem on Mobile & Desktop) */}
      {isPhase1 && (
        <div
          className="tps1-intro__particles"
          style={{
            transform: `translate3d(${orbitCenterX}px, ${orbitCenterY - Math.round((isMobile ? 6 : 10) * stageScale)}px, 0) scale(${Number(((stageW / 284) * (isMobile ? 0.92 : 1)).toFixed(3))})`,
          }}
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
            )
          )}
        </div>
      )}

      {/* Phase 3: Horizontal Speed Streaks during Docking */}
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

      {/* LOGO PART 1: EMBLEM CROP BOX */}
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
          <div className={`tps1-intro__emblem-bloom${isPhase1 ? " is-blooming" : ""}`}>
            <svg
              viewBox="0 0 1024 366"
              className={`tps1-intro__emblem-svg${isPhase1 ? "" : " is-hidden"}`}
              style={{ width: stageW, height: stageH }}
              aria-hidden="true"
            >
              <path
                d="M 157 57 C 176 88 182 118 164 152 C 160 160 157 166 156 170 C 154 164 148 152 142 140 C 132 115 140 84 157 57 Z"
                fill="#00a651"
                stroke="#10b981"
                strokeWidth="4.5"
                strokeLinejoin="round"
                pathLength={1}
                className="tps1-intro__leaf-center"
              />
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

      {/* LOGO PART 2: WORDMARK CROP BOX */}
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

      {/* PHASE 2.2: Unified Flex-Column Center Meta */}
      <div
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
          style={{ width: isMobile ? 140 : 180 }}
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

      {/* Skip Button */}
      {!isMerged && !isSkipping && (
        <button type="button" onClick={triggerSkip} className="tps1-intro__skip">
          <span>Bỏ qua chuyển cảnh</span>
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
