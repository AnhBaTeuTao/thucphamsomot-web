"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Menu, X, Users, ChevronDown, Check, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { navItemsByLocale, siteConfig, type Locale } from "@/lib/site";
import { SKU_GROUPS, type SkuGroup } from "@/lib/sku-catalog";
import { brandAssets } from "@/lib/brand";
import { TopBar } from "@/components/b2b/top-bar";
import { dispatchMajorPageTransition } from "@/components/b2b/major-page-transition";
import { CATEGORY_TRANSITION_CONFIG } from "@/lib/category-transition-config";
import { CategoryLink } from "@/components/b2b/category-link";

const orderAppUrl = "https://dathang.thucphamsomot.vn/";

function isCatalogNavHref(href: string) {
  return href === "/san-pham" || href === "/en/products";
}

function isNavItemActive(pathname: string, href: string) {
  if (isCatalogNavHref(href)) {
    return (
      pathname === href ||
      pathname.startsWith("/san-pham") ||
      pathname.startsWith("/danh-muc") ||
      pathname.startsWith("/en/products")
    );
  }
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

function catalogGroupHref(group: SkuGroup, isEnglish: boolean) {
  if (isEnglish) {
    return `/en/products?category=${group.slug}#danh-muc`;
  }
  return group.hasPage ? `/danh-muc/${group.slug}` : `/san-pham?category=${group.slug}#danh-muc`;
}

function localeFromPath(pathname: string): Locale {
  return pathname.startsWith("/en") ? "en" : "vi";
}

function swapLocalePath(pathname: string, nextLocale: Locale) {
  const cleanPath = pathname === "/" ? "" : pathname;
  if (nextLocale === "en") {
    if (cleanPath.startsWith("/en")) return cleanPath || "/en";
    if (cleanPath === "/bao-gia") return "/en/bao-gia";
    if (cleanPath === "/gioi-thieu") return "/en/about";
    if (cleanPath === "/san-pham") return "/en/products";
    if (cleanPath === "/quy-trinh") return "/en/delivery";
    if (cleanPath === "/lien-he") return "/en/contact";
    if (cleanPath === "/nganh-hang" || cleanPath.startsWith("/nganh-hang/") || cleanPath.startsWith("/danh-muc")) {
      return "/en/ingredients";
    }
    if (cleanPath.startsWith("/kien-thuc")) return "/en/recipes";
    return "/en";
  }

  if (!cleanPath.startsWith("/en")) return cleanPath || "/";
  if (cleanPath === "/en/bao-gia") return "/bao-gia";
  if (cleanPath === "/en/about") return "/gioi-thieu";
  if (cleanPath === "/en/products") return "/san-pham";
  if (cleanPath === "/en/delivery") return "/quy-trinh";
  if (cleanPath === "/en/contact") return "/lien-he";
  if (cleanPath === "/en/ingredients") return "/nganh-hang/bep-an-tap-the";
  if (cleanPath === "/en/recipes") return "/kien-thuc";
  return "/";
}

export function SiteHeader() {
  const pathname = usePathname();

  if (pathname === "/nhan-bao-gia") {
    return (
      <header
        className="site-header site-header--premium site-header--landing"
        style={{ borderBottom: "1px solid rgba(15,111,75,0.12)", background: "#ffffff" }}
      >
        <div
          className="container-shell"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 68 }}
        >
          <Link href="/" className="site-brand" aria-label={siteConfig.name}>
            <span className="site-brand__mark">
              <Image src={brandAssets.logoTransparent} alt="TPS1" width={150} height={48} priority />
            </span>
            <span className="site-brand__copy">
              <span className="site-brand__name">{siteConfig.name}</span>
              <span className="site-brand__tag">Báo giá B2B trong 24h</span>
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <a
              href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 700,
                fontSize: "0.92rem",
                color: "#133127",
                textDecoration: "none",
              }}
            >
              Hotline: <span style={{ color: "#0f6f4b" }}>{siteConfig.phone}</span>
            </a>
            <a
              href="#quick-quote"
              className="btn-primary"
              style={{ padding: "8px 18px", fontSize: "0.86rem", borderRadius: 8, textDecoration: "none" }}
            >
              Nhận báo giá
            </a>
          </div>
        </div>
      </header>
    );
  }

  return <SiteHeaderChrome pathname={pathname} />;
}

function SiteHeaderChrome({ pathname }: { pathname: string }) {
  const activeRouteSlug = pathname.startsWith("/danh-muc/")
    ? pathname.replace("/danh-muc/", "").split("/")[0]
    : "";
  const defaultPreviewSlug =
    activeRouteSlug && CATEGORY_TRANSITION_CONFIG[activeRouteSlug]
      ? activeRouteSlug
      : SKU_GROUPS[0].slug;

  const [prevPathname, setPrevPathname] = useState(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const [previewSlug, setPreviewSlug] = useState<string>(defaultPreviewSlug);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setLangOpen(false);
    setCatalogOpen(false);
    setMobileCatalogOpen(false);
    setPreviewSlug(defaultPreviewSlug);
  }
  const [headerBottom, setHeaderBottom] = useState(108);
  const [panelOffset, setPanelOffset] = useState<{ shiftX: number; caretLeft: number }>({
    shiftX: 0,
    caretLeft: 360,
  });

  const locale = localeFromPath(pathname);
  const isEnglish = locale === "en";
  const navItems = navItemsByLocale[locale];

  const headerRef = useRef<HTMLElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const megaPanelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingFocusFirstRef = useRef(false);

  const clearCatalogTimers = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const syncMegaPosition = useCallback(() => {
    const wrap = dropdownRef.current;
    if (!wrap || typeof window === "undefined") return;
    const vw = document.documentElement.clientWidth || window.innerWidth;
    const wrapRect = wrap.getBoundingClientRect();
    const panelW = Math.min(720, vw - 32);
    const wrapCenter = wrapRect.left + wrapRect.width / 2;
    const idealLeft = wrapCenter - panelW / 2;
    const clampedLeft = Math.max(16, Math.min(vw - 16 - panelW, idealLeft));
    const shiftX = Math.round(clampedLeft - idealLeft);
    const caretLeft = Math.round(Math.max(24, Math.min(panelW - 24, wrapCenter - clampedLeft)));
    setPanelOffset((prev) =>
      prev.shiftX === shiftX && prev.caretLeft === caretLeft ? prev : { shiftX, caretLeft }
    );
  }, []);

  const scheduleOpenCatalog = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (catalogOpen || openTimerRef.current) return;
    openTimerRef.current = setTimeout(() => {
      openTimerRef.current = null;
      syncMegaPosition();
      setCatalogOpen(true);
    }, 120);
  }, [catalogOpen, syncMegaPosition]);

  const openCatalogNow = useCallback(
    (focusFirst = false) => {
      clearCatalogTimers();
      syncMegaPosition();
      if (focusFirst) {
        pendingFocusFirstRef.current = true;
      }
      setCatalogOpen(true);
    },
    [clearCatalogTimers, syncMegaPosition]
  );

  const scheduleCloseCatalog = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setCatalogOpen(false);
    }, 200);
  }, []);

  const closeCatalogNow = useCallback(
    (returnFocus = false) => {
      clearCatalogTimers();
      setCatalogOpen(false);
      if (returnFocus) {
        window.requestAnimationFrame(() => {
          triggerRef.current?.focus();
        });
      }
    },
    [clearCatalogTimers]
  );

  const closeMobileMenus = useCallback(() => {
    closeCatalogNow();
    setMenuOpen(false);
    setMobileCatalogOpen(false);
  }, [closeCatalogNow]);

  useEffect(() => {
    if (!catalogOpen) return;
    syncMegaPosition();
    if (pendingFocusFirstRef.current) {
      pendingFocusFirstRef.current = false;
      void megaPanelRef.current?.offsetHeight;
      itemRefs.current[0]?.focus();
    }
    window.addEventListener("resize", syncMegaPosition);
    return () => window.removeEventListener("resize", syncMegaPosition);
  }, [catalogOpen, syncMegaPosition]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (langRef.current && !langRef.current.contains(target)) {
        setLangOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        clearCatalogTimers();
        setCatalogOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        const wasCatalogOpen = dropdownRef.current?.classList.contains("is-open");
        clearCatalogTimers();
        setCatalogOpen(false);
        setLangOpen(false);
        setMenuOpen(false);
        if (wasCatalogOpen) {
          window.requestAnimationFrame(() => triggerRef.current?.focus());
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      clearCatalogTimers();
    };
  }, [clearCatalogTimers]);

  useEffect(() => {
    const syncRootHeaderHeight = () => {
      const headerEl = headerRef.current;
      if (!headerEl) return;
      const topBarEl = document.querySelector(".b2b-topbar, .top-bar") as HTMLElement | null;
      const topBarH = topBarEl ? topBarEl.getBoundingClientRect().height : 0;
      const headerH = headerEl.getBoundingClientRect().height;
      const total = Math.max(56, Math.ceil(topBarH + headerH));
      document.documentElement.style.setProperty("--site-header-bottom", `${total}px`);
      document.documentElement.style.setProperty("--site-header-height", `${Math.max(48, Math.ceil(headerH))}px`);
    };

    syncRootHeaderHeight();
    window.addEventListener("resize", syncRootHeaderHeight);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && headerRef.current) {
      observer = new ResizeObserver(syncRootHeaderHeight);
      observer.observe(headerRef.current);
      const topBarEl = document.querySelector(".b2b-topbar, .top-bar");
      if (topBarEl) observer.observe(topBarEl);
    }

    return () => {
      window.removeEventListener("resize", syncRootHeaderHeight);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const syncHeaderBottom = () => {
      if (window.innerWidth >= 1101) {
        setMenuOpen(false);
        setMobileCatalogOpen(false);
        return;
      }
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      setHeaderBottom(Math.max(48, Math.min(window.innerHeight, Math.ceil(rect.bottom))));
    };
    syncHeaderBottom();
    window.addEventListener("resize", syncHeaderBottom);
    window.addEventListener("scroll", syncHeaderBottom, { passive: true });
    return () => {
      window.removeEventListener("resize", syncHeaderBottom);
      window.removeEventListener("scroll", syncHeaderBottom);
    };
  }, [menuOpen]);

  const handleMegaItemKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLAnchorElement>, idx: number) => {
      const total = SKU_GROUPS.length;
      const cols = typeof window !== "undefined" && window.innerWidth < 900 ? 1 : 2;
      let nextIdx: number | null = null;

      if (e.key === "ArrowRight") {
        nextIdx = (idx + 1) % total;
      } else if (e.key === "ArrowLeft") {
        nextIdx = (idx - 1 + total) % total;
      } else if (e.key === "ArrowDown") {
        nextIdx = idx + cols < total ? idx + cols : idx % cols;
      } else if (e.key === "ArrowUp") {
        if (idx - cols >= 0) {
          nextIdx = idx - cols;
        } else {
          const lastRowStart = Math.floor((total - 1) / cols) * cols;
          nextIdx = Math.min(total - 1, lastRowStart + (idx % cols));
        }
      } else if (e.key === "Home") {
        nextIdx = 0;
      } else if (e.key === "End") {
        nextIdx = total - 1;
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeCatalogNow(true);
        return;
      }

      if (nextIdx !== null) {
        e.preventDefault();
        const nextGroup = SKU_GROUPS[nextIdx];
        if (nextGroup) {
          setPreviewSlug(nextGroup.slug);
        }
        itemRefs.current[nextIdx]?.focus();
      }
    },
    [closeCatalogNow]
  );

  const previewGroup =
    SKU_GROUPS.find((g) => g.slug === previewSlug) ?? SKU_GROUPS[0];
  const previewConfig =
    CATEGORY_TRANSITION_CONFIG[previewGroup.slug] ?? CATEGORY_TRANSITION_CONFIG[SKU_GROUPS[0].slug];
  const previewHref = catalogGroupHref(previewGroup, isEnglish);

  return (
    <>
      <TopBar />

      <header ref={headerRef} className={`site-header site-header--premium${menuOpen ? " is-menu-open" : ""}`}>
        <div className="container-shell site-header__inner">
          <Link href={isEnglish ? "/en" : "/"} className="site-brand" aria-label={siteConfig.englishName}>
            <span className="site-brand__mark">
              <Image src={brandAssets.logoTransparent} alt="TPS1" width={160} height={52} priority />
            </span>
            <span className="site-brand__copy">
              <span className="site-brand__name">{isEnglish ? siteConfig.englishName : siteConfig.name}</span>
              <span className="site-brand__tag">
                {isEnglish ? "B2B food supply · ISO 22000" : "Thực phẩm B2B · ISO 22000"}
              </span>
            </span>
          </Link>

          <button
            type="button"
            className="site-menu-toggle"
            aria-label={menuOpen ? (isEnglish ? "Close menu" : "Đóng menu") : (isEnglish ? "Open menu" : "Mở menu")}
            aria-expanded={menuOpen}
            aria-controls="site-mobile-nav"
            onClick={() => {
              if (!menuOpen && headerRef.current) {
                const rect = headerRef.current.getBoundingClientRect();
                setHeaderBottom(Math.max(48, Math.min(window.innerHeight, Math.ceil(rect.bottom))));
              } else if (menuOpen) {
                setMobileCatalogOpen(false);
              }
              setMenuOpen((v) => !v);
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav className="site-nav site-nav--minimal" aria-label={isEnglish ? "Main navigation" : "Điều hướng chính"}>
            {navItems.map((item) => {
              const isActive = isNavItemActive(pathname, item.href);

              if (isCatalogNavHref(item.href)) {
                return (
                  <div
                    key={item.href}
                    ref={dropdownRef}
                    className={`site-nav__dropdown-wrap${catalogOpen ? " is-open" : ""}`}
                    onMouseEnter={scheduleOpenCatalog}
                    onMouseLeave={scheduleCloseCatalog}
                    onBlur={(e: FocusEvent<HTMLDivElement>) => {
                      if (!dropdownRef.current?.contains(e.relatedTarget as Node | null)) {
                        scheduleCloseCatalog();
                      }
                    }}
                  >
                    <Link
                      ref={triggerRef}
                      href={item.href}
                      className={`site-nav__link site-nav__link--dropdown ${isActive ? "is-active" : ""}`}
                      aria-expanded={catalogOpen}
                      aria-haspopup="true"
                      aria-controls="tps1-catalog-mega-menu"
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          openCatalogNow(true);
                        } else if (e.key === "Escape" && catalogOpen) {
                          e.preventDefault();
                          closeCatalogNow(true);
                        }
                      }}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
                          return;
                        }
                        if (!catalogOpen) {
                          e.preventDefault();
                          openCatalogNow(e.detail === 0);
                          return;
                        }
                        closeCatalogNow();
                        if (e.detail !== 0) {
                          dispatchMajorPageTransition(item.href, pathname);
                        }
                        window.dispatchEvent(new CustomEvent("tps1-select-category", { detail: "" }));
                      }}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={13}
                        className={`site-nav__chevron${catalogOpen ? " is-open" : ""}`}
                        aria-hidden="true"
                      />
                    </Link>

                    <div
                      id="tps1-catalog-mega-menu"
                      ref={megaPanelRef}
                      className={`site-nav__mega${catalogOpen ? " is-open" : ""}`}
                      role="region"
                      aria-label={isEnglish ? "TPS1 Product Catalog" : "Danh mục nguồn hàng TPS1"}
                      style={
                        {
                          "--mega-shift-x": `${panelOffset.shiftX}px`,
                          "--mega-caret-left": `${panelOffset.caretLeft}px`,
                        } as CSSProperties
                      }
                      onMouseEnter={() => {
                        if (closeTimerRef.current) {
                          clearTimeout(closeTimerRef.current);
                          closeTimerRef.current = null;
                        }
                      }}
                    >
                      <span className="site-nav__mega-caret" aria-hidden="true" />

                      <div className="site-nav__mega-head">
                        <span className="site-nav__mega-title">
                          {isEnglish ? "TPS1 Product Catalog" : "Danh mục nguồn hàng TPS1"}
                        </span>
                        <Link
                          href={isEnglish ? "/en/products" : "/san-pham"}
                          className="site-nav__mega-all"
                          onClick={(e) => {
                            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                            closeCatalogNow();
                            if (e.detail !== 0) {
                              dispatchMajorPageTransition(isEnglish ? "/en/products" : "/san-pham", pathname);
                            }
                            window.dispatchEvent(new CustomEvent("tps1-select-category", { detail: "" }));
                          }}
                        >
                          <span>{isEnglish ? "View all products →" : "Xem tất cả sản phẩm →"}</span>
                        </Link>
                      </div>

                      <div className="site-nav__mega-body">
                        <div className="site-nav__mega-grid">
                          {SKU_GROUPS.map((group, idx) => {
                            const cfg = CATEGORY_TRANSITION_CONFIG[group.slug];
                            const href = catalogGroupHref(group, isEnglish);
                            const isCurrent = pathname === `/danh-muc/${group.slug}`;
                            const isPreviewed = previewGroup.slug === group.slug;
                            const badgeText = isEnglish ? cfg?.featuredBadgeEn : cfg?.featuredBadge;

                            return (
                              <CategoryLink
                                key={group.slug}
                                ref={(node) => {
                                  itemRefs.current[idx] = node;
                                }}
                                href={href}
                                categorySlug={group.slug}
                                isEnglish={isEnglish}
                                dispatchSelectEvent={!group.hasPage || isEnglish}
                                onBeforeTransition={() => closeCatalogNow()}
                                onCategoryHover={(slug) => setPreviewSlug(slug)}
                                aria-current={isCurrent ? "page" : undefined}
                                data-cat-slug={group.slug}
                                className={`site-nav__mega-item${isCurrent ? " is-current" : ""}${isPreviewed ? " is-previewed" : ""}`}
                                onKeyDown={(e) => handleMegaItemKeyDown(e, idx)}
                              >
                                <span className="site-nav__mega-thumb" aria-hidden="true">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={cfg?.previewImage ?? group.image}
                                    alt=""
                                    width={44}
                                    height={44}
                                    loading="eager"
                                    decoding="async"
                                  />
                                </span>

                                <span className="site-nav__mega-copy">
                                  <span className="site-nav__mega-label-row">
                                    <span className="site-nav__mega-label">
                                      {isEnglish ? group.labelEn : group.label}
                                    </span>
                                    {badgeText && (
                                      <span className="site-nav__mega-badge">{badgeText}</span>
                                    )}
                                  </span>
                                </span>

                                <span className="site-nav__mega-arrow" aria-hidden="true">
                                  →
                                </span>
                              </CategoryLink>
                            );
                          })}
                        </div>

                        <aside
                          className="site-nav__mega-preview"
                          aria-label={isEnglish ? "Category preview" : "Xem trước nhóm hàng"}
                        >
                          <div className="site-nav__mega-preview-media">
                            {SKU_GROUPS.map((group) => {
                              const cfg = CATEGORY_TRANSITION_CONFIG[group.slug];
                              const activeLayer = previewGroup.slug === group.slug;
                              return (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  key={group.slug}
                                  src={cfg?.previewImage ?? group.image}
                                  alt={isEnglish ? group.labelEn : group.label}
                                  className={`site-nav__mega-preview-img${activeLayer ? " is-visible" : ""}`}
                                  loading={activeLayer ? "eager" : "lazy"}
                                  decoding="async"
                                />
                              );
                            })}
                          </div>

                          <div className="site-nav__mega-preview-copy">
                            <span className="site-nav__mega-preview-name">
                              {isEnglish ? previewGroup.labelEn : previewGroup.label}
                            </span>
                            <p className="site-nav__mega-preview-desc">
                              {isEnglish ? previewConfig.shortDescEn : previewConfig.shortDesc}
                            </p>
                            <CategoryLink
                              href={previewHref}
                              categorySlug={previewGroup.slug}
                              isEnglish={isEnglish}
                              dispatchSelectEvent={!previewGroup.hasPage || isEnglish}
                              onBeforeTransition={() => closeCatalogNow()}
                              className="site-nav__mega-preview-link"
                            >
                              {isEnglish ? "View category →" : "Xem nhóm hàng →"}
                            </CategoryLink>
                          </div>
                        </aside>
                      </div>

                      <div className="site-nav__mega-foot">
                        <span>
                          {isEnglish
                            ? "Need a custom catalog and kitchen specifications?"
                            : "Cần danh mục và quy cách riêng cho bếp?"}
                        </span>
                        <Link
                          href={isEnglish ? "/en/bao-gia" : "/bao-gia"}
                          className="site-nav__mega-cta"
                          onClick={() => closeCatalogNow()}
                        >
                          {isEnglish ? "Request Quote →" : "Gửi yêu cầu báo giá →"}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`site-nav__link ${isActive ? "is-active" : ""}`}
                  onClick={() => dispatchMajorPageTransition(item.href, pathname)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="site-header__actions">
            <div className="site-header__lang-dropdown" ref={langRef}>
              <button
                className="lang-dropdown-toggle"
                onClick={() => setLangOpen(!langOpen)}
                aria-label={isEnglish ? "EN – Change language" : "VI – Đổi ngôn ngữ"}
              >
                {isEnglish ? "EN" : "VI"}
                <ChevronDown size={14} className={`lang-dropdown-icon ${langOpen ? "is-open" : ""}`} />
              </button>

              {langOpen && (
                <div className="lang-dropdown-menu">
                  <Link
                    href={swapLocalePath(pathname, "vi")}
                    className={`lang-item ${!isEnglish ? "is-active" : ""}`}
                    onClick={() => setLangOpen(false)}
                  >
                    <Image src="/images/flag-vi.svg" alt="VI" width={20} height={15} />
                    <span>Tiếng Việt</span>
                    {!isEnglish && <Check size={14} className="lang-check" />}
                  </Link>
                  <Link
                    href={swapLocalePath(pathname, "en")}
                    className={`lang-item ${isEnglish ? "is-active" : ""}`}
                    onClick={() => setLangOpen(false)}
                  >
                    <Image src="/images/flag-en.svg" alt="EN" width={20} height={15} />
                    <span>English</span>
                    {isEnglish && <Check size={14} className="lang-check" />}
                  </Link>
                </div>
              )}
            </div>

            <div className="site-header__cta-group">
              <Link
                href={orderAppUrl}
                className="btn-header-outline"
                title={isEnglish ? "VIP Partner Portal" : "Cổng Đối Tác VIP"}
              >
                <Users size={14} aria-hidden="true" />
                <span className="btn-header-outline__label">{isEnglish ? "VIP Portal" : "Cổng Đối Tác VIP"}</span>
              </Link>
              <Link
                href={isEnglish ? "/en/bao-gia" : "/bao-gia"}
                className="btn-header-primary"
                id="header-rfq-btn"
              >
                {isEnglish ? "Request Quote" : "Gửi yêu cầu báo giá"}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          className="site-mobile-nav__backdrop"
          aria-hidden="true"
          style={{ "--site-header-current-bottom": `${headerBottom}px` } as CSSProperties}
          onClick={closeMobileMenus}
        />
      )}

      <div
        id="site-mobile-nav"
        className={`site-mobile-nav${menuOpen ? " is-open" : ""}`}
        style={{ "--site-header-current-bottom": `${headerBottom}px` } as CSSProperties}
      >
        <div className="container-shell site-mobile-nav__panel">
          <div className="site-mobile-nav__cta-group">
            <Link
              href={orderAppUrl}
              className="btn-header-outline"
              onClick={closeMobileMenus}
            >
              <Users size={16} aria-hidden="true" />
              {isEnglish ? "VIP Portal" : "Cổng Đối Tác VIP"}
            </Link>
            <Link
              href={isEnglish ? "/en/bao-gia" : "/bao-gia"}
              className="btn-header-primary"
              onClick={closeMobileMenus}
            >
              {isEnglish ? "Request Quote" : "Gửi yêu cầu báo giá"}
            </Link>
          </div>
          {navItems.map((item) => {
            const isActive = isNavItemActive(pathname, item.href);

            if (isCatalogNavHref(item.href)) {
              return (
                <div
                  key={item.href}
                  className={`site-mobile-nav__accordion${isActive ? " is-active" : ""}${mobileCatalogOpen ? " is-expanded" : ""}`}
                >
                  <div className="site-mobile-nav__accordion-head">
                    <Link
                      href={item.href}
                      className="site-mobile-nav__accordion-link"
                      onClick={(e) => {
                        if (!mobileCatalogOpen) {
                          e.preventDefault();
                          setMobileCatalogOpen(true);
                          return;
                        }
                        setMenuOpen(false);
                        setMobileCatalogOpen(false);
                        dispatchMajorPageTransition(item.href, pathname);
                        window.dispatchEvent(new CustomEvent("tps1-select-category", { detail: "" }));
                      }}
                    >
                      <span>{item.label}</span>
                    </Link>
                    <button
                      type="button"
                      className={`site-mobile-nav__accordion-toggle${mobileCatalogOpen ? " is-open" : ""}`}
                      aria-expanded={mobileCatalogOpen}
                      aria-label={
                        isEnglish ? "Toggle category list" : "Mở danh sách 10 nhóm hàng"
                      }
                      onClick={() => setMobileCatalogOpen((v) => !v)}
                    >
                      <ChevronDown size={20} aria-hidden="true" />
                    </button>
                  </div>

                  {mobileCatalogOpen && (
                    <div className="site-mobile-nav__sublist">
                      {SKU_GROUPS.map((group) => {
                        const cfg = CATEGORY_TRANSITION_CONFIG[group.slug];
                        const href = catalogGroupHref(group, isEnglish);
                        const subActive = pathname === `/danh-muc/${group.slug}`;
                        const badgeText = isEnglish ? cfg?.featuredBadgeEn : cfg?.featuredBadge;

                        return (
                          <CategoryLink
                            key={group.slug}
                            href={href}
                            categorySlug={group.slug}
                            isEnglish={isEnglish}
                            dispatchSelectEvent={!group.hasPage || isEnglish}
                            onBeforeTransition={closeMobileMenus}
                            aria-current={subActive ? "page" : undefined}
                            className={`site-mobile-nav__sublink${subActive ? " is-active" : ""}`}
                          >
                            <span className="site-mobile-nav__subthumb" aria-hidden="true">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={cfg?.previewImage ?? group.image}
                                alt=""
                                width={44}
                                height={44}
                                loading="lazy"
                                decoding="async"
                              />
                            </span>
                            <span className="site-mobile-nav__subcopy">
                              <span>{isEnglish ? group.labelEn : group.label}</span>
                              {badgeText && (
                                <span className="site-nav__mega-badge">{badgeText}</span>
                              )}
                            </span>
                            <span className="site-mobile-nav__subarrow" aria-hidden="true">
                              →
                            </span>
                          </CategoryLink>
                        );
                      })}
                      <Link
                        href={item.href}
                        className="site-mobile-nav__suball"
                        onClick={() => {
                          setMenuOpen(false);
                          setMobileCatalogOpen(false);
                          window.dispatchEvent(new CustomEvent("tps1-select-category", { detail: "" }));
                        }}
                      >
                        <span>{isEnglish ? "View all products" : "Xem tất cả sản phẩm"}</span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`site-mobile-nav__link${isActive ? " is-active" : ""}`}
                onClick={() => {
                  closeMobileMenus();
                  dispatchMajorPageTransition(item.href, pathname);
                }}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
