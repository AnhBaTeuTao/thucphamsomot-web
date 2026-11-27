import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Snowflake,
  Truck,
  Utensils,
} from "lucide-react";
import { makeMetadata } from "@/lib/seo";

export const metadata = makeMetadata({
  title: "ISO 22000 & HACCP B2B Food Delivery Process | Thuc Pham So Mot",
  description:
    "Six-step closed-loop food supply process by TPS1 under ISO 22000 and HACCP: order planning, farm procurement & quarantine inspection, cold-room prep, cold storage, refrigerated truck dispatch, and kitchen handover.",
  path: "/en/delivery",
});

const PROCESS_STEPS_EN = [
  {
    title: "Order receiving and planning",
    rawTitle: "Order receiving and planning",
    desc: (
      <>
        Receive purchase orders (PO) from partners through our B2B coordination system. Our dispatch team{" "}
        <strong className="tps1-key-hl">plans procurement volumes and allocates production staff</strong>, ensuring exact alignment with each kitchen and factory receiving schedule.
      </>
    ),
    icon: FileText,
    image: "/images/process/step1.jpg",
  },
  {
    title: "Procurement and incoming inspection",
    rawTitle: "Procurement and incoming inspection",
    desc: (
      <>
        Produce from VietGAP-certified farms arrives at our warehouse overnight. Our QA/QC team{" "}
        <strong className="tps1-key-hl">verifies veterinary certificates and runs rapid pesticide residue tests</strong> before accepting any batch into storage.
      </>
    ),
    icon: ShieldCheck,
    image: "/images/process/step%202.png",
  },
  {
    title: "Preparation and packaging",
    rawTitle: "Preparation and packaging",
    desc: (
      <>
        Ingredients are cleaned, trimmed, and portioned to{" "}
        <strong className="tps1-key-hl">each kitchen&apos;s custom quantitative specifications</strong>. Products are vacuum-packed and{" "}
        <strong className="tps1-key-hl">labeled with clear batch traceability tags</strong> inside our ISO 22000 cold prep rooms.
      </>
    ),
    icon: Utensils,
    image: "/images/process/step3.png",
  },
  {
    title: "Cold-warehouse storage",
    rawTitle: "Cold-warehouse storage",
    desc: (
      <>
        Finished batches move immediately into{" "}
        <strong className="tps1-key-hl">chilled and deep-frozen chambers at standard temperature ranges</strong> to preserve nutrition and freshness, pre-sorted by delivery route code.
      </>
    ),
    icon: Snowflake,
    image: "/images/process/step4.png",
  },
  {
    title: "Refrigerated fleet dispatch",
    rawTitle: "Refrigerated fleet dispatch",
    desc: (
      <>
        Orders are loaded onto our <strong className="tps1-key-hl">dedicated refrigerated truck fleet</strong>. GPS tracking and thermal sensors monitor temperatures continuously throughout transit from our warehouse to your kitchen door.
      </>
    ),
    icon: Truck,
    image: "/images/process/step5.png",
  },
  {
    title: "Kitchen handover and verification",
    rawTitle: "Kitchen handover and verification",
    desc: (
      <>
        TPS1 staff deliver directly to your receiving dock. The kitchen manager{" "}
        <strong className="tps1-key-hl">verifies weights, inspects freshness, and checks core product temperatures</strong> before signing off on delivery.
      </>
    ),
    icon: ClipboardCheck,
    image: "/images/process/step6.png",
  },
];

export default function EnglishDeliveryProcessPage() {
  return (
    <main className="b2b-process-page">
      {/* 1. HERO SECTION */}
      <section className="b2b-process-hero">
        <Image
          src="/images/about/hero_v2.jpg"
          alt="Thuc Pham So Mot B2B Food Delivery Process"
          fill
          className="object-cover b2b-about-hero__bg"
          priority
          sizes="100vw"
        />
        <div className="b2b-about-hero__overlay" />
        <div className="container-shell position-relative z-10 text-center">
          <div className="b2b-about-hero__content" style={{ margin: "0 auto" }}>
            <div className="section-label" style={{ color: "#4ade80", justifyContent: "center" }}>
              Closed-loop operations
            </div>
            <h1 className="b2b-process-hero__title">
              B2B food delivery<br />
              <span style={{ color: "#4ade80" }}>built on precision standards</span>
            </h1>
            <p className="b2b-process-hero__desc">
              From incoming quality inspection to on-schedule kitchen handover, every step is{" "}
              <strong className="b2b-hero__sub-hl">strictly controlled under ISO 22000 and HACCP standards</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* 2. TIMELINE SECTION */}
      <section className="b2b-process-timeline-section">
        <div className="container-shell">
          <div className="b2b-timeline">
            {PROCESS_STEPS_EN.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`b2b-timeline__item b2b-timeline__item--step-${index + 1} ${isEven ? "is-left" : "is-right"}`}
                >
                  {/* Content Column */}
                  <div className="b2b-timeline__content-col">
                    <div className="b2b-timeline__step-header">
                      <div className="b2b-timeline__step-num">Step 0{index + 1}</div>
                      <div className="b2b-timeline__mobile-icon">
                        <step.icon size={20} />
                      </div>
                    </div>
                    <h3 className="b2b-timeline__title">{step.title}</h3>
                    <p className="b2b-timeline__desc">{step.desc}</p>
                  </div>

                  {/* Center Axis */}
                  <div className="b2b-timeline__center">
                    <div className="b2b-timeline__dot">
                      <step.icon size={24} className="b2b-timeline__icon" />
                    </div>
                    {index !== PROCESS_STEPS_EN.length - 1 && <div className="b2b-timeline__line"></div>}
                  </div>

                  {/* Image Column */}
                  <div className="b2b-timeline__image-col">
                    <div className="b2b-timeline__image-wrap">
                      <Image
                        src={step.image}
                        alt={step.rawTitle}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. INCIDENT RESPONSE & REPLACEMENT POLICY */}
      <section className="b2b-policy-section">
        <div className="container-shell">
          <div className="b2b-policy-box">
            <div className="b2b-policy-header">
              <AlertTriangle size={32} className="b2b-policy-icon" />
              <div>
                <h2 className="b2b-policy-title section-title" style={{ margin: "0 0 10px" }}>
                  Incident response and replacement policy
                </h2>
                <p className="b2b-policy-subtitle">
                  At TPS1, we understand that &quot;In an industrial kitchen, a 1-minute delay affects 1,000 meals.&quot;
                  Our incident-response protocol is designed to protect your kitchen&apos;s production schedule unconditionally.
                </p>
              </div>
            </div>

            <div className="b2b-policy-grid">
              <div className="b2b-policy-card">
                <h4 className="b2b-policy-card__title">Detected upon delivery (at the kitchen dock)</h4>
                <p className="b2b-policy-card__desc">
                  If any item does not match specifications, freshness standards, or ordered weight during receiving inspection:
                  <strong> TPS1 replaces it 1-for-1 and immediately dispatches a refrigerated van within 1–2 hours</strong> so your cooking shift is never delayed.
                </p>
              </div>
              <div className="b2b-policy-card">
                <h4 className="b2b-policy-card__title">Detected during kitchen preparation</h4>
                <p className="b2b-policy-card__desc">
                  In case of hidden internal defects inside produce or meat discovered only when cutting:
                  <strong> Simply take a photo. We automatically credit 100% of the affected item&apos;s value to your account</strong> or deliver a replacement the next morning.
                </p>
              </div>
              <div className="b2b-policy-card">
                <h4 className="b2b-policy-card__title">Food safety liability protection</h4>
                <p className="b2b-policy-card__desc">
                  In the rare event of a verified food-safety incident attributed to supplied ingredients by authorities:
                  <strong> TPS1 assumes full legal responsibility and indemnifies damages through our VietinBank Insurance policy up to VND 5 billion</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="b2b-cta-band">
        <div className="container-shell position-relative z-10" style={{ textAlign: "center" }}>
          <h2 className="section-title-light">
            Connect with TPS1&apos;s B2B supply network
          </h2>
          <p className="b2b-cta-band__desc" style={{ maxWidth: "600px", margin: "16px auto 28px", color: "rgba(255,255,255,0.8)" }}>
            Experience a reliable, transparent cold-chain delivery process tailored to your kitchen&apos;s exact receiving hours.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link href="/en/bao-gia" className="btn-hero-primary">
              Request a supply proposal <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
