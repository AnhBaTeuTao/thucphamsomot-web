import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Tag } from "lucide-react";
import { makeMetadata } from "@/lib/seo";
import { getBlogPostBySlug, formatBlogDate } from "@/lib/blog";
import { ArticleJsonLd } from "@/components/article-json-ld";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getBlogPostBySlug(slug, false);

  if (!article) {
    return makeMetadata({
      title: "Blog",
      description: "Bài viết không tồn tại.",
      path: `/blog/${slug}`,
    });
  }

  return makeMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    path: `/blog/${article.slug}`,
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getBlogPostBySlug(slug, true);

  if (!article) {
    notFound();
  }

  return (
    <main className="blog-page min-h-screen pb-20">
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", item: "/" },
          { name: "Blog", item: "/blog" },
          { name: article.title, item: `/blog/${article.slug}` },
        ]}
      />
      <ArticleJsonLd
        type="BlogPosting"
        title={article.title}
        description={article.excerpt}
        url={new URL(`/blog/${article.slug}`, siteConfig.url).toString()}
        image={new URL(article.coverImage, siteConfig.url).toString()}
        author={article.author}
        datePublished={article.publishedAt}
      />
      
      {/* Hero Section */}
      <section className="blog-detail-hero pt-14 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="blog-back-link mb-7">
            <ArrowLeft size={16} className="mr-1.5" />
            Quay lại Blog
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm text-[#2c463a] font-medium mb-6">
            <span className="blog-header__badge" style={{ marginBottom: 0 }}>
              <Tag size={12} className="mr-1.5" />
              {article.category}
            </span>
            <span className="flex items-center">
              <CalendarDays size={14} className="mr-1.5 text-[#0f6f4b]" />
              {formatBlogDate(article.publishedAt)}
            </span>
            <span className="flex items-center">
              <Clock3 size={14} className="mr-1.5 text-[#0f6f4b]" />
              {article.readingTime}
            </span>
          </div>

          <h1 className="blog-detail-title text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
            {article.title}
          </h1>
          <p className="blog-detail-lead text-lg md:text-xl leading-relaxed mb-10">
            {article.excerpt}
          </p>

          <div className="blog-detail-cover relative aspect-[16/9] w-full">
            <Image 
              src={article.coverImage} 
              alt={article.title} 
              fill 
              priority 
              className="object-cover"
              sizes="(max-w-width: 1024px) 100vw, 896px"
            />
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="blog-detail-card p-7 sm:p-10 md:p-12">
          {/* Prose */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: article.contentHtml || "" }}
          />
        </div>

        {/* Related / Next Steps */}
        <section className="blog-related-box mt-14 p-7 sm:p-9">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-black text-[#0f241c] mb-3">Hỗ Trợ & Báo Giá</h2>
            <p className="text-[#1c352a] font-medium max-w-2xl mx-auto">
              Các liên kết dưới đây giúp bạn nhanh chóng tìm hiểu sản phẩm và nhận báo giá phù hợp nhất cho bếp ăn, nhà máy của mình.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {getRelatedNewsLinks(article.slug).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="blog-related-card group"
              >
                <h3 className="blog-related-card__title text-lg mb-2">{item.label}</h3>
                <p className="blog-related-card__desc text-sm mb-4">{item.description}</p>
                <span className="blog-related-card__cta inline-flex items-center text-sm font-extrabold">
                  Xem trang <ArrowRight size={16} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

const categoryLinkBySlug: Record<string, { href: string; label: string; description: string }> = {
  "bi-quyet-bao-quan-rau-cu-trong-kho-lanh": {
    href: "/danh-muc/rau-cu-qua",
    label: "Danh mục Rau củ quả",
    description: "Nguồn rau củ tươi theo mùa, phù hợp bếp ăn cần giao định kỳ.",
  },
  "so-sanh-thuc-pham-tuoi-song-va-dong-lanh": {
    href: "/danh-muc/hang-dong-lanh",
    label: "Danh mục Hàng đông lạnh",
    description: "Giải pháp dự phòng nguồn hàng khi cần chủ động tồn kho.",
  },
  "quy-trinh-chuan-kiem-tra-thit": {
    href: "/danh-muc/thit-heo",
    label: "Danh mục Thịt heo",
    description: "Thịt heo kiểm tra khi nhập kho, cắt đúng quy cách bếp cần.",
  },
  "du-bao-gia-thit-heo-cuoi-nam-2026": {
    href: "/danh-muc/thit-heo",
    label: "Danh mục Thịt heo",
    description: "Xem các mặt hàng thịt heo và cách nhận báo giá theo sản lượng.",
  },
  "cach-xay-dung-thuc-don-suat-an-25k": {
    href: "/danh-muc/gia-vi",
    label: "Danh mục Gia vị",
    description: "Gia vị chuẩn hóa hương vị, hỗ trợ giữ định mức chi phí suất ăn.",
  },
  "7-sai-lam-lang-phi-ngan-sach-suat-an": {
    href: "/danh-muc/gia-vi",
    label: "Danh mục Gia vị",
    description: "Tối ưu chi phí gia vị và nguyên liệu để tránh lãng phí ngân sách.",
  },
  "tieu-chuan-vsattp-suat-an-cong-nghiep": {
    href: "/danh-muc/hai-san",
    label: "Danh mục Hải sản",
    description: "Nhóm hàng nhạy về an toàn thực phẩm, kiểm soát chặt từ đầu vào.",
  },
  "tai-sao-chon-nha-cung-cap-thuc-pham-dia-phuong": {
    href: "/danh-muc/thuc-pham-chay",
    label: "Danh mục Thực phẩm chay",
    description: "Nguồn hàng chay từ nhà phân phối chuyên biệt tại địa phương.",
  },
  "case-study-giam-15-phan-tram-chi-phi-thuc-pham": {
    href: "/san-pham",
    label: "Xem toàn bộ sản phẩm",
    description: "Danh mục 5.000+ sản phẩm giúp tái cấu trúc chi phí nguyên liệu.",
  },
  "giai-phap-cung-ung-thuc-pham-nha-may-3-ca": {
    href: "/danh-muc/hang-dong-lanh",
    label: "Danh mục Hàng đông lạnh",
    description: "Chủ động tồn kho cho nhà máy vận hành liên tục nhiều ca.",
  },
};

function getRelatedNewsLinks(slug: string) {
  const common = [
    { href: "/san-pham", label: "Xem sản phẩm", description: "Danh mục nhóm hàng và quy cách cụ thể." },
    { href: "/bao-gia", label: "Gửi yêu cầu báo giá", description: "Gửi nhu cầu để nhận phản hồi nhanh chóng." },
  ];

  const categoryLink = categoryLinkBySlug[slug];
  const categoryLinks = categoryLink ? [categoryLink] : [];

  if (slug.includes("nha-may") || slug.includes("cong-nghiep")) {
    return [
      ...categoryLinks,
      { href: "/cung-cap-thuc-pham-dong-nai", label: "Khu vực Đồng Nai", description: "Dịch vụ giao hàng tận nơi cho nhà máy Đồng Nai." },
      { href: "/cung-cap-thuc-pham-binh-duong", label: "Khu vực Bình Dương", description: "Tuyến giao hàng cho nhà máy, KCN Bình Dương." },
      ...common,
    ].slice(0, 4);
  }

  return [
    ...categoryLinks,
    { href: "/cung-cap-thuc-pham-bien-hoa", label: "Khu vực Biên Hòa", description: "Trang địa phương cho nhu cầu mua định kỳ." },
    { href: "/cung-cap-thuc-pham-tp-hcm", label: "Khu vực TP.HCM", description: "Trang địa phương cho nhu cầu giao theo tuyến." },
    ...common,
  ].slice(0, 4);
}
