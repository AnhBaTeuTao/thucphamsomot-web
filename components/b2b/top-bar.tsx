"use client";

import { ShieldCheck, Award, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";

const itemsByLocale = {
  vi: [
    { icon: ShieldCheck, text: "Đạt chuẩn ISO 22000 & HACCP" },
    { icon: Award, text: "Bảo hiểm trách nhiệm sản phẩm 5.000.000.000 VNĐ" },
    { icon: Phone, text: `Hotline B2B: ${siteConfig.phone}` },
    { icon: ShieldCheck, text: "99,8% đơn hàng giao đúng hẹn" },
    { icon: Award, text: "109+ khách hàng doanh nghiệp tin dùng" },
  ],
  en: [
    { icon: ShieldCheck, text: "ISO 22000 & HACCP Certified" },
    { icon: Award, text: "Product Liability Insurance of VND 5,000,000,000" },
    { icon: Phone, text: `B2B Hotline: ${siteConfig.phone}` },
    { icon: ShieldCheck, text: "99.8% On-Time Delivery Rate" },
    { icon: Award, text: "Trusted by 109+ Enterprise & Kitchen Clients" },
  ],
};

export function TopBar() {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en");
  const items = isEnglish ? itemsByLocale.en : itemsByLocale.vi;
  // 4 copies total (2 per 50% half) so the marquee spans wide viewports & 50% zoom seamlessly
  const halfTrackItems = [...items, ...items];
  const allItems = [...halfTrackItems, ...halfTrackItems];

  return (
    <div
      className="b2b-topbar"
      role="banner"
      aria-label={isEnglish ? "Certifications and B2B contact info" : "Thông tin chứng chỉ và liên hệ"}
    >
      <div className="b2b-topbar__track" aria-hidden="true">
        {allItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <span key={i} className="b2b-topbar__item">
              <Icon size={13} />
              <span>{item.text}</span>
              <span className="b2b-topbar__dot" />
            </span>
          );
        })}
      </div>
      <p className="sr-only">{items.map((i) => i.text).join(" · ")}</p>
    </div>
  );
}
