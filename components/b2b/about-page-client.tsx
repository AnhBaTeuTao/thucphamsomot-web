"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Search,
  ShieldCheck,
  TrendingDown,
  Truck,
  X,
} from "lucide-react";
import { ScrollReveal } from "@/components/b2b/scroll-reveal";

export type AboutCertificate = {
  id: string;
  title: string;
  desc: string;
  src: string;
  alt: string;
  seal: string;
};

const CERTIFICATES: AboutCertificate[] = [
  {
    id: "vsattp",
    title: "VSATTP",
    desc: "Cơ sở đủ điều kiện an toàn thực phẩm.",
    src: "/images/about/vsattp_cert.jpg",
    alt: "Giấy chứng nhận VSATTP",
    seal: "Verified",
  },
  {
    id: "iso",
    title: "ISO 22000:2018",
    desc: "Hệ thống quản lý an toàn thực phẩm.",
    src: "/images/about/iso_cert.jpg",
    alt: "Chứng nhận ISO 22000:2018",
    seal: "ISO 22000",
  },
  {
    id: "haccp",
    title: "HACCP Codex",
    desc: "Phân tích mối nguy và kiểm soát điểm tới hạn.",
    src: "/images/about/haccp_cert.jpg",
    alt: "Chứng nhận HACCP",
    seal: "HACCP",
  },
  {
    id: "insurance-1",
    title: "Bảo hiểm trách nhiệm sản phẩm",
    desc: "Do Bảo hiểm VietinBank (VBI) cấp, tổng hạn mức 5 tỷ đồng.",
    src: "/images/about/insurance_1.jpg",
    alt: "Bảo hiểm trách nhiệm sản phẩm",
    seal: "VBI · 5 tỷ",
  },
  {
    id: "insurance-2",
    title: "Mức bồi thường",
    desc: "Hạn mức chi tiết cho thiệt hại về người và tài sản.",
    src: "/images/about/insurance_2.jpg",
    alt: "Bảo hiểm trách nhiệm sản phẩm - Trang 2",
    seal: "Hợp đồng VBI",
  },
];

const CERTIFICATES_EN: AboutCertificate[] = [
  {
    id: "vsattp",
    title: "Food Safety Certificate",
    desc: "Certified facility meeting national food safety conditions (VSATTP).",
    src: "/images/about/vsattp_cert.jpg",
    alt: "Food Safety Certificate (VSATTP)",
    seal: "Verified",
  },
  {
    id: "iso",
    title: "ISO 22000:2018",
    desc: "International food safety management system.",
    src: "/images/about/iso_cert.jpg",
    alt: "ISO 22000:2018 Certificate",
    seal: "ISO 22000",
  },
  {
    id: "haccp",
    title: "HACCP Codex",
    desc: "Hazard analysis and critical control points system.",
    src: "/images/about/haccp_cert.jpg",
    alt: "HACCP Certificate",
    seal: "HACCP",
  },
  {
    id: "insurance-1",
    title: "Product liability insurance",
    desc: "Issued by VietinBank Insurance (VBI), total coverage of VND 5 billion.",
    src: "/images/about/insurance_1.jpg",
    alt: "Product liability insurance policy",
    seal: "VBI · VND 5B",
  },
  {
    id: "insurance-2",
    title: "Indemnity coverage schedule",
    desc: "Detailed compensation limits for personal injury and property damage.",
    src: "/images/about/insurance_2.jpg",
    alt: "Product liability insurance - Page 2",
    seal: "VBI Policy",
  },
];

const CORE_VALUES = [
  {
    text: "Nguồn gốc minh bạch, kiểm dịch mỗi ngày",
    icon: ShieldCheck,
  },
  {
    text: "Giao hàng đúng giờ, đúng quy cách",
    icon: Truck,
  },
  {
    text: "Bình ổn giá, giúp bếp chủ động kiểm soát chi phí",
    icon: TrendingDown,
  },
];

const CORE_VALUES_EN = [
  {
    text: "Transparent origin, daily veterinary & safety checks",
    icon: ShieldCheck,
  },
  {
    text: "On-time delivery, exact kitchen specifications",
    icon: Truck,
  },
  {
    text: "Price stability, helping kitchens proactively control meal costs",
    icon: TrendingDown,
  },
];

type CapacityPanoramaMetric = {
  id: string;
  indexLabel: string;
  shortIndex: string;
  finalMain: string;
  finalSuffix: string;
  label: string;
  kind: "int-plus" | "thousand-plus" | "hours-247" | "billion";
  target: number;
  bgSrc: string;
  bgAlt: string;
};

type MetricDisplayParts = {
  main: string;
  suffix: string;
};

const CAPACITY_METRICS: CapacityPanoramaMetric[] = [
  {
    id: "clients",
    indexLabel: "01 / 04",
    shortIndex: "01",
    finalMain: "109",
    finalSuffix: "+",
    label: "Doanh nghiệp và bếp ăn tin chọn",
    kind: "int-plus",
    target: 109,
    bgSrc: "/images/industries/bep-an-tap-the-vn.png",
    bgAlt: "Bếp ăn công nghiệp và nhà hàng đối tác TPS1",
  },
  {
    id: "skus",
    indexLabel: "02 / 04",
    shortIndex: "02",
    finalMain: "5.000",
    finalSuffix: "+",
    label: "Mã sản phẩm trong danh mục",
    kind: "thousand-plus",
    target: 5000,
    bgSrc: "/images/categories/rau-cu-qua.png",
    bgAlt: "Danh mục hơn 5.000 mã thực phẩm tươi sạch TPS1",
  },
  {
    id: "fleet",
    indexLabel: "03 / 04",
    shortIndex: "03",
    finalMain: "24",
    finalSuffix: "/7",
    label: "Đội xe lạnh sẵn sàng giao hàng",
    kind: "hours-247",
    target: 24,
    bgSrc: "/images/tps1-warehouse-wide.jpg",
    bgAlt: "Kho vận quy mô lớn và điều phối xe lạnh TPS1 24/7",
  },
  {
    id: "insurance",
    indexLabel: "04 / 04",
    shortIndex: "04",
    finalMain: "5",
    finalSuffix: " tỷ",
    label: "Bảo hiểm trách nhiệm sản phẩm",
    kind: "billion",
    target: 5,
    bgSrc: "/images/tps1-meat-seafood.png",
    bgAlt: "Kiểm soát an toàn thực phẩm và bảo hiểm trách nhiệm 5 tỷ đồng",
  },
];

const CAPACITY_METRICS_EN: CapacityPanoramaMetric[] = [
  {
    id: "clients",
    indexLabel: "01 / 04",
    shortIndex: "01",
    finalMain: "109",
    finalSuffix: "+",
    label: "Partner businesses and commercial kitchens",
    kind: "int-plus",
    target: 109,
    bgSrc: "/images/industries/bep-an-tap-the-vn.png",
    bgAlt: "Industrial canteens and partner restaurants served by TPS1",
  },
  {
    id: "skus",
    indexLabel: "02 / 04",
    shortIndex: "02",
    finalMain: "5,000",
    finalSuffix: "+",
    label: "Product SKUs across our catalog",
    kind: "thousand-plus",
    target: 5000,
    bgSrc: "/images/categories/rau-cu-qua.png",
    bgAlt: "Catalog of over 5,000 fresh food items supplied by TPS1",
  },
  {
    id: "fleet",
    indexLabel: "03 / 04",
    shortIndex: "03",
    finalMain: "24",
    finalSuffix: "/7",
    label: "Refrigerated truck fleet ready for dispatch",
    kind: "hours-247",
    target: 24,
    bgSrc: "/images/tps1-warehouse-wide.jpg",
    bgAlt: "Large-scale warehouse and 24/7 cold-chain fleet dispatch",
  },
  {
    id: "insurance",
    indexLabel: "04 / 04",
    shortIndex: "04",
    finalMain: "5",
    finalSuffix: "B VND",
    label: "Product liability insurance coverage",
    kind: "billion",
    target: 5,
    bgSrc: "/images/tps1-meat-seafood.png",
    bgAlt: "Food safety control and VND 5 billion product liability insurance",
  },
];

function formatMetricProgress(
  metric: CapacityPanoramaMetric,
  progress: number,
  locale: "vi" | "en" = "vi"
): MetricDisplayParts {
  if (progress >= 1) {
    return { main: metric.finalMain, suffix: metric.finalSuffix };
  }
  const val = Math.round(metric.target * progress);
  if (metric.kind === "int-plus") return { main: `${val}`, suffix: "+" };
  if (metric.kind === "thousand-plus") {
    return { main: val.toLocaleString(locale === "en" ? "en-US" : "vi-VN"), suffix: "+" };
  }
  if (metric.kind === "hours-247") {
    const days = Math.max(1, Math.min(7, Math.round(7 * progress)));
    return { main: `${val}`, suffix: `/${days}` };
  }
  return { main: `${val}`, suffix: locale === "en" ? "B VND" : " tỷ" };
}

export function AboutPageClient({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const isEn = locale === "en";
  const certs = isEn ? CERTIFICATES_EN : CERTIFICATES;
  const coreValues = isEn ? CORE_VALUES_EN : CORE_VALUES;
  const capacityMetrics = isEn ? CAPACITY_METRICS_EN : CAPACITY_METRICS;
  const [activeCertIndex, setActiveCertIndex] = useState<number | null>(null);
  const [activePaneIndex, setActivePaneIndex] = useState<number>(1);
  const [metricParts, setMetricParts] = useState<MetricDisplayParts[]>(() =>
    capacityMetrics.map((m) => ({ main: m.finalMain, suffix: m.finalSuffix }))
  );
  const [counterDone, setCounterDone] = useState(false);

  const scaleRef = useRef<HTMLElement | null>(null);
  const hasCountedRef = useRef(false);

  const closeModal = useCallback(() => setActiveCertIndex(null), []);
  const showPrevCert = useCallback(() => {
    setActiveCertIndex((prev) =>
      prev === null ? null : (prev - 1 + certs.length) % certs.length
    );
  }, [certs.length]);
  const showNextCert = useCallback(() => {
    setActiveCertIndex((prev) =>
      prev === null ? null : (prev + 1) % certs.length
    );
  }, [certs.length]);

  // Keyboard navigation & body scroll lock for Lightbox Modal
  useEffect(() => {
    if (activeCertIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      else if (e.key === "ArrowLeft") showPrevCert();
      else if (e.key === "ArrowRight") showNextCert();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeCertIndex, closeModal, showPrevCert, showNextCert]);

  // Smooth 1100ms ease-out cubic Animated Number Counter when Section 4 enters view
  useEffect(() => {
    const section = scaleRef.current;
    if (!section || hasCountedRef.current) return;

    let rafId = 0;

    const startCount = () => {
      if (hasCountedRef.current) return;
      hasCountedRef.current = true;
      const duration = 1100;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setMetricParts(capacityMetrics.map((m) => formatMetricProgress(m, eased, locale)));
        if (t < 1) {
          rafId = window.requestAnimationFrame(tick);
        } else {
          setCounterDone(true);
        }
      };

      rafId = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startCount();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [capacityMetrics, locale]);

  const activeCert = activeCertIndex !== null ? certs[activeCertIndex] : null;

  return (
    <main className="b2b-about-page tps1-about">
      {/* 1. HERO SECTION — CHUẨN 100% SERVER https://thucphamsomot.vn/gioi-thieu */}
      <section className="b2b-about-hero">
        <Image
          src="/images/about/hero_v2.jpg"
          alt={isEn ? "Thuc Pham So Mot - Large-scale warehouse facility" : "Thực Phẩm Số 1 - Kho bãi quy mô lớn"}
          fill
          className="object-cover b2b-about-hero__bg"
          priority
          sizes="100vw"
        />
        <div className="b2b-about-hero__overlay" />
        <div className="container-shell position-relative z-10">
          <div className="b2b-about-hero__content">
            <div className="section-label" style={{ color: "#4ade80" }}>
              {isEn ? "About us" : "Về chúng tôi"}
            </div>
            <h1 className="b2b-about-hero__title">
              {isEn ? (
                <>
                  Reliable food supply,<br />
                  <span style={{ color: "#4ade80" }}>peace of mind in every meal</span>
                </>
              ) : (
                <>
                  Vững nguồn thực phẩm,<br />
                  <span style={{ color: "#4ade80" }}>trọn vẹn từng bữa ăn</span>
                </>
              )}
            </h1>
            <p className="b2b-about-hero__desc">
              {isEn ? (
                <>
                  Officially operating since 2017, Thuc Pham So Mot Co., Ltd. (TPS1) delivers{" "}
                  <strong className="b2b-hero__sub-hl">a diverse range of traceable food ingredients</strong>{" "}
                  to restaurants, eateries, corporate canteens, schools, hospitals, and industrial kitchens.
                </>
              ) : (
                <>
                  Công ty TNHH Thực Phẩm Số Một (TPS1) chính thức hoạt động từ năm 2017, mang{" "}
                  <strong className="b2b-hero__sub-hl">đa dạng thực phẩm có nguồn gốc rõ ràng</strong>{" "}
                  đến nhà hàng, quán ăn, bếp công ty, trường học, bệnh viện và bếp ăn công nghiệp.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* 2. CÂU CHUYỆN TPS1 & ẢNH ĐỘI XE LẠNH SẠCH SẼ NGUYÊN VẸN (50/50 CÂN BẰNG TUYỆT ĐỐI) */}
      <section className="tps1-about-story">
        <div className="container-shell">
          <div className="tps1-about-story__grid">
            {/* Editorial Story Copy + 3 Clean Value Cards */}
            <ScrollReveal className="tps1-about-story__copy">
              <div className="tps1-about-story__top">
                <div className="section-label">{isEn ? "The TPS1 story" : "Câu chuyện TPS1"}</div>
                <h2 className="section-title tps1-about-story__title">
                  {isEn
                    ? "Behind every great meal is a thoughtfully prepared kitchen"
                    : "Phía sau mỗi bữa ăn ngon là một gian bếp được chuẩn bị chu đáo"}
                </h2>

                <div className="tps1-about-story__narrative">
                  {isEn ? (
                    <>
                      <p>
                        Every chef, whether in a restaurant or a corporate canteen, relies on{" "}
                        <strong className="tps1-key-hl">fresh ingredients cut to exact specifications and delivered on time</strong>. Even a single delayed delivery can disrupt an entire cooking shift.
                      </p>
                      <p>
                        TPS1 takes that sourcing burden off your shoulders. Our warehouses, refrigerated truck fleet, and prep stations all work toward one goal:{" "}
                        <strong className="tps1-key-hl">ingredients arriving at your kitchen on schedule and to specification</strong>, so your culinary team can focus completely on every dish.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        Người đứng bếp, dù ở nhà hàng hay bếp ăn công ty, đều cần{" "}
                        <strong className="tps1-key-hl">nguyên liệu tươi, đúng quy cách và về đến nơi đúng giờ</strong>. Chỉ một chuyến hàng đến trễ cũng đủ khiến cả một ca nấu bị xáo trộn.
                      </p>
                      <p>
                        TPS1 nhận về mình phần lo nguồn hàng ấy. Kho bãi, đội xe lạnh và khâu sơ chế đều hướng về một mục tiêu:{" "}
                        <strong className="tps1-key-hl">hàng đến bếp đúng giờ, đúng quy cách</strong>, để người đứng bếp dành trọn tâm sức cho từng món ăn.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* 3 Clean Value Stations (Zero Piercing Line) */}
              <div className="tps1-about-stream">
                {coreValues.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="tps1-about-stream__item">
                      <span className="tps1-about-stream__orb" aria-hidden="true">
                        <Icon size={20} strokeWidth={2.2} />
                      </span>
                      <span className="tps1-about-stream__text">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* Clean Rectangular Soft-Rounded Refrigerated Fleet Image (Exact 50/50 Width & Height) */}
            <ScrollReveal delay={90} className="tps1-about-story__media-col">
              <div className="b2b-about-story__image tps1-about-fleet-clean">
                <Image
                  src="/images/about/fleet_v2.png"
                  alt={isEn ? "Thuc Pham So Mot refrigerated delivery fleet" : "Đội xe vận chuyển Thực Phẩm Số Một"}
                  fill
                  className="object-cover tps1-about-fleet-clean__img"
                  sizes="(max-width: 960px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. CHỨNG NHẬN & BẢO HIỂM — PHÒNG TRƯNG BÀY KÍNH 3D & HỘP ĐÈN LIGHTBOX */}
      <section className="tps1-about-certs">
        <div className="container-shell">
          <ScrollReveal className="tps1-about-certs__header">
            <div className="section-label">{isEn ? "Certifications & insurance" : "Chứng nhận và bảo hiểm"}</div>
            <h2 className="section-title">
              {isEn ? "Full certifications, clear accountability" : "Chứng nhận đầy đủ, trách nhiệm rõ ràng"}
            </h2>
            <p className="section-desc tps1-about-certs__desc">
              {isEn ? (
                <>
                  TPS1 holds full{" "}
                  <strong className="tps1-key-hl">food-safety facility certification (VSATTP), ISO 22000:2018, HACCP</strong>, and a{" "}
                  <strong className="tps1-key-hl">product liability insurance policy covering up to VND 5 billion</strong>. All legal documents are ready for immediate inspection whenever your enterprise or school conducts supplier due diligence.
                </>
              ) : (
                <>
                  TPS1 sở hữu giấy chứng nhận{" "}
                  <strong className="tps1-key-hl">cơ sở đủ điều kiện an toàn thực phẩm, ISO 22000:2018, HACCP</strong> và hợp đồng{" "}
                  <strong className="tps1-key-hl">bảo hiểm trách nhiệm sản phẩm với tổng hạn mức 5 tỷ đồng</strong>. Toàn bộ hồ sơ sẵn sàng được cung cấp khi quý doanh nghiệp, nhà trường cần thẩm định nhà cung cấp.
                </>
              )}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={70} className="tps1-about-certs__grid">
            {certs.map((cert, idx) => (
              <button
                key={cert.id}
                type="button"
                className="tps1-cert-showcase"
                data-cert-id={cert.id}
                onClick={() => setActiveCertIndex(idx)}
                aria-label={isEn ? `Zoom certificate ${cert.title}` : `Xem phóng to hồ sơ ${cert.title}`}
              >
                <div className="tps1-cert-showcase__seal">
                  <BadgeCheck size={14} />
                  <span>{cert.seal}</span>
                </div>

                <div className="tps1-cert-showcase__frame">
                  <Image
                    src={cert.src}
                    alt={cert.alt}
                    fill
                    className="object-contain tps1-cert-showcase__img"
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 32vw, 20vw"
                  />
                  <span className="tps1-cert-showcase__sheen" aria-hidden="true" />
                  <span className="tps1-cert-showcase__zoom-pill">
                    <Search size={12} />
                    <span>{isEn ? "Click to inspect document" : "Bấm để xem rõ văn bản"}</span>
                  </span>
                </div>

                <div className="tps1-cert-showcase__body">
                  <h3 className="tps1-cert-showcase__title">{cert.title}</h3>
                  <p className="tps1-cert-showcase__desc">{cert.desc}</p>
                </div>
              </button>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* 4. TPS1 QUA NHỮNG CON SỐ — BỨC TƯỜNG 4 KHOANG CỬA SỔ TOÀN CẢNH CO GIÃN TƯƠNG TÁC */}
      <section
        ref={scaleRef}
        className="tps1-about-scale-panorama"
        data-counter-done={counterDone ? "true" : "false"}
        data-active-pane={activePaneIndex}
      >
        <div className="container-shell">
          <ScrollReveal className="tps1-panorama-head">
            <div className="tps1-panorama-head__left">
              <div className="section-label">{isEn ? "TPS1 by the numbers" : "TPS1 qua những con số"}</div>
              <h2 className="tps1-panorama-head__title">
                {isEn ? "Industrial-scale supply capacity" : "Năng lực đáp ứng quy mô công nghiệp"}
              </h2>
            </div>

            <div
              className="tps1-panorama-nav"
              role="tablist"
              aria-label={isEn ? "Select TPS1 capacity metric" : "Chọn chỉ số năng lực TPS1"}
            >
              {capacityMetrics.map((metric, idx) => {
                const isActive = activePaneIndex === idx;
                return (
                  <button
                    key={metric.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`tps1-panorama-nav__btn${isActive ? " is-active" : ""}`}
                    onMouseEnter={() => setActivePaneIndex(idx)}
                    onFocus={() => setActivePaneIndex(idx)}
                    onClick={() => setActivePaneIndex(idx)}
                  >
                    {metric.shortIndex}
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={70}>
            <div className="tps1-panorama-stage">
              {capacityMetrics.map((metric, idx) => {
                const isActive = activePaneIndex === idx;
                return (
                  <div
                    key={metric.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    className={`tps1-panorama-pane${isActive ? " is-active" : ""}`}
                    data-metric-id={metric.id}
                    data-pane-index={idx}
                    onMouseEnter={() => setActivePaneIndex(idx)}
                    onFocus={() => setActivePaneIndex(idx)}
                    onClick={() => setActivePaneIndex(idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActivePaneIndex(idx);
                      }
                    }}
                  >
                    <Image
                      src={metric.bgSrc}
                      alt={metric.bgAlt}
                      fill
                      className="tps1-panorama-pane__bg"
                      sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 40vw"
                    />
                    <div className="tps1-panorama-pane__overlay" aria-hidden="true" />

                    <div className="tps1-panorama-pane__top">
                      <span className="tps1-panorama-pane__idx">{metric.indexLabel}</span>
                      <span className="tps1-panorama-pane__dot" aria-hidden="true" />
                    </div>

                    <div className="tps1-panorama-pane__bottom">
                      <div className="tps1-panorama-pane__num">
                        {metricParts[idx].main}
                        <span className="tps1-panorama-pane__suffix">
                          {metricParts[idx].suffix}
                        </span>
                      </div>
                      <div className="tps1-panorama-pane__beam" aria-hidden="true">
                        <span className="tps1-panorama-pane__beam-fill" />
                      </div>
                      <p className="tps1-panorama-pane__label">{metric.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. CTA CUỐI TRANG — SÂN KHẤU CHÂN TRỜI 3D ĐỒNG BỘ TRANG CHỦ */}
      <section className="tps1-horizon-cta tps1-about-cta">
        <div className="container-shell">
          <ScrollReveal mode="final">
            <div className="tps1-horizon-stage">
              <div className="tps1-horizon-stage__aurora" aria-hidden="true" />
              <div className="tps1-horizon-stage__grid" aria-hidden="true" />
              <div className="tps1-horizon-stage__content">
                <h2 className="section-title-light tps1-about-cta__title">
                  {isEn ? "Delivering peace of mind in every meal" : "Gửi trọn an tâm trong từng bữa ăn"}
                </h2>
                <p className="tps1-about-cta__desc">
                  {isEn
                    ? "Simply send your required item list and estimated quantities — TPS1 will deliver a custom wholesale quote within 24 hours."
                    : "Quý khách chỉ cần gửi danh sách hàng và số lượng dự kiến, TPS1 sẽ gửi báo giá sỉ trong vòng 24 giờ."}
                </p>
                <Link href={isEn ? "/en/bao-gia" : "/bao-gia"} className="btn-hero-primary tps1-about-cta__btn">
                  {isEn ? "Send quote request" : "Gửi yêu cầu báo giá"} <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* INTERACTIVE FULLSCREEN CERTIFICATE LIGHTBOX MODAL */}
      {activeCert && activeCertIndex !== null && (
        <div
          className="tps1-cert-modal"
          role="dialog"
          aria-modal="true"
          aria-label={isEn ? `Certificate details ${activeCert.title}` : `Chi tiết chứng nhận ${activeCert.title}`}
          onClick={closeModal}
        >
          <div
            className="tps1-cert-modal__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tps1-cert-modal__head">
              <div className="tps1-cert-modal__meta">
                <span className="tps1-cert-modal__count">
                  {activeCertIndex + 1} / {certs.length}
                </span>
                <div>
                  <h3 className="tps1-cert-modal__title">{activeCert.title}</h3>
                  <p className="tps1-cert-modal__desc">{activeCert.desc}</p>
                </div>
              </div>
              <button
                type="button"
                className="tps1-cert-modal__close"
                onClick={closeModal}
                aria-label={isEn ? "Close certificate viewer" : "Đóng cửa sổ xem chứng nhận"}
              >
                <X size={20} />
              </button>
            </div>

            <div className="tps1-cert-modal__stage">
              <button
                type="button"
                className="tps1-cert-modal__nav tps1-cert-modal__nav--prev"
                onClick={showPrevCert}
                aria-label={isEn ? "Previous certificate" : "Hồ sơ trước"}
              >
                <ChevronLeft size={22} />
              </button>

              <div className="tps1-cert-modal__img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeCert.src}
                  alt={activeCert.alt}
                  className="tps1-cert-modal__img"
                />
              </div>

              <button
                type="button"
                className="tps1-cert-modal__nav tps1-cert-modal__nav--next"
                onClick={showNextCert}
                aria-label={isEn ? "Next certificate" : "Hồ sơ tiếp theo"}
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
