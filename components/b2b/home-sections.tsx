"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChefHat,
  Factory,
  GraduationCap,
  HeartPulse,
  MapPin,
  Plus,
  Store,
  Truck,
  Utensils,
} from "lucide-react";
import { ScrollReveal } from "@/components/b2b/scroll-reveal";

const industryHighlights = [
  {
    href: "/nganh-hang/nha-hang-khach-san",
    image: "/images/industries/nha-hang-khach-san-vn.png",
    icon: Utensils,
    label: "Nhà hàng, khách sạn",
    description:
      "Nguyên liệu có kích cỡ, quy cách phù hợp với thực đơn và được giao theo giờ bếp nhận hàng.",
  },
  {
    href: "/nganh-hang/quan-an",
    image: "/images/tps1-kitchen.png",
    icon: Store,
    label: "Quán ăn, chuỗi F&B",
    description: "Giao nguyên liệu tươi theo số lượng và giờ nhận hàng của quán.",
  },
  {
    href: "/nganh-hang/bep-an-tap-the",
    image: "/images/industries/bep-an-tap-the-vn.png",
    icon: Factory,
    label: "Bếp công ty, nhà máy",
    description:
      "Cung cấp nguyên liệu theo định mức và lịch nấu từng ca của bếp công ty, nhà máy.",
  },
  {
    href: "/nganh-hang/truong-hoc",
    image: "/images/industries/truong-hoc-vn.png",
    icon: GraduationCap,
    label: "Trường học",
    description:
      "Cung cấp thực phẩm rõ nguồn gốc và hồ sơ an toàn thực phẩm cho bếp ăn bán trú.",
  },
  {
    href: "/nganh-hang/benh-vien",
    image: "/images/industries/benh-vien-vn.png",
    icon: HeartPulse,
    label: "Bệnh viện",
    description: "Kiểm soát an toàn theo ISO 22000 và HACCP cho bếp ăn bệnh viện.",
  },
  {
    href: "/nganh-hang/suat-an-cong-nghiep",
    image: "/images/industries/suat-an-cong-nghiep-vn.png",
    icon: ChefHat,
    label: "Đơn vị suất ăn",
    description: "Nguyên liệu ổn định và hỗ trợ thực đơn cho đơn vị cung cấp suất ăn.",
  },
];

const dongNaiBanner = {
  href: "/cung-cap-thuc-pham-dong-nai",
  label: "Toàn tỉnh Đồng Nai",
};

const dongNaiRoutes = [
  { href: "/cung-cap-thuc-pham-bien-hoa", label: "Biên Hòa" },
  { href: "/cung-cap-thuc-pham-ho-nai", label: "Hố Nai" },
  { href: "/cung-cap-thuc-pham-tam-phuoc", label: "Tam Phước" },
  { href: "/cung-cap-thuc-pham-trang-bom", label: "Trảng Bom" },
  { href: "/cung-cap-thuc-pham-cho-nha-may", label: "Các khu công nghiệp" },
  { href: "/cung-cap-thuc-pham-kcn-amata", label: "KCN Amata" },
  { href: "/cung-cap-thuc-pham-vinh-cuu", label: "Vĩnh Cửu" },
  { href: "/cung-cap-thuc-pham-long-thanh", label: "Long Thành" },
  { href: "/cung-cap-thuc-pham-nhon-trach", label: "Nhơn Trạch" },
  { href: "/cung-cap-thuc-pham-binh-phuoc", label: "Bình Phước" },
];

const hcmRoutes = [
  { href: "/cung-cap-thuc-pham-tp-hcm", label: "TP. Hồ Chí Minh" },
  { href: "/cung-cap-thuc-pham-binh-duong", label: "Bình Dương" },
  { href: "/cung-cap-thuc-pham-ba-ria-vung-tau", label: "Bà Rịa - Vũng Tàu" },
  { href: "/cung-cap-thuc-pham-phu-my", label: "Phú Mỹ" },
];

const processSteps = [
  {
    num: "01",
    image: "/images/process/step1.jpg",
    title: "Gửi danh sách hàng",
    desc: "Tải lên file Excel, PDF hoặc ảnh chụp danh sách nguyên liệu cần mua.",
  },
  {
    num: "02",
    image: "/images/tps1-quality.jpg",
    title: "Nhận báo giá trong 24 giờ",
    desc: "Đội kinh doanh gửi bảng giá chi tiết, tính theo sản lượng thực tế của từng gian bếp.",
  },
  {
    num: "03",
    image: "/images/tps1-real-delivery-truck.jpg",
    title: "Xác nhận và giao hàng",
    desc: "Chốt đơn qua điện thoại hoặc email; hàng về bếp đúng lịch, đúng quy cách đã thỏa thuận.",
  },
];

const knowledgeArticles = [
  {
    image: "/images/industries/benh-vien-vn.png",
    title: "Chọn nhà cung cấp thực phẩm cho bếp ăn bệnh viện: những điểm khác với bếp ăn thường",
    summary:
      "Bếp ăn bệnh viện nấu cho người bệnh với nhiều chế độ ăn, hoạt động cả ngày lễ và chịu kiểm tra chặt. Những điểm phòng hành chính và khoa dinh dưỡng nên xét khi chọn nhà cung cấp.",
    href: "/blog",
  },
  {
    image: "/images/tps1-quality.jpg",
    title: "Truy xuất nguồn gốc thực phẩm cho bếp ăn tập thể: làm thế nào cho đúng?",
    summary:
      "Khi có sự cố hay đoàn kiểm tra, bếp ăn phải trả lời được lô thịt, lô rau hôm đó từ đâu ra. Cách tổ chức hồ sơ để truy xuất nguồn gốc trong vài phút thay vì vài ngày.",
    href: "/blog",
  },
  {
    image: "/images/industries/bep-an-tap-the-vn.png",
    title: "Checklist chuẩn bị bếp ăn mùa tất niên và Tết cho nhà máy, trường học",
    summary:
      "Từ tiệc tất niên, ngày làm việc cuối năm đến tuần mở cửa sau Tết: danh sách việc bếp ăn tập thể cần chuẩn bị về nguyên liệu, lịch giao, kho và nhân sự.",
    href: "/blog",
  },
  {
    image: "/images/categories/rau-cu-qua.png",
    title: "Vì sao bếp ăn chuyên nghiệp không mua thực phẩm trôi nổi, không hóa đơn?",
    summary:
      "Mua hàng chợ không hóa đơn có vẻ rẻ hơn vài phần trăm, nhưng bếp ăn doanh nghiệp, trường học phải trả giá bằng rủi ro thuế, rủi ro an toàn thực phẩm và những lần giải trình khó khăn.",
    href: "/blog",
  },
  {
    image: "/images/industries/truong-hoc-vn.png",
    title: "Tiêu chí chọn nhà cung cấp thực phẩm cho bếp ăn trường học",
    summary:
      "Bảy tiêu chí hội đồng nhà trường nên dùng khi chọn nhà cung cấp thực phẩm cho bếp bán trú: từ hồ sơ pháp lý, nguồn hàng, giờ giao đến cách xử lý khi có sự cố.",
    href: "/blog",
  },
  {
    image: "/images/tps1-kitchen.png",
    title: "Kiểm thực ba bước và lưu mẫu thức ăn: bếp ăn tập thể cần làm gì từ khâu nhận hàng",
    summary:
      "Tóm tắt Quyết định 1246/QĐ-BYT cho người phụ trách bếp: nhận hàng cần kiểm tra giấy tờ gì, ghi sổ ra sao, lưu mẫu bao nhiêu gam, giữ ở nhiệt độ nào và trong bao lâu.",
    href: "/blog",
  },
];

const homeFaqs = [
  {
    question: "TPS1 cung cấp thực phẩm cho những loại bếp ăn nào?",
    answer:
      "TPS1 cung cấp thực phẩm sỉ cho bếp ăn công nghiệp tại nhà máy và khu công nghiệp, bếp ăn bán trú của trường học, bếp ăn bệnh viện, bếp ăn cơ quan, đơn vị suất ăn công nghiệp, cùng nhà hàng và quán ăn. Mỗi bếp được tư vấn quy cách hàng và lịch giao riêng.",
  },
  {
    question: "TPS1 giao thực phẩm ở những khu vực nào?",
    answer:
      "TPS1 giao hàng theo tuyến cố định tại Đồng Nai (Biên Hòa, Trảng Bom, Long Thành, Nhơn Trạch, các khu công nghiệp), Bình Dương, TP.HCM và Bà Rịa – Vũng Tàu.",
  },
  {
    question: "Làm thế nào để nhận báo giá thực phẩm sỉ?",
    answer:
      "Quý khách gửi danh sách hàng cần mua dưới dạng file Excel, PDF hoặc ảnh chụp qua trang báo giá hoặc hotline 089 890 2222. TPS1 xác nhận trong 2 giờ làm việc và gửi báo giá trong vòng 24 giờ, tính theo sản lượng thực tế của bếp.",
  },
  {
    question: "TPS1 có xuất hóa đơn VAT và cung cấp hồ sơ an toàn thực phẩm không?",
    answer:
      "Có. TPS1 xuất hóa đơn VAT điện tử cho mọi đơn hàng, đạt chứng nhận ISO 22000 và HACCP, có bảo hiểm trách nhiệm sản phẩm 5 tỷ đồng, và cung cấp hồ sơ an toàn thực phẩm, chứng từ nguồn gốc theo yêu cầu của nhà trường, bệnh viện hoặc doanh nghiệp.",
  },
  {
    question: "Thực phẩm được giao vào thời gian nào và bảo quản ra sao?",
    answer:
      "TPS1 giao theo ca, theo ngày hoặc theo tuần tùy lịch nấu của bếp, có tuyến giao từ 05:00 sáng. Hàng tươi sống và đông lạnh được vận chuyển bằng xe lạnh chuyên dụng để giữ độ tươi đến khi tới bếp.",
  },
];

const industryHighlightsByLocale = {
  vi: industryHighlights,
  en: [
    {
      href: "/en/ingredients#bento-nha-hang-khach-san",
      image: "/images/industries/nha-hang-khach-san-vn.png",
      icon: Utensils,
      label: "Restaurants & hotels",
      description:
        "Ingredients graded by size and cut to match your menu, delivered according to your kitchen's receiving hours.",
    },
    {
      href: "/en/ingredients#bento-quan-an",
      image: "/images/tps1-kitchen.png",
      icon: Store,
      label: "Eateries & F&B chains",
      description: "Fresh ingredients delivered daily matching the volume and opening hours of each outlet.",
    },
    {
      href: "/en/ingredients#bento-bep-an-tap-the",
      image: "/images/industries/bep-an-tap-the-vn.png",
      icon: Factory,
      label: "Company & factory canteens",
      description:
        "Ingredients supplied to exact shift rations and cooking schedules for corporate and factory kitchens.",
    },
    {
      href: "/en/ingredients#bento-truong-hoc",
      image: "/images/industries/truong-hoc-vn.png",
      icon: GraduationCap,
      label: "Schools",
      description:
        "Traceable ingredients with full food-safety documentation for school boarding and day-boarding kitchens.",
    },
    {
      href: "/en/ingredients#bento-benh-vien",
      image: "/images/industries/benh-vien-vn.png",
      icon: HeartPulse,
      label: "Hospitals",
      description: "Strict food safety controlled under ISO 22000 and HACCP standards for hospital kitchens.",
    },
    {
      href: "/en/ingredients#bento-suat-an-cong-nghiep",
      image: "/images/industries/suat-an-cong-nghiep-vn.png",
      icon: ChefHat,
      label: "Industrial caterers",
      description: "Consistent ingredient specs and menu support for industrial meal contractors.",
    },
  ],
};

const dongNaiRoutesEn = [
  { href: "/en/contact", label: "Bien Hoa" },
  { href: "/en/contact", label: "Ho Nai" },
  { href: "/en/contact", label: "Tam Phuoc" },
  { href: "/en/contact", label: "Trang Bom" },
  { href: "/en/contact", label: "Industrial Parks" },
  { href: "/en/contact", label: "Amata IP" },
  { href: "/en/contact", label: "Vinh Cuu" },
  { href: "/en/contact", label: "Long Thanh" },
  { href: "/en/contact", label: "Nhon Trach" },
  { href: "/en/contact", label: "Binh Phuoc" },
];

const hcmRoutesEn = [
  { href: "/en/contact", label: "Ho Chi Minh City" },
  { href: "/en/contact", label: "Binh Duong" },
  { href: "/en/contact", label: "Ba Ria - Vung Tau" },
  { href: "/en/contact", label: "Phu My" },
];

const processStepsEn = [
  {
    num: "01",
    image: "/images/process/step1.jpg",
    title: "Send your buying list",
    desc: "Upload an Excel, PDF, or photo of the ingredients your kitchen needs to purchase.",
  },
  {
    num: "02",
    image: "/images/tps1-quality.jpg",
    title: "Receive quote within 24 hours",
    desc: "Our sales team prepares a detailed wholesale price list based on your kitchen's actual volume.",
  },
  {
    num: "03",
    image: "/images/tps1-real-delivery-truck.jpg",
    title: "Confirm and receive delivery",
    desc: "Confirm orders via phone or email; goods arrive at your kitchen on schedule and to agreed specs.",
  },
];

const knowledgeArticlesEn = [
  {
    image: "/images/industries/benh-vien-vn.png",
    title: "Choosing a food supplier for hospital kitchens: how it differs from regular canteens",
    summary:
      "Hospital kitchens prepare meals for patients across diverse dietary regimens, operate on holidays, and undergo strict inspections. Key factors administrative and nutrition departments should evaluate.",
    href: "/en/news",
  },
  {
    image: "/images/tps1-quality.jpg",
    title: "Food traceability for collective canteens: how to set it up properly",
    summary:
      "During an audit or inspection, a kitchen must immediately trace where that day's meat and produce batch came from. How to organize records to trace origins in minutes instead of days.",
    href: "/en/news",
  },
  {
    image: "/images/industries/bep-an-tap-the-vn.png",
    title: "Year-end and Tet holiday kitchen checklist for factories and schools",
    summary:
      "From year-end banquets and final working shifts to the first week back after Tet: what collective kitchens need to prepare regarding ingredients, delivery schedules, cold storage, and staffing.",
    href: "/en/news",
  },
  {
    image: "/images/categories/rau-cu-qua.png",
    title: "Why professional kitchens avoid unverified market goods without VAT invoices",
    summary:
      "Buying unverified goods without invoices may look a few percent cheaper upfront, but corporate and school kitchens pay a heavy price in tax compliance risks, food-safety hazards, and audit explanations.",
    href: "/en/news",
  },
  {
    image: "/images/industries/truong-hoc-vn.png",
    title: "7 criteria for selecting a food supplier for school boarding kitchens",
    summary:
      "Seven essential benchmarks school boards should evaluate when selecting a boarding-kitchen supplier: legal certificates, sourcing origins, delivery timing, and incident response.",
    href: "/en/news",
  },
  {
    image: "/images/tps1-kitchen.png",
    title: "Three-step food inspection and sample retention: what collective kitchens must do from receiving",
    summary:
      "A practical summary of Ministry of Health Decision 1246/QD-BYT for kitchen managers: what documents to check upon delivery, how to log entries, how many grams to retain, and storage temperature rules.",
    href: "/en/news",
  },
];

const homeFaqsEn = [
  {
    question: "What types of kitchens does TPS1 supply food to?",
    answer:
      "TPS1 supplies wholesale food ingredients to factory and industrial-park canteens, school boarding kitchens, hospital kitchens, corporate offices, industrial catering contractors, as well as restaurants and F&B chains. Every kitchen receives tailored product specifications and delivery schedules.",
  },
  {
    question: "Which areas does TPS1 deliver to?",
    answer:
      "TPS1 operates fixed daily cold-chain delivery routes across Dong Nai (Bien Hoa, Trang Bom, Long Thanh, Nhon Trach, and major industrial parks), Binh Duong, Ho Chi Minh City, and Ba Ria – Vung Tau.",
  },
  {
    question: "How can we receive a wholesale food quotation?",
    answer:
      "Simply send your buying list as an Excel file, PDF, or photo via our quote page or hotline 089 890 2222. TPS1 confirms your request within 2 working hours and delivers a detailed quotation within 24 hours, calculated according to your actual volume.",
  },
  {
    question: "Does TPS1 issue VAT invoices and provide food-safety records?",
    answer:
      "Yes. TPS1 issues valid electronic VAT invoices for every order, holds ISO 22000 and HACCP certifications, carries VND 5 billion in product liability insurance, and provides full food-safety and origin certificates required by schools, hospitals, and enterprises.",
  },
  {
    question: "When are ingredients delivered and how are they preserved?",
    answer:
      "TPS1 delivers by shift, day, or week to match your kitchen's cooking schedule, with early routes starting from 05:00 AM. Fresh and frozen items are transported in dedicated refrigerated trucks to maintain freshness right to your kitchen door.",
  },
];

export function IndustriesShowcaseSection({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const isEn = locale === "en";
  const items = industryHighlightsByLocale[locale];
  return (
    <section className="home-sectors tps1-cine-sectors" aria-labelledby="industries-heading">
      <div className="container-shell">
        <ScrollReveal className="b2b-section-head tps1-sectors-head">
          <div className="section-label">{isEn ? "Industries we serve" : "Ngành hàng phục vụ"}</div>
          <h2 id="industries-heading" className="section-title tps1-sectors-head__title">
            {isEn ? "Food supply tailored to every kitchen model" : "Thực phẩm cho từng loại hình bếp ăn"}
          </h2>
          <p className="section-desc">
            {isEn
              ? "TPS1 tailors product specifications, arranges delivery schedules, and provides legal documentation matched to restaurants, company canteens, schools, and catering contractors."
              : "TPS1 lựa chọn quy cách hàng hóa, sắp xếp lịch giao và cung cấp hồ sơ theo nhu cầu của nhà hàng, bếp công ty, trường học và các đơn vị suất ăn."}
          </p>
        </ScrollReveal>

        <div className="tps1-cine-grid">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.href + item.label} delay={(idx % 3) * 55} className="tps1-cine-card-wrap">
                <Link href={item.href} className="tps1-cine-card">
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    className="tps1-cine-card__img"
                    sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  />
                  <div className="tps1-cine-card__scrim" aria-hidden="true" />

                  <span className="tps1-cine-card__badge" aria-hidden="true">
                    <Icon size={20} />
                  </span>

                  <div className="tps1-cine-card__bottom">
                    <h3>{item.label}</h3>
                    <p>{item.description}</p>
                    <span className="tps1-cine-card__cta">
                      <span>{isEn ? "View details" : "Xem trang"}</span>
                      <ArrowRight size={15} className="tps1-cine-card__arrow" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal className="home-sectors__footer">
          <Link href={isEn ? "/en/ingredients" : "/nganh-hang"} className="btn-secondary">
            <span>{isEn ? "Explore all 6 industries" : "Xem tất cả ngành hàng"}</span>
            <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function ColdChainDispatchSection({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const isEn = locale === "en";
  const dnRoutes = isEn ? dongNaiRoutesEn : dongNaiRoutes;
  const hRoutes = isEn ? hcmRoutesEn : hcmRoutes;
  const dnBannerHref = isEn ? "/en/contact" : dongNaiBanner.href;
  const dnBannerLabel = isEn ? "All across Dong Nai Province" : dongNaiBanner.label;

  return (
    <section className="tps1-areas-luxury" aria-labelledby="areas-heading">
      <div className="container-shell">
        <ScrollReveal className="b2b-section-head tps1-areas-luxury__head">
          <div className="section-label">{isEn ? "Service coverage" : "Khu vực phục vụ"}</div>
          <h2 id="areas-heading" className="section-title tps1-areas-luxury__title">
            {isEn ? (
              <>
                Wholesale food delivery across{" "}
                <br className="tps1-br-md" />
                Dong Nai, Binh Duong,{" "}
                <br className="tps1-br-md" />
                Ho Chi Minh City &amp; Ba Ria – Vung Tau
              </>
            ) : (
              <>
                Cung cấp thực phẩm tại{" "}
                <br className="tps1-br-md" />
                Đồng Nai, Bình Dương,{" "}
                <br className="tps1-br-md" />
                TP.HCM và Bà Rịa – Vũng Tàu
              </>
            )}
          </h2>
          <p className="section-desc tps1-areas-luxury__desc">
            {isEn ? (
              <>
                Fixed daily refrigerated routes cover Dong Nai (including the former Binh Phuoc area),{" "}
                <br className="tps1-br-lg" />
                Ho Chi Minh City, Binh Duong, and Ba Ria - Vung Tau, delivering right on time for every kitchen shift.
              </>
            ) : (
              <>
                Các tuyến giao cố định phủ Đồng Nai (gồm cả khu vực Bình Phước cũ),{" "}
                <br className="tps1-br-lg" />
                TP.HCM, Bình Dương và Bà Rịa - Vũng Tàu, đưa hàng đến đúng khung giờ mỗi gian bếp cần.
              </>
            )}
          </p>
        </ScrollReveal>

        {/* 2 Pearl-Mint Elevated Route Panels (7fr : 5fr, Equal Height) */}
        <div className="tps1-areas-luxury__panels">
          {/* PANEL 1: DONG NAI (1 Full-Width Hub Banner + 10 Equal 2x5 Cells) */}
          <ScrollReveal className="tps1-pearl-panel">
            <div className="tps1-pearl-panel__header">
              <div className="tps1-pearl-panel__title-row">
                <span className="tps1-pearl-panel__icon" aria-hidden="true">
                  <Truck size={20} />
                </span>
                <h3>{isEn ? "Dong Nai" : "Đồng Nai"}</h3>
              </div>
              <p className="tps1-pearl-panel__sub">
                <MapPin size={14} aria-hidden="true" />
                <span>{isEn ? "Including former Binh Phuoc area" : "Gồm cả khu vực Bình Phước cũ"}</span>
              </p>
            </div>

            <div className="tps1-pearl-panel__dongnai-grid">
              <Link href={dnBannerHref} className="tps1-route-banner">
                <span className="tps1-route-banner__dot" aria-hidden="true" />
                <span className="tps1-route-banner__label">{dnBannerLabel}</span>
                <ArrowRight size={17} className="tps1-route-banner__arrow" aria-hidden="true" />
              </Link>

              {dnRoutes.map((area) => (
                <Link key={area.href + area.label} href={area.href} className="tps1-route-cell">
                  <span className="tps1-route-cell__dot" aria-hidden="true" />
                  <span className="tps1-route-cell__label">{area.label}</span>
                  <ArrowRight size={15} className="tps1-route-cell__arrow" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </ScrollReveal>

          {/* PANEL 2: TP.HCM VA LAN CAN (4 Tall Stretched Major Route Bars) */}
          <ScrollReveal delay={75} className="tps1-pearl-panel">
            <div className="tps1-pearl-panel__header">
              <div className="tps1-pearl-panel__title-row">
                <span className="tps1-pearl-panel__icon" aria-hidden="true">
                  <Truck size={20} />
                </span>
                <h3>{isEn ? "Ho Chi Minh City & neighboring areas" : "TP.HCM và lân cận"}</h3>
              </div>
              <p className="tps1-pearl-panel__sub">
                <MapPin size={14} aria-hidden="true" />
                <span>
                  {isEn
                    ? "Including former Binh Duong & Ba Ria - Vung Tau"
                    : "Gồm Bình Dương và Bà Rịa - Vũng Tàu cũ"}
                </span>
              </p>
            </div>

            <div className="tps1-pearl-panel__hcm-stack">
              {hRoutes.map((area) => (
                <Link key={area.href + area.label} href={area.href} className="tps1-route-major">
                  <span className="tps1-route-major__dot" aria-hidden="true" />
                  <span className="tps1-route-major__label">{area.label}</span>
                  <ArrowRight size={17} className="tps1-route-major__arrow" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export function ProcessCertificationsSection({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const isEn = locale === "en";
  const steps = isEn ? processStepsEn : processSteps;

  return (
    <section className="tps1-orbital-open" aria-labelledby="process-heading">
      <div className="container-shell">
        <ScrollReveal className="b2b-section-head b2b-process__head">
          <div className="section-label">{isEn ? "How we work" : "Quy trình làm việc"}</div>
          <h2 id="process-heading" className="section-title">
            {isEn ? "From your buying list to on-time kitchen delivery" : "Từ danh sách cần mua đến đơn hàng được giao"}
          </h2>
          <p className="section-desc">
            {isEn
              ? "Send your buying list to receive a tailored quote, then finalize product specifications and delivery schedules with TPS1."
              : "Gửi danh sách cần mua để nhận báo giá, sau đó thống nhất quy cách và lịch giao với TPS1."}
          </p>
        </ScrollReveal>

        {/* Project44 Flowing Light-Wave SVG + 3 Orbital Circular Photo Nodes (176px, 0% Boxes) */}
        <div className="tps1-wave-process">
          <svg
            className="tps1-wave-process__svg"
            viewBox="0 0 1000 150"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="tps1-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0f6f4b" stopOpacity="0.28" />
                <stop offset="50%" stopColor="#14b87a" stopOpacity="0.72" />
                <stop offset="100%" stopColor="#ff7918" stopOpacity="0.65" />
              </linearGradient>
              <radialGradient id="tps1-orb-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff7918" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#14b87a" stopOpacity="0.48" />
                <stop offset="100%" stopColor="#14b87a" stopOpacity="0" />
              </radialGradient>
            </defs>

            <path
              d="M 85 75 C 230 16, 350 134, 500 75 C 650 16, 770 134, 915 75"
              fill="none"
              stroke="url(#tps1-wave-grad)"
              strokeWidth="2.5"
              strokeDasharray="6 6"
              strokeLinecap="round"
            />
            <path
              className="tps1-wave-process__flow"
              d="M 85 75 C 230 16, 350 134, 500 75 C 650 16, 770 134, 915 75"
              fill="none"
              stroke="url(#tps1-wave-grad)"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <circle r="15" fill="url(#tps1-orb-glow)">
              <animateMotion
                dur="4.4s"
                repeatCount="indefinite"
                path="M 85 75 C 230 16, 350 134, 500 75 C 650 16, 770 134, 915 75"
              />
            </circle>
            <circle r="5.5" fill="#ffffff" stroke="#ff7918" strokeWidth="2">
              <animateMotion
                dur="4.4s"
                repeatCount="indefinite"
                path="M 85 75 C 230 16, 350 134, 500 75 C 650 16, 770 134, 915 75"
              />
            </circle>
          </svg>

          <div className="tps1-wave-process__grid">
            {steps.map((step, idx) => (
              <ScrollReveal key={step.num} delay={idx * 80} className="tps1-wave-station">
                <div className="tps1-wave-station__orb-wrap">
                  <span className="tps1-wave-station__ring" aria-hidden="true" />
                  <div className="tps1-wave-station__disc">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      loading="eager"
                      className="object-cover"
                      sizes="190px"
                    />
                  </div>
                  <span className="tps1-wave-station__num" aria-label={isEn ? `Step ${step.num}` : `Bước ${step.num}`}>
                    {step.num}
                  </span>
                </div>

                <div className="tps1-wave-station__text">
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function KitchenKnowledgeSection({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const isEn = locale === "en";
  const list = isEn ? knowledgeArticlesEn : knowledgeArticles;
  const [featured, ...restArticles] = list;
  const streamArticles = restArticles.slice(0, 4);

  return (
    <section className="tps1-editorial" aria-labelledby="knowledge-heading">
      <div className="container-shell">
        <ScrollReveal className="tps1-editorial__head">
          <div>
            <div className="section-label">{isEn ? "Kitchen operations insights" : "Kiến thức cho bếp ăn"}</div>
            <h2 id="knowledge-heading" className="section-title">
              {isEn ? "Practical guides for kitchen & procurement managers" : "Bài viết mới cho người quản lý bếp ăn"}
            </h2>
          </div>
          <Link href={isEn ? "/en/news" : "/blog"} className="btn-secondary tps1-editorial__all-btn">
            <span>{isEn ? "View all articles" : "Xem tất cả bài viết"}</span>
            <ArrowRight size={16} />
          </Link>
        </ScrollReveal>

        <div className="tps1-editorial__layout">
          <ScrollReveal className="tps1-editorial__featured-col">
            <Link href={featured.href} className="tps1-editorial-featured">
              <div className="tps1-editorial-featured__media">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="tps1-editorial-featured__img object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                />
              </div>
              <div className="tps1-editorial-featured__body">
                <h3>{featured.title}</h3>
                <p>{featured.summary}</p>
                <span className="tps1-editorial__read">
                  <span>{isEn ? "Read article" : "Đọc bài viết"}</span>
                  <ArrowRight size={15} className="tps1-editorial__arrow" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={60} className="tps1-editorial__stream-col">
            {streamArticles.map((article) => (
              <div key={article.title} className="tps1-editorial-row-wrap">
                <Link href={article.href} className="tps1-editorial-row">
                  <div className="tps1-editorial-row__thumb">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="110px"
                    />
                  </div>
                  <div className="tps1-editorial-row__content">
                    <h3>{article.title}</h3>
                    <p>{article.summary}</p>
                    <span className="tps1-editorial__read">
                      <span>{isEn ? "Read article" : "Đọc bài viết"}</span>
                      <ArrowRight size={15} className="tps1-editorial__arrow" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export function HomeFaqSection({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const isEn = locale === "en";
  const faqs = isEn ? homeFaqsEn : homeFaqs;

  return (
    <section className="tps1-faq-split" aria-labelledby="faq-heading">
      <div className="container-shell">
        <div className="tps1-faq-split__grid">
          <ScrollReveal className="tps1-faq-split__sticky">
            <div className="section-label">{isEn ? "Frequently asked questions" : "Câu hỏi thường gặp"}</div>
            <h2 id="faq-heading" className="section-title tps1-faq-split__title">
              {isEn
                ? "Common questions kitchens ask before partnering with TPS1"
                : "Những điều bếp ăn thường hỏi trước khi chọn TPS1"}
            </h2>
          </ScrollReveal>

          <div className="tps1-faq-split__list">
            {faqs.map((item, idx) => (
              <ScrollReveal key={item.question} delay={idx * 40}>
                <details className="tps1-faq-row" open={idx === 0}>
                  <summary className="tps1-faq-row__summary">
                    <span className="tps1-faq-row__q">{item.question}</span>
                    <span className="tps1-faq-row__plus" aria-hidden="true">
                      <Plus size={20} />
                    </span>
                  </summary>
                  <div className="tps1-faq-row__answer">
                    <p>{item.answer}</p>
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FinalCtaBandSection({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const isEn = locale === "en";

  return (
    <section className="tps1-horizon-cta" aria-label={isEn ? "Bottom call to action" : "Kêu gọi hành động cuối trang"}>
      <div className="container-shell">
        <ScrollReveal mode="final" className="tps1-horizon-stage">
          <div className="tps1-horizon-stage__aurora" aria-hidden="true" />
          <div className="tps1-horizon-stage__grid" aria-hidden="true" />
          <div className="tps1-horizon-stage__content">
            <div className="section-label b2b-cta-band__label">
              {isEn ? "Ready to partner" : "Sẵn sàng hợp tác"}
            </div>
            <h2 className="section-title-light b2b-cta-title">
              {isEn ? "Send your food purchasing list to TPS1" : "Gửi danh sách thực phẩm cần mua cho TPS1"}
            </h2>
            <p className="b2b-cta-band__desc">
              {isEn
                ? "Send your required item list — TPS1 confirms within 2 working hours and delivers a detailed quotation within 24 hours. Review your quote with no obligation before placing an order."
                : "Gửi danh sách hàng cần mua, TPS1 xác nhận trong 2 giờ làm việc và gửi báo giá trong vòng 24 giờ. Khách hàng có thể xem báo giá trước khi quyết định đặt hàng."}
            </p>
            <div className="b2b-cta-band__actions">
              <Link href={isEn ? "/en/bao-gia" : "/bao-gia"} className="btn-hero-primary">
                <span>{isEn ? "Send quote request" : "Gửi yêu cầu báo giá"}</span>
                <ArrowRight size={18} />
              </Link>
              <Link href="/ho-so-nang-luc" className="btn-hero-secondary">
                <span>
                  {isEn ? "View company profile & food safety certificates" : "Xem hồ sơ năng lực & chứng nhận ATTP"}
                </span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
