export type CutoutShape = "long" | "round" | "flat";

export type CategoryCutoutAsset = {
  id: string;
  src: string;
  alt: string;
  /** Semantic type used to ensure two items of the same kind are never placed adjacent */
  kind: string;
  /** Silhouette geometry used to keep visual rhythm balanced across depth layers */
  shape: CutoutShape;
  /** Secondary botanical / aromatic garnish accent (target 2-3 per run) */
  isGarnish?: boolean;
};

export type CategoryTransitionConfig = {
  slug: string;
  label: string;
  labelEn: string;
  shortDesc: string;
  shortDescEn: string;
  previewImage: string;
  featuredBadge?: string;
  featuredBadgeEn?: string;
  /** Primary deep outer tone (opaque backdrop edge) */
  overlayColor: string;
  /** Brighter rich center tone for 2-tone cinematic radial gradient */
  overlayCenterColor: string;
  /** Soft luminous glow behind center typography (rendered at opacity 0.25 + heavy blur) */
  overlayGlowColor: string;
  /** Curated unique cutout pool (no repeated image within a run) */
  cutouts: CategoryCutoutAsset[];
  /** Missing items documented in docs/transition-assets-needed.md */
  missingCutouts: string[];
};

const CUTOUTS = {
  // ── High-res studio cutouts (840px RGBA WebP, unified top-left softbox lighting) ──
  porkBellySlab: {
    id: "fresh-pork-belly",
    src: "/images/transition-cutouts/fresh-pork-belly.webp",
    alt: "Thịt ba rọi heo nguyên miếng",
    kind: "pork-belly-slab",
    shape: "flat",
  },
  porkBellySliced: {
    id: "pork-belly-sliced",
    src: "/images/transition-cutouts/pork-belly-sliced.webp",
    alt: "Thịt ba rọi heo cắt lát dày",
    kind: "pork-belly-sliced",
    shape: "flat",
  },
  porkRibs: {
    id: "pork-baby-back-ribs",
    src: "/images/transition-cutouts/pork-baby-back-ribs.webp",
    alt: "Sườn non heo tươi nguyên dẻ",
    kind: "pork-ribs",
    shape: "long",
  },
  porkChop: {
    id: "pork-chop-cutlet",
    src: "/images/transition-cutouts/pork-chop-cutlet.webp",
    alt: "Sườn cốt lết heo có xương",
    kind: "pork-chop",
    shape: "round",
  },
  porkTenderloin: {
    id: "pork-tenderloin",
    src: "/images/transition-cutouts/pork-tenderloin.webp",
    alt: "Nạc thăn heo nguyên cây",
    kind: "pork-loin",
    shape: "long",
  },
  porkMarrowBones: {
    id: "pork-marrow-bones",
    src: "/images/transition-cutouts/pork-marrow-bones.webp",
    alt: "Xương ống heo tươi cắt sạch",
    kind: "pork-bone",
    shape: "long",
  },
  porkMinced: {
    id: "pork-minced-fresh",
    src: "/images/transition-cutouts/pork-minced-fresh.webp",
    alt: "Thịt heo xay tươi trong chén sơ chế",
    kind: "pork-minced",
    shape: "round",
  },

  beefRibeye: {
    id: "beef-ribeye-steak",
    src: "/images/transition-cutouts/beef-ribeye-steak.webp",
    alt: "Thịt thăn bò ribeye vân cẩm thạch",
    kind: "beef-steak",
    shape: "flat",
  },
  beefTenderloin: {
    id: "beef-tenderloin-medallion",
    src: "/images/transition-cutouts/beef-tenderloin-medallion.webp",
    alt: "Thăn nội bò cắt khoanh dày",
    kind: "beef-medallion",
    shape: "round",
  },
  beefBrisket: {
    id: "beef-brisket-slab",
    src: "/images/transition-cutouts/beef-brisket-slab.webp",
    alt: "Gầu bò nguyên miếng vân mỡ nạc",
    kind: "beef-brisket",
    shape: "flat",
  },
  beefShankCross: {
    id: "beef-shank-cross",
    src: "/images/transition-cutouts/beef-shank-cross.webp",
    alt: "Bắp bò cắt khoanh hoa gân",
    kind: "beef-shank",
    shape: "round",
  },
  beefFlankStrip: {
    id: "beef-flank-strip",
    src: "/images/transition-cutouts/beef-flank-strip.webp",
    alt: "Nạm bò dải dài thớ thịt rõ",
    kind: "beef-flank",
    shape: "long",
  },
  beefShabuRolls: {
    id: "beef-shabu-rolls",
    src: "/images/transition-cutouts/beef-shabu-rolls.webp",
    alt: "Thịt bò thái lát mỏng cuộn tròn",
    kind: "beef-rolls",
    shape: "round",
  },

  chickenDrumstick: {
    id: "raw-chicken-drumstick",
    src: "/images/transition-cutouts/raw-chicken-drumstick.webp",
    alt: "Đùi gà tươi sạch",
    kind: "poultry-drumstick",
    shape: "long",
  },
  chickenBreast: {
    id: "poultry-chicken-breast",
    src: "/images/transition-cutouts/poultry-chicken-breast.webp",
    alt: "Ức gà phi lê tươi",
    kind: "poultry-breast",
    shape: "flat",
  },
  chickenWings: {
    id: "poultry-chicken-wings",
    src: "/images/transition-cutouts/poultry-chicken-wings.webp",
    alt: "Cánh gà tươi ba khúc",
    kind: "poultry-wings",
    shape: "flat",
  },
  duckBreast: {
    id: "poultry-duck-breast",
    src: "/images/transition-cutouts/poultry-duck-breast.webp",
    alt: "Ức vịt tươi có da",
    kind: "poultry-duck",
    shape: "flat",
  },

  salmonFillet: {
    id: "salmon-fillet",
    src: "/images/transition-cutouts/salmon-fillet.webp",
    alt: "Cá hồi phi lê tươi",
    kind: "seafood-salmon",
    shape: "long",
  },
  scallopShell: {
    id: "seafood-scallop-shell",
    src: "/images/transition-cutouts/seafood-scallop-shell.webp",
    alt: "Sò điệp tươi nửa vỏ",
    kind: "seafood-shellfish",
    shape: "round",
  },
  squidFresh: {
    id: "fresh-squid",
    src: "/images/transition-cutouts/fresh-squid.webp",
    alt: "Mực ống tươi",
    kind: "seafood-squid",
    shape: "long",
  },

  carrot: {
    id: "fresh-carrot",
    src: "/images/transition-cutouts/fresh-carrot.webp",
    alt: "Cà rốt Đà Lạt tươi",
    kind: "veg-root",
    shape: "long",
  },
  broccoli: {
    id: "fresh-broccoli",
    src: "/images/transition-cutouts/fresh-broccoli.webp",
    alt: "Bông cải xanh Đà Lạt",
    kind: "veg-floret",
    shape: "round",
  },
  tomato: {
    id: "fresh-tomato",
    src: "/images/transition-cutouts/fresh-tomato.webp",
    alt: "Cà chua chín đỏ",
    kind: "veg-fruit",
    shape: "round",
  },
  corn: {
    id: "sweet-corn",
    src: "/images/transition-cutouts/sweet-corn.webp",
    alt: "Bắp ngọt tươi",
    kind: "veg-cob",
    shape: "long",
  },
  purpleCabbage: {
    id: "purple-cabbage",
    src: "/images/transition-cutouts/purple-cabbage.webp",
    alt: "Bắp cải tím tươi",
    kind: "veg-cabbage",
    shape: "round",
  },
  mushroom: {
    id: "fresh-mushroom",
    src: "/images/transition-cutouts/fresh-mushroom.webp",
    alt: "Nấm đùi gà tươi",
    kind: "veg-mushroom",
    shape: "round",
  },
  citrus: {
    id: "fresh-citrus",
    src: "/images/transition-cutouts/fresh-citrus.webp",
    alt: "Cam tươi mọng nước",
    kind: "fruit-citrus",
    shape: "round",
  },

  garlicBulb: {
    id: "garnish-garlic-bulb",
    src: "/images/transition-cutouts/garnish-garlic-bulb.webp",
    alt: "Củ và tép tỏi tươi",
    kind: "garnish-garlic",
    shape: "round",
    isGarnish: true,
  },
  lemongrass: {
    id: "garnish-lemongrass-stalks",
    src: "/images/transition-cutouts/garnish-lemongrass-stalks.webp",
    alt: "Cây sả tươi cắt vát",
    kind: "garnish-herb",
    shape: "long",
    isGarnish: true,
  },

  dryRiceScoop: {
    id: "dry-rice-wooden-scoop",
    src: "/images/transition-cutouts/dry-rice-wooden-scoop.webp",
    alt: "Muỗng gỗ đựng gạo thơm hạt dài",
    kind: "dry-rice",
    shape: "round",
  },

  cuttingBoard: {
    id: "tool-cutting-board",
    src: "/images/transition-cutouts/tool-cutting-board.webp",
    alt: "Thớt gỗ bếp chuyên nghiệp",
    kind: "tool-board",
    shape: "flat",
  },
  chefKnife: {
    id: "tool-chef-knife",
    src: "/images/transition-cutouts/tool-chef-knife.webp",
    alt: "Dao bếp inox lưỡi phay xước cán gỗ",
    kind: "tool-knife",
    shape: "long",
  },
  stainlessPot: {
    id: "tool-stainless-pot",
    src: "/images/transition-cutouts/tool-stainless-pot.webp",
    alt: "Nồi inox công nghiệp bếp ăn",
    kind: "tool-pot",
    shape: "round",
  },
  wokPan: {
    id: "tool-wok-pan",
    src: "/images/transition-cutouts/tool-wok-pan.webp",
    alt: "Chảo thép carbon cán dài bếp Á",
    kind: "tool-wok",
    shape: "flat",
  },

  // ── Existing clean cutouts (300px legacy PNG — scheduled for 840px upgrade in docs/transition-assets-needed.md) ──
  bokChoy: {
    id: "fresh-bok-choy",
    src: "/images/food-cutouts/fresh-bok-choy.png",
    alt: "Cải thìa xanh tươi",
    kind: "veg-leaf-long",
    shape: "long",
  },
  cabbageGreen: {
    id: "fresh-cabbage-green",
    src: "/images/food-cutouts/fresh-cabbage-green.png",
    alt: "Bắp cải xanh Đà Lạt",
    kind: "veg-cabbage-green",
    shape: "round",
  },
  lettuce: {
    id: "fresh-lettuce",
    src: "/images/food-cutouts/fresh-lettuce.png",
    alt: "Xà lách xanh tươi",
    kind: "veg-leaf-round",
    shape: "round",
  },
  cucumber: {
    id: "fresh-cucumber",
    src: "/images/food-cutouts/fresh-cucumber.png",
    alt: "Dưa leo xanh tươi",
    kind: "veg-gourd",
    shape: "long",
  },
  bellPepper: {
    id: "red-bell-pepper",
    src: "/images/food-cutouts/red-bell-pepper.png",
    alt: "Ớt chuông đỏ Đà Lạt",
    kind: "garnish-pepper",
    shape: "round",
    isGarnish: true,
  },
  avocado: {
    id: "fresh-avocado",
    src: "/images/food-cutouts/fresh-avocado.png",
    alt: "Bơ sáp Đà Lạt",
    kind: "veg-avocado",
    shape: "round",
  },
  potato: {
    id: "fresh-potato",
    src: "/images/food-cutouts/fresh-potato.png",
    alt: "Khoai tây Đà Lạt",
    kind: "veg-tuber",
    shape: "round",
  },
  eggs: {
    id: "fresh-eggs-pair",
    src: "/images/food-cutouts/fresh-eggs-pair.png",
    alt: "Trứng gà tươi sạch",
    kind: "poultry-egg",
    shape: "round",
  },
  seaFish: {
    id: "fresh-sea-fish",
    src: "/images/food-cutouts/fresh-sea-fish.png",
    alt: "Cá biển tươi",
    kind: "seafood-whole-fish",
    shape: "long",
  },
  prawn: {
    id: "fresh-prawn",
    src: "/images/food-cutouts/fresh-prawn.png",
    alt: "Tôm sú tươi",
    kind: "seafood-shrimp",
    shape: "round",
  },
  gingerGarlic: {
    id: "fresh-ginger-garlic",
    src: "/images/food-cutouts/fresh-ginger-garlic.png",
    alt: "Gừng và tỏi tươi",
    kind: "garnish-ginger",
    shape: "flat",
    isGarnish: true,
  },
  lemon: {
    id: "fresh-pineapple-lemon",
    src: "/images/food-cutouts/fresh-pineapple-lemon.png",
    alt: "Chanh vàng tươi",
    kind: "garnish-citrus",
    shape: "round",
    isGarnish: true,
  },
} as const satisfies Record<string, CategoryCutoutAsset>;

export const CATEGORY_TRANSITION_CONFIG: Record<string, CategoryTransitionConfig> = {
  "rau-cu-qua": {
    slug: "rau-cu-qua",
    label: "Rau củ quả",
    labelEn: "Produce",
    shortDesc: "Rau ăn lá, củ quả và trái cây Đà Lạt sơ chế sạch, giao sớm mỗi sáng.",
    shortDescEn: "Fresh Dalat leafy greens, roots and fruit delivered early every morning.",
    previewImage: "/images/categories/rau-cu-qua.png",
    featuredBadge: "Bán chạy",
    featuredBadgeEn: "Best seller",
    overlayColor: "#0F3D2B",
    overlayCenterColor: "#1F6B47",
    overlayGlowColor: "#4ADE80",
    cutouts: [
      CUTOUTS.carrot,
      CUTOUTS.broccoli,
      CUTOUTS.tomato,
      CUTOUTS.corn,
      CUTOUTS.purpleCabbage,
      CUTOUTS.mushroom,
      CUTOUTS.citrus,
      CUTOUTS.bokChoy,
      CUTOUTS.cabbageGreen,
      CUTOUTS.lettuce,
      CUTOUTS.cucumber,
      CUTOUTS.bellPepper,
      CUTOUTS.avocado,
      CUTOUTS.potato,
      CUTOUTS.garlicBulb,
      CUTOUTS.lemongrass,
      CUTOUTS.lemon,
    ],
    missingCutouts: ["cải thảo", "ớt chuông vàng", "cải bó xôi", "hành lá", "củ cải trắng", "bí đỏ"],
  },
  "thit-heo": {
    slug: "thit-heo",
    label: "Thịt heo",
    labelEn: "Pork",
    shortDesc: "Ba rọi, nạc vai, sườn non pha lóc theo quy cách bếp, đủ chứng từ kiểm dịch.",
    shortDescEn: "Pork belly, shoulder and ribs portioned to kitchen specs with inspection docs.",
    previewImage: "/images/tps1-meat-seafood.png",
    featuredBadge: "Bán chạy",
    featuredBadgeEn: "Best seller",
    overlayColor: "#3A1517",
    overlayCenterColor: "#7A2C2A",
    overlayGlowColor: "#F87171",
    cutouts: [
      CUTOUTS.porkBellySlab,
      CUTOUTS.porkBellySliced,
      CUTOUTS.porkRibs,
      CUTOUTS.porkChop,
      CUTOUTS.porkTenderloin,
      CUTOUTS.porkMarrowBones,
      CUTOUTS.porkMinced,
      CUTOUTS.garlicBulb,
      CUTOUTS.lemongrass,
      CUTOUTS.gingerGarlic,
      CUTOUTS.bellPepper,
    ],
    missingCutouts: [
      "thịt vai heo",
      "nạc dăm",
      "chân giò heo khoanh tròn",
      "thịt heo thái mỏng cuộn",
      "hành tím",
      "ớt đỏ tươi",
      "lá thơm & tiêu hạt",
    ],
  },
  "thit-bo": {
    slug: "thit-bo",
    label: "Thịt bò",
    labelEn: "Beef",
    shortDesc: "Thăn nội, phi lê, nạm gân chọn phần theo món xào, hầm và bít tết.",
    shortDescEn: "Tenderloin, fillet and brisket selected for stir-fry, stew and steak menus.",
    previewImage: "/images/categories/thit-ca.png",
    overlayColor: "#3A1517",
    overlayCenterColor: "#7A2C2A",
    overlayGlowColor: "#FB7185",
    cutouts: [
      CUTOUTS.beefRibeye,
      CUTOUTS.beefTenderloin,
      CUTOUTS.beefBrisket,
      CUTOUTS.beefShankCross,
      CUTOUTS.beefFlankStrip,
      CUTOUTS.beefShabuRolls,
      CUTOUTS.garlicBulb,
      CUTOUTS.lemongrass,
      CUTOUTS.gingerGarlic,
      CUTOUTS.mushroom,
      CUTOUTS.tomato,
    ],
    missingCutouts: [
      "gân bò",
      "bò cắt khối hầm",
      "hương thảo & tiêu đen",
      "ớt đỏ tươi",
    ],
  },
  "gia-cam": {
    slug: "gia-cam",
    label: "Gia cầm",
    labelEn: "Poultry",
    shortDesc: "Gà, vịt nguyên con hoặc chia phần đùi, cánh, ức kèm trứng sạch mỗi ngày.",
    shortDescEn: "Whole or portioned chicken, duck and fresh farm eggs for daily menus.",
    previewImage: "/images/industries/bep-an-tap-the-vn.png",
    overlayColor: "#3D2A12",
    overlayCenterColor: "#8A5A20",
    overlayGlowColor: "#FBBF24",
    cutouts: [
      CUTOUTS.chickenDrumstick,
      CUTOUTS.chickenBreast,
      CUTOUTS.chickenWings,
      CUTOUTS.duckBreast,
      CUTOUTS.eggs,
      CUTOUTS.lemongrass,
      CUTOUTS.garlicBulb,
      CUTOUTS.gingerGarlic,
      CUTOUTS.lemon,
    ],
    missingCutouts: ["gà ta nguyên con", "đùi góc tư gà", "trứng cút", "chân gà", "đùi vịt", "lá chanh"],
  },
  "hai-san": {
    slug: "hai-san",
    label: "Hải sản",
    labelEn: "Seafood",
    shortDesc: "Cá, tôm, mực chọn cỡ đều tay, sơ chế sẵn và giữ lạnh suốt tuyến giao.",
    shortDescEn: "Consistent-grade fish, shrimp and squid kept chilled from dock to kitchen.",
    previewImage: "/images/categories/dong-lanh.png",
    featuredBadge: "Bán chạy",
    featuredBadgeEn: "Best seller",
    overlayColor: "#0C2F45",
    overlayCenterColor: "#1E6A8C",
    overlayGlowColor: "#38BDF8",
    cutouts: [
      CUTOUTS.salmonFillet,
      CUTOUTS.scallopShell,
      CUTOUTS.squidFresh,
      CUTOUTS.seaFish,
      CUTOUTS.prawn,
      CUTOUTS.lemon,
      CUTOUTS.lemongrass,
      CUTOUTS.garlicBulb,
      CUTOUTS.gingerGarlic,
    ],
    missingCutouts: ["cua biển", "cá thu cắt khoanh", "bạch tuộc tươi", "vẹm xanh", "nghêu trắng", "viên đá lạnh", "thì là"],
  },
  "hang-dong-lanh": {
    slug: "hang-dong-lanh",
    label: "Hàng đông lạnh",
    labelEn: "Frozen",
    shortDesc: "Thịt, hải sản và thực phẩm chế biến cấp đông sâu chuẩn nhiệt độ âm.",
    shortDescEn: "Deep-frozen meats, seafood and prepared goods held at sub-zero cold chain.",
    previewImage: "/images/tps1-frozen.png",
    overlayColor: "#12303B",
    overlayCenterColor: "#4C93A8",
    overlayGlowColor: "#7DD3FC",
    cutouts: [
      CUTOUTS.salmonFillet,
      CUTOUTS.scallopShell,
      CUTOUTS.squidFresh,
      CUTOUTS.prawn,
      CUTOUTS.chickenWings,
      CUTOUTS.chickenBreast,
      CUTOUTS.chickenDrumstick,
      CUTOUTS.porkBellySliced,
      CUTOUTS.beefRibeye,
      CUTOUTS.beefShabuRolls,
      CUTOUTS.corn,
      CUTOUTS.potato,
    ],
    missingCutouts: ["viên đá lạnh & tinh thể băng", "há cảo / sủi cảo cấp đông", "tôm đông đóng khối", "đậu Hà Lan & bắp phủ sương"],
  },
  "gia-vi": {
    slug: "gia-vi",
    label: "Gia vị",
    labelEn: "Seasonings",
    shortDesc: "Nước mắm, dầu ăn, muối, tiêu và gia vị Việt, Hoa, Hàn, Âu đóng gói lớn.",
    shortDescEn: "Bulk fish sauce, oils, salt, pepper and Asian-Western kitchen seasonings.",
    previewImage: "/images/tps1-spices.png",
    overlayColor: "#40220C",
    overlayCenterColor: "#A3541B",
    overlayGlowColor: "#FB923C",
    cutouts: [
      CUTOUTS.garlicBulb,
      CUTOUTS.lemongrass,
      CUTOUTS.gingerGarlic,
      CUTOUTS.bellPepper,
      CUTOUTS.lemon,
      CUTOUTS.citrus,
      CUTOUTS.tomato,
      CUTOUTS.carrot,
    ],
    missingCutouts: ["hoa hồi & quế thanh", "chén muối biển hạt", "tiêu đen nguyên hạt", "ớt khô", "chai nước mắm", "bình dầu ăn", "củ nghệ tươi"],
  },
  "do-kho": {
    slug: "do-kho",
    label: "Đồ khô",
    labelEn: "Dry goods",
    shortDesc: "Gạo, đậu, bún miến, nấm khô đặt chung tuyến định kỳ cùng hàng tươi.",
    shortDescEn: "Rice, legumes, dried noodles and mushrooms scheduled with fresh deliveries.",
    previewImage: "/images/categories/gia-vi.png",
    overlayColor: "#3B2D1A",
    overlayCenterColor: "#8C6A3A",
    overlayGlowColor: "#FDE68A",
    cutouts: [
      CUTOUTS.dryRiceScoop,
      CUTOUTS.mushroom,
      CUTOUTS.corn,
      CUTOUTS.potato,
      CUTOUTS.garlicBulb,
      CUTOUTS.gingerGarlic,
      CUTOUTS.lemongrass,
      CUTOUTS.carrot,
    ],
    missingCutouts: ["vắt miến / bún khô", "nấm hương khô", "mộc nhĩ khô", "đậu đỏ", "đậu xanh", "hạt sen khô", "hạt điều"],
  },
  "thuc-pham-chay": {
    slug: "thuc-pham-chay",
    label: "Thực phẩm chay",
    labelEn: "Vegetarian",
    shortDesc: "Đậu hũ, nấm, rau lá và chả chay thanh đạm cho thực đơn chay định kỳ.",
    shortDescEn: "Tofu, mushrooms, fresh greens and plant-based specialties for meatless days.",
    previewImage: "/images/categories/chay.png",
    overlayColor: "#16371F",
    overlayCenterColor: "#4E8A3D",
    overlayGlowColor: "#86EFAC",
    cutouts: [
      CUTOUTS.mushroom,
      CUTOUTS.broccoli,
      CUTOUTS.bokChoy,
      CUTOUTS.lettuce,
      CUTOUTS.avocado,
      CUTOUTS.tomato,
      CUTOUTS.purpleCabbage,
      CUTOUTS.corn,
      CUTOUTS.carrot,
      CUTOUTS.garlicBulb,
      CUTOUTS.lemongrass,
    ],
    missingCutouts: ["đậu hũ tươi", "đậu hũ chiên", "nấm đông cô tươi", "nấm kim châm", "lát củ sen"],
  },
  "thiet-bi-bep": {
    slug: "thiet-bi-bep",
    label: "Dụng cụ bếp",
    labelEn: "Kitchen tools",
    shortDesc: "Dao inox, nồi chảo, thớt kháng khuẩn và vật tư đặt chung đơn nguyên liệu.",
    shortDescEn: "Stainless knives, cookware, cutting boards and kitchen supplies in one order.",
    previewImage: "/images/tps1_tools_placeholder.png",
    overlayColor: "#1B2630",
    overlayCenterColor: "#4A5E70",
    overlayGlowColor: "#94A3B8",
    cutouts: [
      CUTOUTS.cuttingBoard,
      CUTOUTS.chefKnife,
      CUTOUTS.stainlessPot,
      CUTOUTS.wokPan,
      CUTOUTS.garlicBulb,
      CUTOUTS.tomato,
      CUTOUTS.carrot,
      CUTOUTS.broccoli,
      CUTOUTS.mushroom,
      CUTOUTS.citrus,
    ],
    missingCutouts: ["vá & muỗng inox", "khay GN inox", "kẹp gắp inox", "âu trộn inox", "phới lồng inox", "rổ lưới inox"],
  },
};

export function getCategoryTransitionConfig(slug: string): CategoryTransitionConfig | undefined {
  return CATEGORY_TRANSITION_CONFIG[slug];
}

export function extractCategorySlugFromHref(href: string): string | null {
  if (!href) return null;
  const [pathPart, rest] = href.split("?");
  const cleanPath = (pathPart || "").split("#")[0].replace(/\/+$/, "");
  if (cleanPath.startsWith("/danh-muc/")) {
    const slug = cleanPath.slice("/danh-muc/".length).split("/")[0];
    if (slug && CATEGORY_TRANSITION_CONFIG[slug]) return slug;
  }
  if (rest) {
    const query = rest.split("#")[0];
    const params = new URLSearchParams(query);
    const cat = params.get("category");
    if (cat && CATEGORY_TRANSITION_CONFIG[cat]) return cat;
  }
  return null;
}

// Scoped suppression for MajorPageTransition ONLY while a category transition targets /san-pham
let suppressedTargetPath: string | null = null;
let majorTransitionSuppressedUntil = 0;

export function suppressMajorPageTransition(durationMs = 4000, targetPath?: string) {
  suppressedTargetPath = targetPath ?? null;
  majorTransitionSuppressedUntil = Date.now() + durationMs;
}

export function clearMajorPageTransitionSuppression() {
  suppressedTargetPath = null;
  majorTransitionSuppressedUntil = 0;
}

export function isMajorPageTransitionSuppressed(candidatePath?: string): boolean {
  if (Date.now() >= majorTransitionSuppressedUntil) {
    suppressedTargetPath = null;
    return false;
  }
  if (suppressedTargetPath && candidatePath && candidatePath !== suppressedTargetPath) {
    return false;
  }
  return true;
}
