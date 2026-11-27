import { makeMetadata } from "@/lib/seo";
import { AboutPageClient } from "@/components/b2b/about-page-client";

export const metadata = makeMetadata({
  title: "About Us | Thuc Pham So Mot (TPS1) — Reliable B2B Food Supplier",
  description:
    "Officially operating since 2017, Thuc Pham So Mot Co., Ltd. (TPS1) supplies over 5,000 traceable food items to 109+ businesses, industrial canteens, schools, hospitals, and restaurants.",
  path: "/en/about",
});

export default function EnglishAboutPage() {
  return <AboutPageClient locale="en" />;
}
