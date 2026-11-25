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
    label: "Nhà\u00A0hàng, khách\u00A0sạn",
    description:
      "Nguyên liệu có kích cỡ, quy cách phù hợp với thực đơn và được giao theo giờ bếp nhận\u00A0hàng.",
  },
  {
    href: "/nganh-hang/quan-an",
    image: "/images/tps1-kitchen.png",
    icon: Store,
    label: "Quán ăn, chuỗi F&B",
    description: "Giao nguyên liệu tươi theo số lượng và giờ nhận hàng của\u00A0quán.",
  },
  {
    href: "/nganh-hang/bep-an-tap-the",
    image: "/images/industries/bep-an-tap-the-vn.png",
    icon: Factory,
    label: "Bếp\u00A0ăn công\u00A0nghiệp, nhà\u00A0máy",
    description:
      "Cung cấp nguyên liệu theo định mức và lịch nấu từng ca của bếp công ty, nhà\u00A0máy.",
  },
  {
    href: "/nganh-hang/truong-hoc",
    image: "/images/industries/truong-hoc-vn.png",
    icon: GraduationCap,
    label: "Trường\u00A0học",
    description:
      "Cung cấp thực\u00A0phẩm rõ nguồn gốc và hồ sơ an toàn thực\u00A0phẩm cho bếp\u00A0ăn bán\u00A0trú.",
  },
  {
    href: "/nganh-hang/benh-vien",
    image: "/images/industries/benh-vien-vn.png",
    icon: HeartPulse,
    label: "Bệnh\u00A0viện",
    description: "Kiểm soát an toàn theo ISO 22000 và HACCP cho bếp\u00A0ăn bệnh\u00A0viện.",
  },
  {
    href: "/nganh-hang/suat-an-cong-nghiep",
    image: "/images/industries/suat-an-cong-nghiep-vn.png",
    icon: ChefHat,
    label: "Đơn vị suất\u00A0ăn",
    description: "Nguyên liệu ổn định và hỗ trợ thực đơn cho đơn vị cung cấp suất\u00A0ăn.",
  },
];

const dongNaiBanner = {
  href: "/cung-cap-thuc-pham-dong-nai",
  label: "Toàn tỉnh Đồng\u00A0Nai",
};

const dongNaiRoutes = [
  { href: "/cung-cap-thuc-pham-bien-hoa", label: "Biên\u00A0Hòa" },
  { href: "/cung-cap-thuc-pham-ho-nai", label: "Hố\u00A0Nai" },
  { href: "/cung-cap-thuc-pham-tam-phuoc", label: "Tam\u00A0Phước" },
  { href: "/cung-cap-thuc-pham-trang-bom", label: "Trảng\u00A0Bom" },
  { href: "/cung-cap-thuc-pham-cho-nha-may", label: "Các khu công\u00A0nghiệp" },
  { href: "/cung-cap-thuc-pham-kcn-amata", label: "KCN\u00A0Amata" },
  { href: "/cung-cap-thuc-pham-vinh-cuu", label: "Vĩnh\u00A0Cửu" },
  { href: "/cung-cap-thuc-pham-long-thanh", label: "Long\u00A0Thành" },
  { href: "/cung-cap-thuc-pham-nhon-trach", label: "Nhơn\u00A0Trạch" },
  { href: "/cung-cap-thuc-pham-binh-phuoc", label: "Bình\u00A0Phước" },
];

const hcmRoutes = [
  { href: "/cung-cap-thuc-pham-tp-hcm", label: "TP.\u00A0Hồ\u00A0Chí\u00A0Minh" },
  { href: "/cung-cap-thuc-pham-binh-duong", label: "Bình\u00A0Dương" },
  { href: "/cung-cap-thuc-pham-ba-ria-vung-tau", label: "Bà\u00A0Rịa\u00A0-\u00A0Vũng\u00A0Tàu" },
  { href: "/cung-cap-thuc-pham-phu-my", label: "Phú\u00A0Mỹ" },
];

const processSteps = [
  {
    num: "01",
    image: "/images/process/step1.jpg",
    title: "Gửi danh sách hàng",
    desc: "Tải lên file Excel, PDF hoặc ảnh chụp danh sách nguyên liệu cần\u00A0mua.",
  },
  {
    num: "02",
    image: "/images/tps1-quality.jpg",
    title: "Nhận báo giá trong 24\u00A0giờ",
    desc: "Đội kinh doanh gửi bảng giá chi tiết, tính theo sản lượng thực tế của từng gian\u00A0bếp.",
  },
  {
    num: "03",
    image: "/images/tps1-real-delivery-truck.jpg",
    title: "Xác nhận và giao hàng",
    desc: "Chốt đơn qua điện thoại hoặc email; hàng về bếp đúng lịch, đúng quy cách đã thỏa\u00A0thuận.",
  },
];

const knowledgeArticles = [
  {
    image: "/images/industries/benh-vien-vn.png",
    title: "Chọn nhà cung cấp thực\u00A0phẩm cho bếp\u00A0ăn bệnh\u00A0viện: những điểm khác với bếp\u00A0ăn thường",
    summary:
      "Bếp\u00A0ăn bệnh\u00A0viện nấu cho người bệnh với nhiều chế độ ăn, hoạt động cả ngày lễ và chịu kiểm tra chặt. Những điểm phòng hành chính và khoa dinh dưỡng nên xét khi chọn nhà cung\u00A0cấp.",
    href: "/blog",
  },
  {
    image: "/images/tps1-quality.jpg",
    title: "Truy xuất nguồn gốc thực\u00A0phẩm cho bếp\u00A0ăn tập thể: làm thế nào cho\u00A0đúng?",
    summary:
      "Khi có sự cố hay đoàn kiểm tra, bếp\u00A0ăn phải trả lời được lô thịt, lô rau hôm đó từ đâu ra. Cách tổ chức hồ sơ để truy xuất nguồn gốc trong vài phút thay vì vài\u00A0ngày.",
    href: "/blog",
  },
  {
    image: "/images/industries/bep-an-tap-the-vn.png",
    title: "Checklist chuẩn bị bếp\u00A0ăn mùa tất niên và Tết cho nhà\u00A0máy, trường\u00A0học",
    summary:
      "Từ tiệc tất niên, ngày làm việc cuối năm đến tuần mở cửa sau Tết: danh sách việc bếp\u00A0ăn tập thể cần chuẩn bị về nguyên liệu, lịch giao, kho và nhân\u00A0sự.",
    href: "/blog",
  },
  {
    image: "/images/categories/rau-cu-qua.png",
    title: "Vì sao bếp\u00A0ăn chuyên nghiệp không mua thực\u00A0phẩm trôi nổi, không hóa\u00A0đơn?",
    summary:
      "Mua hàng chợ không hóa đơn có vẻ rẻ hơn vài phần trăm, nhưng bếp\u00A0ăn doanh nghiệp, trường\u00A0học phải trả giá bằng rủi ro thuế, rủi ro an toàn thực\u00A0phẩm và những lần giải trình khó\u00A0khăn.",
    href: "/blog",
  },
  {
    image: "/images/industries/truong-hoc-vn.png",
    title: "Tiêu chí chọn nhà cung cấp thực\u00A0phẩm cho bếp\u00A0ăn trường\u00A0học",
    summary:
      "Bảy tiêu chí hội đồng nhà trường nên dùng khi chọn nhà cung cấp thực\u00A0phẩm cho bếp bán trú: từ hồ sơ pháp lý, nguồn hàng, giờ giao đến cách xử lý khi có sự\u00A0cố.",
    href: "/blog",
  },
  {
    image: "/images/tps1-kitchen.png",
    title: "Kiểm thực ba bước và lưu mẫu thức ăn: bếp\u00A0ăn tập thể cần làm gì từ khâu nhận\u00A0hàng",
    summary:
      "Tóm tắt Quyết định 1246/QĐ-BYT cho người phụ trách bếp: nhận hàng cần kiểm tra giấy tờ gì, ghi sổ ra sao, lưu mẫu bao nhiêu gam, giữ ở nhiệt độ nào và trong bao\u00A0lâu.",
    href: "/blog",
  },
];

const homeFaqs = [
  {
    question: "TPS1 cung cấp thực\u00A0phẩm cho những loại bếp\u00A0ăn nào?",
    answer:
      "TPS1 cung cấp thực\u00A0phẩm sỉ cho bếp\u00A0ăn công nghiệp tại nhà\u00A0máy và khu công nghiệp, bếp\u00A0ăn bán trú của trường\u00A0học, bếp\u00A0ăn bệnh\u00A0viện, bếp\u00A0ăn cơ quan, đơn vị suất ăn công nghiệp, cùng nhà\u00A0hàng và quán ăn. Mỗi bếp được tư vấn quy cách hàng và lịch giao\u00A0riêng.",
  },
  {
    question: "TPS1 giao thực\u00A0phẩm ở những khu vực nào?",
    answer:
      "TPS1 giao hàng theo tuyến cố định tại Đồng\u00A0Nai (Biên\u00A0Hòa, Trảng\u00A0Bom, Long\u00A0Thành, Nhơn\u00A0Trạch, các khu công nghiệp), Bình\u00A0Dương, TP.HCM và Bà\u00A0Rịa\u00A0–\u00A0Vũng\u00A0Tàu.",
  },
  {
    question: "Làm thế nào để nhận báo giá thực\u00A0phẩm sỉ?",
    answer:
      "Quý khách gửi danh sách hàng cần mua dưới dạng file Excel, PDF hoặc ảnh chụp qua trang báo giá hoặc hotline 089 890 2222. TPS1 xác nhận trong 2\u00A0giờ làm\u00A0việc và gửi báo giá trong vòng 24\u00A0giờ, tính theo sản lượng thực tế của\u00A0bếp.",
  },
  {
    question: "TPS1 có xuất hóa đơn VAT và cung cấp hồ sơ an toàn thực\u00A0phẩm không?",
    answer:
      "Có. TPS1 xuất hóa đơn VAT điện tử cho mọi đơn hàng, đạt chứng nhận ISO 22000 và HACCP, có bảo hiểm trách nhiệm sản phẩm 5 tỷ đồng, và cung cấp hồ sơ an toàn thực\u00A0phẩm, chứng từ nguồn gốc theo yêu cầu của nhà trường, bệnh\u00A0viện hoặc doanh\u00A0nghiệp.",
  },
  {
    question: "Thực\u00A0phẩm được giao vào thời gian nào và bảo quản ra sao?",
    answer:
      "TPS1 giao theo ca, theo ngày hoặc theo tuần tùy lịch nấu của bếp, có tuyến giao từ 05:00 sáng. Hàng tươi sống và đông\u00A0lạnh được vận chuyển bằng xe lạnh chuyên dụng để giữ độ tươi đến khi tới\u00A0bếp.",
  },
];

export function IndustriesShowcaseSection() {
  return (
    <section className="home-sectors tps1-cine-sectors" aria-labelledby="industries-heading">
      <div className="container-shell">
        <ScrollReveal className="b2b-section-head tps1-sectors-head">
          <div className="section-label">Ngành hàng phục vụ</div>
          <h2 id="industries-heading" className="section-title tps1-sectors-head__title">
            Thực{"\u00A0"}phẩm cho từng loại hình bếp{"\u00A0"}ăn
          </h2>
          <p className="section-desc">
            TPS1 lựa chọn quy cách hàng hóa, sắp xếp lịch giao và cung cấp hồ sơ theo nhu cầu của nhà{"\u00A0"}hàng, bếp công ty, trường{"\u00A0"}học và các đơn vị suất{"\u00A0"}ăn.
          </p>
        </ScrollReveal>

        <div className="tps1-cine-grid">
          {industryHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.href} delay={(idx % 3) * 55} className="tps1-cine-card-wrap">
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
                      <span>Xem trang</span>
                      <ArrowRight size={15} className="tps1-cine-card__arrow" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal className="home-sectors__footer">
          <Link href="/nganh-hang" className="btn-secondary">
            <span>Xem tất cả ngành hàng</span>
            <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function ColdChainDispatchSection() {
  return (
    <section className="tps1-areas-luxury" aria-labelledby="areas-heading">
      <div className="container-shell">
        <ScrollReveal className="b2b-section-head tps1-areas-luxury__head">
          <div className="section-label">Khu vực phục vụ</div>
          <h2 id="areas-heading" className="section-title tps1-areas-luxury__title">
            Cung cấp thực{"\u00A0"}phẩm tại{" "}
            <br className="tps1-br-md" />
            Đồng{"\u00A0"}Nai, Bình{"\u00A0"}Dương,{" "}
            <br className="tps1-br-md" />
            TP.HCM và Bà{"\u00A0"}Rịa{"\u00A0"}–{"\u00A0"}Vũng{"\u00A0"}Tàu
          </h2>
          <p className="section-desc tps1-areas-luxury__desc">
            Các tuyến giao cố định phủ Đồng{"\u00A0"}Nai (gồm cả khu vực Bình{"\u00A0"}Phước{"\u00A0"}cũ),{" "}
            <br className="tps1-br-lg" />
            TP.HCM, Bình{"\u00A0"}Dương và Bà{"\u00A0"}Rịa{"\u00A0"}-{"\u00A0"}Vũng{"\u00A0"}Tàu, đưa hàng đến đúng khung{"\u00A0"}giờ mỗi{"\u00A0"}gian{"\u00A0"}bếp{"\u00A0"}cần.
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
                <h3>Đồng{"\u00A0"}Nai</h3>
              </div>
              <p className="tps1-pearl-panel__sub">
                <MapPin size={14} aria-hidden="true" />
                <span>Gồm cả khu vực Bình{"\u00A0"}Phước{"\u00A0"}cũ</span>
              </p>
            </div>

            <div className="tps1-pearl-panel__dongnai-grid">
              <Link href={dongNaiBanner.href} className="tps1-route-banner">
                <span className="tps1-route-banner__dot" aria-hidden="true" />
                <span className="tps1-route-banner__label">{dongNaiBanner.label}</span>
                <ArrowRight size={17} className="tps1-route-banner__arrow" aria-hidden="true" />
              </Link>

              {dongNaiRoutes.map((area) => (
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
                <h3>TP.HCM và lân cận</h3>
              </div>
              <p className="tps1-pearl-panel__sub">
                <MapPin size={14} aria-hidden="true" />
                <span>Gồm Bình{"\u00A0"}Dương và Bà{"\u00A0"}Rịa{"\u00A0"}-{"\u00A0"}Vũng{"\u00A0"}Tàu cũ</span>
              </p>
            </div>

            <div className="tps1-pearl-panel__hcm-stack">
              {hcmRoutes.map((area) => (
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

export function ProcessCertificationsSection() {
  return (
    <section className="tps1-orbital-open" aria-labelledby="process-heading">
      <div className="container-shell">
        <ScrollReveal className="b2b-section-head b2b-process__head">
          <div className="section-label">Quy trình làm việc</div>
          <h2 id="process-heading" className="section-title">
            Từ danh sách cần mua đến đơn hàng được{"\u00A0"}giao
          </h2>
          <p className="section-desc">
            Gửi danh sách cần mua để nhận báo giá, sau đó thống nhất quy cách và lịch giao với{"\u00A0"}TPS1.
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
            {processSteps.map((step, idx) => (
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
                  <span className="tps1-wave-station__num" aria-label={`Bước ${step.num}`}>
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

export function KitchenKnowledgeSection() {
  const [featured, ...restArticles] = knowledgeArticles;
  const streamArticles = restArticles.slice(0, 4);

  return (
    <section className="tps1-editorial" aria-labelledby="knowledge-heading">
      <div className="container-shell">
        <ScrollReveal className="tps1-editorial__head">
          <div>
            <div className="section-label">Kiến thức cho bếp ăn</div>
            <h2 id="knowledge-heading" className="section-title">
              Bài viết mới cho người quản lý bếp{"\u00A0"}ăn
            </h2>
          </div>
          <Link href="/blog" className="btn-secondary tps1-editorial__all-btn">
            <span>Xem tất cả bài viết</span>
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
                  <span>Đọc bài viết</span>
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
                      <span>Đọc bài viết</span>
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

export function HomeFaqSection() {
  return (
    <section className="tps1-faq-split" aria-labelledby="faq-heading">
      <div className="container-shell">
        <div className="tps1-faq-split__grid">
          <ScrollReveal className="tps1-faq-split__sticky">
            <div className="section-label">Câu hỏi thường gặp</div>
            <h2 id="faq-heading" className="section-title tps1-faq-split__title">
              Những điều bếp{"\u00A0"}ăn thường hỏi trước khi chọn{"\u00A0"}TPS1
            </h2>
          </ScrollReveal>

          <div className="tps1-faq-split__list">
            {homeFaqs.map((item, idx) => (
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

export function FinalCtaBandSection() {
  return (
    <section className="tps1-horizon-cta" aria-label="Kêu gọi hành động cuối trang">
      <div className="container-shell">
        <ScrollReveal mode="final" className="tps1-horizon-stage">
          <div className="tps1-horizon-stage__aurora" aria-hidden="true" />
          <div className="tps1-horizon-stage__grid" aria-hidden="true" />
          <div className="tps1-horizon-stage__content">
            <div className="section-label b2b-cta-band__label">Sẵn sàng hợp tác</div>
            <h2 className="section-title-light b2b-cta-title">
              Gửi danh sách thực{"\u00A0"}phẩm cần mua cho{"\u00A0"}TPS1
            </h2>
            <p className="b2b-cta-band__desc">
              Gửi danh sách hàng cần mua, TPS1 xác nhận trong 2{"\u00A0"}giờ làm{"\u00A0"}việc và gửi báo giá trong vòng 24{"\u00A0"}giờ. Khách hàng có thể xem báo giá trước khi quyết định đặt{"\u00A0"}hàng.
            </p>
            <div className="b2b-cta-band__actions">
              <Link href="/bao-gia" className="btn-hero-primary">
                <span>Gửi yêu cầu báo giá</span>
                <ArrowRight size={18} />
              </Link>
              <Link href="/ho-so-nang-luc" className="btn-hero-secondary">
                <span>Xem hồ sơ năng lực &amp; chứng nhận ATTP</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
