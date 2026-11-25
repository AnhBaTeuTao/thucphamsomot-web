import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { SkuPage } from "@/lib/sku-catalog";

function pageHref(basePath: string, page: number) {
  return page <= 1 ? basePath : `${basePath}?trang=${page}`;
}

export function SkuCatalogSkeleton({ title }: { title?: string }) {
  return (
    <section className="category-catalog" id="san-pham" aria-busy="true" aria-label="Đang tải danh sách sản phẩm">
      <div className="category-catalog__head">
        <h2>{title ?? "Sản phẩm trong nhóm"}</h2>
        <p>Đang tải danh sách mặt hàng...</p>
      </div>
      <div className="sku-list">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="sku-row cat-skel-card" aria-hidden="true">
            <div className="sku-row__media cat-skel" />
            <div className="sku-row__body">
              <div className="cat-skel cat-skel--line-sm" />
              <div className="cat-skel cat-skel--line" />
              <div className="cat-skel cat-skel--btn" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Pure Server Component product list with client-routed <Link> pagination
// (zero heavy client bundle, still works cleanly without JavaScript).
export function SkuCatalogList({
  data,
  basePath,
  title,
}: {
  data: SkuPage;
  basePath: string;
  title: string;
}) {
  const { page, totalPages, totalCount, products } = data;
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <section className="category-catalog" id="san-pham" aria-labelledby="category-catalog-title">
      <div className="category-catalog__head">
        <h2 id="category-catalog-title">{title}</h2>
        <p>
          {totalCount.toLocaleString("vi-VN")} sản phẩm
          {totalPages > 1 ? ` · trang ${page}/${totalPages}` : ""} · giá báo theo sản lượng
        </p>
      </div>

      {products.length === 0 ? (
        <div className="sku-empty">Nhóm hàng đang cập nhật. Vui lòng gửi yêu cầu báo giá để được tư vấn.</div>
      ) : (
        <div className="sku-list">
          {products.map((product, index) => (
            <article
              key={product.id}
              className={`sku-row${index >= 8 ? " sku-row--deferred" : ""}`}
            >
              <div className="sku-row__media">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  loading={index < 4 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="sku-row__img"
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
                    Đơn vị: <strong>{product.unit}</strong>
                  </span>
                  <span className="sku-row__price">Liên hệ báo giá</span>
                </div>

                <div className="sku-row__action">
                  <Link
                    href={`/lien-he?product=${encodeURIComponent(product.name)}`}
                    className="sku-row__add"
                    title={`Thêm vào báo giá: ${product.name}`}
                  >
                    <span>Thêm vào báo giá</span>
                    <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="sku-pagination" aria-label="Phân trang sản phẩm">
          {page > 1 ? (
            <Link className="sku-page-btn" href={pageHref(basePath, page - 1)} rel="prev" aria-label="Trang trước">
              <ChevronLeft size={16} />
            </Link>
          ) : null}
          {start > 1 ? (
            <>
              <Link className="sku-page-btn" href={pageHref(basePath, 1)}>1</Link>
              {start > 2 ? <span className="sku-page-ellipsis">...</span> : null}
            </>
          ) : null}
          {pages.map((i) => (
            <Link
              key={i}
              className={`sku-page-btn${i === page ? " is-active" : ""}`}
              href={pageHref(basePath, i)}
              aria-current={i === page ? "page" : undefined}
            >
              {i}
            </Link>
          ))}
          {end < totalPages ? (
            <>
              {end < totalPages - 1 ? <span className="sku-page-ellipsis">...</span> : null}
              <Link className="sku-page-btn" href={pageHref(basePath, totalPages)}>{totalPages}</Link>
            </>
          ) : null}
          {page < totalPages ? (
            <Link className="sku-page-btn" href={pageHref(basePath, page + 1)} rel="next" aria-label="Trang sau">
              <ChevronRight size={16} />
            </Link>
          ) : null}
        </nav>
      ) : null}
    </section>
  );
}
