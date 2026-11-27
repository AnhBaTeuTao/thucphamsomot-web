"use client";

import type { ReactNode } from "react";
import {
  Award,
  Building2,
  ClipboardList,
  ShieldCheck,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { ScrollReveal } from "@/components/b2b/scroll-reveal";

type PillarItem = {
  tone: 1 | 2 | 3 | 4 | 5 | 6;
  icon: LucideIcon;
  title: string;
  desc: ReactNode;
};

type LocaleCopy = {
  label: string;
  title: string;
  desc: ReactNode;
  pillars: PillarItem[];
};

const texts: Record<"vi" | "en", LocaleCopy> = {
  vi: {
    label: "Cam kết dịch vụ",
    title: "Vì sao khách hàng chọn TPS1?",
    desc: (
      <>
        <strong className="tps1-key-hl">Nguồn gốc thực phẩm, lịch giao hàng, giá cả và hóa đơn</strong> là những điều khách hàng cần biết rõ khi chọn nhà cung cấp.
      </>
    ),
    pillars: [
      {
        tone: 1,
        icon: ShieldCheck,
        title: "Chứng từ đầy đủ, truy xuất từng lô",
        desc: (
          <>
            Khi cần kiểm tra nguồn hàng, khách hàng có thể yêu cầu TPS1 cung cấp{" "}
            <strong className="tps1-key-hl">hồ sơ an toàn thực phẩm</strong> và các{" "}
            <strong className="tps1-key-hl">chứng từ pháp lý</strong> liên quan.
          </>
        ),
      },
      {
        tone: 2,
        icon: Truck,
        title: "Giao hàng theo lịch của bếp",
        desc: (
          <>
            Khách hàng có thể đặt lịch{" "}
            <strong className="tps1-key-hl">giao theo ca, theo ngày hoặc theo tuần</strong> để phù hợp với giờ chuẩn bị và nấu ăn. Thực phẩm được vận chuyển bằng{" "}
            <strong className="tps1-key-hl">xe lạnh chuyên dụng</strong> để giữ độ tươi khi đến bếp.
          </>
        ),
      },
      {
        tone: 3,
        icon: ClipboardList,
        title: "Báo giá trong 24 giờ",
        desc: (
          <>
            TPS1 gửi <strong className="tps1-key-hl">báo giá riêng</strong> cho từng khách hàng, dựa trên{" "}
            <strong className="tps1-key-hl">số lượng và tần suất đặt hàng thực tế</strong>.
          </>
        ),
      },
      {
        tone: 4,
        icon: Building2,
        title: "Phục vụ từ năm 2017",
        desc: (
          <>
            TPS1 đang cung cấp thực phẩm cho{" "}
            <strong className="tps1-key-hl">hơn 109 doanh nghiệp và bếp ăn</strong>, gồm nhà hàng, bếp công ty và trường học.
          </>
        ),
      },
      {
        tone: 5,
        icon: Award,
        title: "Hóa đơn VAT đầy đủ",
        desc: (
          <>
            Xuất <strong className="tps1-key-hl">hóa đơn điện tử hợp lệ</strong>, hỗ trợ chuyển khoản và{" "}
            <strong className="tps1-key-hl">công nợ theo thỏa thuận</strong>.
          </>
        ),
      },
      {
        tone: 6,
        icon: Zap,
        title: "Danh mục 5.000+ sản phẩm",
        desc: (
          <>
            Khách hàng có thể đặt rau củ, thịt cá, hàng đông lạnh, gia vị, đồ khô và thực phẩm chay từ{" "}
            <strong className="tps1-key-hl">cùng một nhà cung cấp</strong>.
          </>
        ),
      },
    ],
  },
  en: {
    label: "Service commitment",
    title: "Why do commercial kitchens choose TPS1?",
    desc: (
      <>
        <strong className="tps1-key-hl">Food origin, delivery schedule, pricing, and invoicing</strong> are the essential details every customer needs to know clearly when choosing a supplier.
      </>
    ),
    pillars: [
      {
        tone: 1,
        icon: ShieldCheck,
        title: "Full records, traceable by batch",
        desc: (
          <>
            Whenever source verification is needed, customers can request{" "}
            <strong className="tps1-key-hl">food-safety records</strong> and{" "}
            <strong className="tps1-key-hl">related legal certificates</strong> from TPS1.
          </>
        ),
      },
      {
        tone: 2,
        icon: Truck,
        title: "Delivered to kitchen schedules",
        desc: (
          <>
            Customers can schedule{" "}
            <strong className="tps1-key-hl">deliveries by shift, by day, or by week</strong> to match prep and cooking hours. Ingredients travel in{" "}
            <strong className="tps1-key-hl">dedicated refrigerated trucks</strong> to stay fresh until they reach the kitchen.
          </>
        ),
      },
      {
        tone: 3,
        icon: ClipboardList,
        title: "Custom quote within 24 hours",
        desc: (
          <>
            TPS1 sends a <strong className="tps1-key-hl">tailored wholesale quotation</strong> to each customer, based on{" "}
            <strong className="tps1-key-hl">actual order volume and delivery frequency</strong>.
          </>
        ),
      },
      {
        tone: 4,
        icon: Building2,
        title: "Serving since 2017",
        desc: (
          <>
            TPS1 currently supplies food ingredients to{" "}
            <strong className="tps1-key-hl">over 109 businesses and kitchens</strong>, including restaurants, corporate canteens, and schools.
          </>
        ),
      },
      {
        tone: 5,
        icon: Award,
        title: "Full valid VAT invoices",
        desc: (
          <>
            We issue <strong className="tps1-key-hl">valid electronic VAT invoices</strong> and support bank transfers along with{" "}
            <strong className="tps1-key-hl">agreed credit terms</strong>.
          </>
        ),
      },
      {
        tone: 6,
        icon: Zap,
        title: "Catalog of 5,000+ products",
        desc: (
          <>
            Customers can order fresh produce, meat, seafood, frozen goods, seasonings, dry goods, and vegetarian items from{" "}
            <strong className="tps1-key-hl">a single supplier</strong>.
          </>
        ),
      },
    ],
  },
};

export function TrustPillars({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const t = texts[locale];

  return (
    <section className="b2b-pillars tps1-pillars-unified" aria-labelledby="pillars-heading">
      <div className="container-shell">
        <ScrollReveal className="b2b-pillars-head">
          <div className="b2b-pillars-head__eyebrow">{t.label}</div>
          <h2 id="pillars-heading" className="b2b-pillars-head__title">
            {t.title}
          </h2>
          <p className="b2b-pillars-head__desc">{t.desc}</p>
        </ScrollReveal>

        <ScrollReveal className="b2b-pillars-grid" id="b2b-pillars-grid">
          {t.pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article
                key={`pillar-tone-${pillar.tone}`}
                className={`b2b-pillar-card b2b-pillar-card--tone-${pillar.tone}`}
              >
                <div className="b2b-pillar-icon" aria-hidden="true">
                  <Icon size={25} strokeWidth={2} />
                </div>
                <h3 className="b2b-pillar-card__title">{pillar.title}</h3>
                <p className="b2b-pillar-card__desc">{pillar.desc}</p>
              </article>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
