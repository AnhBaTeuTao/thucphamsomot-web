import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/lib/content";

const imageMap: Record<string, string> = {
  "rau-cu-qua": "/images/categories/rau-cu-qua.png",
  "thit-heo": "/images/categories/thit-ca.png",
  "hai-san": "/images/tps1-meat-seafood.png",
  "hang-dong-lanh": "/images/categories/dong-lanh.png",
  "gia-vi": "/images/categories/gia-vi.png",
  "thuc-pham-chay": "/images/categories/chay.png",
};

const texts = {
  vi: {
    label: "Danh mục sản phẩm",
    title: <>Đủ đầy nguyên liệu <br />cho mọi thực đơn.</>,
    desc: "Giá được báo riêng cho từng khách hàng theo sản lượng thực tế, vì vậy danh mục không niêm yết giá.",
    btnAll: "Xem toàn bộ danh mục",
    btnLink: "/san-pham",
    rfqTag: "Giá sỉ được báo riêng theo sản lượng của từng gian bếp",
    rfqBtn: "Xem & Yêu cầu báo giá",
    catLinkPrefix: "/danh-muc/",
  },
  en: {
    label: "B2B Catalog",
    title: <>Fulfilling all your <br />kitchen ingredient needs.</>,
    desc: "No public pricing — every order gets a custom quote based on actual volume.",
    btnAll: "View full catalog",
    btnLink: "/en/products",
    rfqTag: "B2B Policy: Contact for a quote — no public pricing displayed",
    rfqBtn: "View & Request Quote",
    catLinkPrefix: "/danh-muc/",
  }
};

const enCategoryOverrides: Record<string, { title: string; description: string; highlights: string[] }> = {
  "rau-cu-qua": {
    title: "Vegetables & Fruits",
    description: "Fresh vegetables for canteens, schools, hospitals, restaurants, and industrial catering.",
    highlights: ["Dalat & West sources", "VietGAP available", "Scheduled delivery"]
  },
  "thit-heo": {
    title: "Pork",
    description: "Pork cut to kitchen specifications for canteens, schools, hospitals, and industrial catering.",
    highlights: ["Custom cuts", "Checked on arrival", "Cold-chain delivery"]
  },
  "hai-san": {
    title: "Seafood",
    description: "Fish, shrimp, squid, and seafood for canteens, hospitals, restaurants, and industrial catering.",
    highlights: ["Daily fresh seafood", "Fresh and frozen", "Custom specs"]
  },
  "hang-dong-lanh": {
    title: "Frozen Foods",
    description: "Frozen foods for kitchens aiming to optimize inventory, maintain quality, and plan ingredients proactively.",
    highlights: ["Cold storage", "Beef, chicken, fish", "For large kitchens"]
  },
  "gia-vi": {
    title: "Seasonings & Spices",
    description: "Asian & Western spices, vegetarian seasonings, and kitchen supplies for professional canteens and restaurants.",
    highlights: ["Chinese cuisine", "Korean cuisine", "Western cuisine", "Full catalog"]
  },
  "thuc-pham-chay": {
    title: "Vegetarian Foods",
    description: "Vegetarian foods and spices for restaurants, canteens, schools, events, and flexible menus.",
    highlights: ["Specialized distributor", "Flexible vegan menus", "Suitable for all"]
  }
};


export function B2BCatalog({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const displayCats = ["rau-cu-qua", "thit-heo", "hai-san", "hang-dong-lanh", "gia-vi"]
    .map((slug) => categories.find((item) => item.slug === slug))
    .filter((item): item is (typeof categories)[number] => Boolean(item));
  const t = texts[locale];

  return (
    <section className="b2b-catalog" aria-labelledby="catalog-heading">
      <div className="container-shell">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "36px",
          }}
        >
          <div>
            <div className="section-label">{t.label}</div>
            <h2 id="catalog-heading" className="section-title">
              {t.title}
            </h2>
            <p className="section-desc" style={{ color: "#374151", fontSize: "18px", lineHeight: 1.7, marginBottom: 0, textWrap: "pretty" }}>
              {t.desc}
            </p>
          </div>
          <Link href={t.btnLink} className="btn-header-internal">
            {t.btnAll} <ArrowRight size={15} />
          </Link>
        </div>

        {/* RFQ notice badge */}
        <div style={{ marginBottom: "24px" }}>
          <span className="b2b-catalog__rfq-tag">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c7372f", display: "inline-block" }} />
            {t.rfqTag}
          </span>
        </div>

        {/* Bento grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: "16px",
          }}
          id="catalog-bento"
        >
          {displayCats.map((baseCat, index) => {
            const bgImage = imageMap[baseCat.slug] || "/images/categories/rau-cu-qua.png";
            const isRow1 = index < 2;
            const colSpan = isRow1 ? "span 6 / span 6" : "span 4 / span 4";
            const minHeight = isRow1 ? "380px" : "260px";

            let title = baseCat.title;
            let description = baseCat.description;
            let highlights = baseCat.highlights ?? [];

            if (locale === "vi" && isRow1) {
              if (baseCat.slug === "rau-cu-qua") {
                description = "Rau củ từ Đà Lạt, miền Tây và Bảo Lộc chọn lựa mỗi ngày, giữ trọn độ tươi trên suốt chặng đường về bếp, để đĩa rau trên bàn nhà hàng hay khay cơm trường học đều xanh mướt như vừa hái.";
                highlights = ["Nguồn Đà Lạt & miền Tây", "Phân loại theo kích cỡ", "Giao đúng ca bếp"];
              } else if (baseCat.slug === "thit-heo") {
                description = "Từ bát canh sườn của quán cơm đến khay thịt kho của bếp công ty, thịt heo có mặt trong hầu hết thực đơn. TPS1 chia phần đúng quy cách và giữ lạnh suốt đường giao, để miếng thịt luôn tươi hồng, săn chắc.";
                highlights = ["Cắt đúng quy cách bếp", "Kiểm tra kỹ khi nhập kho", "Giữ lạnh suốt đường giao"];
              }
            }

            if (locale === "en" && enCategoryOverrides[baseCat.slug]) {
              title = enCategoryOverrides[baseCat.slug].title;
              description = enCategoryOverrides[baseCat.slug].description;
              highlights = enCategoryOverrides[baseCat.slug].highlights;
            }

            // 3 ô dưới (Hải sản, Hàng đông lạnh, Gia vị): Trả về nguyên trạng như cũ
            if (!isRow1) {
              return (
                <div
                  key={baseCat.slug}
                  className="b2b-category-card"
                  style={{ gridColumn: colSpan, minHeight }}
                >
                  <Image
                    src={bgImage}
                    alt={title}
                    fill
                    className="b2b-category-card__img object-cover"
                    sizes="33vw"
                  />
                  <div className="b2b-category-card__overlay" />
                  <div className="b2b-category-card__content">
                    <h3
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 900,
                        marginBottom: "12px",
                        lineHeight: 1.2,
                      }}
                    >
                      {title}
                    </h3>

                    {highlights.slice(0, 2).length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                        {highlights.slice(0, 2).map((h) => (
                          <span
                            key={h}
                            style={{
                              fontSize: "0.72rem",
                              padding: "3px 9px",
                              borderRadius: "999px",
                              background: "rgba(255,255,255,0.14)",
                              border: "1px solid rgba(255,255,255,0.18)",
                            }}
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link href={`${t.catLinkPrefix}${baseCat.slug}`} className="b2b-rfq-btn">
                      {t.rfqBtn} <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            }

            // 2 ô trên (Rau củ quả & Thịt heo): Cân bằng tuyệt đối, không lệch, không thụt
            return (
              <div
                key={baseCat.slug}
                className="b2b-category-card"
                style={{ gridColumn: colSpan, minHeight }}
              >
                <Image
                  src={bgImage}
                  alt={title}
                  fill
                  className="b2b-category-card__img object-cover"
                  sizes="50vw"
                />
                <div
                  className="b2b-category-card__overlay"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(6, 20, 14, 0.82) 0%, rgba(6, 20, 14, 0.60) 45%, rgba(6, 20, 14, 0.90) 100%)",
                  }}
                />
                <div
                  className="b2b-category-card__content"
                  style={{
                    position: "absolute",
                    inset: 0,
                    padding: "28px 28px 24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <h3
                      style={{
                        fontSize: "1.65rem",
                        fontWeight: 900,
                        color: "#ffffff",
                        marginBottom: "12px",
                        lineHeight: 1.25,
                        textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {title}
                    </h3>

                    {description && (
                      <p
                        style={{
                          fontSize: "17.5px",
                          color: "#f8fafc",
                          marginBottom: "16px",
                          lineHeight: 1.62,
                          maxWidth: "520px",
                          fontWeight: 450,
                          textShadow: "0 1px 4px rgba(0, 0, 0, 0.7)",
                          textWrap: "pretty",
                          minHeight: "86px",
                        }}
                      >
                        {description}
                      </p>
                    )}

                    {highlights.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                          marginBottom: "14px",
                          minHeight: "32px",
                          alignItems: "center",
                        }}
                      >
                        {highlights.slice(0, 3).map((h) => (
                          <span
                            key={h}
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: "#ffffff",
                              padding: "4px 11px",
                              borderRadius: "999px",
                              background: "rgba(255, 255, 255, 0.18)",
                              border: "1px solid rgba(255, 255, 255, 0.28)",
                              backdropFilter: "blur(6px)",
                              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                            }}
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`${t.catLinkPrefix}${baseCat.slug}`}
                    className="b2b-rfq-btn"
                    style={{
                      fontSize: "0.85rem",
                      padding: "9px 16px",
                      borderRadius: "10px",
                      marginTop: "auto",
                    }}
                  >
                    {t.rfqBtn} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 768px) {
            #catalog-bento {
              grid-template-columns: 1fr !important;
              gap: 16px !important;
            }
            #catalog-bento > * {
              grid-column: span 1 !important;
            }
            /* 2 Thẻ trên cùng (Rau củ quả & Thịt heo) có mô tả dài + 3 tags + nút CTA: CẦN ĐỦ CHIỀU CAO ĐỂ KHÔNG BỊ CẮT CHỮ */
            #catalog-bento > div:nth-child(-n+2) {
              min-height: 460px !important;
            }
            /* 3 Thẻ hàng dưới (Hải sản, Hàng đông lạnh, Gia vị) */
            #catalog-bento > div:nth-child(n+3) {
              min-height: 260px !important;
            }
            .b2b-category-card__content {
              padding: 22px 20px 20px !important;
            }
            .b2b-category-card__content h3 {
              font-size: 1.35rem !important;
              margin-bottom: 8px !important;
            }
            .b2b-category-card__content p {
              min-height: auto !important;
              font-size: 14.5px !important;
              line-height: 1.55 !important;
              margin-bottom: 12px !important;
            }
          }
        `}} />
      </div>
    </section>
  );
}
