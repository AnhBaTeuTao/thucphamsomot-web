"use client";

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
  desc: string;
};

type LocaleCopy = {
  label: string;
  title: string;
  desc: string;
  pillars: PillarItem[];
};

const texts: Record<"vi" | "en", LocaleCopy> = {
  vi: {
    label: "CAM KẾT DỊCH VỤ",
    title: "Vì sao khách hàng chọn\u00A0TPS1?",
    desc: "Nguồn gốc thực\u00A0phẩm, lịch giao hàng, giá cả và hóa đơn là những điều khách hàng cần biết rõ khi chọn nhà cung\u00A0cấp.",
    pillars: [
      {
        tone: 1,
        icon: ShieldCheck,
        title: "Có chứng từ đầy đủ, truy xuất tới từng\u00A0lô",
        desc: "Khi cần kiểm tra nguồn hàng, khách hàng có thể yêu cầu TPS1 cung cấp hồ sơ an toàn thực\u00A0phẩm và các chứng từ pháp lý liên\u00A0quan.",
      },
      {
        tone: 2,
        icon: Truck,
        title: "Giao hàng theo lịch của\u00A0bếp",
        desc: "Khách hàng có thể đặt lịch giao theo ca, theo ngày hoặc theo tuần để phù hợp với giờ chuẩn bị và nấu ăn. Thực\u00A0phẩm được vận chuyển bằng xe lạnh chuyên dụng để giữ độ tươi khi đến\u00A0bếp.",
      },
      {
        tone: 3,
        icon: ClipboardList,
        title: "Báo giá trong 24\u00A0giờ",
        desc: "TPS1 gửi báo giá riêng cho từng khách hàng, dựa trên số lượng và tần suất đặt hàng thực\u00A0tế.",
      },
      {
        tone: 4,
        icon: Building2,
        title: "Phục vụ từ năm\u00A02017",
        desc: "TPS1 đang cung cấp thực\u00A0phẩm cho hơn 109 doanh nghiệp và bếp\u00A0ăn, gồm nhà\u00A0hàng, bếp công ty và trường\u00A0học.",
      },
      {
        tone: 5,
        icon: Award,
        title: "Hóa đơn VAT đầy\u00A0đủ",
        desc: "Xuất hóa đơn điện tử hợp lệ, hỗ trợ chuyển khoản và công nợ theo thỏa\u00A0thuận.",
      },
      {
        tone: 6,
        icon: Zap,
        title: "Danh mục 5.000+\u00A0sản\u00A0phẩm",
        desc: "Khách hàng có thể đặt rau củ, thịt cá, hàng đông\u00A0lạnh, gia\u00A0vị, đồ\u00A0khô và thực\u00A0phẩm chay từ cùng một nhà cung\u00A0cấp.",
      },
    ],
  },
  en: {
    label: "SERVICE COMMITMENT",
    title: "Why do commercial kitchens choose\u00A0TPS1?",
    desc: "Food origin, delivery schedule, pricing, and invoicing are the essentials every customer needs to know when choosing a supplier.",
    pillars: [
      {
        tone: 1,
        icon: ShieldCheck,
        title: "Full documentation, traceable to every\u00A0batch",
        desc: "Whenever source verification is needed, customers can request food-safety records and related legal certificates from TPS1.",
      },
      {
        tone: 2,
        icon: Truck,
        title: "Delivery matched to kitchen\u00A0schedules",
        desc: "Schedule deliveries by shift, day, or week to match prep and cooking hours. Products travel in dedicated refrigerated vans to stay fresh.",
      },
      {
        tone: 3,
        icon: ClipboardList,
        title: "Custom quote within 24\u00A0hours",
        desc: "TPS1 prepares a dedicated quote for each customer based on actual order volume and delivery frequency.",
      },
      {
        tone: 4,
        icon: Building2,
        title: "Serving since\u00A02017",
        desc: "TPS1 supplies food ingredients to over 109 businesses and kitchens, including restaurants, corporate canteens, and schools.",
      },
      {
        tone: 5,
        icon: Award,
        title: "Full valid VAT\u00A0invoices",
        desc: "Compliant electronic VAT invoicing with support for bank transfers and agreed credit terms.",
      },
      {
        tone: 6,
        icon: Zap,
        title: "Catalog of 5,000+\u00A0products",
        desc: "Order produce, meat, seafood, frozen goods, seasonings, dry goods, and vegetarian items from a single supplier.",
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
