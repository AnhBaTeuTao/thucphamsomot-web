import { ShieldCheck, Truck, ClipboardList, Building2, Award, Zap } from "lucide-react";

const texts = {
  vi: {
    label: "Cam kết dịch vụ",
    title: (
      <>
        <span className="phrase">Vì sao nhiều gian bếp</span>{" "}
        <span className="phrase">chọn&nbsp;TPS1?</span>
      </>
    ),
    desc: "Mỗi cam kết dưới đây được giữ bằng việc làm mỗi ngày, từ chuyến hàng sáng sớm đến tờ hóa đơn cuối tháng.",
    pillars: [
      {
        icon: ShieldCheck,
        color: "#0f6f4b",
        bg: "rgba(15,111,75,0.10)",
        title: "Rõ nguồn gốc, đủ\u00a0hồ\u00a0sơ",
        desc: "Hàng có nguồn gốc rõ ràng, kèm hồ sơ an toàn thực phẩm và chứng từ pháp lý khi quý khách cần\u00a0đối\u00a0chiếu.",
      },
      {
        icon: Truck,
        color: "#1d4ed8",
        bg: "rgba(29,78,216,0.10)",
        title: "Đúng giờ, đúng\u00a0nhịp\u00a0bếp",
        desc: "Giao theo ca, theo ngày hoặc theo tuần bằng xe lạnh chuyên dụng, để hàng về bếp vẫn giữ trọn\u00a0độ\u00a0tươi.",
      },
      {
        icon: ClipboardList,
        color: "#c7372f",
        bg: "rgba(199,55,47,0.10)",
        title: "Báo giá trong\u00a024\u00a0giờ",
        desc: "Mỗi gian bếp nhận một phương án giá riêng, tính theo sản lượng và nhịp đặt hàng\u00a0thực\u00a0tế.",
      },
      {
        icon: Building2,
        color: "#7c3aed",
        bg: "rgba(124,58,237,0.10)",
        title: "Phục vụ từ\u00a0năm\u00a02017",
        desc: "Hơn 109 doanh nghiệp và bếp ăn, từ nhà hàng, bếp công ty đến trường học, đang tin\u00a0chọn\u00a0TPS1.",
      },
      {
        icon: Award,
        color: "#b45309",
        bg: "rgba(180,83,9,0.10)",
        title: "Hóa đơn VAT\u00a0đầy\u00a0đủ",
        desc: "Xuất hóa đơn điện tử hợp lệ, hỗ trợ chuyển khoản và công nợ theo\u00a0thỏa\u00a0thuận.",
      },
      {
        icon: Zap,
        color: "#0891b2",
        bg: "rgba(8,145,178,0.10)",
        title: "Danh mục 5.000+\u00a0sản\u00a0phẩm",
        desc: "Rau củ, thịt cá, hàng đông lạnh, gia vị, đồ khô và thực phẩm chay, gói gọn trong một đầu mối cho cả\u00a0gian\u00a0bếp.",
      },
    ]
  },
  en: {
    label: "Service Commitment",
    title: "Why do businesses choose TPS1?",
    desc: "More than just a supplier — TPS1 is a long-term, reliable catering partner.",
    pillars: [
      {
        icon: ShieldCheck,
        color: "#0f6f4b",
        bg: "rgba(15,111,75,0.10)",
        title: "Verified\u00a0Source",
        desc: "Food-safety and legal documents are available for B2B review on request.",
      },
      {
        icon: Truck,
        color: "#1d4ed8",
        bg: "rgba(29,78,216,0.10)",
        title: "Scheduled\u00a0Delivery",
        desc: "Flexible scheduling by shift, day, or week. Specialized fleet ensuring cold chain temperature.",
      },
      {
        icon: ClipboardList,
        color: "#c7372f",
        bg: "rgba(199,55,47,0.10)",
        title: "Quote within\u00a024h",
        desc: "Each customer gets a custom pricing plan tailored to volume and actual order cycles.",
      },
      {
        icon: Building2,
        color: "#7c3aed",
        bg: "rgba(124,58,237,0.10)",
        title: "B2B\u00a0Experience",
        desc: "Serving factories, schools, hospitals, and industrial catering operators in Dong Nai.",
      },
      {
        icon: Award,
        color: "#b45309",
        bg: "rgba(180,83,9,0.10)",
        title: "Full VAT\u00a0Invoices",
        desc: "Valid e-invoices. Supporting bank transfers and debt clearing based on agreements.",
      },
      {
        icon: Zap,
        color: "#0891b2",
        bg: "rgba(8,145,178,0.10)",
        title: "5,000+ Product\u00a0Catalog",
        desc: "Vegetables, meat, frozen foods, spices, vegetarian foods — all from a single supplier.",
      },
    ]
  }
};

export function TrustPillars({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const t = texts[locale];

  return (
    <section className="b2b-pillars" aria-labelledby="pillars-heading">
      <div className="container-shell">
        <div className="mb-12">
          <div className="section-label">{t.label}</div>
          <h2 id="pillars-heading" className="section-title">
            {t.title}
          </h2>
          <p className="section-desc" style={{ color: "#374151", fontSize: "18px", lineHeight: 1.7, textWrap: "pretty" }}>
            {t.desc}
          </p>
        </div>

        <div
          className="b2b-pillars-grid"
          id="b2b-pillars-grid"
        >
          {t.pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="b2b-pillar-card"
                style={{
                  padding: "30px 28px",
                  border: "1px solid rgba(15, 111, 75, 0.12)",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.03)",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "20px",
                }}
              >
                {/* Header: Icon bên trái, Tiêu đề to nổi bật đặt ngay kế bên */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    className="b2b-pillar-icon"
                    style={{
                      background: p.bg,
                      color: p.color,
                      width: "58px",
                      height: "58px",
                      borderRadius: "16px",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={28} />
                  </div>
                  <h3
                    style={{
                      fontSize: "1.42rem",
                      fontWeight: 800,
                      color: "#133127",
                      margin: 0,
                      lineHeight: 1.3,
                      textWrap: "balance",
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {p.title}
                  </h3>
                </div>

                {/* Nội dung mô tả chuẩn 18px to rõ, dễ đọc, không rớt chữ */}
                <p
                  style={{
                    fontSize: "18px",
                    color: "#334155",
                    lineHeight: 1.68,
                    margin: 0,
                    fontWeight: 450,
                    textWrap: "pretty",
                  }}
                >
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .b2b-pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr)); /* Desktop: Cố định chuẩn 3 cột x 2 dòng */
          gap: 24px;
        }

        @media (max-width: 900px) {
          .b2b-pillars-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)); /* Tablet: 2 cột x 3 dòng */
            gap: 20px;
          }
        }

        @media (max-width: 640px) {
          .b2b-pillars-grid {
            grid-template-columns: 1fr; /* Mobile: 1 cột xếp chồng dọc */
            gap: 16px;
          }
          .b2b-pillar-card p {
            font-size: 15px !important;
            line-height: 1.55 !important;
          }
        }
      `}} />
    </section>
  );
}
