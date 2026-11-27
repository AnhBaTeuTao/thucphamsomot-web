// Public product catalog read from the KiotViet-synced Supabase `products` table.
// Shared by the /api/sku-products route (client search) and server-rendered
// catalog pages, so Google sees product names in the initial HTML.

export const SKU_PAGE_SIZE = 20;

export type SkuGroup = {
  slug: string;
  label: string;
  labelEn: string;
  // Exact `products.category` values (KiotViet nhóm hàng) in this group.
  categories: string[];
  image: string;
  // Has its own /danh-muc/[slug] landing page.
  hasPage: boolean;
};

export const SKU_GROUPS: SkuGroup[] = [
  { slug: "rau-cu-qua", label: "Rau củ quả", labelEn: "Produce", categories: ["Rau củ quả", "Trái cây"], image: "/images/tps1-vegetables.png", hasPage: true },
  { slug: "thit-heo", label: "Thịt heo", labelEn: "Pork", categories: ["Thịt heo"], image: "/images/tps1-meat-seafood.png", hasPage: true },
  { slug: "thit-bo", label: "Thịt bò", labelEn: "Beef", categories: ["Thịt bò"], image: "/images/categories/thit-ca.png", hasPage: true },
  { slug: "gia-cam", label: "Gia cầm", labelEn: "Poultry", categories: ["Gà, vịt"], image: "/images/industries/bep-an-tap-the-vn.png", hasPage: true },
  { slug: "hai-san", label: "Hải sản", labelEn: "Seafood", categories: ["Hải sản"], image: "/images/categories/dong-lanh.png", hasPage: true },
  { slug: "hang-dong-lanh", label: "Hàng đông lạnh", labelEn: "Frozen", categories: ["Đông lạnh"], image: "/images/tps1-frozen.png", hasPage: true },
  { slug: "gia-vi", label: "Gia vị", labelEn: "Seasonings", categories: ["Gia vị"], image: "/images/tps1-spices.png", hasPage: true },
  { slug: "do-kho", label: "Đồ khô", labelEn: "Dry goods", categories: ["Đồ khô"], image: "/images/categories/gia-vi.png", hasPage: true },
  { slug: "thuc-pham-chay", label: "Thực phẩm chay", labelEn: "Vegetarian", categories: ["Chay, chả giò", "Đậu hũ"], image: "/images/categories/chay.png", hasPage: true },
  { slug: "thiet-bi-bep", label: "Dụng cụ bếp", labelEn: "Kitchen tools", categories: ["Công cụ dụng cụ"], image: "/images/tps1_tools_placeholder.png", hasPage: true },
];

// Slugs used by the catalog before 10/2026; kept so old links and cached
// clients still filter correctly.
const LEGACY_GROUP_SLUGS: Record<string, string> = {
  "rau-cu": "rau-cu-qua",
  "ga-vit": "gia-cam",
  "dong-lanh": "hang-dong-lanh",
  "gao-mi": "do-kho",
};

export function findSkuGroup(slug: string | null | undefined) {
  if (!slug) return undefined;
  const normalized = LEGACY_GROUP_SLUGS[slug] ?? slug;
  return SKU_GROUPS.find((group) => group.slug === normalized);
}

export interface SkuProduct {
  id: string;
  slug: string;
  name: string;
  category: string;      // group slug: 'rau-cu-qua'
  categoryLabel: string; // KiotViet label: 'Rau củ quả'
  unit: string;
  price: number;
  image: string;
  origin?: string;
  spec?: string;
}

export type SkuPage = {
  products: SkuProduct[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  categoryCounts?: Record<string, number>;
};

type RawProduct = {
  id: string | number;
  local_product_id: string | number | null;
  name: string;
  category: string | null;
  unit: string | null;
  price_retail: number | string | null;
  price_wholesale: number | string | null;
  image_url: string | null;
};

function groupForCategory(category: string | null) {
  if (!category) return undefined;
  return SKU_GROUPS.find((group) => group.categories.includes(category));
}

// PostgREST `in.(...)` list with each value double-quoted (values contain commas).
function inList(values: string[]) {
  return `in.(${values.map((value) => `"${value.replace(/"/g, '\\"')}"`).join(",")})`;
}

type CategorySeedSpec = {
  slug: string;
  categoryLabel: string;
  baseNames: string[];
  prepVariants: string[];
  origins: string[];
  units: string[];
  specs: string[];
  images: string[];
};

const SEED_SPECS: CategorySeedSpec[] = [
  {
    slug: "rau-cu-qua",
    categoryLabel: "Rau củ quả",
    baseNames: [
      "Cải ngọt Đà Lạt", "Cải thìa xanh", "Cải thảo búp lớn", "Bông cải xanh Đà Lạt",
      "Bắp cải xanh", "Bắp cải tím", "Xà lách lô lô xanh", "Cà rốt Đà Lạt loại 1",
      "Khoai tây vàng Đà Lạt", "Cà chua chín đỏ", "Dưa leo baby", "Ớt chuông đỏ Đà Lạt",
      "Ớt chuông vàng", "Bắp ngọt tươi", "Nấm đùi gà tươi", "Bơ sáp Đà Lạt",
      "Cải bó xôi", "Hành lá sơ chế", "Củ cải trắng", "Bí đỏ hồ lô",
      "Bầu sao tươi", "Bí đao xanh", "Su su Đà Lạt", "Đậu cove xanh",
      "Rau muống nước sạch", "Mồng tơi lá dày", "Rau dền đỏ", "Khổ qua xanh",
      "Cà tím dài", "Chanh không hạt",
    ],
    prepVariants: [
      "chuẩn VietGAP", "sơ chế sạch gốc", "rửa ozon đóng túi", "cắt khúc theo ca bếp",
      "chọn cỡ đồng đều", "tuyển chọn loại 1", "giao sáng sớm", "sơ chế sẵn bếp ăn",
      "đóng sọt chuẩn bếp công nghiệp", "hàng tươi mỗi ngày",
    ],
    origins: ["Đà Lạt (VietGAP)", "Lâm Đồng", "Đồng Nai", "Tây Nguyên", "Tiền Giang"],
    units: ["kg", "túi", "thùng", "bó"],
    specs: ["Túi 1kg sơ chế sạch gốc", "Sọt 10kg giữ mát", "Túi 2kg chọn đều cỡ", "Đóng gói theo định lượng ca nấu"],
    images: [
      "/images/categories/rau-cu-qua.png",
      "/images/tps1-vegetables.png",
      "/images/transition-cutouts/fresh-broccoli.webp",
      "/images/transition-cutouts/fresh-carrot.webp",
      "/images/transition-cutouts/fresh-tomato.webp",
      "/images/transition-cutouts/sweet-corn.webp",
      "/images/transition-cutouts/purple-cabbage.webp",
      "/images/transition-cutouts/fresh-mushroom.webp",
    ],
  },
  {
    slug: "thit-heo",
    categoryLabel: "Thịt heo",
    baseNames: [
      "Thịt ba rọi heo tươi", "Sườn non heo", "Sườn cốt lết heo", "Thịt nạc vai heo",
      "Thịt nạc dăm heo", "Nạc thăn heo", "Thịt đùi heo", "Chân giò heo trước",
      "Chân giò heo sau", "Giò heo khoanh tròn", "Thịt heo xay tươi", "Xương ống heo",
      "Xương đuôi heo", "Thịt nọng heo", "Ba rọi rút sườn", "Thịt bắp giò heo",
      "Sườn già nấu canh", "Thịt vai đầu giòn", "Da heo làm sạch", "Mỡ gáy heo tươi",
      "Tim heo tươi", "Gan heo tươi", "Cật heo làm sạch", "Bao tử heo làm sạch",
      "Tai heo cạo sạch", "Lưỡi heo tươi", "Thịt heo thái mỏng cuộn", "Sườn cây chặt khúc",
      "Ba rọi cắt lát 5mm", "Nạc đùi thái lát xào",
    ],
    prepVariants: [
      "chuẩn kiểm dịch", "pha lóc theo quy cách bếp", "cắt lát sẵn cho ca nấu", "nguyên tảng giữ lạnh 0-4°C",
      "chặt khúc đồng đều", "hút chân không từng khay", "lọc da sạch mỡ", "chọn lô tươi mỗi sáng",
      "đủ giấy kiểm dịch thú y", "cắt miếng kho tiêu chuẩn",
    ],
    origins: ["Đồng Nai (Kiểm dịch)", "Bình Dương (VietGAHP)", "CP Food Việt Nam", "Long An"],
    units: ["kg", "khay", "thùng"],
    specs: ["Cắt lát hoặc nguyên tảng theo ca", "Khay hút chân không 2kg", "Thùng giữ lạnh 10kg", "Đủ chứng từ kiểm dịch theo lô"],
    images: [
      "/images/tps1-meat-seafood.png",
      "/images/transition-cutouts/fresh-pork-belly.webp",
      "/images/transition-cutouts/pork-belly-sliced.webp",
      "/images/transition-cutouts/pork-baby-back-ribs.webp",
      "/images/transition-cutouts/pork-chop-cutlet.webp",
      "/images/transition-cutouts/pork-tenderloin.webp",
      "/images/transition-cutouts/pork-marrow-bones.webp",
      "/images/transition-cutouts/pork-minced-fresh.webp",
    ],
  },
  {
    slug: "thit-bo",
    categoryLabel: "Thịt bò",
    baseNames: [
      "Thăn nội bò Úc", "Thăn ngoại bò Ribeye", "Gầu bò tươi", "Nạm bò hầm",
      "Bắp bò hoa", "Gân bò trong", "Thịt bò phi lê mềm", "Ba chỉ bò Mỹ thái cuộn",
      "Lõi vai bò Mỹ", "Thịt bò bít tết", "Thịt bò vụn xào", "Thịt bò xay nguyên chất",
      "Đuôi bò chặt khúc", "Xương ống bò nấu phở", "Sườn bò có xương", "Sườn non bò rút xương",
      "Dẻ sườn bò", "Thăn vai bò Úc", "Bắp rùa bò tươi", "Nạc đùi bò thái lát",
      "Gầu giòn bò phở", "Bò viên gân đặc biệt", "Thịt cổ bò cắt khối", "Thịt mông bò nạc",
      "Bò lúc lắc cắt vuông", "Bò tái phở thái máy", "Bò băm nhỏ bếp trường", "Nạm vè bò tươi",
      "Xí quách bò nấu nước dùng", "Thăn lưng bò striploin",
    ],
    prepVariants: [
      "tươi mát nhập khẩu", "thái lát mỏng 2mm", "cắt khối vuông hầm", "nguyên cây hút chân không",
      "pha lóc sạch gân", "chuẩn nhà hàng Âu - Á", "định lượng theo suất ăn", "chọn phần mềm ngọt",
      "đầy đủ CO/CQ kiểm dịch", "bảo quản chuỗi lạnh chuẩn",
    ],
    origins: ["Nhập khẩu Úc", "Nhập khẩu Mỹ", "Đồng Nai", "Tây Ninh"],
    units: ["kg", "khay", "thùng"],
    specs: ["Cây hút chân không 1 - 2kg", "Khay thái lát sẵn 1kg", "Thùng lạnh 10kg", "Định lượng chuẩn bếp công nghiệp"],
    images: [
      "/images/categories/thit-ca.png",
      "/images/transition-cutouts/beef-ribeye-steak.webp",
      "/images/transition-cutouts/beef-tenderloin-medallion.webp",
      "/images/transition-cutouts/beef-brisket-slab.webp",
      "/images/transition-cutouts/beef-shank-cross.webp",
      "/images/transition-cutouts/beef-flank-strip.webp",
      "/images/transition-cutouts/beef-shabu-rolls.webp",
    ],
  },
  {
    slug: "gia-cam",
    categoryLabel: "Gia cầm",
    baseNames: [
      "Gà ta thả vườn nguyên con", "Gà công nghiệp làm sạch", "Ức gà phi lê không da", "Đùi tỏi gà tươi",
      "Đùi góc tư gà", "Cánh gà nguyên 3 khúc", "Cánh gà khúc giữa", "Má đùi gà rút xương",
      "Chân gà làm sạch", "Chân gà rút xương", "Mề gà làm sạch", "Tim gà tươi",
      "Gan gà tươi", "Xương gà nấu nước dùng", "Vịt tươi nguyên con làm sạch", "Ức vịt có da",
      "Đùi vịt góc tư", "Cánh vịt tươi", "Lưỡi vịt sơ chế", "Trứng gà công nghiệp loại 1",
      "Trứng gà ta vườn", "Trứng vịt tươi", "Trứng vịt muối", "Trứng cút tươi",
      "Trứng cút bóc vỏ sẵn", "Gà tam hoàng nguyên con", "Gà ác tiềm thuốc bắc", "Gà chặt miếng kho gừng",
      "Ức gà thái hạt lựu", "Đùi gà lọc xương nướng",
    ],
    prepVariants: [
      "làm sạch lông kỹ", "chia phần theo suất ăn", "rút xương sẵn cho bếp", "đóng khay hút chân không",
      "tươi sống giao trong ngày", "đạt chuẩn an toàn thú y", "chọn cỡ đồng đều", "sơ chế sạch mùi",
      "đóng vỉ chắc chắn", "nguồn trại chuẩn VietGAHP",
    ],
    origins: ["Đồng Nai", "Bình Phước", "Long An", "Bình Dương"],
    units: ["kg", "vỉ", "thùng", "khay"],
    specs: ["Nguyên con 1.4 - 1.6kg", "Khay 2kg chia phần đều", "Vỉ 30 trứng sạch", "Thùng giữ lạnh 10kg"],
    images: [
      "/images/industries/bep-an-tap-the-vn.png",
      "/images/transition-cutouts/raw-chicken-drumstick.webp",
      "/images/transition-cutouts/poultry-chicken-breast.webp",
      "/images/transition-cutouts/poultry-chicken-wings.webp",
      "/images/transition-cutouts/poultry-duck-breast.webp",
      "/images/food-cutouts/fresh-eggs-pair.png",
    ],
  },
  {
    slug: "hai-san",
    categoryLabel: "Hải sản",
    baseNames: [
      "Cá hồi phi lê Na Uy", "Cá thu cắt khoanh", "Cá basa phi lê", "Cá diêu hồng làm sạch",
      "Cá lóc đồng cắt khúc", "Cá rô phi phi lê", "Cá nục biển tươi", "Cá bạc má tươi",
      "Cá chim trắng biển", "Cá mú tươi nguyên con", "Cá bớp cắt khoanh", "Cá trích phi lê",
      "Tôm sú tươi size 30", "Tôm thẻ chân trắng size 50", "Tôm nõn bóc vỏ rút chỉ", "Mực ống tươi",
      "Mực lá làm sạch", "Mực nang cắt hoa", "Bạch tuộc tươi làm sạch", "Sò điệp nửa vỏ",
      "Nghêu trắng làm sạch cát", "Sò huyết tươi", "Vẹm xanh tươi", "Cua biển thịt chắc",
      "Ghẹ xanh tươi sống", "Chả cá thác lác nguyên chất", "Chả cá thu pha sẵn", "Cá cơm tươi",
      "Cá kèo tươi sạch", "Tôm đất tự nhiên",
    ],
    prepVariants: [
      "tươi đánh bắt trong ngày", "sơ chế bỏ ruột đánh vảy", "cắt khoanh đều định lượng", "phi lê sạch xương",
      "bóc vỏ rút chỉ sẵn", "giữ lạnh ướp đá vảy", "chọn cỡ đồng đều", "đóng khay chuẩn nhà hàng",
      "đạt chuẩn VSATTP", "không chất bảo quản",
    ],
    origins: ["Vũng Tàu", "An Giang", "Phú Quốc", "Phan Thiết", "Na Uy (Nhập khẩu)"],
    units: ["kg", "khay", "thùng"],
    specs: ["Sơ chế sạch đóng khay 1kg", "Thùng lạnh 10kg", "Chọn đều cỡ theo khẩu phần", "Xe lạnh 0-2°C tận bếp"],
    images: [
      "/images/categories/dong-lanh.png",
      "/images/transition-cutouts/salmon-fillet.webp",
      "/images/transition-cutouts/seafood-scallop-shell.webp",
      "/images/transition-cutouts/fresh-squid.webp",
      "/images/food-cutouts/fresh-prawn.png",
      "/images/food-cutouts/fresh-sea-fish.png",
    ],
  },
  {
    slug: "hang-dong-lanh",
    categoryLabel: "Đông lạnh",
    baseNames: [
      "Khoai tây cọng Bỉ", "Khoai tây cắt múi cau", "Đậu Hà Lan đông lạnh", "Bắp hạt Mỹ đông lạnh",
      "Rau củ hỗn hợp 4 loại", "Tôm sú đông lạnh IQF", "Cá basa phi lê cấp đông", "Cá hồi cắt phần đông lạnh",
      "Mực vòng tẩm bột", "Tôm tẩm bột chiên xù", "Há cảo tôm đông lạnh", "Sủi cảo thịt heo",
      "Xíu mại hấp đông lạnh", "Chả giò rế hải sản", "Chả giò thịt truyền thống", "Xúc xích Đức xông khói",
      "Xúc xích heo tiệt trùng", "Cá viên chiên loại 1", "Bò viên gân cấp đông", "Tôm viên surimi",
      "Thanh cua Nhật Bản", "Gà rán popcorn", "Cánh gà tẩm vị cấp đông", "Đùi gà góc tư Mỹ đông lạnh",
      "Ba chỉ bò Mỹ cuộn đông", "Sườn heo nhập khẩu đông lạnh", "Bánh bao nhân thịt", "Bánh xếp Hàn Quốc Mandu",
      "Bạch tuộc baby cấp đông", "Sò điệp Nhật cấp đông",
    ],
    prepVariants: [
      "cấp đông sâu -18°C", "đóng túi 1kg tiện dụng", "thùng 10kg giá sỉ", "mạ băng dưới 10%",
      "nhập khẩu chính ngạch", "định lượng sẵn bếp ăn", "rã đông giữ nguyên vị", "chuẩn chuỗi lạnh âm sâu",
      "gói 2.5kg tiết kiệm", "hàng chuẩn xuất khẩu",
    ],
    origins: ["Bỉ (Nhập khẩu)", "Mỹ (Nhập khẩu)", "Nhật Bản", "Việt Nam (Xuất khẩu)", "Na Uy"],
    units: ["kg", "gói", "thùng", "khay"],
    specs: ["Gói 2.5kg (Thùng 4 gói)", "Thùng 10kg bảo quản -18°C", "Túi zip 1kg cấp đông IQF", "Giao xe đông lạnh chuyên dụng"],
    images: [
      "/images/tps1-frozen.png",
      "/images/transition-cutouts/salmon-fillet.webp",
      "/images/transition-cutouts/seafood-scallop-shell.webp",
      "/images/transition-cutouts/poultry-chicken-wings.webp",
      "/images/transition-cutouts/pork-belly-sliced.webp",
      "/images/transition-cutouts/sweet-corn.webp",
    ],
  },
  {
    slug: "gia-vi",
    categoryLabel: "Gia vị",
    baseNames: [
      "Nước mắm Phú Quốc 40 độ đạm", "Nước mắm cốt cá cơm", "Nước tương đậm đặc", "Dầu ăn thực vật tinh luyện",
      "Dầu đậu nành nguyên chất", "Dầu hào bào ngư", "Dầu mè thơm nguyên chất", "Tương ớt cay dịu",
      "Tương cà nguyên chất", "Tương đen ăn phở", "Hạt nêm thịt thăn xương ống", "Hạt nêm nấm hương chay",
      "Bột ngọt tinh khiết", "Đường cát trắng tinh luyện", "Đường phèn vàng", "Muối biển tinh i-ốt",
      "Muối hạt sạch", "Tiêu đen hạt Phú Quốc", "Tiêu sọ xay nhuyễn", "Bột nghệ vàng nguyên chất",
      "Bột cà ri Ấn Độ", "Ngũ vị hương truyền thống", "Sa tế tôm cay thơm", "Giấm gạo lên men tự nhiên",
      "Sốt mayonnaise bếp ăn", "Sốt ướp thịt nướng BBQ", "Sốt teriyaki Nhật", "Hoa hồi & quế thanh",
      "Gừng tỏi băm sẵn", "Sả ớt băm tươi",
    ],
    prepVariants: [
      "can lớn 5L bếp công nghiệp", "can 20L tiết kiệm", "bao 5kg chuyên bếp", "thùng 12 chai 1L",
      "gói 1kg đóng kín", "chuẩn hương vị bếp Việt", "nhập chính hãng có VAT", "hạn sử dụng dài",
      "bao 25kg giá sỉ", "đóng hũ tiện bảo quản",
    ],
    origins: ["Phú Quốc", "Việt Nam", "Thái Lan", "Hàn Quốc", "Nhật Bản"],
    units: ["can", "chai", "gói", "bao", "thùng"],
    specs: ["Can 5L hoặc thùng chai 1L", "Bao 5kg chuyên dụng bếp ăn", "Thùng 12 chai nguyên seal", "Đầy đủ công bố chất lượng & VAT"],
    images: [
      "/images/tps1-spices.png",
      "/images/categories/gia-vi.png",
      "/images/transition-cutouts/garnish-garlic-bulb.webp",
      "/images/transition-cutouts/garnish-lemongrass-stalks.webp",
      "/images/transition-cutouts/fresh-citrus.webp",
    ],
  },
  {
    slug: "do-kho",
    categoryLabel: "Đồ khô",
    baseNames: [
      "Gạo ST25 thơm dẻo", "Gạo Jasmine dẻo vừa", "Gạo Nàng Hoa bếp công nghiệp", "Gạo 64 mềm cơm suất ăn",
      "Gạo nếp cái hoa vàng", "Gạo lứt huyết rồng", "Miến dong nguyên chất", "Bún gạo khô sợi vừa",
      "Phở khô đặc sản", "Hủ tiếu khô Mỹ Tho", "Mì trứng sợi vàng", "Nui ống dài cao cấp",
      "Nấm mèo khô thái sợi", "Nấm hương khô nguyên tai", "Măng khô xé sợi", "Tàu hũ ky lá khô",
      "Đậu xanh cà vỏ", "Đậu đỏ hạt lớn", "Đậu đen xanh lòng", "Đậu phộng nhân sống",
      "Mè trắng rang sẵn", "Hạt sen khô Huế", "Táo đỏ khô Tân Cương", "Kỷ tử khô loại 1",
      "Bột năng tinh khiết", "Bột gạo lọc mịn", "Bột mì đa dụng", "Bột chiên giòn",
      "Hành phi giòn vàng", "Tỏi phi thơm giòn",
    ],
    prepVariants: [
      "bao 25kg giá sỉ", "bao 50kg cho bếp lớn", "túi 1kg hút ẩm", "thùng 10kg sạch sẽ",
      "không chất tẩy trắng", "chọn hạt đều đẹp", "lô mới thơm tự nhiên", "bảo quản kho khô đạt chuẩn",
      "đóng gói tiện định lượng", "giao định kỳ theo tuần",
    ],
    origins: ["Sóc Trăng", "Đồng Tháp", "Đồng Nai", "Tây Nguyên", "Tiền Giang"],
    units: ["kg", "bao", "gói", "thùng"],
    specs: ["Bao 25kg chuyên bếp công nghiệp", "Bao 1kg hút ẩm", "Thùng 10kg đóng gói kín", "Kiểm định ẩm độ & ATVSTP"],
    images: [
      "/images/categories/gia-vi.png",
      "/images/tps1-warehouse-wide.jpg",
      "/images/transition-cutouts/dry-rice-wooden-scoop.webp",
      "/images/transition-cutouts/fresh-mushroom.webp",
      "/images/transition-cutouts/sweet-corn.webp",
      "/images/transition-cutouts/garnish-garlic-bulb.webp",
    ],
  },
  {
    slug: "thuc-pham-chay",
    categoryLabel: "Thực phẩm chay",
    baseNames: [
      "Đậu hũ trắng non", "Đậu hũ chiên vàng giòn", "Đậu hũ trứng thanh mềm", "Chả lụa chay truyền thống",
      "Chả quế chay", "Chả giò chay rau củ", "Sườn non chay đậu nành", "Bò lát chay",
      "Gà lát chay", "Cá thu chay", "Tôm chay đạm thực vật", "Heo quay chay",
      "Ham chay cắt lát", "Xúc xích chay nấm", "Nấm đùi gà hữu cơ", "Nấm đông cô tươi",
      "Nấm bào ngư xám", "Nấm kim châm trắng", "Nấm rơm tròn búp", "Tàu hũ ky tươi",
      "Tàu hũ ky cuộn chiên", "Mì căn tươi luộc", "Bánh lọc chay nhân nấm", "Há cảo chay rau củ",
      "Viên thả lẩu chay", "Bò viên chay", "Cá viên chay", "Rong biển nấu canh",
      "Đậu hũ ky kho nấm", "Pate chay nấm hương",
    ],
    prepVariants: [
      "100% nguyên liệu thực vật", "không hàn the bảo quản", "tươi mới mỗi sáng", "đóng gói chuẩn trường học",
      "tiện sơ chế bếp bệnh viện", "định lượng theo mâm chay", "thơm ngon thanh đạm", "chứng nhận VSATTP",
      "đóng khay 500g - 1kg", "giao giữ mát 0-4°C",
    ],
    origins: ["TP.HCM", "Đồng Nai", "Đà Lạt", "Bình Dương"],
    units: ["kg", "đòn", "khay", "gói"],
    specs: ["Đòn 500g bọc lá chuối", "Khay 1kg giữ lạnh", "Gói 500g tiện chia suất", "Đạt chuẩn bếp ăn trường học & bệnh viện"],
    images: [
      "/images/categories/chay.png",
      "/images/transition-cutouts/fresh-mushroom.webp",
      "/images/transition-cutouts/fresh-broccoli.webp",
      "/images/transition-cutouts/fresh-tomato.webp",
      "/images/transition-cutouts/purple-cabbage.webp",
    ],
  },
  {
    slug: "thiet-bi-bep",
    categoryLabel: "Công cụ dụng cụ",
    baseNames: [
      "Dao bếp thái lọc Inox 304", "Dao chặt xương thép nguyên khối", "Dao gọt củ quả chuyên dụng", "Thớt nhựa kháng khuẩn HDPE",
      "Thớt gỗ nghiến công nghiệp", "Nồi nấu nước dùng Inox 50L", "Nồi Inox 3 đáy 30L", "Chảo thép carbon bếp Á",
      "Chảo chống dính sâu lòng 36cm", "Khay Inox GN 1/1 sâu 10cm", "Khay Inox GN 1/2 có nắp", "Khay cơm 5 ngăn Inox 304",
      "Vá múc canh Inox cán dài", "Muôi thủng vớt mì Inox", "Kẹp gắp thực phẩm Inox 30cm", "Âu trộn thực phẩm Inox 40cm",
      "Rổ lưới Inox sơ chế rau", "Thau Inox lớn 50cm", "Phới lồng đánh trứng Inox", "Cân điện tử nhà bếp 30kg",
      "Màng bọc thực phẩm cuộn lớn", "Giấy bạc nướng cuộn 5kg", "Găng tay nitrile sơ chế thực phẩm", "Khẩu trang & nón lưới bếp",
      "Tạp dề chống thấm dầu mỡ", "Ủng cao su trắng bếp công nghiệp", "Hộp nhựa thực phẩm nắp kín 5L", "Thùng đá giữ nhiệt 45L",
      "Xe đẩy khay cơm 3 tầng Inox", "Nhiệt kế đo tâm thực phẩm điện tử",
    ],
    prepVariants: [
      "chuẩn Inox 304 an toàn", "bền bỉ cho bếp công nghiệp", "dễ vệ sinh khử khuẩn", "chống gỉ sét cao cấp",
      "tiêu chuẩn HACCP nhà bếp", "đặt chung đơn thực phẩm", "kích thước chuẩn nhà hàng", "giá sỉ cho dự án bếp",
      "hàng chính hãng có VAT", "bảo hành chất lượng TPS1",
    ],
    origins: ["Việt Nam", "Chính hãng Inox 304", "Nhật Bản", "Đức"],
    units: ["cái", "bộ", "cuộn", "hộp", "thùng"],
    specs: ["Inox 304 dày chuẩn bếp ăn", "Kích thước công nghiệp 40x60cm", "Thùng quy cách bếp lớn", "Hóa đơn VAT đầy đủ"],
    images: [
      "/images/tps1_tools_placeholder.png",
      "/images/tps1-kitchen.png",
      "/images/transition-cutouts/tool-cutting-board.webp",
      "/images/transition-cutouts/tool-chef-knife.webp",
      "/images/transition-cutouts/tool-stainless-pot.webp",
      "/images/transition-cutouts/tool-wok-pan.webp",
    ],
  },
];

function buildMockCatalog3000(): SkuProduct[] {
  const featured: SkuProduct[] = [
    { id: "1", slug: "cai-ngot-da-lat", name: "Cải ngọt Đà Lạt sạch chuẩn VietGAP", category: "rau-cu-qua", categoryLabel: "Rau củ quả", unit: "kg", price: 0, image: "/images/tps1-vegetables.png", origin: "Đà Lạt (VietGAP)", spec: "Túi 1kg sơ chế sạch gốc" },
    { id: "2", slug: "thit-ba-roi-heo", name: "Thịt ba rọi heo tươi chuẩn kiểm dịch", category: "thit-heo", categoryLabel: "Thịt heo", unit: "kg", price: 0, image: "/images/tps1-meat-seafood.png", origin: "Đồng Nai (Kiểm dịch)", spec: "Cắt lát hoặc nguyên tảng theo ca" },
    { id: "3", slug: "than-bo-uc", name: "Thăn bò Úc phi lê mềm cho nhà hàng", category: "thit-bo", categoryLabel: "Thịt bò", unit: "kg", price: 0, image: "/images/categories/thit-ca.png", origin: "Nhập khẩu Úc", spec: "Cây hút chân không 1 - 2kg" },
    { id: "4", slug: "ga-ta-tha-vuon", name: "Gà ta thả vườn làm sạch nguyên con", category: "gia-cam", categoryLabel: "Gia cầm", unit: "kg", price: 0, image: "/images/industries/bep-an-tap-the-vn.png", origin: "Đồng Nai", spec: "Nguyên con 1.4 - 1.6kg" },
    { id: "5", slug: "ca-basa-fillet", name: "Cá basa fillet đông lạnh xuất khẩu", category: "hai-san", categoryLabel: "Hải sản", unit: "kg", price: 0, image: "/images/categories/dong-lanh.png", origin: "An Giang", spec: "Thùng 10kg mạ băng < 10%" },
    { id: "6", slug: "khoai-tay-dong-lanh", name: "Khoai tây cọng Bỉ đông lạnh đóng túi", category: "hang-dong-lanh", categoryLabel: "Đông lạnh", unit: "kg", price: 0, image: "/images/tps1-frozen.png", origin: "Bỉ (Nhập khẩu)", spec: "Gói 2.5kg (Thùng 4 gói)" },
    { id: "7", slug: "nuoc-mam-phu-quoc", name: "Nước mắm Phú Quốc 40 độ đạm", category: "gia-vi", categoryLabel: "Gia vị", unit: "chai", price: 0, image: "/images/tps1-spices.png", origin: "Phú Quốc", spec: "Can 5L hoặc thùng chai 1L" },
    { id: "8", slug: "nam-meo-kho", name: "Nấm mèo khô thái sợi cho bếp công nghiệp", category: "do-kho", categoryLabel: "Đồ khô", unit: "kg", price: 0, image: "/images/categories/gia-vi.png", origin: "Đồng Nai", spec: "Bao 1kg hút ẩm" },
    { id: "9", slug: "cha-lua-chay", name: "Chả lụa chay sạch truyền thống", category: "thuc-pham-chay", categoryLabel: "Thực phẩm chay", unit: "đòn", price: 0, image: "/images/categories/chay.png", origin: "TP.HCM", spec: "Đòn 500g bọc lá chuối" },
    { id: "10", slug: "dao-bep-chuyen-dung", name: "Dao bếp thái lọc Inox chuyên dụng", category: "thiet-bi-bep", categoryLabel: "Công cụ dụng cụ", unit: "cái", price: 0, image: "/images/tps1_tools_placeholder.png", origin: "Chính hãng", spec: "Lưỡi dài 20cm Inox 304" },
    { id: "11", slug: "thot-nhua-bep-an", name: "Thớt nhựa kháng khuẩn chuyên bếp nhà hàng", category: "thiet-bi-bep", categoryLabel: "Công cụ dụng cụ", unit: "cái", price: 0, image: "/images/tps1-kitchen.png", origin: "Việt Nam", spec: "Kích thước lớn 40x60cm dày 3cm" },
  ];

  const countByCat = new Map<string, number>();
  for (const item of featured) {
    countByCat.set(item.category, (countByCat.get(item.category) ?? 0) + 1);
  }

  const all: SkuProduct[] = [...featured];
  let nextId = featured.length + 1;

  // Fill each of the 10 groups up to exactly 300 items => 3,000 products total
  for (const spec of SEED_SPECS) {
    const existing = countByCat.get(spec.slug) ?? 0;
    const needed = Math.max(0, 300 - existing);
    for (let i = 0; i < needed; i += 1) {
      const base = spec.baseNames[i % spec.baseNames.length];
      const prep = spec.prepVariants[Math.floor(i / spec.baseNames.length) % spec.prepVariants.length];
      const code = String(i + 1).padStart(3, "0");
      const id = String(nextId++);
      all.push({
        id,
        slug: `${spec.slug}-${code}`,
        name: `${base} ${prep} (Mã #${code})`,
        category: spec.slug,
        categoryLabel: spec.categoryLabel,
        unit: spec.units[i % spec.units.length],
        price: 0,
        image: spec.images[i % spec.images.length],
        origin: spec.origins[i % spec.origins.length],
        spec: spec.specs[i % spec.specs.length],
      });
    }
  }

  return all;
}

export const MOCK_PRODUCTS: SkuProduct[] = buildMockCatalog3000();

type IndexedMockProduct = {
  product: SkuProduct;
  searchText: string;
};

function foldVietnamese(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase();
}

const {
  allIndexed: MOCK_INDEXED_ALL,
  byCategory: MOCK_INDEXED_BY_CATEGORY,
  categoryCounts: MOCK_CATEGORY_COUNTS,
} = (() => {
  const allIndexed: IndexedMockProduct[] = new Array(MOCK_PRODUCTS.length);
  const byCategory = new Map<string, IndexedMockProduct[]>();
  const categoryCounts: Record<string, number> = { "": MOCK_PRODUCTS.length };

  for (let i = 0; i < MOCK_PRODUCTS.length; i += 1) {
    const product = MOCK_PRODUCTS[i];
    const entry: IndexedMockProduct = {
      product,
      searchText: foldVietnamese(
        `${product.name} ${product.categoryLabel} ${product.origin ?? ""} ${product.spec ?? ""}`
      ),
    };
    allIndexed[i] = entry;
    let bucket = byCategory.get(product.category);
    if (!bucket) {
      bucket = [];
      byCategory.set(product.category, bucket);
    }
    bucket.push(entry);
    categoryCounts[product.category] = (categoryCounts[product.category] ?? 0) + 1;
  }

  return { allIndexed, byCategory, categoryCounts };
})();

export function isSkuCatalogConfigured() {
  return Boolean(process.env.SUPABASE_PRODUCTS_URL && process.env.SUPABASE_PRODUCTS_ANON_KEY);
}

export async function getSkuPage(params: {
  group?: string;
  q?: string;
  page?: number;
  // Seconds to cache the Supabase response in the Next.js data cache; 0 = no-store.
  revalidate?: number;
}): Promise<SkuPage> {
  const url = process.env.SUPABASE_PRODUCTS_URL || "";
  const key = process.env.SUPABASE_PRODUCTS_ANON_KEY || "";
  if (!url || !key) {
    const requestedPage = Math.max(1, Math.floor(params.page ?? 1));
    const group = findSkuGroup(params.group);
    let bucket: IndexedMockProduct[];
    if (group) {
      bucket = MOCK_INDEXED_BY_CATEGORY.get(group.slug) ?? [];
    } else if (params.group && params.group !== "all") {
      bucket = MOCK_INDEXED_BY_CATEGORY.get(params.group) ?? [];
    } else {
      bucket = MOCK_INDEXED_ALL;
    }

    const rawQuery = params.q?.trim() ?? "";
    let matched: IndexedMockProduct[] = bucket;
    if (rawQuery) {
      const tokens = foldVietnamese(rawQuery).split(/\s+/).filter(Boolean);
      if (tokens.length > 0) {
        matched = bucket.filter((entry) =>
          tokens.every((token) => entry.searchText.includes(token))
        );
      }
    }

    const totalCount = matched.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / SKU_PAGE_SIZE));
    const safePage = Math.min(requestedPage, totalPages);
    const offset = (safePage - 1) * SKU_PAGE_SIZE;
    const products = matched
      .slice(offset, offset + SKU_PAGE_SIZE)
      .map((entry) => entry.product);

    return {
      products,
      totalCount,
      totalPages,
      page: safePage,
      pageSize: SKU_PAGE_SIZE,
      categoryCounts: MOCK_CATEGORY_COUNTS,
    };
  }

  const page = Math.max(1, Math.floor(params.page ?? 1));
  const offset = (page - 1) * SKU_PAGE_SIZE;

  const qs = new URLSearchParams({
    select: "id,local_product_id,name,category,unit,price_retail,price_wholesale,image_url",
    active: "eq.true",
    order: "category.desc,name.asc",
    limit: String(SKU_PAGE_SIZE),
    offset: String(offset),
  });

  const group = findSkuGroup(params.group);
  if (group) qs.set("category", inList(group.categories));

  const q = params.q?.trim();
  if (q) qs.set("name", `ilike.*${q}*`);

  const revalidate = params.revalidate ?? 0;
  const res = await fetch(`${url}/rest/v1/products?${qs.toString()}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
      Prefer: "count=exact",
    },
    ...(revalidate > 0 ? { next: { revalidate } } : { cache: "no-store" as const }),
  });

  // PostgREST answers 416 when the offset is past the last row.
  if (res.status === 416) {
    const total = res.headers.get("content-range")?.match(/\/(\d+)/);
    const totalCount = total ? parseInt(total[1], 10) : 0;
    return { products: [], totalCount, totalPages: Math.max(1, Math.ceil(totalCount / SKU_PAGE_SIZE)), page, pageSize: SKU_PAGE_SIZE };
  }

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Supabase products ${res.status}: ${txt.slice(0, 200)}`);
  }

  const raw = (await res.json()) as RawProduct[];
  const match = res.headers.get("content-range")?.match(/\/(\d+)/);
  const totalCount = match ? parseInt(match[1], 10) : raw.length;

  const products = raw.map((p): SkuProduct => {
    const rowGroup = groupForCategory(p.category);
    const id = String(p.local_product_id || p.id);
    return {
      id,
      slug: id,
      name: p.name,
      category: rowGroup?.slug ?? "other",
      categoryLabel: p.category || "",
      unit: (p.unit || "kg").toLowerCase(),
      price: Number(p.price_retail) || Number(p.price_wholesale) || 0,
      image: p.image_url || rowGroup?.image || "/images/tps1-cover-food.jpg",
    };
  });

  return {
    products,
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / SKU_PAGE_SIZE)),
    page,
    pageSize: SKU_PAGE_SIZE,
  };
}
