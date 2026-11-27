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
import { ProductsGrid, SpReveal } from "@/app/san-pham/products-grid";

type PageProps = {
  searchParams: Promise<{ trang?: string; category?: string; q?: string }>;
};

const CATEGORY_GUIDE_ITEMS_EN = [
  {
    slug: "rau-cu-qua",
    href: "/en/products?category=rau-cu-qua#danh-muc",
    title: "Wholesale vegetables & fruits",
    desc: "Leafy greens, root vegetables, and fresh fruits trimmed and packed to meal-portion specs; delivered early in the morning ahead of kitchen prep.",
    image: "/images/categories/rau-cu-qua.png",
    alt: "Fresh wholesale vegetables and fruits delivered every morning to commercial kitchens",
  },
  {
    slug: "thit-heo",
    href: "/en/products?category=thit-heo#danh-muc",
    title: "Wholesale fresh pork",
    desc: "Pork cuts portioned and prepped to kitchen requirements (sliced, minced, or cubed), accompanied by batch veterinary inspection certificates.",
    image: "/images/tps1-meat-seafood.png",
    alt: "Fresh pork portioned to industrial kitchen specifications",
  },
  {
    slug: "thit-bo",
    href: "/en/products?category=thit-bo#danh-muc",
    title: "Fresh & chilled beef",
    desc: "Beef cuts for stir-frying, braising, and stewing; weighed to exact meal quotas and kept chilled throughout transit.",
    image: "/images/categories/thit-ca.png",
    alt: "Portioned beef cuts for restaurants and collective canteens",
  },
  {
    slug: "gia-cam",
    href: "/en/products?category=gia-cam#danh-muc",
    title: "Poultry and eggs",
    desc: "Whole or portioned chicken and duck, plus chicken, duck, and quail eggs for daily collective canteen menus.",
    image: "/images/industries/bep-an-tap-the-vn.png",
    alt: "Poultry and egg preparation for collective canteens",
  },
  {
    slug: "hai-san",
    href: "/en/products?category=hai-san#danh-muc",
    title: "Fish and seafood",
    desc: "Fresh and pre-cleaned fish, shrimp, and squid graded to portion size and delivered by refrigerated truck to lock in freshness.",
    image: "/images/categories/dong-lanh.png",
    alt: "Chilled wholesale fish and shrimp delivered to commercial kitchens",
  },
  {
    slug: "hang-dong-lanh",
    href: "/en/products?category=hang-dong-lanh#danh-muc",
    title: "Frozen foods",
    desc: "Frozen meat, fish, seafood, and processed items preserved at deep-freeze temperatures from our cold warehouse to your kitchen.",
    image: "/images/tps1-frozen.png",
    alt: "Deep-freeze cold storage warehouse at TPS1",
  },
  {
    slug: "do-kho",
    href: "/en/products?category=do-kho#danh-muc",
    title: "Dry goods and rice",
    desc: "Rice, beans, glass noodles, dried mushrooms, and pantry staples for kitchen storerooms, delivered weekly or monthly.",
    image: "/images/tps1-warehouse-wide.jpg",
    alt: "Large-scale rice and dry goods warehouse serving industrial kitchens",
  },
  {
    slug: "gia-vi",
    href: "/en/products?category=gia-vi#danh-muc",
    title: "Seasonings and condiments",
    desc: "Cooking oil, fish sauce, sugar, salt, seasoning powder, and culinary spices in bulk catering packs suited for high-volume cooking.",
    image: "/images/categories/gia-vi.png",
    alt: "Bulk culinary seasonings for industrial kitchens",
  },
  {
    slug: "thuc-pham-chay",
    href: "/en/products?category=thuc-pham-chay#danh-muc",
    title: "Vegetarian foods",
    desc: "Tofu, mushrooms, plant-based rolls, and vegetarian ingredients for schools, hospitals, and vegetarian restaurants.",
    image: "/images/categories/chay.png",
    alt: "Tofu, mushrooms, and produce for school and hospital vegetarian menus",
  },
  {
    slug: "thiet-bi-bep",
    href: "/en/products?category=thiet-bi-bep#danh-muc",
    title: "Kitchen tools & supplies",
    desc: "Commercial kitchen utensils, containers, and consumables conveniently ordered together in a single shipment with your food ingredients.",
    image: "/images/tps1_tools_placeholder.png",
    alt: "Stainless steel utensils and equipment for industrial kitchens",
  },
] as const;

const ORDER_PROCESS_STEPS_EN = [
  {
    num: "01",
    title: "Send your buying list",
    desc: "Select product categories or send your weekly/monthly menu and estimated purchase volumes.",
  },
  {
    num: "02",
    title: "Receive quote within 24 hours",
    desc: "Our sales team prepares a detailed wholesale price table scaled to your kitchen's actual volume.",
  },
  {
    num: "03",
    title: "Confirm specs & delivery schedule",
    desc: "Finalize prep cuts, packaging formats, and delivery time windows matched to your cooking shifts.",
  },
  {
    num: "04",
    title: "Cold-chain delivery with VAT invoice",
    desc: "Refrigerated trucks deliver to your kitchen on time with full quarantine certificates and electronic VAT invoices.",
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
  const baseTitle = "Wholesale Food Catalog for Industrial Canteens, Schools & Hospitals";

  return makeMetadata({
    title: page > 1 ? `${baseTitle} – Page ${page}` : baseTitle,
    description:
      "Over 5,000 wholesale food items: fresh produce, pork, beef, poultry, seafood, frozen goods, dry goods, and seasonings for industrial canteens, schools, hospitals, and restaurants in Dong Nai, Binh Duong, and Ho Chi Minh City.",
    path: page > 1 ? `/en/products?trang=${page}` : "/en/products",
    robots: hasFilter ? { index: false, follow: true } : undefined,
  });
}

export default async function EnglishProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parsePage(params.trang);
  let initialData: SkuPage | undefined;
  try {
    initialData = await getSkuPage({ page, revalidate: 3600 });
  } catch (error) {
    console.error("[en/products] server catalog fetch failed", error);
  }
  if (initialData && page > initialData.totalPages) notFound();

  const phoneHref = `tel:${siteConfig.phone.replace(/\s+/g, "")}`;

  return (
    <main className="sp-catalog-page">
      <TransitionReady expectedPath="/en/products" />
      {/* ZONE 1: HERO — SYNCHRONIZED 100% WITH /SAN-PHAM */}
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
              <nav className="sp-breadcrumb" aria-label="Breadcrumb">
                <Link href="/en" className="sp-breadcrumb__link">
                  Home
                </Link>
                <span className="sp-breadcrumb__sep" aria-hidden="true">
                  /
                </span>
                <span className="sp-breadcrumb__current" aria-current="page">
                  Product catalog
                </span>
              </nav>

              <p className="sp-eyebrow sp-eyebrow--on-dark">TPS1 CATALOG</p>

              <h1 id="sp-hero-heading" className="sp-hero-title">
                Wholesale <span className="sp-phrase">food catalog</span>{" "}
                <span className="sp-hero-title__accent">
                  for <span className="sp-phrase">restaurants</span>{" "}
                  <span className="sp-phrase">&amp; canteens</span>
                </span>
              </h1>

              <p className="sp-hero-desc">
                TPS1 supplies fresh produce, meat, seafood, frozen goods, dry goods, and seasonings with complete origin documentation. Every kitchen chooses its own packaging specs and delivery schedule, with pricing calculated by actual order volume.
              </p>

              <div className="sp-hero-actions">
                <Link href="/en/bao-gia" className="sp-btn sp-btn--orange">
                  Send your buying list
                </Link>
                <a href="#sp-guide-heading" className="sp-btn sp-btn--ghost-dark">
                  Browse product groups
                </a>
              </div>

              <dl className="sp-hero-metrics" aria-label="Wholesale supply highlights">
                <div className="sp-hero-metrics__item">
                  <dt className="sp-sr-only">Catalog size</dt>
                  <dd>
                    <strong className="sp-hero-metrics__num">5,000+</strong> SKUs
                  </dd>
                </div>
                <div className="sp-hero-metrics__item">
                  <dt className="sp-sr-only">Quotation time</dt>
                  <dd>Quote within 24 hours</dd>
                </div>
                <div className="sp-hero-metrics__item">
                  <dt className="sp-sr-only">Invoicing</dt>
                  <dd>Full VAT invoices</dd>
                </div>
              </dl>
            </div>

            <div className="sp-hero-media-col">
              <figure className="sp-hero-media">
                <Image
                  src="/images/tps1-meat-seafood.png"
                  alt="Chilled meat and fresh seafood storage at 0 to 4 degrees Celsius at TPS1"
                  fill
                  priority
                  sizes="(max-width: 960px) 100vw, 50vw"
                  className="sp-hero-media__img"
                />
                <figcaption className="sp-hero-media__caption-wrap">
                  <span className="sp-hero-media__caption">Cold room 0–4°C</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ZONES 2 & 3: STICKY FILTER BAR & PRODUCT GRID */}
      <Suspense fallback={null}>
        <ProductsGrid locale="en" initialData={initialData} basePath="/en/products" />
      </Suspense>

      {/* ZONE 4: 10 WHOLESALE FOOD GROUPS — BENTO GRID WITH REAL PHOTOS */}
      <section className="sp-guide-band" aria-labelledby="sp-guide-heading">
        <div className="sp-container">
          <SpReveal className="sp-guide-header">
            <p className="sp-eyebrow">SOURCING CATEGORIES</p>
            <h2 id="sp-guide-heading" className="sp-guide-title">
              Wholesale food categories TPS1 supplies to commercial kitchens
            </h2>
            <p className="sp-guide-intro">
              TPS1&apos;s catalog covers over 5,000 items organized by category so industrial canteens, schools, hospitals, and restaurants can easily build their purchasing lists. Products are packed to your kitchen&apos;s specifications, delivered by shift, day, or week, and backed by electronic VAT invoices for every order. Send your buying list to receive a custom wholesale quotation within 24 hours.
            </p>
          </SpReveal>

          <div className="sp-bento-grid">
            {CATEGORY_GUIDE_ITEMS_EN.map((item, idx) => {
              const isFeature = idx === 0;
              const isWideLast = idx === CATEGORY_GUIDE_ITEMS_EN.length - 1;
              return (
                <SpReveal
                  key={item.slug}
                  delay={Math.min(idx, 5) * 70}
                  className={`sp-bento-slot${isFeature ? " sp-bento-slot--feature" : ""}${isWideLast ? " sp-bento-slot--wide" : ""}`}
                >
                  <CategoryLink
                    href={item.href}
                    categorySlug={item.slug}
                    isEnglish
                    dispatchSelectEvent
                    className="sp-bento-card"
                  >
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
                          View category <span className="sp-bento-card__arrow" aria-hidden="true">→</span>
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

      {/* ZONE 5: 4-STEP B2B ORDERING PROCESS */}
      <section className="sp-process-band" aria-labelledby="sp-process-heading">
        <div className="sp-container">
          <SpReveal className="sp-process-header">
            <p className="sp-eyebrow">B2B ORDERING WORKFLOW</p>
            <h2 id="sp-process-heading" className="sp-process-title">
              Four clear steps to <span className="sp-text-orange">transparent, on-schedule wholesale supply</span>
            </h2>
          </SpReveal>

          <ol className="sp-process-grid">
            {ORDER_PROCESS_STEPS_EN.map((step, idx) => (
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

      {/* ZONE 6: BOTTOM CTA BAND */}
      <section className="sp-cta-band" aria-labelledby="sp-cta-heading">
        <div className="sp-container">
          <SpReveal className="sp-cta-inner">
            <div className="sp-cta-copy">
              <p className="sp-eyebrow sp-eyebrow--on-dark">B2B SOURCING CONSULTATION</p>
              <h2 id="sp-cta-heading" className="sp-cta-title">
                Need a custom catalog and kitchen specifications?
              </h2>
              <p className="sp-cta-desc">
                Send your wholesale food list, estimated volume, and delivery area to receive a tailored quotation within 24 hours.
              </p>
            </div>
            <div className="sp-cta-actions">
              <a href={phoneHref} className="sp-btn sp-btn--ghost-dark">
                Call consultation
              </a>
              <Link href="/en/bao-gia" className="sp-btn sp-btn--orange">
                Send your buying list
              </Link>
            </div>
          </SpReveal>
        </div>
      </section>
    </main>
  );
}
