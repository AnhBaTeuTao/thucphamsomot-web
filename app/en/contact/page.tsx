import { makeMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { LeadForm } from "@/components/lead-form";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Phone,
  MapPin,
  Mail,
  Globe,
  MessageCircle,
  Clock,
  Truck,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata = makeMetadata({
  title: "Contact & B2B Consultation | Thuc Pham So Mot (TPS1)",
  description:
    "Hotline 089 890 2222, email contact@thucphamsomot.vn. Connect directly with the Thuc Pham So Mot (TPS1) team for B2B food supply consultation and commercial kitchen partnerships.",
  path: "/en/contact",
});

const contactsEn = [
  { Icon: Building2, label: "Company", value: "THUC PHAM SO MOT COMPANY LIMITED (TPS1)", bold: true },
  { Icon: MapPin, label: "Office", value: siteConfig.englishAddress },
  { Icon: Phone, label: "Hotline", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s+/g, "")}`, highlight: true },
  { Icon: MessageCircle, label: "Zalo / Viber / WhatsApp", value: siteConfig.zaloDisplay },
  { Icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { Icon: Globe, label: "Website", value: siteConfig.domain, href: siteConfig.url },
];

const localitiesEn = [
  "Bien Hoa",
  "Dong Nai",
  "Long Thanh",
  "Trang Bom",
  "Nhon Trach",
  "Di An",
  "Thu Duc",
  "Ho Chi Minh City",
  "Binh Duong",
  "Ba Ria - Vung Tau",
  "Binh Phuoc",
];

const commitmentsEn = [
  {
    Icon: Clock,
    title: "Response within 30 minutes",
    desc: "Our B2B sales team receives your inquiry and reaches out within 30 minutes to answer every question.",
  },
  {
    Icon: Truck,
    title: "On-schedule delivery",
    desc: "Dedicated refrigerated trucks operate 24/7, delivering right on rhythm with your kitchen's agreed schedule.",
  },
  {
    Icon: ShieldCheck,
    title: "VND 5 billion insurance",
    desc: "Every shipment is backed by our VietinBank Insurance (VBI) product liability policy.",
  },
  {
    Icon: BadgeCheck,
    title: "ISO 22000 & HACCP",
    desc: "Transparent sourcing, daily quarantine inspections, and certified international food-safety management.",
  },
];

const processStepsEn = [
  { num: "01", label: "Submit inquiry", desc: "Fill out form or call hotline" },
  { num: "02", label: "Review & consult", desc: "Response within 30 minutes" },
  { num: "03", label: "Tailored proposal", desc: "Price quote & sample schedule" },
  { num: "04", label: "Partner & deliver", desc: "Contract & recurring delivery" },
];

export default function EnglishContactPage() {
  return (
    <main className="page-shell">
      {/* ── HERO BANNER — SYNCHRONIZED 100% WITH /LIEN-HE ────────────── */}
      <section style={{ background: "linear-gradient(135deg, #0a1a10 0%, #123127 100%)", padding: "56px 0 48px" }}>
        <div className="container-shell">
          <div
            className="eyebrow"
            style={{
              background: "rgba(255,255,255,0.12)",
              borderColor: "rgba(255,255,255,0.2)",
              color: "#fff",
              marginBottom: "18px",
            }}
          >
            Contact us
          </div>
          <h1
            style={{
              margin: "0 0 14px",
              color: "#fff",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 900,
              lineHeight: 1.32,
              maxWidth: "18ch",
            }}
          >
            Contact &amp; <span style={{ color: "#4ade80" }}>consultation</span>
          </h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.86)", fontSize: "1.08rem", lineHeight: 1.75, maxWidth: "60ch" }}>
            Connect directly with the Thuc Pham So Mot team for{" "}
            <strong className="b2b-hero__sub-hl">tailored B2B food supply solutions, partnership inquiries</strong>, and fast kitchen support.
          </p>
        </div>
      </section>

      {/* ── MAIN GRID ───────────────────────────────── */}
      <section className="container-shell section-pad">
        <div className="contact-main-grid">
          {/* ── LEFT COLUMN ──────────────────────────── */}
          <div style={{ display: "grid", gap: "16px" }}>
            {/* Contact Info Card */}
            <div className="card" style={{ borderRadius: "24px", padding: "28px" }}>
              <div className="section-label" style={{ marginBottom: "20px" }}>
                Contact information
              </div>
              {contactsEn.map(({ Icon, label, value, href, highlight, bold }) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(20,35,28,0.07)",
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: "42px",
                      height: "42px",
                      borderRadius: "12px",
                      background: "rgba(15,111,75,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent)",
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        margin: "0 0 3px",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        style={{
                          fontSize: highlight ? "1.5rem" : "0.95rem",
                          fontWeight: highlight || bold ? 900 : 600,
                          color: "#123127",
                          textDecoration: "none",
                        }}
                      >
                        {value}
                      </a>
                    ) : (
                      <p
                        style={{
                          margin: 0,
                          fontSize: bold ? "0.95rem" : "0.9rem",
                          fontWeight: bold ? 800 : 500,
                          color: "#123127",
                          lineHeight: 1.5,
                        }}
                      >
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Service coverage */}
            <div className="card" style={{ borderRadius: "24px", padding: "22px 28px" }}>
              <div className="section-label" style={{ marginBottom: "14px" }}>
                Service coverage
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {localitiesEn.map((loc) => (
                  <span
                    key={loc}
                    style={{
                      display: "inline-block",
                      padding: "6px 14px",
                      borderRadius: "999px",
                      border: "1px solid rgba(15,111,75,0.16)",
                      background: "rgba(15,111,75,0.06)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "#365044",
                    }}
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            {/* Warehouse & operations team photo */}
            <div
              style={{
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                minHeight: "220px",
                border: "1px solid var(--border)",
                boxShadow: "0 14px 42px rgba(20,35,28,0.07)",
              }}
            >
              <Image
                src="/images/tps1-gallery-warehouse-people.jpg"
                alt="Thuc Pham So Mot warehouse and delivery team"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, transparent 30%, rgba(10,26,16,0.85) 100%)",
                }}
              />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <CheckCircle2 size={18} color="#4ade80" />
                  <span
                    style={{
                      color: "#4ade80",
                      fontSize: "0.78rem",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Dedicated B2B team
                  </span>
                </div>
                <p style={{ margin: 0, color: "#fff", fontSize: "0.92rem", fontWeight: 600, lineHeight: 1.5 }}>
                  Officially operating since 2017, distributing B2B food ingredients across Dong Nai and neighboring provinces
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ─────────────────────────── */}
          <div style={{ display: "grid", gap: "16px" }}>
            <LeadForm mode="contact" locale="en" />

            {/* 4-step workflow */}
            <div className="card" style={{ borderRadius: "24px", padding: "24px 28px" }}>
              <div className="section-label" style={{ marginBottom: "16px" }}>
                Onboarding workflow
              </div>
              <div className="contact-steps-grid">
                {processStepsEn.map(({ num, label, desc }) => (
                  <div
                    key={num}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "16px",
                      background: "rgba(15,111,75,0.05)",
                      border: "1px solid rgba(15,111,75,0.1)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: 900,
                        color: "var(--accent)",
                        lineHeight: 1,
                        marginBottom: "6px",
                      }}
                    >
                      {num}
                    </div>
                    <div style={{ fontWeight: 800, color: "#123127", fontSize: "0.9rem", marginBottom: "3px" }}>
                      {label}
                    </div>
                    <div style={{ color: "var(--muted-foreground)", fontSize: "0.8rem", lineHeight: 1.5 }}>
                      {desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICE COMMITMENTS ────────────────────────── */}
      <section style={{ background: "#f4f7f3", borderTop: "1px solid var(--border)", padding: "64px 0" }}>
        <div className="container-shell">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div className="section-label" style={{ justifyContent: "center", marginBottom: "12px" }}>
              Service commitment
            </div>
            <h2 className="section-title" style={{ margin: 0 }}>
              Why over 109 businesses trust TPS1
            </h2>
          </div>
          <div className="contact-commitments-grid">
            {commitmentsEn.map(({ Icon, title, desc }) => (
              <div key={title} className="card" style={{ borderRadius: "20px", padding: "24px", display: "grid", gap: "12px" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, rgba(15,111,75,0.12), rgba(15,111,75,0.06))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                  }}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <h3 style={{ margin: "0 0 6px", color: "#123127", fontSize: "1rem", fontWeight: 900, lineHeight: 1.3 }}>
                    {title}
                  </h3>
                  <p style={{ margin: 0, color: "var(--muted-foreground)", fontSize: "0.87rem", lineHeight: 1.7 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP + DIRECT HOTLINE CTA ───────────────────── */}
      <section style={{ padding: "0 0 64px" }}>
        <div className="container-shell">
          <div className="contact-bottom-grid">
            <div
              style={{
                borderRadius: "24px",
                background: "linear-gradient(135deg, #0f6f4b 0%, #123127 100%)",
                padding: "40px 36px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "28px",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.12)",
                    color: "#4ade80",
                    fontSize: "0.75rem",
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "20px",
                  }}
                >
                  📞 Direct consultation
                </div>
                <h2 className="section-title-light" style={{ margin: "0 0 14px" }}>
                  Need fast support? Call our hotline now!
                </h2>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.78)", lineHeight: 1.75 }}>
                  Our B2B sales team is ready to assist from <strong style={{ color: "#fff" }}>07:00 – 21:00</strong> every day, including weekends.
                </p>
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                  className="btn-primary"
                  style={{
                    background: "#4ade80",
                    color: "#0a1a10",
                    fontWeight: 900,
                    fontSize: "1.15rem",
                    padding: "16px 24px",
                    borderRadius: "14px",
                    boxShadow: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    textDecoration: "none",
                  }}
                >
                  <Phone size={20} /> {siteConfig.phone}
                </a>
                <Link
                  href="/en/bao-gia"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "14px 24px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.25)",
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                  }}
                >
                  Send quote request <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Google Map */}
            <div
              style={{
                borderRadius: "24px",
                overflow: "hidden",
                border: "1px solid var(--border)",
                boxShadow: "0 14px 42px rgba(20,35,28,0.07)",
                minHeight: "340px",
              }}
            >
              <iframe
                src={siteConfig.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, display: "block", minHeight: "340px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Thuc Pham So Mot Office Map"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
