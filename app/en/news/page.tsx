import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Sparkles } from "lucide-react";
import { makeMetadata } from "@/lib/seo";
import { BlogExploreGrid, type BlogExploreItem } from "@/components/b2b/blog-explore-grid";

export const metadata = makeMetadata({
  title: "B2B Kitchen Operations & Procurement Blog | Thuc Pham So Mot",
  description:
    "Practical guides for canteen managers, factory procurement teams, and school administrators: ingredient portioning, food safety compliance, meal cost control, and supplier evaluation.",
  path: "/en/news",
});

type EnglishArticle = {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  readingTime: string;
  publishedLabel: string;
};

const ENGLISH_BLOG_POSTS: EnglishArticle[] = [
  {
    slug: "hospital-kitchen-food-supplier",
    href: "/en/bao-gia",
    title: "Choosing a food supplier for hospital kitchens: how it differs from regular canteens",
    excerpt:
      "Hospital kitchens prepare meals for patients across strict therapeutic diets, operate 365 days a year including public holidays, and undergo rigorous clinical audits. Here are the key benchmarks hospital nutrition and procurement departments should evaluate.",
    category: "Hospital & Healthcare",
    coverImage: "/images/industries/benh-vien-vn.png",
    readingTime: "6 min read",
    publishedLabel: "Oct 20, 2026",
  },
  {
    slug: "collective-canteen-food-traceability",
    href: "/en/bao-gia",
    title: "Food traceability for collective canteens: how to set it up properly",
    excerpt:
      "During an inspection or audit, a canteen must immediately verify the farm and slaughterhouse origin of that day's meat and produce batches. Learn how to organize batch records to trace origins in minutes instead of days.",
    category: "Food Safety & QA",
    coverImage: "/images/tps1-quality.jpg",
    readingTime: "5 min read",
    publishedLabel: "Oct 18, 2026",
  },
  {
    slug: "year-end-and-tet-kitchen-checklist",
    href: "/en/bao-gia",
    title: "Year-end and Tet holiday kitchen preparation checklist for factories and schools",
    excerpt:
      "From year-end appreciation banquets and final factory shifts to the first week back after Tet: a complete checklist covering ingredient reservations, cold-chain schedules, storage, and kitchen staffing.",
    category: "Kitchen Operations",
    coverImage: "/images/industries/bep-an-tap-the-vn.png",
    readingTime: "7 min read",
    publishedLabel: "Oct 15, 2026",
  },
  {
    slug: "why-kitchens-avoid-unverified-market-food",
    href: "/en/bao-gia",
    title: "Why professional kitchens avoid unverified market food without VAT invoices",
    excerpt:
      "Buying unverified market goods without invoices may look a few percent cheaper upfront, but corporate and school kitchens pay a heavy price in tax disallowed expenses, food-safety hazards, and audit risks.",
    category: "Cost & Compliance",
    coverImage: "/images/categories/rau-cu-qua.png",
    readingTime: "5 min read",
    publishedLabel: "Oct 12, 2026",
  },
  {
    slug: "school-boarding-kitchen-supplier-criteria",
    href: "/en/bao-gia",
    title: "7 criteria for selecting a food supplier for school boarding kitchens",
    excerpt:
      "Seven essential criteria school boards and parent committees should evaluate when choosing a boarding-kitchen supplier: legal certificates, farm origins, deboned fillets, early-morning delivery windows, and incident response.",
    category: "School Canteens",
    coverImage: "/images/industries/truong-hoc-vn.png",
    readingTime: "6 min read",
    publishedLabel: "Oct 09, 2026",
  },
  {
    slug: "three-step-food-inspection-and-sample-retention",
    href: "/en/bao-gia",
    title: "Three-step food inspection and meal sample retention: what collective kitchens must do upon receiving",
    excerpt:
      "A practical summary of Ministry of Health Decision 1246/QD-BYT for kitchen managers: which certificates to inspect upon delivery, how to log entries, sample weights in grams, storage temperatures, and 24-hour retention rules.",
    category: "Food Safety & QA",
    coverImage: "/images/tps1-kitchen.png",
    readingTime: "6 min read",
    publishedLabel: "Oct 06, 2026",
  },
  {
    slug: "controlling-vegetable-trim-loss-in-industrial-catering",
    href: "/en/bao-gia",
    title: "Controlling vegetable trim loss in industrial catering: from receiving dock to prep table",
    excerpt:
      "Raw produce shrinkage can quietly erode 8% to 15% of an industrial caterer's meal budget. Discover how pre-trimmed, size-graded vegetables keep portion yields predictable across every shift.",
    category: "Cost & Compliance",
    coverImage: "/images/tps1-vegetables.png",
    readingTime: "5 min read",
    publishedLabel: "Oct 03, 2026",
  },
  {
    slug: "cold-chain-temperature-standards-for-meat-and-seafood",
    href: "/en/bao-gia",
    title: "Cold-chain temperature standards (0–4°C vs. -18°C) for commercial kitchen receiving",
    excerpt:
      "How receiving teams at factories, hotels, and hospitals can verify core product temperatures in under 3 minutes to prevent bacterial growth and preserve meat and seafood texture.",
    category: "Cold-Chain Logistics",
    coverImage: "/images/tps1-meat-seafood.png",
    readingTime: "5 min read",
    publishedLabel: "Sep 29, 2026",
  },
  {
    slug: "standardizing-multi-branch-fb-ingredient-specs",
    href: "/en/bao-gia",
    title: "How growing F&B chains standardize ingredient specifications across 5 to 20 outlets",
    excerpt:
      "When an eatery expands into a multi-branch chain, inconsistent meat cuts and broth bones quickly lead to uneven flavor. Learn how centralized B2B specs and early-morning route deliveries keep every branch consistent.",
    category: "Restaurants & F&B",
    coverImage: "/images/industries/nha-hang-khach-san-vn.png",
    readingTime: "6 min read",
    publishedLabel: "Sep 25, 2026",
  },
  {
    slug: "menu-planning-for-factory-shift-workers",
    href: "/en/bao-gia",
    title: "Menu planning for factory shift workers: balancing nutrition, variety, and fixed meal budgets",
    excerpt:
      "Practical strategies for rotating weekly menus in industrial parks across Dong Nai and Binh Duong using seasonal Da Lat produce and alternative protein cuts when market prices fluctuate.",
    category: "Kitchen Operations",
    coverImage: "/images/industries/suat-an-cong-nghiep-vn.png",
    readingTime: "6 min read",
    publishedLabel: "Sep 21, 2026",
  },
];

export default function EnglishNewsPage() {
  const featured = ENGLISH_BLOG_POSTS[0];
  const recentPosts = ENGLISH_BLOG_POSTS.slice(1, 4);
  const exploreItems: BlogExploreItem[] = ENGLISH_BLOG_POSTS.slice(4);

  return (
    <main className="blog-page min-h-screen pb-20">
      {/* Page Header — Synchronized 100% with /blog */}
      <header className="blog-header pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="blog-header__badge">
            B2B Blog &amp; Practical Guides
          </div>
          <h1 className="blog-header__title text-4xl md:text-5xl tracking-tight mb-6">
            Insights for commercial kitchens, factories <br className="hidden md:block" /> and procurement teams.
          </h1>
          <p className="blog-header__desc max-w-2xl mx-auto text-lg mb-8">
            Market updates, food-waste control tips, and practical guides to help you optimize industrial catering budgets and food-safety compliance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/en/bao-gia" className="blog-btn-primary">
              Request a quote <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link href="/en/products" className="blog-btn-secondary">
              View Products
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        {/* Magazine Layout: Featured Left (8 cols), 3 Recent Right (4 cols) */}
        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
            <div className="lg:col-span-8">
              <Link
                href={featured.href}
                className="blog-featured-card group block relative h-full min-h-[400px] lg:min-h-[500px]"
              >
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  className="blog-featured-card__img object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="blog-featured-card__scrim" />
                <div className="blog-featured-card__body absolute bottom-0 left-0 p-7 sm:p-9 w-full">
                  <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-white/95">
                    <span className="blog-featured-card__badge">
                      <Sparkles size={13} className="mr-1.5" /> Featured
                    </span>
                    <span className="flex items-center font-medium">
                      <CalendarDays size={14} className="mr-1.5 opacity-85" /> {featured.publishedLabel}
                    </span>
                    <span className="flex items-center font-medium">
                      <Clock3 size={14} className="mr-1.5 opacity-85" /> {featured.readingTime}
                    </span>
                  </div>
                  <h2 className="blog-featured-card__title text-2xl sm:text-3xl mb-3 leading-tight">
                    {featured.title}
                  </h2>
                  <p className="blog-featured-card__excerpt line-clamp-2 max-w-3xl">
                    {featured.excerpt}
                  </p>
                </div>
              </Link>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-5">
              <h3 className="blog-recent__heading text-lg pb-3">Latest Articles</h3>
              <div className="flex flex-col gap-4 flex-grow justify-between">
                {recentPosts.map((post) => (
                  <Link
                    href={post.href}
                    key={post.slug}
                    className="blog-recent-card group flex gap-4 items-center"
                  >
                    <div className="blog-recent-card__thumb relative w-28 h-28 shrink-0">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="blog-recent-card__img object-cover"
                        sizes="112px"
                      />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <span className="blog-recent-card__cat mb-1">{post.category}</span>
                      <h4 className="blog-recent-card__title text-base leading-snug line-clamp-3">
                        {post.title}
                      </h4>
                      <span className="blog-recent-card__date text-xs mt-2 flex items-center">
                        <CalendarDays size={12} className="mr-1 opacity-75" />
                        {post.publishedLabel}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3-Column Grid for the rest */}
        <BlogExploreGrid items={exploreItems} locale="en" />
      </div>
    </main>
  );
}
