"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { usePathname } from "next/navigation";
import { siteConfig, type Locale } from "@/lib/site";
import { brandAssets, customerHighlights } from "@/lib/brand";

const footerText = {
  vi: {
    description:
      "Gửi trọn an tâm trong từng bữa ăn. Từ năm 2017, TPS1 mang đa dạng thực phẩm có nguồn gốc rõ ràng, an toàn đến nhà hàng, quán ăn, bếp công ty, trường học và bếp ăn công nghiệp.",
    contact: "Liên hệ",
    facebookLabel: "Facebook chính thức",
    supplyForHeading: "Cung cấp thực phẩm cho",
    served: "Đã phục vụ",
    mapTitle: "Bản đồ công ty",
    mapCopy:
      "Xem vị trí văn phòng và khu vực TPS1 đang giao hàng: Đồng Nai (gồm cả khu vực Bình Phước cũ), TP.HCM, Bình Dương và Bà Rịa - Vũng Tàu.",
    mapLink: "Mở Google Maps",
    mapIframeTitle: "Bản đồ Thực Phẩm Số Một",
    quoteHref: "/bao-gia",
    quoteLabel: "Gửi yêu cầu báo giá",
    adminLabel: "Quản trị nội dung",
    address: siteConfig.addressFull,
    customers: customerHighlights.slice(0, 5),
    segments: [
      { href: "/nganh-hang/nha-hang-khach-san", label: "Nhà hàng, khách sạn" },
      { href: "/nganh-hang/quan-an", label: "Quán ăn, chuỗi F&B" },
      { href: "/cung-cap-thuc-pham-cho-truong-hoc", label: "Trường học, bếp bán trú" },
      { href: "/cung-cap-thuc-pham-cho-nha-may", label: "Nhà máy, xí nghiệp" },
      { href: "/cung-cap-thuc-pham-cho-co-quan", label: "Cơ quan, văn phòng" },
      { href: "/cung-cap-thuc-pham-dong-nai", label: "Doanh nghiệp tại Đồng Nai" },
    ],
  },
  en: {
    description:
      "Delivering peace of mind in every meal. Since 2017, TPS1 has supplied diverse, traceable, and safe food ingredients to restaurants, eateries, company canteens, schools, and industrial kitchens.",
    contact: "Contact",
    facebookLabel: "Official Facebook page",
    supplyForHeading: "We supply food for",
    served: "Trusted by",
    mapTitle: "Company map",
    mapCopy:
      "View our office location and delivery coverage: Dong Nai (including former Binh Phuoc area), Ho Chi Minh City, Binh Duong, and Ba Ria - Vung Tau.",
    mapLink: "Open Google Maps",
    mapIframeTitle: "Thuc Pham So Mot map",
    quoteHref: "/en/bao-gia",
    quoteLabel: "Request a quote",
    adminLabel: "Content admin",
    address: siteConfig.englishAddress,
    customers: customerHighlights.slice(0, 5),
    segments: [
      { href: "/en/ingredients#bento-nha-hang-khach-san", label: "Restaurants & hotels" },
      { href: "/en/ingredients#bento-quan-an", label: "Eateries & F&B chains" },
      { href: "/en/ingredients#bento-truong-hoc", label: "Schools & boarding canteens" },
      { href: "/en/ingredients#bento-bep-an-tap-the", label: "Factories & industrial parks" },
      { href: "/en/ingredients#bento-benh-vien", label: "Hospitals & healthcare" },
      { href: "/en/ingredients#bento-suat-an-cong-nghiep", label: "Industrial catering contractors" },
    ],
  },
} satisfies Record<
  Locale,
  {
    description: string;
    contact: string;
    facebookLabel: string;
    supplyForHeading: string;
    served: string;
    mapTitle: string;
    mapCopy: string;
    mapLink: string;
    mapIframeTitle: string;
    quoteHref: string;
    quoteLabel: string;
    adminLabel: string;
    address: string;
    customers: string[];
    segments: Array<{ href: string; label: string }>;
  }
>;

export function SiteFooter() {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith("/en") ? "en" : "vi";
  const text = footerText[locale];

  return (
    <footer className="site-footer">
      <div className="container-shell site-footer__inner">
        <div className="site-footer__brand">
          <Image src={brandAssets.logoTransparent} alt={siteConfig.name} width={180} height={60} />
          <p>{text.description}</p>
        </div>

        <div>
          <h2>{text.contact}</h2>
          <ul className="site-footer__links">
            <li>
              <Phone size={14} />
              <a href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}>{siteConfig.phone}</a>
            </li>
            <li>
              <Mail size={14} />
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </li>
            <li>
              <MapPin size={14} />
              <span>{text.address}</span>
            </li>
            <li>
              <ArrowUpRight size={14} />
              <a href={siteConfig.facebook} target="_blank" rel="noopener noreferrer">
                {text.facebookLabel}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2>{text.supplyForHeading}</h2>
          <ul className="site-footer__links">
            {text.segments.map((item) => (
              <li key={item.href + item.label}>
                <ArrowUpRight size={14} />
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>{text.served}</h2>
          <ul className="site-footer__links">
            {text.customers.map((item) => (
              <li key={item}>
                <ArrowUpRight size={14} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-shell site-footer__map">
        <div className="site-footer__map-copy">
          <h2>{text.mapTitle}</h2>
          <p>{text.mapCopy}</p>
          <a href={siteConfig.mapPlaceUrl} target="_blank" rel="noreferrer">
            {text.mapLink}
          </a>
        </div>
        <div className="site-footer__map-frame">
          <iframe
            src={siteConfig.mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={text.mapIframeTitle}
          />
        </div>
      </div>

      <div className="container-shell site-footer__bottom">
        <span>thucphamsomot.vn</span>
      </div>
    </footer>
  );
}
