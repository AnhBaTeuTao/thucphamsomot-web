import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Sparkles } from "lucide-react";
import { makeMetadata } from "@/lib/seo";
import { getAllBlogPosts, formatBlogDate } from "@/lib/blog";
import { BlogExploreGrid, type BlogExploreItem } from "@/components/b2b/blog-explore-grid";

export const dynamic = "force-dynamic";

export const metadata = makeMetadata({
  title: "Kiến thức vận hành bếp ăn tập thể",
  description: "Bài viết cho người quản lý bếp ăn, phòng thu mua nhà máy và nhà trường: định mức nguyên liệu, an toàn thực phẩm, chi phí suất ăn và cách chọn nhà cung cấp.",
  path: "/blog",
});

export default async function BlogPage() {
  const articles = await getAllBlogPosts();
  const featured = articles[0];
  const recentPosts = articles.slice(1, 4);
  const exploreItems: BlogExploreItem[] = articles.slice(4).map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    coverImage: article.coverImage,
    readingTime: article.readingTime,
    publishedLabel: formatBlogDate(article.publishedAt),
  }));

  return (
    <main className="blog-page min-h-screen pb-20">
      {/* Page Header */}
      <header className="blog-header pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="blog-header__badge">
            Blog và Cẩm nang hữu ích
          </div>
          <h1 className="blog-header__title text-4xl md:text-5xl tracking-tight mb-6">
            Góc chia sẻ cho bếp ăn, nhà máy <br className="hidden md:block" /> và đội đặt hàng.
          </h1>
          <p className="blog-header__desc max-w-2xl mx-auto text-lg mb-8">
            Cập nhật tin tức thị trường, mẹo quản lý hao hụt thực phẩm và các bài hướng dẫn giúp tối ưu ngân sách suất ăn công nghiệp hiệu quả.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/bao-gia"
              className="blog-btn-primary"
            >
              Gửi yêu cầu báo giá <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link
              href="/san-pham"
              className="blog-btn-secondary"
            >
              Xem Sản Phẩm
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        {/* Magazine Layout: Featured Left, 3 Recent Right */}
        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
            {/* Featured Post (Left, spans 8 cols) */}
            <div className="lg:col-span-8">
              <Link href={`/blog/${featured.slug}`} className="blog-featured-card group block relative h-full min-h-[400px] lg:min-h-[500px]">
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
                      <Sparkles size={13} className="mr-1.5" /> Nổi bật
                    </span>
                    <span className="flex items-center font-medium">
                      <CalendarDays size={14} className="mr-1.5 opacity-85" /> {formatBlogDate(featured.publishedAt)}
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

            {/* Recent Posts (Right, spans 4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              <h3 className="blog-recent__heading text-lg pb-3">Bài Mới Nhất</h3>
              <div className="flex flex-col gap-4 flex-grow justify-between">
                {recentPosts.map((post) => (
                  <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-recent-card group flex gap-4 items-center">
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
                        {formatBlogDate(post.publishedAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3-Column Grid for the rest (6 -> 12 -> pagination) */}
        <BlogExploreGrid items={exploreItems} />
      </div>
    </main>
  );
}
