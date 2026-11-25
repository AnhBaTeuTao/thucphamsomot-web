"use client";

import Image from "next/image";
import Link from "next/link";
import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { SKU_GROUPS, SKU_PAGE_SIZE, type SkuPage, type SkuProduct } from "@/lib/sku-catalog";
import type { Locale } from "@/lib/site";

// ─── Category tabs ─────────────────────────────────────────────────────────
const CATEGORIES: Record<Locale, { slug: string; label: string }[]> = {
  vi: [
    { slug: "", label: "Tất cả" },
    ...SKU_GROUPS.map((group) => ({ slug: group.slug, label: group.label })),
  ],
  en: [
    { slug: "", label: "All" },
    ...SKU_GROUPS.map((group) => ({ slug: group.slug, label: group.labelEn })),
  ],
};

const TEXT = {
  vi: {
    unit: "Đơn vị: ",
    priceTag: "Liên hệ báo giá",
    addToCart: "Thêm vào báo giá",
    added: "Đã thêm",
    clearFilters: "Xóa bộ lọc",
    sendQuoteList: "Gửi danh sách báo giá",
    searchPlaceholder: "Tìm tên sản phẩm... (vd: cá basa, thịt vai, cải thảo)",
    searchLabel: "Tìm kiếm tên sản phẩm trong danh mục",
    clearSearch: "Xóa từ khóa tìm kiếm",
    tabsLabel: "Lọc theo nhóm hàng thực phẩm",
    empty: "Không tìm thấy sản phẩm phù hợp. Vui lòng thử từ khóa khác hoặc gửi danh sách cho TPS1.",
    emptyCta: "Gửi danh sách cần mua",
    emptyReset: "Xóa bộ lọc",
    prevPage: "Trang trước",
    nextPage: "Trang sau",
    paginationLabel: "Phân trang danh mục sản phẩm",
    loadingLabel: "Đang tải danh mục sản phẩm",
  },
  en: {
    unit: "Unit: ",
    priceTag: "Contact for quote",
    addToCart: "Add to quote",
    added: "Added",
    clearFilters: "Clear filters",
    sendQuoteList: "Send quote list",
    searchPlaceholder: "Search products... (e.g., basa fish, beef, cabbage)",
    searchLabel: "Search product catalog",
    clearSearch: "Clear search query",
    tabsLabel: "Filter by product category",
    empty: "No matching products found. Try another keyword or send your purchase list to TPS1.",
    emptyCta: "Send purchase list",
    emptyReset: "Clear filters",
    prevPage: "Previous page",
    nextPage: "Next page",
    paginationLabel: "Product catalog pagination",
    loadingLabel: "Loading product catalog",
  },
} as const;

// ─── Subtle IntersectionObserver scroll reveal (fade + 16px translateY) ───
export function SpReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`sp-reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--sp-reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

// ─── Legacy SkuRow export (preserved intact for /danh-muc/[slug]) ──────────
export function SkuRow({
  product,
  index = 99,
  locale = "vi",
}: {
  product: SkuProduct;
  index?: number;
  locale?: Locale;
}) {
  const text = TEXT[locale];

  return (
    <article className="sku-row">
      <div className="sku-row__media">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={index < 5}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="sku-row__img"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/tps1-cover-food.jpg";
          }}
        />
      </div>

      <div className="sku-row__body">
        <div className="sku-row__info">
          <span className="sku-row__cat">{product.categoryLabel}</span>
          <h3 className="sku-row__name" title={product.name}>
            {product.name}
          </h3>
        </div>

        <div className="sku-row__price-unit">
          <span className="sku-row__unit">
            {text.unit}
            <strong>{product.unit}</strong>
          </span>
          <span className="sku-row__price">{text.priceTag}</span>
        </div>

        <div className="sku-row__action">
          <Link
            href={`${locale === "en" ? "/en/contact" : "/lien-he"}?product=${encodeURIComponent(product.name)}`}
            className="sku-row__add"
            title={`${text.addToCart}: ${product.name}`}
          >
            <span>{text.addToCart}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Elevated 4:3 B2B Product Card for /san-pham ───────────────────────────
const SpProductCard = memo(function SpProductCard({
  product,
  locale,
  isAdded,
  onToggleAdd,
}: {
  product: SkuProduct;
  locale: Locale;
  isAdded: boolean;
  onToggleAdd: (product: SkuProduct) => void;
}) {
  const text = TEXT[locale];

  return (
    <article className="sp-card">
      <div className="sp-card__media">
        <Image
          src={product.image}
          alt={`${product.name} - ${product.categoryLabel} sỉ TPS1`}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 960px) 33vw, (max-width: 1200px) 25vw, 20vw"
          className="sp-card__img"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/tps1-cover-food.jpg";
          }}
        />
      </div>

      <div className="sp-card__body">
        <span className="sp-card__cat">{product.categoryLabel}</span>
        <h3 className="sp-card__name" title={product.name}>
          {product.name}
        </h3>

        <div className="sp-card__meta-line">
          <span className="sp-card__unit">
            {text.unit}
            <strong>{product.unit}</strong>
          </span>
          <span className="sp-card__price">{text.priceTag}</span>
        </div>

        <button
          type="button"
          className={`sp-card__cta${isAdded ? " is-added" : ""}`}
          aria-pressed={isAdded}
          onClick={() => onToggleAdd(product)}
        >
          {isAdded ? (
            <>
              <span>{text.added}</span>
              <span aria-hidden="true">✓</span>
            </>
          ) : (
            <>
              <span>{text.addToCart}</span>
              <span className="sp-card__arrow" aria-hidden="true">
                →
              </span>
            </>
          )}
        </button>
      </div>
    </article>
  );
});

function SpSkeletonGrid() {
  return (
    <div className="sp-grid" aria-busy="true" aria-label={TEXT.vi.loadingLabel}>
      {Array.from({ length: 10 }).map((_, idx) => (
        <div key={idx} className="sp-card sp-card--skeleton" aria-hidden="true">
          <div className="sp-card__media sp-skeleton-block" />
          <div className="sp-card__body">
            <span className="sp-skeleton-line sp-skeleton-line--cat" />
            <span className="sp-skeleton-line sp-skeleton-line--title" />
            <span className="sp-skeleton-line sp-skeleton-line--title-short" />
            <div className="sp-card__meta-line">
              <span className="sp-skeleton-line sp-skeleton-line--meta" />
            </div>
            <span className="sp-skeleton-line sp-skeleton-line--link" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── URL ?category= query sync (bọc trong Suspense an toàn) ─────────────────
function CategoryUrlSync({
  validSlugs,
  onSelectCategory,
}: {
  validSlugs: string[];
  onSelectCategory: (slug: string) => void;
}) {
  const searchParams = useSearchParams();
  const appliedCatRef = useRef<string | null>(null);

  useEffect(() => {
    const raw = searchParams.get("category") ?? "";
    const matched = raw && validSlugs.includes(raw) ? raw : "";

    const shouldSync =
      appliedCatRef.current === null
        ? Boolean(matched)
        : appliedCatRef.current !== matched;

    if (!shouldSync) return;

    const timer = window.setTimeout(() => {
      appliedCatRef.current = matched;
      onSelectCategory(matched);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [searchParams, validSlugs, onSelectCategory]);

  return null;
}

// ─── Products Grid (main export) ───────────────────────────────────────────
export function ProductsGrid({
  locale = "vi",
  initialData,
  basePath,
}: {
  locale?: Locale;
  initialData?: SkuPage;
  basePath?: string;
}) {
  const [products, setProducts] = useState<SkuProduct[]>(initialData?.products ?? []);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(!initialData);
  const [page, setPage] = useState(initialData?.page ?? 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages ?? 1);
  const [totalCount, setTotalCount] = useState(initialData?.totalCount ?? 0);
  const [addedProducts, setAddedProducts] = useState<Map<string, string>>(() => new Map());
  const pageSize = initialData?.pageSize ?? SKU_PAGE_SIZE;

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const cacheRef = useRef(
    new Map<string, { products: SkuProduct[]; totalCount: number; totalPages: number }>(
      initialData ? [[`||${initialData.page}`, initialData]] : []
    )
  );

  const text = TEXT[locale];
  const catList = CATEGORIES[locale];
  const validSlugs = useMemo(
    () => catList.map((c) => c.slug).filter(Boolean),
    [catList]
  );

  // Per-category counts from server payload (or full local dataset)
  const categoryCounts = useMemo(() => {
    if (!initialData) return null;
    if (initialData.categoryCounts) {
      const map = new Map<string, number>();
      for (const [slug, count] of Object.entries(initialData.categoryCounts)) {
        map.set(slug, count);
      }
      return map;
    }
    if (initialData.totalPages > 1) return null;
    const map = new Map<string, number>();
    map.set("", initialData.totalCount);
    for (const p of initialData.products) {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    }
    return map;
  }, [initialData]);

  // Adaptive < 80% browser zoom: expand container to 1440px (up to 6 columns)
  useEffect(() => {
    const syncZoomOutAttr = () => {
      const pageEl = document.querySelector(".sp-catalog-page") as HTMLElement | null;
      if (!pageEl) return;
      const ratioZoom =
        window.outerWidth > 0 && window.innerWidth > 0
          ? window.outerWidth / window.innerWidth
          : 1;
      const isZoomedOut =
        (ratioZoom > 0.2 && ratioZoom < 0.8) || window.innerWidth >= 2000;
      if (isZoomedOut) {
        pageEl.setAttribute("data-sp-zoom-out", "true");
      } else {
        pageEl.removeAttribute("data-sp-zoom-out");
      }
    };

    syncZoomOutAttr();
    window.addEventListener("resize", syncZoomOutAttr);
    window.visualViewport?.addEventListener("resize", syncZoomOutAttr);
    return () => {
      window.removeEventListener("resize", syncZoomOutAttr);
      window.visualViewport?.removeEventListener("resize", syncZoomOutAttr);
    };
  }, []);

  const handleUrlCategory = useCallback((slug: string) => {
    setCategory(slug);
    setPage(1);
  }, []);

  useEffect(() => {
    const onSelectEvent = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      if (typeof slug === "string" && (slug === "" || validSlugs.includes(slug))) {
        setCategory(slug);
        setPage(1);
      }
    };
    window.addEventListener("tps1-select-category", onSelectEvent);
    return () => window.removeEventListener("tps1-select-category", onSelectEvent);
  }, [validSlugs]);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(val);
      setPage(1);
    }, 320);
  };

  const resetFilters = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setCategory("");
    setSearch("");
    setQuery("");
    setPage(1);
  };

  const handleToggleAdd = useCallback((product: SkuProduct) => {
    setAddedProducts((prev) => {
      const next = new Map(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.set(product.id, product.name);
      }
      return next;
    });
  }, []);

  const putCache = useCallback(
    (key: string, value: { products: SkuProduct[]; totalCount: number; totalPages: number }) => {
      const cache = cacheRef.current;
      if (cache.has(key)) {
        cache.delete(key);
      } else if (cache.size >= 60) {
        const oldest = cache.keys().next().value;
        if (oldest !== undefined) cache.delete(oldest);
      }
      cache.set(key, value);
    },
    []
  );

  const prefetchNextPage = useCallback(
    (cat: string, q: string, pg: number, maxPages: number) => {
      const nextPg = pg + 1;
      if (nextPg > maxPages) return;
      const nextKey = `${cat}|${q.trim().toLocaleLowerCase()}|${nextPg}`;
      if (cacheRef.current.has(nextKey)) return;

      const params = new URLSearchParams({ page: String(nextPg) });
      if (cat) params.set("category", cat);
      if (q.trim()) params.set("q", q.trim());

      void fetch(`/api/sku-products?${params.toString()}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!data || Array.isArray(data)) return;
          putCache(nextKey, {
            products: data.products || [],
            totalCount: data.totalCount || 0,
            totalPages: data.totalPages || 1,
          });
        })
        .catch(() => {
          // Ignore silent prefetch errors
        });
    },
    [putCache]
  );

  const fetchProducts = useCallback(
    async (cat: string, q: string, pg: number) => {
      const cacheKey = `${cat}|${q.trim().toLocaleLowerCase()}|${pg}`;
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        setProducts(cached.products);
        setTotalCount(cached.totalCount);
        setTotalPages(cached.totalPages);
        setLoading(false);
        prefetchNextPage(cat, q, pg, cached.totalPages);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(pg) });
        if (cat) params.set("category", cat);
        if (q.trim()) params.set("q", q.trim());

        const res = await fetch(`/api/sku-products?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("fetch failed");

        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
          setTotalCount(data.length);
          setTotalPages(1);
        } else {
          const next = {
            products: data.products || [],
            totalCount: data.totalCount || 0,
            totalPages: data.totalPages || 1,
          };
          setProducts(next.products);
          setTotalCount(next.totalCount);
          setTotalPages(next.totalPages);
          putCache(cacheKey, next);
          prefetchNextPage(cat, q, pg, next.totalPages);
        }

        const listTop = document.getElementById("sp-catalog-top");
        if (listTop && pg > 1) {
          listTop.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setProducts([]);
        setTotalCount(0);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [prefetchNextPage, putCache]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchProducts(category, query, page);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [category, query, page, fetchProducts]);

  const hasActiveFilter = Boolean(category || search.trim() || query.trim());

  const resultSummary = useMemo(() => {
    if (loading && products.length === 0) {
      return text.loadingLabel;
    }
    if (totalCount === 0 || products.length === 0) {
      return locale === "en" ? "Showing 0 products" : "Hiển thị 0 mặt hàng";
    }
    const from = (page - 1) * pageSize + 1;
    const to = Math.min(totalCount, from + products.length - 1);
    const totalLabel =
      !category && !query.trim() && totalCount >= 5000
        ? "5.000+"
        : totalCount.toLocaleString("vi-VN");
    if (locale === "en") {
      return `Showing ${from}-${to} of ${totalLabel} products`;
    }
    return `Hiển thị ${from}-${to} trong ${totalLabel} mặt hàng`;
  }, [loading, products.length, totalCount, page, pageSize, category, query, locale, text.loadingLabel]);

  const quoteListHref = useMemo(() => {
    const names = Array.from(addedProducts.values());
    const base = locale === "en" ? "/en/bao-gia" : "/bao-gia";
    if (names.length === 0) return base;
    return `${base}?product=${encodeURIComponent(names.join(", "))}`;
  }, [addedProducts, locale]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    const linkable = Boolean(basePath) && !category && !query.trim();

    const renderBtn = (
      target: number,
      content: ReactNode,
      opts: { active?: boolean; disabled?: boolean; label?: string; keyId?: string } = {}
    ) => {
      const className = `sp-page-btn${opts.active ? " is-active" : ""}`;
      const key = opts.keyId ?? opts.label ?? String(target);
      if (opts.disabled) {
        return (
          <button
            key={key}
            type="button"
            className={className}
            disabled
            aria-label={opts.label}
          >
            {content}
          </button>
        );
      }
      if (linkable) {
        return (
          <a
            key={key}
            href={target === 1 ? basePath : `${basePath}?trang=${target}`}
            className={className}
            aria-label={opts.label}
            aria-current={opts.active ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              setPage(target);
            }}
          >
            {content}
          </a>
        );
      }
      return (
        <button
          key={key}
          type="button"
          className={className}
          aria-label={opts.label}
          aria-current={opts.active ? "page" : undefined}
          onClick={() => setPage(target)}
        >
          {content}
        </button>
      );
    };

    const pageNums: ReactNode[] = [];
    for (let i = start; i <= end; i++) {
      pageNums.push(
        renderBtn(i, i, {
          active: page === i,
          label: locale === "en" ? `Page ${i}` : `Trang ${i}`,
          keyId: `p-${i}`,
        })
      );
    }

    return (
      <nav className="sp-pagination" aria-label={text.paginationLabel}>
        {renderBtn(Math.max(1, page - 1), text.prevPage, {
          disabled: page <= 1,
          label: text.prevPage,
          keyId: "prev",
        })}

        {start > 1 && (
          <>
            {renderBtn(1, 1, { label: locale === "en" ? "Page 1" : "Trang 1", keyId: "first" })}
            {start > 2 && (
              <span className="sp-page-ellipsis" aria-hidden="true">
                …
              </span>
            )}
          </>
        )}

        {pageNums}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <span className="sp-page-ellipsis" aria-hidden="true">
                …
              </span>
            )}
            {renderBtn(totalPages, totalPages, {
              label: locale === "en" ? `Page ${totalPages}` : `Trang ${totalPages}`,
              keyId: "last",
            })}
          </>
        )}

        {renderBtn(Math.min(totalPages, page + 1), text.nextPage, {
          disabled: page >= totalPages,
          label: text.nextPage,
          keyId: "next",
        })}
      </nav>
    );
  };

  return (
    <section className="sp-catalog-section" id="danh-muc" aria-label="Danh sách sản phẩm TPS1">
      <Suspense fallback={null}>
        <CategoryUrlSync validSlugs={validSlugs} onSelectCategory={handleUrlCategory} />
      </Suspense>

      {/* VÙNG 2: TẦNG A STICKY (HÀNG ĐIỀU KHIỂN) + TẦNG B (11 CHIP NHÓM HÀNG HIỆN ĐỦ) */}
      <div className="sp-filterbar">
        <div className="sp-container">
          <div className="sp-filter-top">
            <div className="sp-filter-status">
              <p className="sp-result-count" role="status" aria-live="polite">
                {resultSummary}
              </p>
              {hasActiveFilter && (
                <button
                  type="button"
                  className="sp-filter-reset"
                  onClick={resetFilters}
                >
                  {text.clearFilters}
                </button>
              )}
              {addedProducts.size > 0 && (
                <Link href={quoteListHref} className="sp-quote-pill">
                  {text.sendQuoteList} ({addedProducts.size}) →
                </Link>
              )}
            </div>

            <div className="sp-search">
              <Search size={16} className="sp-search__icon" aria-hidden="true" />
              <input
                type="search"
                id="sku-search-input"
                className="sp-search__input"
                placeholder={text.searchPlaceholder}
                aria-label={text.searchLabel}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="sp-search__clear"
                  onClick={() => handleSearch("")}
                  aria-label={text.clearSearch}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* VÙNG 3: NỀN XÁM XANH #F2F5F1 — KHỐI CHIP TẦNG B + LƯỚI SẢN PHẨM LẤP ĐẦY CONTAINER */}
      <div className="sp-catalog-band" id="sp-catalog-top">
        <div className="sp-container">
          <div className="sp-filter-chips-card">
            <div className="sp-chips-viewport">
              <div className="sp-chips" role="group" aria-label={text.tabsLabel}>
                {catList.map((cat) => {
                  const isActive = category === cat.slug;
                  const count = categoryCounts?.get(cat.slug);
                  return (
                    <button
                      key={cat.slug || "all"}
                      type="button"
                      aria-pressed={isActive}
                      className={`sp-chip${isActive ? " is-active" : ""}`}
                      onClick={() => {
                        setCategory(cat.slug);
                        setPage(1);
                      }}
                    >
                      {isActive && (
                        <span className="sp-chip__check" aria-hidden="true">
                          ✓
                        </span>
                      )}
                      <span>{cat.label}</span>
                      {typeof count === "number" && (
                        <span className="sp-chip__count">{count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {loading && products.length === 0 ? (
            <SpSkeletonGrid />
          ) : products.length === 0 ? (
            <div className="sp-empty" role="status">
              <p className="sp-empty__text">{text.empty}</p>
              <div className="sp-empty__actions">
                <Link
                  href={locale === "en" ? "/en/bao-gia" : "/bao-gia"}
                  className="sp-btn sp-btn--primary"
                >
                  {text.emptyCta}
                </Link>
                {hasActiveFilter && (
                  <button
                    type="button"
                    className="sp-btn sp-btn--outline"
                    onClick={resetFilters}
                  >
                    {text.emptyReset}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div
                className={`sp-grid${loading ? " is-loading" : ""}`}
                aria-busy={loading}
              >
                {products.map((product) => (
                  <SpProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    isAdded={addedProducts.has(product.id)}
                    onToggleAdd={handleToggleAdd}
                  />
                ))}
              </div>
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
