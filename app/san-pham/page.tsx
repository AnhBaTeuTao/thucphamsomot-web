import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { makeMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { getSkuPage, type SkuPage } from "@/lib/sku-catalog";
import { TransitionReady } from "@/components/b2b/transition-ready";
import { CategoryLink } from "@/components/b2b/category-link";
import { ProductsGrid, SpReveal } from "./products-grid";

type PageProps = {
  searchParams: Promise<{ trang?: string; category?: string; q?: string }>;
};

const CATEGORY_GUIDE_ITEMS = [
  {
    href: "/danh-muc/rau-cu-qua",
    title: "Rau củ quả sỉ",
    desc: "Rau ăn lá, củ quả và trái cây được sơ chế, đóng gói theo định lượng từng bữa; giao sớm để bếp kịp sơ chế trước giờ nấu.",
    image: "/images/categories/rau-cu-qua.png",
    alt: "Rau củ quả tươi sạch giao sỉ mỗi sáng cho bếp ăn",
  },
  {
    href: "/danh-muc/thit-heo",
    title: "Thịt heo sỉ",
    desc: "Thịt heo pha lóc theo phần, cắt theo quy cách của bếp (thái lát, xay, chặt miếng), kèm chứng từ kiểm dịch theo lô.",
    image: "/images/tps1-meat-seafood.png",
    alt: "Thịt heo tươi pha lóc theo quy cách bếp ăn công nghiệp",
  },
  {
    href: "/danh-muc/thit-bo",
    title: "Thịt bò",
    desc: "Thịt bò các phần cho món xào, nấu, hầm; cân đúng định lượng suất ăn và giữ lạnh trong suốt quá trình giao.",
    image: "/images/categories/thit-ca.png",
    alt: "Thịt bò tươi cắt phần cho nhà hàng và bếp ăn tập thể",
  },
  {
    href: "/danh-muc/gia-cam",
    title: "Gia cầm và trứng",
    desc: "Gà, vịt nguyên con hoặc chặt phần, trứng gà, trứng vịt, trứng cút cho thực đơn hằng ngày của bếp ăn tập thể.",
    image: "/images/industries/bep-an-tap-the-vn.png",
    alt: "Sơ chế nguyên liệu gia cầm và trứng cho bếp ăn tập thể",
  },
  {
    href: "/danh-muc/hai-san",
    title: "Hải sản",
    desc: "Cá, tôm, mực tươi và đã sơ chế, chọn cỡ phù hợp với khẩu phần, giao bằng xe lạnh để giữ độ tươi.",
    image: "/images/categories/dong-lanh.png",
    alt: "Cá và tôm hải sản giữ lạnh giao sỉ cho bếp ăn",
  },
  {
    href: "/danh-muc/hang-dong-lanh",
    title: "Hàng đông lạnh",
    desc: "Thịt, cá, hải sản và thực phẩm chế biến đông lạnh, bảo quản ở nhiệt độ âm sâu từ kho đến bếp.",
    image: "/images/tps1-frozen.png",
    alt: "Kho bảo quản thực phẩm đông lạnh âm sâu của TPS1",
  },
  {
    href: "/danh-muc/do-kho",
    title: "Đồ khô, gạo",
    desc: "Gạo, đậu, miến, nấm khô và các mặt hàng khô cho kho bếp, giao theo tuần hoặc theo tháng.",
    image: "/images/tps1-warehouse-wide.jpg",
    alt: "Kho lưu trữ gạo và đồ khô quy mô lớn phục vụ bếp công nghiệp",
  },
  {
    href: "/danh-muc/gia-vi",
    title: "Gia vị",
    desc: "Dầu ăn, nước mắm, đường, muối, hạt nêm và gia vị nấu ăn đóng gói lớn, phù hợp bếp nấu số lượng nhiều.",
    image: "/images/categories/gia-vi.png",
    alt: "Gia vị nấu ăn đóng gói lớn cho bếp ăn công nghiệp",
  },
  {
    href: "/danh-muc/thuc-pham-chay",
    title: "Thực phẩm chay",
    desc: "Đậu hũ, nấm, chả chay và nguyên liệu cho ngày ăn chay của trường học, bệnh viện và nhà hàng chay.",
    image: "/images/categories/chay.png",
    alt: "Đậu hũ, nấm và rau củ cho thực đơn chay trường học và bệnh viện",
  },
  {
    href: "/danh-muc/thiet-bi-bep",
    title: "Dụng cụ, thiết bị bếp",
    desc: "Dụng cụ và vật tư cho bếp ăn công nghiệp, đặt chung trong một đơn với nguyên liệu.",
    image: "/images/tps1_tools_placeholder.png",
    alt: "Dụng cụ và thiết bị inox cho bếp ăn công nghiệp",
  },
] as const;

const ORDER_PROCESS_STEPS = [
  {
    num: "01",
    title: "Gửi danh sách cần mua",
    desc: "Chọn nhóm hàng hoặc gửi thực đơn, sản lượng dự kiến theo tuần hoặc theo tháng.",
  },
  {
    num: "02",
    title: "Nhận báo giá trong 24 giờ",
    desc: "Bộ phận kinh doanh lập bảng giá sỉ chi tiết theo sản lượng thực tế của bếp.",
  },
  {
    num: "03",
    title: "Xác nhận quy cách và lịch giao",
    desc: "Chốt quy cách sơ chế, đóng gói và khung giờ giao phù hợp với ca nấu.",
  },
  {
    num: "04",
    title: "Giao hàng kèm hóa đơn VAT",
    desc: "Xe lạnh giao tận bếp đúng hẹn, bàn giao đầy đủ chứng từ kiểm dịch và hóa đơn VAT.",
  },
] as const;

function parsePage(value: string | undefined) {
  const page = parseInt(value ?? "1", 10);
  return Number.isFinite(page) && page > 1 ? page : 1;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = parsePage(params.trang);
  const hasFilter = Boolean(params.category?.trim() || params.q?.trim());
  const baseTitle = "Danh mục thực phẩm sỉ cho bếp ăn công nghiệp, trường học, bệnh viện";

  return makeMetadata({
    title: page > 1 ? `${baseTitle} – trang ${page}` : baseTitle,
    description:
      "Hơn 5.000 mặt hàng thực phẩm sỉ: rau củ quả, thịt heo, thịt bò, gia cầm, hải sản, hàng đông lạnh, đồ khô, gia vị cho bếp ăn công nghiệp, trường học, bệnh viện và nhà hàng tại Đồng Nai, Bình Dương, TP.HCM.",
    path: page > 1 ? `/san-pham?trang=${page}` : "/san-pham",
    robots: hasFilter ? { index: false, follow: true } : undefined,
  });
}

export default async function SanPhamPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parsePage(params.trang);
  let initialData: SkuPage | undefined;
  try {
    initialData = await getSkuPage({ page, revalidate: 3600 });
  } catch (error) {
    console.error("[san-pham] server catalog fetch failed", error);
  }
  if (initialData && page > initialData.totalPages) notFound();

  const phoneHref = `tel:${siteConfig.phone.replace(/\s+/g, "")}`;

  return (
    <main className="sp-catalog-page">
      <TransitionReady expectedPath="/san-pham" />
      {/* VÙNG 1: HERO — NỀN XANH ĐẬM #06392A, 2 CỘT 50/50 CÂN BẰNG */}
      <section className="sp-hero-band" aria-labelledby="sp-hero-heading">
        <div className="sp-hero-bg" aria-hidden="true">
          <Image
            src="/images/tps1-warehouse-wide.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="sp-hero-bg__img"
          />
          <div className="sp-hero-bg__overlay" />
        </div>

        <div className="sp-container sp-hero-container">
          <div className="sp-hero-grid">
            <div className="sp-hero-copy">
              <nav className="sp-breadcrumb" aria-label="Đường dẫn trang">
                <Link href="/" className="sp-breadcrumb__link">
                  Trang chủ
                </Link>
                <span className="sp-breadcrumb__sep" aria-hidden="true">
                  /
                </span>
                <span className="sp-breadcrumb__current" aria-current="page">
                  Danh mục hàng hóa
                </span>
              </nav>

              <p className="sp-eyebrow sp-eyebrow--on-dark">CATALOG TPS1</p>

              <h1 id="sp-hero-heading" className="sp-hero-title">
                Danh mục <span className="sp-phrase">thực phẩm</span>{" "}
                <span className="sp-hero-title__accent">
                  cho <span className="sp-phrase">nhà hàng</span>{" "}
                  <span className="sp-phrase">và bếp ăn</span>
                </span>
              </h1>

              <p className="sp-hero-desc">
                TPS1 cung cấp rau củ, thịt cá, hàng đông lạnh, đồ khô và gia vị kèm chứng từ đầy đủ. Mỗi bếp chọn quy cách đóng gói và lịch giao phù hợp, giá tính theo sản lượng thực tế.
              </p>

              <div className="sp-hero-actions">
                <Link href="/bao-gia" className="sp-btn sp-btn--orange">
                  Gửi danh sách cần mua
                </Link>
                <a href="#sp-guide-heading" className="sp-btn sp-btn--ghost-dark">
                  Xem các nhóm hàng
                </a>
              </div>

              <dl className="sp-hero-metrics" aria-label="Thông số cung ứng thực phẩm sỉ">
                <div className="sp-hero-metrics__item">
                  <dt className="sp-sr-only">Quy mô danh mục</dt>
                  <dd>
                    <strong className="sp-hero-metrics__num">5.000+</strong> mặt hàng
                  </dd>
                </div>
                <div className="sp-hero-metrics__item">
                  <dt className="sp-sr-only">Thời gian báo giá</dt>
                  <dd>Báo giá trong 24 giờ</dd>
                </div>
                <div className="sp-hero-metrics__item">
                  <dt className="sp-sr-only">Hóa đơn chứng từ</dt>
                  <dd>Có hóa đơn VAT</dd>
                </div>
              </dl>
            </div>

            <div className="sp-hero-media-col">
              <figure className="sp-hero-media">
                <Image
                  src="/images/tps1-meat-seafood.png"
                  alt="Khu bảo quản thịt cá và thực phẩm tươi sống trong kho lạnh 0 đến 4 độ C của TPS1"
                  fill
                  priority
                  sizes="(max-width: 960px) 100vw, 50vw"
                  className="sp-hero-media__img"
                />
                <figcaption className="sp-hero-media__caption-wrap">
                  <span className="sp-hero-media__caption">Kho lạnh 0-4°C</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* VÙNG 2 (TRẮNG STICKY) & VÙNG 3 (XÁM XANH #F2F5F1 LƯỚI SẢN PHẨM) */}
      <Suspense fallback={null}>
        <ProductsGrid initialData={initialData} basePath="/san-pham" />
      </Suspense>

      {/* VÙNG 4: 10 NHÓM THỰC PHẨM SỈ — NỀN TRẮNG, LƯỚI BENTO CÓ ẢNH THẬT */}
      <section className="sp-guide-band" aria-labelledby="sp-guide-heading">
        <div className="sp-container">
          <SpReveal className="sp-guide-header">
            <p className="sp-eyebrow">NHÓM HÀNG CUNG ỨNG</p>
            <h2 id="sp-guide-heading" className="sp-guide-title">
              Các nhóm thực phẩm sỉ TPS1 cung cấp cho bếp ăn
            </h2>
            <p className="sp-guide-intro">
              Danh mục của TPS1 gồm hơn 5.000 mặt hàng, chia theo nhóm để bếp ăn công nghiệp, trường học, bệnh viện và nhà hàng dễ lên danh sách mua. Hàng được đóng gói theo quy cách bếp yêu cầu, giao theo ca, theo ngày hoặc theo tuần, và có hóa đơn VAT cho từng đơn. Mỗi mặt hàng được báo giá riêng theo sản lượng; quý khách gửi danh sách cần mua để nhận báo giá trong 24 giờ.
            </p>
          </SpReveal>

          <div className="sp-bento-grid">
            {CATEGORY_GUIDE_ITEMS.map((item, idx) => {
              const isFeature = idx === 0;
              const isWideLast = idx === CATEGORY_GUIDE_ITEMS.length - 1;
              return (
                <SpReveal
                  key={item.href}
                  delay={Math.min(idx, 5) * 70}
                  className={`sp-bento-slot${isFeature ? " sp-bento-slot--feature" : ""}${isWideLast ? " sp-bento-slot--wide" : ""}`}
                >
                  <CategoryLink href={item.href} className="sp-bento-card">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      loading="lazy"
                      sizes={
                        isFeature
                          ? "(max-width: 560px) 100vw, (max-width: 900px) 50vw, 66vw"
                          : isWideLast
                            ? "(max-width: 560px) 100vw, (max-width: 900px) 50vw, 100vw"
                            : "(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
                      }
                      className="sp-bento-card__img"
                    />
                    <div className="sp-bento-card__overlay" aria-hidden="true" />
                    <div className="sp-bento-card__content">
                      <span className="sp-bento-card__num" aria-hidden="true">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="sp-bento-card__bottom">
                        <h3 className="sp-bento-card__title">{item.title}</h3>
                        <p className="sp-bento-card__desc">{item.desc}</p>
                        <span className="sp-bento-card__cta">
                          Xem nhóm hàng <span className="sp-bento-card__arrow" aria-hidden="true">→</span>
                        </span>
                      </div>
                    </div>
                  </CategoryLink>
                </SpReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* VÙNG 5: QUY TRÌNH ĐẶT HÀNG — NỀN XÁM XANH #F2F5F1, 4 BƯỚC NGANG */}
      <section className="sp-process-band" aria-labelledby="sp-process-heading">
        <div className="sp-container">
          <SpReveal className="sp-process-header">
            <p className="sp-eyebrow">QUY TRÌNH ĐẶT HÀNG B2B</p>
            <h2 id="sp-process-heading" className="sp-process-title">
              Bốn bước lên đơn thực phẩm sỉ <span className="sp-text-orange">rõ ràng và đúng hẹn</span>
            </h2>
          </SpReveal>

          <ol className="sp-process-grid">
            {ORDER_PROCESS_STEPS.map((step, idx) => (
              <li key={step.num} className="sp-process-li">
                <SpReveal delay={idx * 70} className="sp-process-step">
                  <div className="sp-process-step__top">
                    <span className="sp-process-step__num">{step.num}</span>
                    <span className="sp-process-step__line" aria-hidden="true" />
                  </div>
                  <h3 className="sp-process-step__title">{step.title}</h3>
                  <p className="sp-process-step__desc">{step.desc}</p>
                </SpReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* VÙNG 6: CTA CUỐI — NỀN XANH ĐẬM #06392A, 2 CỘT CÂN BẰNG */}
      <section className="sp-cta-band" aria-labelledby="sp-cta-heading">
        <div className="sp-container">
          <SpReveal className="sp-cta-inner">
            <div className="sp-cta-copy">
              <p className="sp-eyebrow sp-eyebrow--on-dark">TƯ VẤN NGUỒN HÀNG B2B</p>
              <h2 id="sp-cta-heading" className="sp-cta-title">
                Cần danh mục và quy cách riêng cho bếp?
              </h2>
              <p className="sp-cta-desc">
                Gửi danh sách thực phẩm sỉ, sản lượng dự kiến và khu vực giao để nhận báo giá trong 24 giờ.
              </p>
            </div>
            <div className="sp-cta-actions">
              <a href={phoneHref} className="sp-btn sp-btn--ghost-dark">
                Gọi tư vấn
              </a>
              <Link href="/bao-gia" className="sp-btn sp-btn--orange">
                Gửi danh sách cần mua
              </Link>
            </div>
          </SpReveal>
        </div>
      </section>
    </main>
  );
}
