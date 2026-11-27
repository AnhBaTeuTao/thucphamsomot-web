"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/content";
import { SKU_GROUPS } from "@/lib/sku-catalog";
import { useSmoothTilt } from "@/components/b2b/use-smooth-tilt";
import { ScrollReveal } from "@/components/b2b/scroll-reveal";
import { CategoryLink } from "@/components/b2b/category-link";

const imageMap: Record<string, string> = {
  "rau-cu-qua": "/images/categories/rau-cu-qua.png",
  "thit-heo": "/images/categories/thit-ca.png",
  "hai-san": "/images/tps1-meat-seafood.png",
  "hang-dong-lanh": "/images/categories/dong-lanh.png",
  "gia-vi": "/images/categories/gia-vi.png",
};

// Ultra-light WebP circular thumbnails for all 10 quick-access sourcing groups
const quickThumbMap: Record<string, string> = {
  "rau-cu-qua": "/images/intro/medal-produce.webp",
  "thit-heo": "/images/intro/medal-meat.webp",
  "thit-bo": "/images/intro/wall-meat.webp",
  "gia-cam": "/images/intro/wall-canteen.webp",
  "hai-san": "/images/intro/medal-seafood.webp",
  "hang-dong-lanh": "/images/intro/medal-frozen.webp",
  "gia-vi": "/images/intro/medal-spices.webp",
  "do-kho": "/images/intro/wall-spices.webp",
  "thuc-pham-chay": "/images/intro/medal-vegan.webp",
  "thiet-bi-bep": "/images/intro/wall-loading.webp",
};

const texts = {
  vi: {
    label: "Danh mục sản phẩm",
    title: "Danh mục thực phẩm sỉ cho bếp ăn: rau củ, thịt cá, đông lạnh, đồ khô & gia vị",
    desc: "Danh mục giúp khách hàng chọn nhóm hàng cần mua. TPS1 báo giá riêng theo số lượng đặt hàng thực tế.",
    btnAll: "Xem toàn bộ danh mục",
    btnLink: "/san-pham",
    rfqTag: "Báo giá riêng theo số lượng đặt hàng",
    rfqBtn: "Xem và yêu cầu báo giá",
    quickHeading: "Truy cập nhanh toàn bộ 10 nhóm nguồn hàng TPS1",
    quickCountLabel: "10 nhóm nguồn hàng",
    catLinkPrefix: "/danh-muc/",
  },
  en: {
    label: "Product catalog",
    title: "Wholesale food catalog for kitchens: produce, meat, seafood, frozen goods, dry goods & seasonings",
    desc: "Browse product groups to build your buying list. TPS1 provides custom wholesale quotes based on your actual order volume.",
    btnAll: "View full product catalog",
    btnLink: "/en/products",
    rfqTag: "Custom quotes based on order volume",
    rfqBtn: "View and request quote",
    quickHeading: "Quick access to all 10 TPS1 sourcing groups",
    quickCountLabel: "10 sourcing groups",
    catLinkPrefix: "/en/products?category=",
  },
};

const viCategoryCopy: Record<
  string,
  { title: string; specBadge: string; description: string; highlights: string[] }
> = {
  "rau-cu-qua": {
    title: "Rau củ quả",
    specBadge: "Báo giá riêng theo số lượng đặt hàng",
    description:
      "TPS1 cung cấp rau củ từ Đà Lạt, miền Tây và Bảo Lộc, lựa chọn theo ngày và giao theo lịch của bếp. Hàng được phân loại theo kích cỡ, độ chín để phù hợp với nhu cầu chế biến.",
    highlights: [
      "Nguồn rau từ Đà Lạt, miền Tây, Bảo Lộc",
      "Phân loại theo kích cỡ và độ chín",
      "Giao đúng giờ bếp cần",
    ],
  },
  "thit-heo": {
    title: "Thịt heo",
    specBadge: "Báo giá riêng theo số lượng đặt hàng",
    description:
      "TPS1 cung cấp thịt heo cho nhà hàng, quán ăn và bếp ăn tập thể. Thịt được chia phần theo quy cách đặt hàng, kiểm tra khi nhập kho và giữ lạnh trong quá trình giao.",
    highlights: [
      "Cắt đúng quy cách của bếp",
      "Kiểm tra kỹ khi nhập kho",
      "Giữ lạnh suốt đường giao",
    ],
  },
  "hai-san": {
    title: "Hải sản",
    specBadge: "Báo giá riêng theo số lượng đặt hàng",
    description: "",
    highlights: ["Hải sản về kho mỗi ngày", "Đủ hàng tươi và đông lạnh"],
  },
  "hang-dong-lanh": {
    title: "Hàng đông lạnh",
    specBadge: "Báo giá riêng theo số lượng đặt hàng",
    description: "",
    highlights: ["Bảo quản trong kho lạnh riêng", "Thịt bò, gà, cá và hải sản"],
  },
  "gia-vi": {
    title: "Gia vị",
    specBadge: "Báo giá riêng theo số lượng đặt hàng",
    description: "",
    highlights: ["Gia vị Việt, Hoa, Hàn, Âu", "Gia vị chay mặn đầy đủ"],
  },
};

const enCategoryOverrides: Record<
  string,
  { title: string; specBadge: string; description: string; highlights: string[] }
> = {
  "rau-cu-qua": {
    title: "Vegetables & fruits",
    specBadge: "Custom quotes based on order volume",
    description:
      "TPS1 supplies fresh produce from Da Lat, the Mekong Delta, and Bao Loc, selected daily and delivered according to your kitchen's schedule. Produce is graded by size and ripeness to match your cooking requirements.",
    highlights: [
      "Sourced from Da Lat, Mekong Delta, Bao Loc",
      "Graded by size and ripeness",
      "Delivered right when your kitchen needs",
    ],
  },
  "thit-heo": {
    title: "Fresh pork",
    specBadge: "Custom quotes based on order volume",
    description:
      "TPS1 supplies fresh pork for restaurants, eateries, and collective canteens. Meat is portioned to your order specifications, inspected upon warehouse arrival, and kept chilled throughout delivery.",
    highlights: [
      "Cut to your kitchen specifications",
      "Inspected upon warehouse arrival",
      "Chilled throughout delivery",
    ],
  },
  "hai-san": {
    title: "Seafood",
    specBadge: "Custom quotes based on order volume",
    description: "",
    highlights: ["Daily seafood arrivals at our warehouse", "Full range of fresh and frozen items"],
  },
  "hang-dong-lanh": {
    title: "Frozen goods",
    specBadge: "Custom quotes based on order volume",
    description: "",
    highlights: ["Stored in dedicated cold rooms", "Beef, poultry, fish, and seafood"],
  },
  "gia-vi": {
    title: "Seasonings & spices",
    specBadge: "Custom quotes based on order volume",
    description: "",
    highlights: ["Vietnamese, Chinese, Korean & Western spices", "Full savory and vegetarian seasonings"],
  },
};

function TiltSpotlightCard({
  isRow1,
  bgImage,
  specBadge,
  title,
  description,
  highlights,
  targetHref,
  rfqBtn,
  index,
}: {
  isRow1: boolean;
  bgImage: string;
  specBadge: string;
  title: string;
  description: string;
  highlights: string[];
  targetHref: string;
  rfqBtn: string;
  index: number;
}) {
  const { ref, onMouseMove, onMouseLeave } = useSmoothTilt<HTMLDivElement>({
    maxTilt: 4.2,
    damping: 0.12,
  });

  return (
    <ScrollReveal
      delay={index * 50}
      className={`b2b-category-card-wrap tps1-mosaic-slot--${index} ${isRow1 ? "b2b-category-card--featured" : "b2b-category-card--compact"}`}
    >
      <div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="b2b-category-card-hitbox"
      >
        <div
          ref={ref}
          className={`b2b-category-card ${isRow1 ? "b2b-category-card--featured" : "b2b-category-card--compact"}`}
        >
        <Image
          src={bgImage}
          alt={title}
          fill
          className="b2b-category-card__img object-cover"
          sizes={isRow1 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        <div className="b2b-category-card__overlay" />
        <div className="b2b-category-card__spotlight" aria-hidden="true" />
        <div className="b2b-category-card__content">
          {specBadge && (
            <div className="b2b-category-card__spec-badge">
              <span className="b2b-category-card__spec-dot" aria-hidden="true" />
              <span>{specBadge}</span>
            </div>
          )}

          <div className="b2b-category-card__bottom">
            <div className="b2b-category-card__top">
              <h3>{title}</h3>
              {description && <p>{description}</p>}

              {highlights.length > 0 && (
                <div className="b2b-category-card__tags">
                  {highlights.slice(0, isRow1 ? 3 : 2).map((h) => (
                    <span key={h} className="b2b-category-card__tag">
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <CategoryLink href={targetHref} className="b2b-rfq-btn">
              <span>{rfqBtn}</span>
              <ArrowRight size={15} />
            </CategoryLink>
          </div>
        </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function B2BCatalog({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const displayCats = ["rau-cu-qua", "thit-heo", "hai-san", "hang-dong-lanh", "gia-vi"]
    .map((slug) => categories.find((item) => item.slug === slug))
    .filter((item): item is (typeof categories)[number] => Boolean(item));
  const t = texts[locale];

  return (
    <section className="b2b-catalog" aria-labelledby="catalog-heading">
      <div className="container-shell">
        <ScrollReveal className="b2b-catalog-header">
          <div className="b2b-catalog-header-copy">
            <div className="b2b-catalog-header__kicker">
              <div className="section-label">{t.label}</div>
              <div className="b2b-catalog__rfq-tag">
                <span className="b2b-catalog__rfq-dot" aria-hidden="true" />
                <span>{t.rfqTag}</span>
              </div>
            </div>
            <h2 id="catalog-heading" className="b2b-catalog-header__title">
              {locale === "vi" ? (
                <>
                  Danh mục thực phẩm sỉ cho bếp ăn:{" "}
                  <br className="b2b-catalog-header__br" />
                  rau củ, thịt cá, đông lạnh, đồ khô &amp; gia vị
                </>
              ) : (
                t.title
              )}
            </h2>
            <p className="b2b-catalog-header__desc">{t.desc}</p>
          </div>

          <Link href={t.btnLink} className="btn-secondary b2b-catalog__all-btn">
            <span>{t.btnAll}</span>
            <ArrowRight size={16} />
          </Link>
        </ScrollReveal>

        <div id="catalog-bento" className="b2b-catalog-bento">
          {displayCats.map((baseCat, index) => {
            const bgImage = imageMap[baseCat.slug] || "/images/categories/rau-cu-qua.png";
            const isRow1 = index < 2;

            let title = baseCat.title;
            let specBadge = "";
            let description = baseCat.description || "";
            let highlights = baseCat.highlights ?? [];

            if (locale === "vi" && viCategoryCopy[baseCat.slug]) {
              title = viCategoryCopy[baseCat.slug].title;
              specBadge = viCategoryCopy[baseCat.slug].specBadge;
              description = viCategoryCopy[baseCat.slug].description;
              highlights = viCategoryCopy[baseCat.slug].highlights;
            }

            if (locale === "en" && enCategoryOverrides[baseCat.slug]) {
              title = enCategoryOverrides[baseCat.slug].title;
              specBadge = enCategoryOverrides[baseCat.slug].specBadge;
              description = enCategoryOverrides[baseCat.slug].description;
              highlights = enCategoryOverrides[baseCat.slug].highlights;
            }

            const targetHref =
              locale === "en"
                ? `/en/products?category=${baseCat.slug}#danh-muc`
                : `${t.catLinkPrefix}${baseCat.slug}`;

            return (
              <TiltSpotlightCard
                key={baseCat.slug}
                index={index}
                isRow1={isRow1}
                bgImage={bgImage}
                specBadge={specBadge}
                title={title}
                description={description}
                highlights={highlights}
                targetHref={targetHref}
                rfqBtn={t.rfqBtn}
              />
            );
          })}
        </div>

        {/* Dải truy cập nhanh đầy đủ 10 nhóm nguồn hàng TPS1 kèm ảnh tròn WebP 40x40 */}
        <ScrollReveal className="b2b-catalog-quick">
          <div className="b2b-catalog-quick__head">
            <p className="b2b-catalog-quick__heading">{t.quickHeading}</p>
            <span className="b2b-catalog-quick__count">{t.quickCountLabel}</span>
          </div>
          <div className="b2b-catalog-quick__grid">
            {SKU_GROUPS.map((group) => {
              const href =
                locale === "en"
                  ? `/en/products?category=${group.slug}#danh-muc`
                  : group.hasPage
                    ? `/danh-muc/${group.slug}`
                    : `/san-pham?category=${group.slug}#danh-muc`;
              const thumbSrc = quickThumbMap[group.slug] || "/images/intro/medal-produce.webp";
              const groupLabel = locale === "en" ? group.labelEn : group.label;

              return (
                <div key={group.slug}>
                  <CategoryLink
                    href={href}
                    categorySlug={group.slug}
                    isEnglish={locale === "en"}
                    dispatchSelectEvent={!group.hasPage || locale === "en"}
                    className="b2b-catalog-quick__item"
                  >
                    <span className="b2b-catalog-quick__thumb" aria-hidden="true">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumbSrc}
                        alt=""
                        width={40}
                        height={40}
                        loading="lazy"
                        decoding="async"
                        className="b2b-catalog-quick__thumb-img"
                      />
                    </span>
                    <span className="b2b-catalog-quick__label">{groupLabel}</span>
                    <ArrowRight size={15} className="b2b-catalog-quick__arrow" aria-hidden="true" />
                  </CategoryLink>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
