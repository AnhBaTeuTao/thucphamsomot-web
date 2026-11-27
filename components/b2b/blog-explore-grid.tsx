"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";

const PAGE_SIZE = 12;
const INITIAL_VISIBLE = 6;

export type BlogExploreItem = {
  slug: string;
  href?: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  readingTime: string;
  publishedLabel: string;
};

/**
 * Interactive 3-column "Khám Phá Thêm" / "Explore More" grid for /blog and /en/news:
 * shows 6 posts initially -> expands to 12 on "Xem thêm" -> paginates cleanly when > 12 posts.
 */
export function BlogExploreGrid({
  items,
  locale = "vi",
}: {
  items: BlogExploreItem[];
  locale?: "vi" | "en";
}) {
  const isEn = locale === "en";
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  if (items.length === 0) return null;

  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const pageArticles = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const visibleArticles = isExpanded ? pageArticles : pageArticles.slice(0, INITIAL_VISIBLE);

  const showLoadMore = pageArticles.length > INITIAL_VISIBLE && !isExpanded;
  const showPagination = totalPages > 1 && (isExpanded || pageArticles.length <= INITIAL_VISIBLE);

  const handlePageChange = (targetPage: number) => {
    const next = Math.min(Math.max(1, targetPage), totalPages);
    if (next === safePage) return;
    setCurrentPage(next);
    setIsExpanded(false);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={sectionRef} className="blog-grid-divider mt-16 pt-16 scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h2 className="section-title" style={{ margin: 0 }}>
          {isEn ? "Explore More Articles" : "Khám Phá Thêm"}
        </h2>
        {totalPages > 1 && (
          <span className="blog-grid-counter">
            {isEn ? `Page ${safePage} / ${totalPages}` : `Trang ${safePage} / ${totalPages}`}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleArticles.map((article) => {
          const linkHref = article.href ?? `/blog/${article.slug}`;
          return (
            <article key={article.slug} className="blog-grid-card group">
              <Link href={linkHref} className="blog-grid-card__media block relative aspect-[16/10]">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="blog-grid-card__img object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="blog-grid-card__pill">{article.category}</span>
                </div>
              </Link>
              <div className="p-6">
                <div className="blog-grid-card__meta flex items-center gap-4 text-xs mb-3">
                  <span className="flex items-center">
                    <CalendarDays size={14} className="mr-1.5 opacity-80" /> {article.publishedLabel}
                  </span>
                  <span className="flex items-center">
                    <Clock3 size={14} className="mr-1.5 opacity-80" /> {article.readingTime}
                  </span>
                </div>
                <Link href={linkHref} className="block mt-2">
                  <h3 className="blog-grid-card__title text-xl leading-tight line-clamp-2">{article.title}</h3>
                  <p className="blog-grid-card__excerpt mt-3 text-sm line-clamp-3">{article.excerpt}</p>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {showLoadMore && (
        <div className="blog-loadmore-wrap">
          <button
            type="button"
            className="blog-loadmore-btn"
            onClick={() => setIsExpanded(true)}
          >
            <span>{isEn ? "Load more articles" : "Xem thêm bài viết"}</span>
            <ChevronDown size={18} aria-hidden="true" />
          </button>
        </div>
      )}

      {showPagination && (
        <nav
          className="blog-pagination"
          aria-label={isEn ? "Article pagination" : "Phân trang bài viết Khám Phá Thêm"}
        >
          <button
            type="button"
            className="blog-page-btn blog-page-btn--nav"
            disabled={safePage <= 1}
            onClick={() => handlePageChange(safePage - 1)}
            aria-label={isEn ? "Previous page" : "Trang trước"}
          >
            <ChevronLeft size={16} aria-hidden="true" />
            <span>{isEn ? "Previous" : "Trang trước"}</span>
          </button>

          <div className="blog-pagination__numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                className={`blog-page-btn blog-page-btn--num${pageNum === safePage ? " is-active" : ""}`}
                aria-current={pageNum === safePage ? "page" : undefined}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="blog-page-btn blog-page-btn--nav"
            disabled={safePage >= totalPages}
            onClick={() => handlePageChange(safePage + 1)}
            aria-label={isEn ? "Next page" : "Trang sau"}
          >
            <span>{isEn ? "Next" : "Trang sau"}</span>
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </nav>
      )}
    </div>
  );
}
