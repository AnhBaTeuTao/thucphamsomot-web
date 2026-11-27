"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  Factory,
  FileCheck2,
  GraduationCap,
  HeartPulse,
  Sparkles,
  Store,
  Truck,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { IndustrySectorItem, IndustrySectorSlug } from "@/lib/industries-showcase";

const SECTOR_ICONS: Record<IndustrySectorSlug, LucideIcon> = {
  "nha-hang-khach-san": UtensilsCrossed,
  "quan-an": Store,
  "truong-hoc": GraduationCap,
  "bep-an-tap-the": Factory,
  "benh-vien": HeartPulse,
  "suat-an-cong-nghiep": ClipboardCheck,
};

type IndustrySpotlightProps = {
  items: IndustrySectorItem[];
  locale?: "vi" | "en";
};

/**
 * Interactive 6-sector Light Culinary Spotlight (35% porcelain/mint selector rail / 65% sunlit stage).
 * Each sector uses semantic color-coded icons; the stage highlights 3 color-coded operational pillars.
 */
export function IndustrySpotlight({ items, locale = "vi" }: IndustrySpotlightProps) {
  const isEn = locale === "en";
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex] ?? items[0];

  if (!active) return null;

  return (
    <div className="nh-spotlight" data-active-slug={active.slug}>
      {/* Left 35%: Soft Mint Panel with 6 Crisp Selector Tabs */}
      <div className="nh-spotlight__rail">
        <div className="nh-spotlight__rail-head">
          <span className="nh-spotlight__rail-kicker">
            {isEn ? "Explore each operating rhythm" : "Khám phá từng nhịp vận hành"}
          </span>
          <span className="nh-spotlight__rail-hint">
            {isEn ? "Hover or tap to inspect kitchen standards" : "Di chuột hoặc chạm để xem chuẩn bếp"}
          </span>
        </div>

        <div
          className="nh-spotlight__tabs"
          role="tablist"
          aria-label={isEn ? "Select kitchen model" : "Chọn mô hình bếp ăn"}
        >
          {items.map((item, idx) => {
            const Icon = SECTOR_ICONS[item.slug];
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.slug}
                type="button"
                role="tab"
                id={`nh-tab-${item.slug}`}
                data-sector-slug={item.slug}
                aria-selected={isActive}
                aria-controls={`nh-panel-${item.slug}`}
                className={`nh-spotlight__tab${isActive ? " is-active" : ""}`}
                onMouseEnter={() => setActiveIndex(idx)}
                onFocus={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
              >
                <span className="nh-spotlight__tab-num">{item.num}</span>
                <span className="nh-spotlight__tab-icon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <span className="nh-spotlight__tab-body">
                  <strong>{item.shortTitle}</strong>
                  <small>{item.dispatchTime}</small>
                </span>
                <ArrowRight size={15} className="nh-spotlight__tab-arrow" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Right 65%: Bright Sunlit Kitchen Photo + Light Frosted Porcelain Info Card */}
      <div
        className="nh-spotlight__stage"
        role="tabpanel"
        id={`nh-panel-${active.slug}`}
        aria-labelledby={`nh-tab-${active.slug}`}
      >
        <div className="nh-spotlight__media">
          {items.map((item, idx) => (
            <Image
              key={item.slug}
              src={item.image}
              alt={item.imageAlt}
              fill
              sizes="(max-width: 1080px) 100vw, 60vw"
              priority={idx === 0}
              className={`nh-spotlight__img${idx === activeIndex ? " is-active" : ""}`}
            />
          ))}

          <div className="nh-spotlight__photo-bar">
            <span className="nh-spotlight__stage-badge">
              <b>{active.num} / 06</b>
              <span>{active.tag}</span>
            </span>
            <span className="nh-spotlight__stage-time">
              <Truck size={14} aria-hidden="true" />
              <span>{active.dispatchTime}</span>
            </span>
          </div>
        </div>

        <div className="nh-spotlight__dossier">
          <div className="nh-spotlight__stage-header">
            <h3 className="nh-spotlight__stage-title">{active.title}</h3>
            <p className="nh-spotlight__stage-desc">{active.bentoDesc}</p>
          </div>

          <div className="nh-spotlight__glass-grid">
            <div className="nh-spotlight__glass-pill nh-spotlight__glass-pill--ingredients">
              <div className="nh-spotlight__glass-head">
                <span className="nh-spotlight__glass-icon" aria-hidden="true">
                  <Sparkles size={15} />
                </span>
                <span>{isEn ? "Ingredients & prep" : "Nguyên liệu & sơ chế"}</span>
              </div>
              <p>{active.spotlightPillars.ingredients}</p>
            </div>

            <div className="nh-spotlight__glass-pill nh-spotlight__glass-pill--logistics">
              <div className="nh-spotlight__glass-head">
                <span className="nh-spotlight__glass-icon" aria-hidden="true">
                  <Truck size={15} />
                </span>
                <span>{isEn ? "Cold-chain & timing" : "Vận chuyển & khung giờ"}</span>
              </div>
              <p>{active.spotlightPillars.logistics}</p>
            </div>

            <div className="nh-spotlight__glass-pill nh-spotlight__glass-pill--compliance">
              <div className="nh-spotlight__glass-head">
                <span className="nh-spotlight__glass-icon" aria-hidden="true">
                  <FileCheck2 size={15} />
                </span>
                <span>{isEn ? "Food safety & VAT" : "Chứng từ VSATTP & VAT"}</span>
              </div>
              <p>{active.spotlightPillars.compliance}</p>
            </div>
          </div>

          <div className="nh-spotlight__stage-foot">
            <Link
              href={isEn ? "/en/bao-gia" : `/nganh-hang/${active.slug}`}
              className="nh-spotlight__link"
            >
              <span>
                {isEn ? "Request a tailored quote for this kitchen model" : "Khám phá chuyên sâu mô hình này"}
              </span>
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
