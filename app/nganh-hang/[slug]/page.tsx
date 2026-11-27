import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  ChevronDown,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { findBySlug, industries } from "@/lib/content";
import { makeMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { siteConfig } from "@/lib/site";
import { FadeInUp, StaggerContainer, StaggerItem, ScaleIn } from "@/components/ui/motion-wrapper";

const industrySeoTitles: Record<string, string> = {
  "bep-an-tap-the": "Thực phẩm cho bếp ăn tập thể tại Đồng Nai",
  "suat-an-cong-nghiep": "Nguyên liệu cho đơn vị suất ăn công nghiệp",
  "truong-hoc": "Thực phẩm cho bếp ăn trường học, bán trú",
  "benh-vien": "Thực phẩm cho bếp ăn bệnh viện",
  "nha-hang-khach-san": "Thực phẩm cho nhà hàng, khách sạn",
};

// Synchronized real kitchen photo for /nganh-hang/quan-an (1024x1024 square frame).
const industryHeroOverrides: Record<string, string> = {
  "quan-an": "/images/tps1-kitchen.png",
};

const industrySegmentLinks: Record<string, { href: string; label: string }> = {
  "truong-hoc": {
    href: "/cung-cap-thuc-pham-cho-truong-hoc",
    label: "Xem quy trình cung cấp thực phẩm cho trường học tại Đồng Nai",
  },
  "bep-an-tap-the": {
    href: "/cung-cap-thuc-pham-cho-nha-may",
    label: "Xem quy trình cung cấp thực phẩm cho nhà máy, xí nghiệp",
  },
  "suat-an-cong-nghiep": {
    href: "/cung-cap-thuc-pham-cho-nha-may",
    label: "Xem quy trình cung cấp thực phẩm cho nhà máy, xí nghiệp",
  },
  "benh-vien": {
    href: "/cung-cap-thuc-pham-cho-co-quan",
    label: "Xem quy trình cung cấp thực phẩm cho bếp ăn cơ quan",
  },
};

export function generateStaticParams() {
  return industries.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = findBySlug(industries, slug);
  if (!item) return makeMetadata({ title: "Ngành hàng", path: `/nganh-hang/${slug}` });
  return makeMetadata({
    title: item.metaTitle ?? industrySeoTitles[item.slug] ?? item.title,
    description: item.metaDescription ?? item.description,
    path: `/nganh-hang/${item.slug}`,
  });
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = findBySlug(industries, slug);
  if (!item) return notFound();

  const description = item.description ?? item.title;
  const segmentLink = industrySegmentLinks[slug];
  const heroImage = industryHeroOverrides[slug] ?? `/images/industries/${slug}-vn.png`;
  const phoneHref = `tel:${siteConfig.phone.replace(/\s/g, "")}`;

  return (
    <main className="industry-detail-page pb-20">
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", item: "/" },
          { name: "Ngành hàng", item: "/nganh-hang" },
          { name: item.title, item: `/nganh-hang/${item.slug}` },
        ]}
      />

      {/* 1. Split Hero (2 Columns — Full 1024x1024 frame without cropping heads) */}
      <section className="ind-hero">
        <div className="container-shell">
          <div className="ind-hero__grid">
            <FadeInUp className="ind-hero__copy">
              <div className="ind-hero__badge">
                <ShieldCheck size={16} aria-hidden="true" />
                <span>Ngành Hàng</span>
              </div>
              <h1 className="ind-hero__title">{item.title}</h1>
              <p className="ind-hero__desc">{description}</p>
              <div className="ind-hero__actions">
                <Link href="/bao-gia" className="ind-hero__btn-primary">
                  <span>Gửi yêu cầu báo giá</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <a href={phoneHref} className="ind-hero__btn-secondary">
                  <Phone size={17} aria-hidden="true" />
                  <span>Hotline {siteConfig.phone}</span>
                </a>
              </div>
            </FadeInUp>

            <div className="ind-hero__media">
              <div className="ind-hero__frame">
                <Image
                  src={heroImage}
                  alt={item.title}
                  fill
                  priority
                  className="ind-hero__img object-cover"
                  sizes="(max-width: 960px) 100vw, 45vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Signals Card (Cleanly separated below Hero, semantic accents) */}
      <section className="container-shell ind-trust-section">
        <div className="ind-trust-bar">
          <div className="ind-trust-item ind-trust-item--emerald">
            <div className="ind-trust-item__icon" aria-hidden="true">
              <Clock size={22} />
            </div>
            <div>
              <span className="ind-trust-item__value">99,8%</span>
              <span className="ind-trust-item__label">Tỷ lệ đơn hàng giao đúng hẹn</span>
            </div>
          </div>

          <div className="ind-trust-divider" aria-hidden="true" />

          <div className="ind-trust-item ind-trust-item--blue">
            <div className="ind-trust-item__icon" aria-hidden="true">
              <Boxes size={22} />
            </div>
            <div>
              <span className="ind-trust-item__value">5.000+</span>
              <span className="ind-trust-item__label">Mã sản phẩm trong danh mục</span>
            </div>
          </div>

          <div className="ind-trust-divider" aria-hidden="true" />

          <div className="ind-trust-item ind-trust-item--amber">
            <div className="ind-trust-item__icon" aria-hidden="true">
              <MapPin size={22} />
            </div>
            <div>
              <strong className="ind-trust-item__title">Khu vực phục vụ</strong>
              <span className="ind-trust-item__sub">Đồng Nai, TP.HCM &amp; lân cận</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 & 4. Content Sections (3D Tactile Bento Cards with per-card semantic palette) */}
      <section className="container-shell mb-16">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {item.sections?.map((section, idx) => {
            const isFullWidth = idx === 0 && item.sections!.length > 1;
            const toneIdx = idx % 3;
            return (
              <StaggerItem key={idx} className={isFullWidth ? "md:col-span-2" : ""}>
                <article className={`ind-bento-card ind-bento-card--tone-${toneIdx}`}>
                  <div className="ind-bento-card__head">
                    <div className="ind-bento-card__num">0{idx + 1}</div>
                    <h2 className="ind-bento-card__title">{section.heading}</h2>
                  </div>
                  <div
                    className={`ind-bento-card__body${
                      isFullWidth ? " md:text-lg max-w-4xl mb-7" : " mb-6"
                    }`}
                  >
                    {section.body}
                  </div>
                  {section.items && section.items.length > 0 && (
                    <ul className={`grid gap-3.5 ${isFullWidth ? "md:grid-cols-2" : "grid-cols-1"}`}>
                      {section.items.map((listItem, i) => (
                        <li key={i} className="ind-bento-card__check">
                          <CheckCircle2 className="ind-bento-card__check-icon shrink-0" size={20} />
                          <span>{listItem}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {segmentLink && (
        <section className="container-shell mb-16">
          <Link href={segmentLink.href} className="ind-segment-link">
            <span>{segmentLink.label}</span>
            <ArrowRight size={20} className="ind-segment-link__arrow" aria-hidden="true" />
          </Link>
        </section>
      )}

      {/* 5. FAQs */}
      {item.faqs && item.faqs.length > 0 && (
        <section className="container-shell mb-16">
          <FadeInUp className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="section-title text-center" style={{ margin: "0 auto 14px" }}>
                Câu hỏi thường gặp
              </h2>
              <p className="text-[#2c463a] font-medium">
                Những điều quý khách thường hỏi trước khi đặt chuyến hàng đầu tiên.
              </p>
            </div>
            <div className="space-y-4">
              {item.faqs.map((faq, i) => (
                <details key={i} className="ind-faq-card group">
                  <summary className="ind-faq-card__summary">
                    <h3 className="ind-faq-card__q">{faq.question}</h3>
                    <span className="ind-faq-card__chevron" aria-hidden="true">
                      <ChevronDown className="size-5 transition-transform duration-200 group-open:-rotate-180" />
                    </span>
                  </summary>
                  <p className="ind-faq-card__a">{faq.answer}</p>
                </details>
              ))}
            </div>
          </FadeInUp>
        </section>
      )}

      {/* CTA Box */}
      <section className="container-shell">
        <ScaleIn className="bg-emerald-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="section-title-light text-center" style={{ margin: "0 auto 20px" }}>
              Gửi trọn an tâm trong từng bữa ăn
            </h2>
            <p className="text-emerald-100 text-lg mb-8">
              Gửi danh mục hàng cần mua, TPS1 gửi lại bảng giá chi tiết trong vòng 24 giờ, kèm tư vấn định lượng để chi phí mỗi bữa luôn hợp lý.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/bao-gia" className="btn-primary !px-8 !py-4 shadow-lg shadow-emerald-950/50">
                Gửi yêu cầu báo giá
              </Link>
              <a href={phoneHref} className="btn-secondary !bg-white/10 !border-white/20 !text-white hover:!bg-white/20 !px-8 !py-4">
                Gọi {siteConfig.phone}
              </a>
            </div>
          </div>
        </ScaleIn>
      </section>
    </main>
  );
}
