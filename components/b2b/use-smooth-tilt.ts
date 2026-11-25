"use client";

import { useCallback, useEffect, useRef } from "react";

type SmoothTiltOptions = {
  maxTilt?: number;
  damping?: number;
};

/**
 * Buttery-smooth 60/120fps requestAnimationFrame damped lerp for 3D card tilt + cursor spotlight.
 * Automatically stops its rAF loop when settled (zero idle CPU cost).
 */
export function useSmoothTilt<T extends HTMLElement>({
  maxTilt = 6.5,
  damping = 0.12,
}: SmoothTiltOptions = {}) {
  const ref = useRef<T>(null);
  const stateRef = useRef({
    rx: 0,
    ry: 0,
    mx: 0,
    my: 0,
    targetRx: 0,
    targetRy: 0,
    targetMx: 0,
    targetMy: 0,
    rafId: 0,
    active: false,
  });

  const startLoop = useCallback(() => {
    const st = stateRef.current;
    if (st.rafId) return;

    const step = () => {
      const el = ref.current;
      if (!el) {
        st.rafId = 0;
        return;
      }

      st.rx += (st.targetRx - st.rx) * damping;
      st.ry += (st.targetRy - st.ry) * damping;
      st.mx += (st.targetMx - st.mx) * damping;
      st.my += (st.targetMy - st.my) * damping;

      el.style.setProperty("--rx", `${st.rx.toFixed(3)}deg`);
      el.style.setProperty("--ry", `${st.ry.toFixed(3)}deg`);
      el.style.setProperty("--mx", `${st.mx.toFixed(1)}px`);
      el.style.setProperty("--my", `${st.my.toFixed(1)}px`);
      el.style.setProperty("--mouse-x", `${st.mx.toFixed(1)}px`);
      el.style.setProperty("--mouse-y", `${st.my.toFixed(1)}px`);

      const settled =
        Math.abs(st.targetRx - st.rx) < 0.02 &&
        Math.abs(st.targetRy - st.ry) < 0.02 &&
        Math.abs(st.targetMx - st.mx) < 0.5 &&
        Math.abs(st.targetMy - st.my) < 0.5;

      if (!settled) {
        st.rafId = window.requestAnimationFrame(step);
      } else {
        st.rx = st.targetRx;
        st.ry = st.targetRy;
        st.mx = st.targetMx;
        st.my = st.targetMy;
        el.style.setProperty("--rx", `${st.rx.toFixed(2)}deg`);
        el.style.setProperty("--ry", `${st.ry.toFixed(2)}deg`);
        st.rafId = 0;
      }
    };

    st.rafId = window.requestAnimationFrame(step);
  }, [damping]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      if (window.innerWidth < 1024) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const st = stateRef.current;

      if (!st.active) {
        st.mx = x;
        st.my = y;
        st.active = true;
      }

      st.targetMx = x;
      st.targetMy = y;
      st.targetRx = (y / rect.height - 0.5) * -maxTilt * 2;
      st.targetRy = (x / rect.width - 0.5) * maxTilt * 2;
      startLoop();
    },
    [maxTilt, startLoop],
  );

  const onMouseLeave = useCallback(() => {
    const st = stateRef.current;
    st.active = false;
    st.targetRx = 0;
    st.targetRy = 0;
    startLoop();
  }, [startLoop]);

  useEffect(() => {
    const st = stateRef.current;
    return () => {
      if (st.rafId) {
        window.cancelAnimationFrame(st.rafId);
        st.rafId = 0;
      }
    };
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
