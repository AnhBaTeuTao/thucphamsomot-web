"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { markTransitionReady } from "@/lib/category-transition-store";

const IMAGE_DECODE_TIMEOUT_MS = 1500;

function waitTwoFrames(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => resolve());
    });
  });
}

function decodeImg(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalWidth > 0) {
    if (typeof img.decode === "function") {
      return img.decode().catch(() => {});
    }
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const done = () => resolve();
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
    if (typeof img.decode === "function") {
      img.decode().then(done).catch(() => {});
    }
  });
}

function TransitionReadyInner({ expectedPath }: { expectedPath?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams?.toString() ?? "";

  useEffect(() => {
    let cancelled = false;
    const currentPath = pathname || "/";
    if (expectedPath && currentPath !== expectedPath && !currentPath.startsWith(expectedPath)) {
      return;
    }

    const fullUrl = searchKey ? `${currentPath}?${searchKey}` : currentPath;

    async function notifyWhenPaintedAndDecoded() {
      // Wait for initial paint (2x rAF after route commit)
      await waitTwoFrames();
      if (cancelled) return;

      // Never fire ready while loading.tsx or Suspense catalog skeleton is still displayed
      if (document.querySelector('main[aria-busy="true"], .category-catalog[aria-busy="true"]')) {
        return;
      }

      // Wait for hero + first up to 12 visible product images to decode (1.5s cap)
      const mainEl = document.querySelector("main") ?? document.body;
      const heroImgs = Array.from(
        mainEl.querySelectorAll<HTMLImageElement>(
          ".page-hero__image, .sp-hero-bg__img, .content-detail__media-image"
        )
      );
      const productImgs = Array.from(
        mainEl.querySelectorAll<HTMLImageElement>(".sku-row__img, .sp-card__img")
      ).slice(0, 12);

      const targets = [...heroImgs, ...productImgs];
      if (targets.length > 0) {
        await Promise.race([
          Promise.all(targets.map((img) => decodeImg(img))),
          new Promise<void>((resolve) => window.setTimeout(resolve, IMAGE_DECODE_TIMEOUT_MS)),
        ]);
      }

      if (!cancelled) {
        markTransitionReady(fullUrl);
      }
    }

    void notifyWhenPaintedAndDecoded();

    return () => {
      cancelled = true;
    };
  }, [pathname, searchKey, expectedPath]);

  return null;
}

/**
 * Signals CategoryTransitionProvider on EVERY pathname/searchParams change (never mount-only).
 * Safe inside both static & dynamic App Router pages via internal Suspense boundary.
 */
export function TransitionReady({ expectedPath }: { expectedPath?: string }) {
  return (
    <Suspense fallback={null}>
      <TransitionReadyInner expectedPath={expectedPath} />
    </Suspense>
  );
}
