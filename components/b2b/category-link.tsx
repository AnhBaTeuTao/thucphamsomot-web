"use client";

import Link from "next/link";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type FocusEvent,
  type MouseEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { extractCategorySlugFromHref } from "@/lib/category-transition-config";
import { normalizeTransitionUrl } from "@/lib/category-transition-store";
import { useCategoryTransition } from "@/components/b2b/category-transition-provider";

type BaseLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href">;

export type CategoryLinkProps = BaseLinkProps & {
  href: string;
  categorySlug?: string;
  isEnglish?: boolean;
  dispatchSelectEvent?: boolean;
  onBeforeTransition?: () => void;
  onCategoryHover?: (slug: string) => void;
};

/**
 * Shared navigation link for all /danh-muc/* and category-filtered routes.
 * - Uses next/link (client navigation, works natively when JS is disabled).
 * - Preserves native Ctrl/Cmd/Shift/Middle-click (new tab) and keyboard Enter (immediate nav).
 * - Prefetches route & preloads category cutouts/hero after 80ms hover.
 * - Captures originRect BEFORE onBeforeTransition closes mega-menu/drawer.
 */
export const CategoryLink = forwardRef<HTMLAnchorElement, CategoryLinkProps>(function CategoryLink(
  {
    href,
    categorySlug,
    isEnglish = false,
    dispatchSelectEvent = false,
    onBeforeTransition,
    onCategoryHover,
    onMouseEnter,
    onFocus,
    onClick,
    children,
    ...rest
  },
  ref
) {
  const router = useRouter();
  const pathname = usePathname();
  const { triggerCategoryTransition, preloadCategory } = useCategoryTransition();
  const prefetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resolvedSlug = categorySlug ?? extractCategorySlugFromHref(href);

  useEffect(() => {
    return () => {
      if (prefetchTimerRef.current) {
        clearTimeout(prefetchTimerRef.current);
      }
    };
  }, []);

  const schedulePreload = useCallback(() => {
    if (!resolvedSlug) return;
    onCategoryHover?.(resolvedSlug);
    if (prefetchTimerRef.current) clearTimeout(prefetchTimerRef.current);
    prefetchTimerRef.current = setTimeout(() => {
      prefetchTimerRef.current = null;
      preloadCategory(resolvedSlug, href);
    }, 80);
  }, [href, onCategoryHover, preloadCategory, resolvedSlug]);

  const handleMouseEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    schedulePreload();
    onMouseEnter?.(e);
  };

  const handleFocus = (e: FocusEvent<HTMLAnchorElement>) => {
    schedulePreload();
    onFocus?.(e);
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;

    // Ctrl/Cmd/Shift/Alt or Middle-Click: let browser open tab natively, NO animation
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    // Keyboard Enter activates click with e.detail === 0: immediate native nav, NO animation
    if (e.detail === 0) {
      onBeforeTransition?.();
      if (dispatchSelectEvent && resolvedSlug) {
        window.dispatchEvent(new CustomEvent("tps1-select-category", { detail: resolvedSlug }));
      }
      return;
    }

    if (!resolvedSlug) {
      onBeforeTransition?.();
      return;
    }

    const currentUrl =
      typeof window !== "undefined"
        ? normalizeTransitionUrl(`${window.location.pathname}${window.location.search}`)
        : normalizeTransitionUrl(pathname || "/");
    const targetUrl = normalizeTransitionUrl(href);

    if (targetUrl === currentUrl) {
      onBeforeTransition?.();
      return;
    }

    // Capture origin coordinates BEFORE hiding mega-menu or drawer
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    onBeforeTransition?.();

    const started = triggerCategoryTransition({
      slug: resolvedSlug,
      href,
      originRect: {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      },
      isEnglish,
      dispatchSelectEvent,
    });

    if (!started) {
      router.push(href);
    }
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseEnter={handleMouseEnter}
      onFocus={handleFocus}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Link>
  );
});
