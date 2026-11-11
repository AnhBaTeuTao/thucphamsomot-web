import { makeMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { LeadForm } from "@/components/lead-form";
import Image from "next/image";
import Link from "next/link";
import {
  Building2, Phone, MapPin, Mail, Globe, MessageCircle,
  Clock, Truck, ShieldCheck, BadgeCheck, ArrowRight, CheckCircle2,
} from "lucide-react";

export const metadata = makeMetadata({
  title: "Liên hệ tư vấn | Thực Phẩm Số Một (TPS1)",
  description:
    "Hotline 089 890 2222, email contact@thucphamsomot.vn. Kết nối trực tiếp với đội ngũ Thực Phẩm Số Một (TPS1) để nhận tư vấn giải pháp cung ứng thực phẩm và hợp tác cùng gian bếp của bạn.",
  path: "/lien-he",
});

const contacts = [
  { Icon: Building2, label: "Công ty", value: "CÔNG TY TNHH THỰC PHẨM SỐ MỘT", bold: true },
  { Icon: MapPin, label: "Văn phòng", value: siteConfig.addressFull },
  { Icon: Phone, label: "Hotline", value: siteConfig.phone, href: `tel:${siteConfig.phone.replace(/\s/g, "")}`, highlight: true },
  { Icon: MessageCircle, label: "Zalo / Viber / WhatsApp", value: siteConfig.zaloDisplay },
  { Icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { Icon: Globe, label: "Website", value: siteConfig.domain, href: siteConfig.url },
];

const commitments = [
  { Icon: Clock, title: "Phản hồi trong 30 phút", desc: "Đội ngũ kinh doanh tiếp nhận thông tin và liên hệ lại trong vòng 30 phút để giải đáp mọi thắc mắc." },
  { Icon: Truck, title: "Giao hàng đúng lịch", desc: "Xe lạnh chuyên dụng hoạt động 24/7, giao hàng đúng nhịp theo lịch đã thống nhất với bếp." },
  { Icon: ShieldCheck, title: "Bảo hiểm 5 tỷ VNĐ", desc: "Mỗi lô hàng đều được bảo vệ bởi hợp đồng bảo hiểm trách nhiệm sản phẩm VietinBank." },
  { Icon: BadgeCheck, title: "ISO 22000 & HACCP", desc: "Nguồn gốc minh bạch, kiểm dịch mỗi ngày, đạt tiêu chuẩn quốc tế về an toàn thực phẩm." },
];

const processSteps = [
  { num: "01", label: "Gửi thông tin", desc: "Điền form hoặc gọi hotline" },
  { num: "02", label: "Tiếp nhận & Tư vấn", desc: "Phản hồi trong 30 phút" },
  { num: "03", label: "Lên phương án", desc: "Báo giá và lịch giao mẫu" },
  { num: "04", label: "Hợp tác & Giao hàng", desc: "Ký kết và giao hàng định kỳ" },
];

export default function ContactPage() {
  return (
    <main className="page-shell">
      {/* ── HERO BANNER ─────────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg, #0a1a10 0%, #123127 100%)", padding: "56px 0 48px" }}>
        <div className="container-shell">
          <div className="eyebrow" style={{ background: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.2)", color: "#fff", marginBottom: "18px" }}>
            Liên hệ
          </div>
          <h1 style={{ margin: "0 0 14px", color: "#fff", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 900, lineHeight: 1.08, maxWidth: "18ch" }}>
            Liên hệ&nbsp;<span style={{ color: "#4ade80" }}>tư vấn</span>
          </h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", fontSize: "1.05rem", lineHeight: 1.8, maxWidth: "60ch" }}>
            Kết nối trực tiếp với đội ngũ Thực Phẩm Số Một để được tư vấn giải pháp cung ứng thực phẩm, trao đổi hợp tác và nhận hỗ trợ nhanh chóng nhất.
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
              <div className="section-label" style={{ marginBottom: "20px" }}>Thông tin liên hệ</div>
              {contacts.map(({ Icon, label, value, href, highlight, bold }) => (
                <div key={label} style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "14px 0", borderBottom: "1px solid rgba(20,35,28,0.07)" }}>
                  <div style={{ flexShrink: 0, width: "42px", height: "42px", borderRadius: "12px", background: "rgba(15,111,75,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: "0 0 3px", fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted-foreground)" }}>{label}</p>
                    {href ? (
                      <a href={href} style={{ fontSize: highlight ? "1.5rem" : "0.95rem", fontWeight: highlight || bold ? 900 : 600, color: "#123127", textDecoration: "none" }}>{value}</a>
                    ) : (
                      <p style={{ margin: 0, fontSize: bold ? "0.95rem" : "0.9rem", fontWeight: bold ? 800 : 500, color: "#123127", lineHeight: 1.5 }}>{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Khu vực phục vụ */}
            <div className="card" style={{ borderRadius: "24px", padding: "22px 28px" }}>
              <div className="section-label" style={{ marginBottom: "14px" }}>Khu vực phục vụ</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {siteConfig.localities.map((loc) => (
                  <span key={loc} style={{ display: "inline-block", padding: "6px 14px", borderRadius: "999px", border: "1px solid rgba(15,111,75,0.16)", background: "rgba(15,111,75,0.06)", fontSize: "0.82rem", fontWeight: 700, color: "#365044" }}>
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            {/* Hình ảnh kho + đội ngũ — thay bản đồ */}
            <div style={{ position: "relative", borderRadius: "24px", overflow: "hidden", minHeight: "220px", border: "1px solid var(--border)", boxShadow: "0 14px 42px rgba(20,35,28,0.07)" }}>
              <Image
                src="/images/tps1-gallery-warehouse-people.jpg"
                alt="Đội ngũ giao nhận Thực Phẩm Số Một tại kho"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              {/* overlay */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, rgba(10,26,16,0.85) 100%)" }} />
              {/* caption */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <CheckCircle2 size={18} color="#4ade80" />
                  <span style={{ color: "#4ade80", fontSize: "0.78rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em" }}>Đội ngũ chuyên nghiệp</span>
                </div>
                <p style={{ margin: 0, color: "#fff", fontSize: "0.92rem", fontWeight: 600, lineHeight: 1.5 }}>
                  Chính thức hoạt động từ năm 2017, phân phối thực phẩm B2B tại Đồng Nai và khu vực lân cận
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ─────────────────────────── */}
          <div style={{ display: "grid", gap: "16px" }}>
            {/* Lead Form */}
            <LeadForm mode="contact" />

            {/* Quy trình 4 bước */}
            <div className="card" style={{ borderRadius: "24px", padding: "24px 28px" }}>
              <div className="section-label" style={{ marginBottom: "16px" }}>Quy trình làm việc</div>
              <div className="contact-steps-grid">
                {processSteps.map(({ num, label, desc }) => (
                  <div key={num} style={{ padding: "14px 16px", borderRadius: "16px", background: "rgba(15,111,75,0.05)", border: "1px solid rgba(15,111,75,0.1)" }}>
                    <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--accent)", lineHeight: 1, marginBottom: "6px" }}>{num}</div>
                    <div style={{ fontWeight: 800, color: "#123127", fontSize: "0.9rem", marginBottom: "3px" }}>{label}</div>
                    <div style={{ color: "var(--muted-foreground)", fontSize: "0.8rem", lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CAM KẾT DỊCH VỤ ────────────────────────── */}
      <section style={{ background: "#f4f7f3", borderTop: "1px solid var(--border)", padding: "64px 0" }}>
        <div className="container-shell">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div className="section-label" style={{ justifyContent: "center", marginBottom: "12px" }}>Cam kết dịch vụ</div>
            <h2 className="section-title" style={{ margin: 0 }}>
              Lý do hơn 109 doanh nghiệp tin tưởng TPS1
            </h2>
          </div>
          <div className="contact-commitments-grid">
            {commitments.map(({ Icon, title, desc }) => (
              <div key={title} className="card" style={{ borderRadius: "20px", padding: "24px", display: "grid", gap: "12px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, rgba(15,111,75,0.12), rgba(15,111,75,0.06))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 style={{ margin: "0 0 6px", color: "#123127", fontSize: "1rem", fontWeight: 900, lineHeight: 1.3 }}>{title}</h3>
                  <p style={{ margin: 0, color: "var(--muted-foreground)", fontSize: "0.87rem", lineHeight: 1.7 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BẢN ĐỒ + CTA ───────────────────────────── */}
      <section style={{ padding: "0 0 64px" }}>
        <div className="container-shell">
          <div className="contact-bottom-grid">
            {/* CTA */}
            <div style={{ borderRadius: "24px", background: "linear-gradient(135deg, #0f6f4b 0%, #123127 100%)", padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "28px" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "999px", background: "rgba(255,255,255,0.12)", color: "#4ade80", fontSize: "0.75rem", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px" }}>
                  📞 Tư vấn trực tiếp
                </div>
                <h2 className="section-title-light" style={{ margin: "0 0 14px" }}>
                  Cần tư vấn nhanh? Gọi ngay hotline!
                </h2>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.72)", lineHeight: 1.75 }}>
                  Đội ngũ kinh doanh TPS1 sẵn sàng hỗ trợ từ <strong style={{ color: "#fff" }}>7:00 – 21:00</strong> mỗi ngày, kể cả cuối tuần.
                </p>
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="btn-primary" style={{ background: "#4ade80", color: "#0a1a10", fontWeight: 900, fontSize: "1.15rem", padding: "16px 24px", borderRadius: "14px", boxShadow: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", textDecoration: "none" }}>
                  <Phone size={20} /> {siteConfig.phone}
                </a>
                <Link href="/bao-gia" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px 24px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.08)", color: "#fff", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}>
                  Gửi yêu cầu báo giá <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Google Map */}
            <div style={{ borderRadius: "24px", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 14px 42px rgba(20,35,28,0.07)", minHeight: "340px" }}>
              <iframe
                src={siteConfig.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, display: "block", minHeight: "340px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Bản đồ Thực Phẩm Số Một"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
