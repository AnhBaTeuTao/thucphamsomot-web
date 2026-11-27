import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, Truck } from "lucide-react";
import { makeMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { INDUSTRY_SECTORS_EN } from "@/lib/industries-showcase";
import { IndustrySpotlight } from "@/components/b2b/industry-spotlight";

export const metadata: Metadata = makeMetadata({
  title: "6 B2B Kitchen Industry Solutions | Thuc Pham So Mot",
  description:
    "Explore operating standards, prep specifications, and dedicated refrigerated truck schedules for 6 kitchen models: Restaurants, F&B Chains, Schools, Factory Canteens, Hospitals, and Industrial Caterers.",
  path: "/en/ingredients",
});

const B2B_PROOF_METRICS_EN = [
  {
    value: "109+",
    label: "Partner businesses and commercial kitchens",
  },
  {
    value: "5,000+",
    label: "Product SKUs across our catalog",
  },
  {
    value: "99.8%",
    label: "On-schedule delivery rate",
  },
  {
    value: "Since 2017",
    label: "Serving Dong Nai, Ho Chi Minh City & nearby provinces",
  },
];

export default function EnglishIndustriesPage() {
  return (
    <main className="nh-page">
      {/* 1. HERO — SYNCHRONIZED 100% WITH /NGANH-HANG */}
      <section className="b2b-process-hero">
        <Image
          src="/images/about/hero_v2.jpg"
          alt="Thuc Pham So Mot B2B Food Supply Ecosystem"
          fill
          className="object-cover b2b-about-hero__bg"
          priority
          sizes="100vw"
        />
        <div className="b2b-about-hero__overlay" />
        <div className="container-shell position-relative z-10 text-center">
          <div className="b2b-about-hero__content" style={{ margin: "0 auto" }}>
            <div className="section-label" style={{ color: "#4ade80", justifyContent: "center" }}>
              Industries we serve
            </div>
            <h1 className="b2b-process-hero__title">
              Every kitchen<br />
              <span style={{ color: "#4ade80" }}>has its own operating rhythm</span>
            </h1>
            <p className="b2b-process-hero__desc">
              From restaurants and F&amp;B chains to factory canteens, schools, and hospitals, TPS1 standardizes{" "}
              <strong className="b2b-hero__sub-hl">prep specifications, refrigerated delivery schedules, and legal documentation</strong> to match every kitchen.
            </p>
          </div>
        </div>
      </section>

      {/* 4 B2B PROOF METRICS BAND */}
      <section className="nh-metrics-band" aria-label="4 B2B supply proof metrics">
        <div className="container-shell">
          <div className="nh-metrics-grid">
            {B2B_PROOF_METRICS_EN.map((metric) => (
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
              <div className="section-label">Interactive industry showcase</div>
              <h2 id="nh-spotlight-heading" className="section-title nh-section-head__title">
                Select each kitchen model to inspect operating standards
              </h2>
            </div>
            <p className="nh-section-head__sub">
              From executive chef portion cuts to school food-safety dossiers and industrial park shift deliveries.
            </p>
          </div>

          <IndustrySpotlight items={INDUSTRY_SECTORS_EN} locale="en" />
        </div>
      </section>

      {/* 2B. CULINARY EDITORIAL ASYMMETRIC BENTO GRID */}
      <section className="nh-bento-section" aria-labelledby="nh-bento-heading">
        <div className="container-shell">
          <div className="nh-section-head">
            <div>
              <div className="section-label">6-sector ecosystem</div>
              <h2 id="nh-bento-heading" className="section-title nh-section-head__title">
                Complete supply solutions by kitchen type
              </h2>
            </div>
            <p className="nh-section-head__sub">
              Select any card below to request a custom product catalog, packaging specification, and compliance dossier.
            </p>
          </div>

          <div className="nh-bento-grid">
            {INDUSTRY_SECTORS_EN.map((ind) => (
              <Link
                key={ind.slug}
                id={`bento-${ind.slug}`}
                href="/en/bao-gia"
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
                      <span>Request quote</span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HORIZON CTA STAGE — SYNCHRONIZED WITH HOMEPAGE & ABOUT */}
      <section className="tps1-horizon-cta nh-horizon-cta" aria-label="Request a wholesale quote">
        <div className="container-shell">
          <div className="tps1-horizon-stage">
            <div className="tps1-horizon-stage__aurora" aria-hidden="true" />
            <div className="tps1-horizon-stage__grid" aria-hidden="true" />
            <div className="tps1-horizon-stage__content">
              <h2 className="section-title-light tps1-about-cta__title">
                Receive a custom quote for your kitchen within 24 hours
              </h2>
              <p className="tps1-about-cta__desc">
                Send your ingredient list or weekly menu — TPS1 will design a wholesale price table and refrigerated delivery schedule matched to your kitchen&apos;s receiving hours.
              </p>
              <div className="nh-horizon-cta__actions">
                <Link href="/en/bao-gia" className="btn-hero-primary tps1-about-cta__btn">
                  <span>Send quote request</span>
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
