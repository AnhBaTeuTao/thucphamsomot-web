import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { makeMetadata } from "@/lib/seo";
import { B2BHeroSection } from "@/components/b2b/hero-section";
import { PartnerRibbon } from "@/components/b2b/partner-ribbon";
import { TrustPillars } from "@/components/b2b/trust-pillars";
import { B2BCatalog } from "@/components/b2b/catalog-section";
import { LeadCaptureSection } from "@/components/b2b/lead-capture";

export const metadata = makeMetadata({
  title: "B2B Food Supplier for Canteens in Dong Nai",
  description:
    "B2B food supplier for canteens, factories, schools and hospitals in Dong Nai. ISO 22000 & HACCP certified, quotes within 24 hours, full VAT invoices.",
  path: "/en",
});

const processSteps = [
  {
    num: "01",
    title: "Send product list",
    desc: "Upload an Excel, PDF, or photo of your required ingredients.",
  },
  {
    num: "02",
    title: "Receive quote in 24h",
    desc: "Our sales team analyzes and sends a detailed pricing plan matching your volume.",
  },
  {
    num: "03",
    title: "Confirm & Deliver",
    desc: "Confirm via phone or email. We deliver on schedule with agreed specifications.",
  },
];

export default function EnglishHomePage() {
  return (
    <main>
      {/* 1. HERO */}
      <B2BHeroSection locale="en" />

      {/* 2. SOCIAL PROOF – Partner ribbon */}
      <PartnerRibbon locale="en" />

      {/* 3. TRUST PILLARS */}
      <TrustPillars locale="en" />

      {/* 4. B2B CATALOG */}
      <B2BCatalog locale="en" />

      {/* 5. PROCESS – How it works */}
      <section className="b2b-process" aria-labelledby="process-heading">
        <div className="container-shell">
          <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 56px" }}>
            <div className="section-label">Workflow</div>
            <h2 id="process-heading" className="section-title">
              3 steps — Simple &amp; Transparent
            </h2>
            <p className="section-desc" style={{ margin: "0 auto" }}>
              No complexity, no wasted time. TPS1 optimizes the process so you get the fastest quote.
            </p>
          </div>

          <div className="b2b-process-grid">
            {/* Connector line */}
            <div className="process-connector-line" aria-hidden="true" />
            {/* Animated glowing dot */}
            <div aria-hidden="true" className="process-dot-anim" />
            {processSteps.map((step) => (
              <div key={step.num} className="b2b-process-step">
                <div className="b2b-process-step__num">{step.num}</div>
                <h3 className="b2b-process-step__title">
                  {step.title}
                </h3>
                <p className="b2b-process-step__desc">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LEAD CAPTURE (Dropzone + Form) */}
      <LeadCaptureSection locale="en" />

      {/* 8. FINAL CTA BAND */}
      <section className="b2b-cta-band" aria-label="Bottom call to action">
        <div className="container-shell" style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "24px",
            }}
          >
            <div className="section-label" style={{ color: "#4ade80" }}>
              Ready to partner
            </div>
            <h2 className="section-title-light" style={{ maxWidth: "640px", margin: 0 }}>
              Get a food supply quote<br />for your kitchen today.
            </h2>
            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "1rem", lineHeight: 1.7, maxWidth: "480px", margin: 0 }}>
              Response within 24 hours. No commitment required.
              Just send your list — TPS1 handles the rest.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/en/bao-gia" className="btn-hero-primary" style={{ fontSize: "1rem" }}>
                Send quote request <ArrowRight size={18} />
              </Link>
              <Link href="/ho-so-nang-luc" className="btn-hero-secondary">
                Download company profile
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
