import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, Truck } from "lucide-react";
import { makeMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { INDUSTRY_SECTORS } from "@/lib/industries-showcase";
import { IndustrySpotlight } from "@/components/b2b/industry-spotlight";

export const metadata: Metadata = makeMetadata({
  title: "Hệ sinh thái 6 mô hình bếp ăn B2B | Thực Phẩm Số Một",
  description:
    "Khám phá đặc thù vận hành, tiêu chuẩn sơ chế và lịch xe lạnh riêng cho 6 mô hình bếp ăn: Nhà hàng, Quán ăn F&B, Trường học, Nhà máy KCN, Bệnh viện và Suất ăn.",
  path: "/nganh-hang",
});

const B2B_PROOF_METRICS = [
  {
    value: "109+",
    label: "Doanh nghiệp và bếp ăn đang hợp tác",
  },
  {
    value: "5.000+",
    label: "Mã sản phẩm trong danh mục",
  },
  {
    value: "99,8%",
    label: "Đơn hàng giao đúng hẹn",
  },
  {
    value: "Từ 2017",
    label: "Phục vụ Đồng Nai, TP.HCM và tỉnh lân cận",
  },
];

export default function NganhHangPage() {
  return (
    <main className="nh-page">
      {/* 1. HERO — ĐỒNG BỘ 100% VỚI /QUY-TRINH */}
      <section className="b2b-process-hero">
        <Image
          src="/images/about/hero_v2.jpg"
          alt="Hệ sinh thái cung ứng thực phẩm B2B Thực Phẩm Số Một"
          fill
          className="object-cover b2b-about-hero__bg"
          priority
          sizes="100vw"
        />
        <div className="b2b-about-hero__overlay" />
        <div className="container-shell position-relative z-10 text-center">
          <div className="b2b-about-hero__content" style={{ margin: "0 auto" }}>
            <div className="section-label" style={{ color: "#4ade80", justifyContent: "center" }}>
              Ngành hàng phục vụ
            </div>
            <h1 className="b2b-process-hero__title">
              Mỗi gian bếp<br />
              <span style={{ color: "#4ade80" }}>một nhịp vận hành riêng</span>
            </h1>
            <p className="b2b-process-hero__desc">
              Từ nhà hàng, quán ăn đến bếp nhà máy, trường học và bệnh viện, TPS1 chuẩn hóa{" "}
              <strong className="b2b-hero__sub-hl">quy cách sơ chế, lịch xe lạnh và hồ sơ pháp lý</strong> khớp với từng gian bếp.
            </p>
          </div>
        </div>
      </section>

      {/* DẢI 4 CHỈ SỐ BẢO CHỨNG CUNG ỨNG B2B */}
      <section className="nh-metrics-band" aria-label="4 chỉ số bảo chứng cung ứng B2B">
        <div className="container-shell">
          <div className="nh-metrics-grid">
            {B2B_PROOF_METRICS.map((metric) => (
              <div key={metric.value} className="nh-metric-card">
                <strong className="nh-metric-card__value">{metric.value}</strong>
                <span className="nh-metric-card__label">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2A. LIGHT CULINARY INTERACTIVE SPOTLIGHT */}
      <section
        id="spotlight"
        className="nh-showcase-section"
        aria-labelledby="nh-spotlight-heading"
      >
        <div className="container-shell">
          <div className="nh-section-head">
            <div>
              <div className="section-label">Sân khấu tương tác ngành hàng</div>
              <h2 id="nh-spotlight-heading" className="section-title nh-section-head__title">
                Chạm từng mô hình để xem chuẩn vận hành
              </h2>
            </div>
            <p className="nh-section-head__sub">
              Từ pha lóc định lượng bếp trưởng đến hồ sơ an toàn trường học và ca kíp nhà máy KCN.
            </p>
          </div>

          <IndustrySpotlight items={INDUSTRY_SECTORS} />
        </div>
      </section>

      {/* 2B. CULINARY EDITORIAL ASYMMETRIC BENTO GRID */}
      <section className="nh-bento-section" aria-labelledby="nh-bento-heading">
        <div className="container-shell">
          <div className="nh-section-head">
            <div>
              <div className="section-label">Hệ sinh thái 6 ngành hàng</div>
              <h2 id="nh-bento-heading" className="section-title nh-section-head__title">
                Toàn cảnh giải pháp theo từng loại hình bếp ăn
              </h2>
            </div>
            <p className="nh-section-head__sub">
              Chọn trực tiếp từng ô ảnh để xem chi tiết danh mục, quy cách đóng gói và chứng từ đi kèm.
            </p>
          </div>

          <div className="nh-bento-grid">
            {INDUSTRY_SECTORS.map((ind) => (
              <Link
                key={ind.slug}
                id={`bento-${ind.slug}`}
                href={`/nganh-hang/${ind.slug}`}
                className={`nh-bento-card nh-bento-card--span-${ind.bentoSpan}`}
              >
                <div className="nh-bento-card__media">
                  <Image
                    src={ind.image}
                    alt={ind.imageAlt}
                    fill
                    sizes={
                      ind.bentoSpan === 7
                        ? "(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 58vw"
                        : ind.bentoSpan === 6
                          ? "(max-width: 768px) 100vw, 50vw"
                          : "(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 42vw"
                    }
                    className="nh-bento-card__img"
                  />
                  <div className="nh-bento-card__photo-bar">
                    <span className="nh-bento-card__badge">
                      <b>{ind.num}</b>
                      <span>{ind.tag}</span>
                    </span>
                    <span className="nh-bento-card__time-pill">
                      <Truck size={14} aria-hidden="true" />
                      <span>{ind.dispatchTime}</span>
                    </span>
                  </div>
                </div>

                <div className="nh-bento-card__panel">
                  <h3 className="nh-bento-card__title">{ind.title}</h3>
                  <p className="nh-bento-card__desc">{ind.bentoDesc}</p>

                  <div className="nh-bento-card__footer">
                    <div className="nh-bento-card__chips">
                      {ind.chips.map((chip) => (
                        <span key={chip} className="nh-bento-card__chip">
                          {chip}
                        </span>
                      ))}
                    </div>

                    <span className="nh-bento-card__cta">
                      <span>Khám phá ngành</span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HORIZON CTA STAGE — ĐỒNG BỘ TRANG CHỦ & GIỚI THIỆU */}
      <section className="tps1-horizon-cta nh-horizon-cta" aria-label="Liên hệ nhận báo giá sỉ">
        <div className="container-shell">
          <div className="tps1-horizon-stage">
            <div className="tps1-horizon-stage__aurora" aria-hidden="true" />
            <div className="tps1-horizon-stage__grid" aria-hidden="true" />
            <div className="tps1-horizon-stage__content">
              <h2 className="section-title-light tps1-about-cta__title">
                Nhận báo giá riêng cho gian bếp trong 24 giờ
              </h2>
              <p className="tps1-about-cta__desc">
                Gửi danh sách nguyên liệu hoặc thực đơn tuần, TPS1 sẽ thiết kế bảng giá sỉ và lịch xe lạnh khớp với giờ nhận hàng của bếp.
              </p>
              <div className="nh-horizon-cta__actions">
                <Link href="/bao-gia" className="btn-hero-primary tps1-about-cta__btn">
                  <span>Gửi yêu cầu báo giá</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                  className="nh-horizon-cta__phone"
                >
                  <Phone size={17} aria-hidden="true" />
                  <span>Hotline: {siteConfig.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
