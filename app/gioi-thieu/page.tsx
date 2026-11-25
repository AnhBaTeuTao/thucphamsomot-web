import { makeMetadata } from "@/lib/seo";
import { AboutPageClient } from "@/components/b2b/about-page-client";

export const metadata = makeMetadata({
  title: "Giới thiệu Công ty TNHH Thực Phẩm Số Một",
  description:
    "Từ năm 2017, Thực Phẩm Số Một cung cấp thực phẩm rõ nguồn gốc cho nhà hàng, quán ăn, bếp công ty, trường học; đạt ISO 22000, HACCP, bảo hiểm sản phẩm 5 tỷ.",
  path: "/gioi-thieu",
});

export default function GioiThieuPage() {
  return <AboutPageClient />;
}
