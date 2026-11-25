"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ReceiptText,
  ShieldCheck,
  Truck,
  X,
  ZoomIn,
  type LucideIcon,
} from "lucide-react";
import { ScrollReveal } from "@/components/b2b/scroll-reveal";

type CommitmentRow = {
  tone: 1 | 2 | 3 | 4 | 5 | 6;
  icon: LucideIcon;
  title: string;
  titleHighlight?: string;
  desc: string;
  descHighlight?: string;
};

type KpiItem = {
  value: string;
  label: string;
};

type LocaleCopy = {
  label: string;
  title: string;
  desc: string;
  photoAlt: string;
  photoBrand: string;
  certAlt: string;
  sheetTitle: string;
  sheetCode: string;
  footerNote: string;
  footerCta: string;
  footerHref: string;
  kpis: KpiItem[];
  rows: CommitmentRow[];
};

const texts: Record<"vi" | "en", LocaleCopy> = {
  vi: {
    label: "Cam kết dịch vụ",
    title: "Vì sao khách hàng chọn\u00A0TPS1?",
    desc: "Nguồn gốc thực\u00A0phẩm, lịch giao hàng, giá cả và hóa đơn là những điều khách hàng cần biết rõ khi chọn nhà cung\u00A0cấp.",
    photoAlt: "Đội ngũ Thực Phẩm Số Một trao đổi và kiểm tra nguồn hàng tại kho",
    photoBrand: "Thực Phẩm Số Một",
    certAlt: "Giấy chứng nhận hệ thống quản lý an toàn thực phẩm HACCP của TPS1",
    sheetTitle: "PHIẾU CAM KẾT DỊCH VỤ",
    sheetCode: "TPS1",
    footerNote: "Báo giá riêng theo số lượng đặt hàng thực\u00A0tế",
    footerCta: "Yêu cầu báo giá",
    footerHref: "/lien-he",
    kpis: [
      { value: "24h", label: "Báo giá" },
      { value: "2017", label: "Phục vụ từ" },
      { value: "109+", label: "Bếp\u00A0ăn và doanh nghiệp" },
      { value: "5.000+", label: "Sản\u00A0phẩm" },
    ],
    rows: [
      {
        tone: 1,
        icon: ShieldCheck,
        title: "Có chứng từ đầy đủ, truy xuất tới từng\u00A0lô",
        titleHighlight: "từng\u00A0lô",
        desc: "Khi cần kiểm tra nguồn hàng, khách hàng có thể yêu cầu TPS1 cung cấp hồ sơ an toàn thực\u00A0phẩm và các chứng từ pháp lý liên\u00A0quan.",
        descHighlight: "an toàn thực\u00A0phẩm",
      },
      {
        tone: 2,
        icon: Truck,
        title: "Giao hàng theo lịch của\u00A0bếp",
        desc: "Khách hàng có thể đặt lịch giao theo ca, theo ngày hoặc theo tuần để phù hợp với giờ chuẩn bị và nấu ăn. Thực\u00A0phẩm được vận chuyển bằng xe lạnh chuyên dụng để giữ độ tươi khi đến\u00A0bếp.",
        descHighlight: "xe lạnh chuyên dụng",
      },
      {
        tone: 3,
        icon: ReceiptText,
        title: "Báo giá trong 24\u00A0giờ",
        titleHighlight: "24\u00A0giờ",
        desc: "TPS1 gửi báo giá riêng cho từng khách hàng, dựa trên số lượng và tần suất đặt hàng thực\u00A0tế.",
      },
      {
        tone: 4,
        icon: Building2,
        title: "Phục vụ từ năm\u00A02017",
        titleHighlight: "2017",
        desc: "TPS1 đang cung cấp thực\u00A0phẩm cho hơn 109 doanh nghiệp và bếp\u00A0ăn, gồm nhà\u00A0hàng, bếp công ty và trường\u00A0học.",
        descHighlight: "109 doanh nghiệp và bếp\u00A0ăn",
      },
      {
        tone: 5,
        icon: BadgeCheck,
        title: "Hóa đơn VAT đầy\u00A0đủ",
        titleHighlight: "VAT",
        desc: "Xuất hóa đơn điện tử hợp lệ, hỗ trợ chuyển khoản và công nợ theo thỏa\u00A0thuận.",
      },
      {
        tone: 6,
        icon: LayoutGrid,
        title: "Danh mục 5.000+\u00A0sản\u00A0phẩm",
        titleHighlight: "5.000+\u00A0sản\u00A0phẩm",
        desc: "Khách hàng có thể đặt rau củ, thịt cá, hàng đông\u00A0lạnh, gia\u00A0vị, đồ\u00A0khô và thực\u00A0phẩm chay từ cùng một nhà cung\u00A0cấp.",
      },
    ],
  },
  en: {
    label: "Service Commitment",
    title: "Why do commercial kitchens choose\u00A0TPS1?",
    desc: "Every commitment is backed by daily execution, from early-morning refrigerated vans to transparent monthly invoicing.",
    photoAlt: "TPS1 operations team inspecting wholesale food stock at the warehouse",
    photoBrand: "Thuc Pham So Mot",
    certAlt: "TPS1 HACCP food safety management certificate",
    sheetTitle: "SERVICE COMMITMENT SHEET",
    sheetCode: "TPS1",
    footerNote: "Custom wholesale pricing based on actual order volume",
    footerCta: "Request a quote",
    footerHref: "/en/contact",
    kpis: [
      { value: "24h", label: "Quote" },
      { value: "2017", label: "Serving since" },
      { value: "109+", label: "Partner kitchens" },
      { value: "5,000+", label: "Products" },
    ],
    rows: [
      {
        tone: 1,
        icon: ShieldCheck,
        title: "Verified source and full records",
        titleHighlight: "full records",
        desc: "Traceable food origin with inspection records and legal certificates ready for kitchen audit at any time.",
        descHighlight: "kitchen audit",
      },
      {
        tone: 2,
        icon: Truck,
        title: "On-schedule cold-chain delivery",
        desc: "Flexible delivery by morning shift, day, or week via insulated and refrigerated vans to lock in freshness.",
        descHighlight: "refrigerated vans",
      },
      {
        tone: 3,
        icon: ReceiptText,
        title: "Detailed quote within 24 hours",
        titleHighlight: "24 hours",
        desc: "Custom wholesale pricing structured around each kitchen's actual consumption and menu specifications.",
      },
      {
        tone: 4,
        icon: Building2,
        title: "Serving since 2017",
        titleHighlight: "2017",
        desc: "Trusted daily by over 109 partner kitchens including restaurants, corporate canteens, schools, and hospitals.",
        descHighlight: "109 partner kitchens",
      },
      {
        tone: 5,
        icon: BadgeCheck,
        title: "Full valid VAT e-invoices",
        titleHighlight: "VAT",
        desc: "Compliant electronic VAT invoicing, bank transfers, and flexible credit terms under formal contracts.",
      },
      {
        tone: 6,
        icon: LayoutGrid,
        title: "Catalog of 5,000+ products",
        titleHighlight: "5,000+ products",
        desc: "Produce, fresh meat, seafood, frozen goods, seasonings, dry goods, and vegetarian items in one consolidated order.",
      },
    ],
  },
};

function renderHighlightedText(text: string, highlight?: string) {
  if (!highlight) return text;
  const idx = text.indexOf(highlight);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="tps1-doc-row__strong">{highlight}</strong>
      {text.slice(idx + highlight.length)}
    </>
  );
}

function formatAnimatedKpi(target: string, progress: number): string {
  if (progress >= 1) return target;
  const match = target.match(/^([\d.,]+)(.*)$/);
  if (!match) return target;
  const [, numToken, suffix] = match;
  const sep = numToken.includes(".") ? "." : numToken.includes(",") ? "," : "";
  const rawNumber = Number(numToken.replace(/[.,]/g, ""));
  if (!Number.isFinite(rawNumber) || rawNumber <= 0) return target;

  const eased = 1 - Math.pow(1 - progress, 3);
  const current = Math.max(0, Math.round(rawNumber * eased));
  if (!sep) return `${current}${suffix}`;

  const grouped = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return `${grouped}${suffix}`;
}

const DOC_CERTIFICATES = [
  {
    id: "haccp",
    title: "HACCP Codex Alimentarius",
    desc: "Hệ thống phân tích mối nguy và kiểm soát điểm tới hạn (TCVN 5603:2023).",
    src: "/images/about/haccp_cert.jpg",
    alt: "Giấy chứng nhận hệ thống quản lý an toàn thực phẩm HACCP của TPS1",
  },
  {
    id: "iso",
    title: "ISO 22000:2018",
    desc: "Chứng nhận hệ thống quản lý an toàn thực phẩm quốc tế.",
    src: "/images/about/iso_cert.jpg",
    alt: "Giấy chứng nhận ISO 22000:2018 của TPS1",
  },
  {
    id: "vsattp",
    title: "Chứng nhận VSATTP",
    desc: "Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm.",
    src: "/images/about/vsattp_cert.jpg",
    alt: "Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm TPS1",
  },
];

export function TrustPillars({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const t = texts[locale];
  const sheetRef = useRef<HTMLDivElement>(null);
  const [kpiProgress, setKpiProgress] = useState(0);
  const [activeCertIdx, setActiveCertIdx] = useState<number | null>(null);
  const hasCountedRef = useRef(false);

  const activeCert = activeCertIdx !== null ? DOC_CERTIFICATES[activeCertIdx] : null;
  const closeCertModal = () => setActiveCertIdx(null);
  const showPrevCert = () =>
    setActiveCertIdx((prev) =>
      prev === null ? 0 : (prev - 1 + DOC_CERTIFICATES.length) % DOC_CERTIFICATES.length,
    );
  const showNextCert = () =>
    setActiveCertIdx((prev) => (prev === null ? 0 : (prev + 1) % DOC_CERTIFICATES.length));

  useEffect(() => {
    if (activeCertIdx === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveCertIdx(null);
      else if (e.key === "ArrowLeft")
        setActiveCertIdx((prev) =>
          prev === null ? 0 : (prev - 1 + DOC_CERTIFICATES.length) % DOC_CERTIFICATES.length,
        );
      else if (e.key === "ArrowRight")
        setActiveCertIdx((prev) => (prev === null ? 0 : (prev + 1) % DOC_CERTIFICATES.length));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeCertIdx]);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el || hasCountedRef.current) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let rafId = 0;
    const startCountUp = () => {
      if (hasCountedRef.current) return;
      hasCountedRef.current = true;
      if (prefersReduced) {
        setKpiProgress(1);
        return;
      }
      const start = performance.now();
      const duration = 850;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        setKpiProgress(p);
        if (p < 1) {
          rafId = window.requestAnimationFrame(tick);
        }
      };
      rafId = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startCountUp();
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const handleRowMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    const rowEl = e.currentTarget;
    const rect = rowEl.getBoundingClientRect();
    rowEl.style.setProperty("--row-mx", `${Math.round(e.clientX - rect.left)}px`);
    rowEl.style.setProperty("--row-my", `${Math.round(e.clientY - rect.top)}px`);
  };

  return (
    <section className="b2b-pillars tps1-pillars-unified" aria-labelledby="pillars-heading">
      <div className="container-shell">
        <ScrollReveal className="b2b-pillars-header">
          <div className="b2b-pillars-header__left">
            <div className="section-label">{t.label}</div>
            <h2 id="pillars-heading" className="b2b-pillars-header__title">
              {t.title}
            </h2>
          </div>
          <p className="b2b-pillars-header__desc">{t.desc}</p>
        </ScrollReveal>

        <ScrollReveal className="tps1-doc-stage">
          <div className="tps1-doc-backing" aria-hidden="true" />

          <div ref={sheetRef} className="tps1-doc-sheet">
            {/* Cột trái: Bảng ảnh thật + cert góc trên trái + dải 4 KPI Glass Spec Dock */}
            <div className="tps1-doc-visual">
              <div className="tps1-doc-visual__frame">
                <Image
                  src="/images/tps1-gallery-warehouse-people.jpg"
                  alt={t.photoAlt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 42vw"
                  className="tps1-doc-visual__img"
                />

                <button
                  type="button"
                  className="tps1-doc-cert"
                  onClick={() => setActiveCertIdx(0)}
                  aria-label={
                    locale === "en"
                      ? "View HACCP Certificate"
                      : "Bấm để phóng to Giấy chứng nhận HACCP"
                  }
                >
                  <div className="tps1-doc-cert__inner">
                    <Image
                      src="/images/about/haccp_cert.jpg"
                      alt={t.certAlt}
                      fill
                      sizes="(max-width: 699px) 96px, (max-width: 1023px) 140px, 160px"
                      className="tps1-doc-cert__img"
                    />
                  </div>
                  <span className="tps1-doc-cert__badge" aria-hidden="true">
                    <ZoomIn size={13} strokeWidth={2.3} />
                    <span>{locale === "en" ? "View cert" : "Xem chứng nhận"}</span>
                  </span>
                </button>

                <div className="tps1-doc-visual__scrim" aria-hidden="true" />
                <div className="tps1-doc-visual__bottom">
                  <div className="tps1-doc-visual__brand">
                    <span className="tps1-doc-visual__brand-dot" aria-hidden="true" />
                    <span>{t.photoBrand}</span>
                  </div>
                  <div className="tps1-doc-kpis" aria-label={t.photoBrand}>
                    {t.kpis.map((kpi) => (
                      <div key={kpi.value + kpi.label} className="tps1-doc-kpi">
                        <span className="tps1-doc-kpi__value">
                          {formatAnimatedKpi(kpi.value, kpiProgress)}
                        </span>
                        <span className="tps1-doc-kpi__label">{kpi.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Bảng thông số cam kết 6 dòng đồng đều */}
            <div className="tps1-doc-table-col">
              <div className="tps1-doc-header">
                <span className="tps1-doc-header__title">
                  <span className="tps1-doc-header__dot" aria-hidden="true" />
                  <span>{t.sheetTitle}</span>
                </span>
                <span className="tps1-doc-header__code">{t.sheetCode}</span>
              </div>

              <div className="tps1-doc-rows" role="list">
                {t.rows.map((row, idx) => {
                  const Icon = row.icon;
                  return (
                    <article
                      key={`tone-${row.tone}`}
                      role="listitem"
                      className={`tps1-doc-row b2b-pillar-row--tone-${row.tone}`}
                      style={{ "--row-delay": `${idx * 60}ms` } as CSSProperties}
                      onMouseMove={handleRowMouseMove}
                    >
                      <span className="tps1-doc-row__spotlight" aria-hidden="true" />
                      <div className="tps1-doc-row__inner">
                        <div className="tps1-doc-row__icon-col">
                          <span className="tps1-doc-row__tile" aria-hidden="true">
                            <Icon className="tps1-doc-row__icon" strokeWidth={1.9} aria-hidden="true" />
                          </span>
                        </div>
                        <div className="tps1-doc-row__body">
                          <h3>{renderHighlightedText(row.title, row.titleHighlight)}</h3>
                          <p>{renderHighlightedText(row.desc, row.descHighlight)}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="tps1-doc-footer">
                <span className="tps1-doc-footer__note">
                  <span className="tps1-doc-footer__dot" aria-hidden="true" />
                  <span>{t.footerNote}</span>
                </span>
                <Link href={t.footerHref} className="tps1-doc-footer__cta">
                  <span>{t.footerCta}</span>
                  <ArrowRight size={15} className="tps1-doc-footer__arrow" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {activeCert && activeCertIdx !== null && (
        <div
          className="tps1-cert-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`Chi tiết chứng nhận ${activeCert.title}`}
          onClick={closeCertModal}
        >
          <div className="tps1-cert-modal__panel" onClick={(e) => e.stopPropagation()}>
            <div className="tps1-cert-modal__head">
              <div className="tps1-cert-modal__meta">
                <span className="tps1-cert-modal__count">
                  {activeCertIdx + 1} / {DOC_CERTIFICATES.length}
                </span>
                <div>
                  <h3 className="tps1-cert-modal__title">{activeCert.title}</h3>
                  <p className="tps1-cert-modal__desc">{activeCert.desc}</p>
                </div>
              </div>
              <button
                type="button"
                className="tps1-cert-modal__close"
                onClick={closeCertModal}
                aria-label="Đóng cửa sổ xem chứng nhận"
              >
                <X size={20} />
              </button>
            </div>

            <div className="tps1-cert-modal__stage">
              <button
                type="button"
                className="tps1-cert-modal__nav tps1-cert-modal__nav--prev"
                onClick={showPrevCert}
                aria-label="Hồ sơ trước"
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
                aria-label="Hồ sơ tiếp theo"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
