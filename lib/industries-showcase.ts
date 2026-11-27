export type IndustrySectorSlug =
  | "nha-hang-khach-san"
  | "quan-an"
  | "truong-hoc"
  | "bep-an-tap-the"
  | "benh-vien"
  | "suat-an-cong-nghiep";

export type IndustrySectorItem = {
  num: string;
  slug: IndustrySectorSlug;
  title: string;
  shortTitle: string;
  tag: string;
  dispatchTime: string;
  image: string;
  imageAlt: string;
  bentoSpan: 5 | 6 | 7;
  bentoDesc: string;
  chips: [string, string, string];
  spotlightPillars: {
    ingredients: string;
    logistics: string;
    compliance: string;
  };
};

export const INDUSTRY_SECTORS: IndustrySectorItem[] = [
  {
    num: "01",
    slug: "nha-hang-khach-san",
    title: "Nhà hàng, khách sạn và tiệc cưới",
    shortTitle: "Nhà hàng, khách sạn",
    tag: "Chuẩn bếp trưởng",
    dispatchTime: "Theo giờ mở bếp",
    image: "/images/industries/nha-hang-khach-san-vn.png",
    imageAlt: "Cung ứng thực phẩm tươi đều cỡ cho bếp nhà hàng và khách sạn",
    bentoSpan: 7,
    bentoDesc:
      "Chọn hàng tươi đều cỡ, cắt lóc đúng chuẩn món và hỗ trợ đơn tiệc bổ sung.",
    chips: ["Tươi đều cỡ", "Cắt theo món", "Đơn phát sinh"],
    spotlightPillars: {
      ingredients: "Rau củ phân loại kích cỡ; thịt cá cắt lóc đúng quy cách từng món.",
      logistics: "Xe lạnh giao theo giờ mở bếp, hỗ trợ đơn bổ sung khi tiệc đông.",
      compliance: "Hơn 5.000 mã hàng một đầu mối, xuất đủ hóa đơn VAT và công nợ.",
    },
  },
  {
    num: "02",
    slug: "quan-an",
    title: "Quán ăn và chuỗi cửa hàng F&B",
    shortTitle: "Quán ăn, chuỗi F&B",
    tag: "Đồng nhất toàn chuỗi",
    dispatchTime: "Mỗi sáng sớm",
    image: "/images/tps1-kitchen.png",
    imageAlt: "Cung cấp nguyên liệu tươi mỗi sáng cho quán ăn và chuỗi F&B",
    bentoSpan: 5,
    bentoDesc:
      "Giao hàng tươi mỗi sáng đủ ngày bán, giữ một quy cách cho mọi chi nhánh.",
    chips: ["Tươi mỗi sáng", "Một quy cách", "Đặt qua Zalo"],
    spotlightPillars: {
      ingredients: "Rau thơm, xương hầm, thịt cá cắt sẵn giữ đồng nhất vị toàn chuỗi.",
      logistics: "Giao mỗi sáng sớm theo tuyến từng điểm bán, hạn chế hàng tồn kho.",
      compliance: "Chốt đơn nhanh qua Zalo trong 30 phút, tách hóa đơn từng quán.",
    },
  },
  {
    num: "03",
    slug: "truong-hoc",
    title: "Trường học bán trú và nội trú",
    shortTitle: "Trường học bán trú",
    tag: "Rõ nguồn gốc",
    dispatchTime: "Đầu giờ sáng",
    image: "/images/industries/truong-hoc-vn.png",
    imageAlt: "Cung cấp thực phẩm an toàn có hồ sơ truy xuất cho trường học bán trú",
    bentoSpan: 5,
    bentoDesc:
      "Nguyên liệu rõ nguồn gốc, cá phi lê sạch xương kèm đủ hồ sơ VSATTP.",
    chips: ["Rõ nguồn gốc", "Hồ sơ VSATTP", "Sạch xương"],
    spotlightPillars: {
      ingredients: "Rau củ theo mùa, thịt nạc, cá phi lê sạch xương cho từng lứa tuổi.",
      logistics: "Xe lạnh giao đầu giờ sáng đúng lịch trường, kịp giờ chế biến.",
      compliance: "Nguồn gốc rõ ràng, đủ hồ sơ VSATTP, ISO 22000, HACCP và VAT.",
    },
  },
  {
    num: "04",
    slug: "bep-an-tap-the",
    title: "Bếp ăn công ty và nhà máy KCN",
    shortTitle: "Bếp ăn công ty, nhà máy",
    tag: "Đúng định mức ca",
    dispatchTime: "Giao theo ca bếp",
    image: "/images/industries/bep-an-tap-the-vn.png",
    imageAlt: "Giao thực phẩm theo ca cho bếp ăn công ty và nhà máy khu công nghiệp",
    bentoSpan: 7,
    bentoDesc:
      "Lập lịch giao xe lạnh theo từng ca bếp, đúng định mức mỗi bữa ăn.",
    chips: ["Giao theo ca", "Đúng định mức", "Hóa đơn VAT"],
    spotlightPillars: {
      ingredients: "Rau Đà Lạt, thịt cá tươi, hàng đông lạnh và gia vị theo thực đơn.",
      logistics: "Xe lạnh giao theo ca bếp đã chốt, đảm bảo bữa ăn đúng giờ công nhân.",
      compliance: "Đạt ISO 22000, HACCP, bảo hiểm 5 tỷ, báo trước biến giá và VAT.",
    },
  },
  {
    num: "05",
    slug: "benh-vien",
    title: "Bệnh viện và cơ sở y tế",
    shortTitle: "Bệnh viện, cơ sở y tế",
    tag: "ISO 22000 & HACCP",
    dispatchTime: "Giao mỗi ngày",
    image: "/images/industries/benh-vien-vn.png",
    imageAlt: "Cung ứng thực phẩm kiểm soát an toàn HACCP cho bếp ăn bệnh viện",
    bentoSpan: 6,
    bentoDesc:
      "Đa dạng nguyên liệu cho thực đơn bệnh lý, kiểm soát lạnh chuẩn ISO & HACCP.",
    chips: ["ISO & HACCP", "Thực đơn y tế", "Xe lạnh chuẩn"],
    spotlightPillars: {
      ingredients: "Thịt nạc, cá phi lê, rau củ mềm phù hợp nhiều chế độ ăn bệnh lý.",
      logistics: "Xe lạnh giữ nhiệt xuyên suốt, giao cố định mỗi ngày kể cả dịp lễ.",
      compliance: "Kiểm soát an toàn chuẩn ISO 22000, HACCP và đầy đủ chứng từ VAT.",
    },
  },
  {
    num: "06",
    slug: "suat-an-cong-nghiep",
    title: "Đơn vị thầu suất ăn công nghiệp",
    shortTitle: "Đơn vị suất ăn",
    tag: "Giữ chi phí suất",
    dispatchTime: "Theo ca chế biến",
    image: "/images/industries/suat-an-cong-nghiep-vn.png",
    imageAlt: "Cung ứng nguyên liệu giá sỉ ổn định cho đơn vị thầu suất ăn công nghiệp",
    bentoSpan: 6,
    bentoDesc:
      "Quy cách hàng đồng nhất giúp giảm hao hụt, giữ vững chi phí mỗi suất ăn.",
    chips: ["Đều quy cách", "Giữ giá suất", "Báo biến giá"],
    spotlightPillars: {
      ingredients: "Nguyên liệu đồng đều kích cỡ, hao hụt thấp, dễ chia từng khẩu phần.",
      logistics: "Kho lạnh và xe lạnh giao theo ca sáng, trưa, tối trước giờ nấu.",
      compliance: "Giá sỉ theo sản lượng, báo sớm biến động giá, gợi ý món thay thế.",
    },
  },
];

export const INDUSTRY_SECTORS_EN: IndustrySectorItem[] = [
  {
    num: "01",
    slug: "nha-hang-khach-san",
    title: "Restaurants, hotels, and wedding venues",
    shortTitle: "Restaurants & hotels",
    tag: "Executive chef grade",
    dispatchTime: "By kitchen opening hours",
    image: "/images/industries/nha-hang-khach-san-vn.png",
    imageAlt: "Uniformly graded fresh food supply for restaurant and hotel kitchens",
    bentoSpan: 7,
    bentoDesc:
      "Select uniformly sized fresh produce, portion cuts to exact dish specs, and support urgent banquet top-up orders.",
    chips: ["Uniform sizing", "Dish-specific cuts", "Urgent banquet orders"],
    spotlightPillars: {
      ingredients: "Produce graded by size; meat and fish portioned to exact dish specifications.",
      logistics: "Refrigerated trucks deliver by kitchen opening hours, supporting urgent banquet additions.",
      compliance: "Over 5,000 SKUs from one supplier, full electronic VAT invoicing and credit terms.",
    },
  },
  {
    num: "02",
    slug: "quan-an",
    title: "Eateries and F&B store chains",
    shortTitle: "Eateries & F&B chains",
    tag: "Chain-wide consistency",
    dispatchTime: "Every early morning",
    image: "/images/tps1-kitchen.png",
    imageAlt: "Fresh morning ingredient delivery for eateries and F&B chains",
    bentoSpan: 5,
    bentoDesc:
      "Deliver fresh daily stock every morning, maintaining identical specifications across all branch outlets.",
    chips: ["Fresh every morning", "Uniform specs", "Order via Zalo"],
    spotlightPillars: {
      ingredients: "Fresh herbs, broth bones, and pre-cut meat/fish maintaining consistent taste across all branches.",
      logistics: "Early-morning route delivery to each outlet, minimizing overnight inventory storage.",
      compliance: "Fast order confirmation via Zalo within 30 minutes, separate VAT invoices per outlet.",
    },
  },
  {
    num: "03",
    slug: "truong-hoc",
    title: "Day-boarding and boarding schools",
    shortTitle: "Boarding schools",
    tag: "Traceable origin",
    dispatchTime: "Early morning arrival",
    image: "/images/industries/truong-hoc-vn.png",
    imageAlt: "Safe traceable food supply with full food-safety records for boarding schools",
    bentoSpan: 5,
    bentoDesc:
      "Clearly traceable ingredients and deboned fish fillets accompanied by complete food-safety records.",
    chips: ["Traceable origin", "Food-safety dossier", "Deboned fillets"],
    spotlightPillars: {
      ingredients: "Seasonal vegetables, lean meat, and carefully deboned fish fillets tailored to student age groups.",
      logistics: "Refrigerated trucks arrive early morning on school schedule, right before meal preparation.",
      compliance: "Transparent origin, full VSATTP food-safety records, ISO 22000, HACCP, and VAT invoices.",
    },
  },
  {
    num: "04",
    slug: "bep-an-tap-the",
    title: "Corporate canteens and industrial park factories",
    shortTitle: "Factory & IP canteens",
    tag: "Exact shift quotas",
    dispatchTime: "Delivered by kitchen shift",
    image: "/images/industries/bep-an-tap-the-vn.png",
    imageAlt: "Shift-timed food delivery for corporate canteens and industrial park factories",
    bentoSpan: 7,
    bentoDesc:
      "Schedule refrigerated truck deliveries for each kitchen shift, matching exact meal portion quotas.",
    chips: ["Shift-timed delivery", "Exact meal quotas", "VAT invoicing"],
    spotlightPillars: {
      ingredients: "Da Lat produce, fresh meat and fish, frozen goods, and seasonings matched to shift menus.",
      logistics: "Refrigerated trucks deliver per confirmed shift schedule, ensuring on-time worker meals.",
      compliance: "ISO 22000, HACCP, VND 5 billion liability insurance, advance price-change notices, and VAT.",
    },
  },
  {
    num: "05",
    slug: "benh-vien",
    title: "Hospitals and healthcare facilities",
    shortTitle: "Hospitals & healthcare",
    tag: "ISO 22000 & HACCP",
    dispatchTime: "Daily delivery",
    image: "/images/industries/benh-vien-vn.png",
    imageAlt: "HACCP-controlled food supply for hospital nutrition kitchens",
    bentoSpan: 6,
    bentoDesc:
      "Diverse ingredients for therapeutic diets, with cold-chain logistics controlled under ISO & HACCP.",
    chips: ["ISO & HACCP", "Clinical diet menus", "Cold-chain fleet"],
    spotlightPillars: {
      ingredients: "Lean meat, fish fillets, and tender vegetables suitable for diverse clinical nutrition regimens.",
      logistics: "Continuous temperature-controlled trucks delivering on a fixed daily schedule including holidays.",
      compliance: "Strict safety management under ISO 22000 and HACCP standards with full VAT documentation.",
    },
  },
  {
    num: "06",
    slug: "suat-an-cong-nghiep",
    title: "Industrial catering contractors",
    shortTitle: "Industrial caterers",
    tag: "Stable meal cost",
    dispatchTime: "By cooking shift",
    image: "/images/industries/suat-an-cong-nghiep-vn.png",
    imageAlt: "Stable wholesale ingredient supply for industrial catering contractors",
    bentoSpan: 6,
    bentoDesc:
      "Uniform product specifications reduce trim loss and keep per-meal ingredient costs stable.",
    chips: ["Uniform specs", "Stable meal cost", "Price alerts"],
    spotlightPillars: {
      ingredients: "Uniformly sized ingredients with low trim waste, making portioning fast and accurate.",
      logistics: "Cold storage and refrigerated fleet delivering before morning, afternoon, and night cooking shifts.",
      compliance: "Volume-based wholesale pricing, early market price alerts, and alternative ingredient suggestions.",
    },
  },
];
