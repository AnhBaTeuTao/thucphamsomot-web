"use client";

import { useEffect, useRef } from "react";

type RevealMode = "default" | "hero" | "final";
type RevealState = "focused" | "past-top" | "below-view";

interface RegisteredEntry {
  el: HTMLElement;
  mode: RevealMode;
  state: RevealState;
}

const registry = new Set<RegisteredEntry>();
let listenersAttached = false;
let rafId = 0;

function applyState(entry: RegisteredEntry, next: RevealState) {
  if (entry.state === next) return;
  entry.state = next;
  const el = entry.el;
  el.classList.remove("is-focused", "is-past-top", "is-below-view");
  if (next === "focused") {
    el.classList.add("is-focused");
    el.setAttribute("data-sr-state", "focused");
  } else if (next === "past-top") {
    el.classList.add("is-past-top");
    el.setAttribute("data-sr-state", "past-top");
  } else {
    el.classList.add("is-below-view");
    el.setAttribute("data-sr-state", "below-view");
  }
}

function evaluateAll() {
  rafId = 0;
  if (typeof window === "undefined") return;

  const vh = window.visualViewport?.height || window.innerHeight || 800;
  const docHeight = document.documentElement.scrollHeight;
  const scrollY = window.scrollY;
  const topFadeLine = vh * 0.1;
  const bottomEnterLine = vh * 0.9;
  const atBottom = window.innerHeight + scrollY >= docHeight - 40;

  registry.forEach((entry) => {
    const rect = entry.el.getBoundingClientRect();

    // Top-of-page exception: Hero always stays focused while near top
    if (entry.mode === "hero") {
      if (scrollY < vh * 0.15) {
        applyState(entry, "focused");
      } else if (rect.bottom <= vh * 0.22) {
        applyState(entry, "past-top");
      } else {
        applyState(entry, "focused");
      }
      return;
    }

    // Bottom-of-page exception: Final CTA always focused when scrolled to page bottom
    if (entry.mode === "final" && atBottom) {
      applyState(entry, "focused");
      return;
    }

    // Zoom-In (125%-200%) guard: blocks taller than 70% of viewport stay focused
    // whenever intersecting the central band [topFadeLine .. bottomEnterLine]
    if (rect.height >= vh * 0.7) {
      if (rect.top < bottomEnterLine && rect.bottom > topFadeLine) {
        applyState(entry, "focused");
      } else if (rect.bottom <= topFadeLine) {
        applyState(entry, "past-top");
      } else {
        applyState(entry, "below-view");
      }
      return;
    }

    // Normal & Zoom-Out (50%-75%) 3-Zone Viewport Focus Band
    if (rect.bottom <= vh * 0.14) {
      applyState(entry, "past-top");
    } else if (!atBottom && rect.top >= bottomEnterLine) {
      applyState(entry, "below-view");
    } else if (atBottom || (rect.top < bottomEnterLine && rect.bottom > vh * 0.14)) {
      applyState(entry, "focused");
    }
  });
}

function scheduleEvaluate() {
  if (typeof window === "undefined") return;
  if (rafId) return;
  rafId = window.requestAnimationFrame(evaluateAll);
}

function attachGlobalListeners() {
  if (listenersAttached || typeof window === "undefined") return;
  listenersAttached = true;

  window.addEventListener("scroll", scheduleEvaluate, { passive: true });
  window.addEventListener("resize", scheduleEvaluate, { passive: true });
  window.visualViewport?.addEventListener("resize", scheduleEvaluate, { passive: true });
  window.visualViewport?.addEventListener("scroll", scheduleEvaluate, { passive: true });
}

function detachGlobalListenersIfEmpty() {
  if (!listenersAttached || registry.size > 0 || typeof window === "undefined") return;
  listenersAttached = false;

  window.removeEventListener("scroll", scheduleEvaluate);
  window.removeEventListener("resize", scheduleEvaluate);
  window.visualViewport?.removeEventListener("resize", scheduleEvaluate);
  window.visualViewport?.removeEventListener("scroll", scheduleEvaluate);
  if (rafId) {
    window.cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  mode = "default",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  mode?: RevealMode;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const entry: RegisteredEntry = { el, mode, state: "focused" };
    registry.add(entry);
    attachGlobalListeners();

    evaluateAll();
    const settleId = window.setTimeout(evaluateAll, 140);

    return () => {
      window.clearTimeout(settleId);
      registry.delete(entry);
      detachGlobalListenersIfEmpty();
    };
  }, [mode]);

  return (
    <div
      ref={ref}
      id={id}
      data-scroll-item=""
      data-sr-state="focused"
      style={delay > 0 ? ({ "--sr-delay": `${delay}ms` } as React.CSSProperties) : undefined}
      className={`tps1-sr is-focused ${className}`.trim()}
    >
      {children}
    </div>
  );
}
