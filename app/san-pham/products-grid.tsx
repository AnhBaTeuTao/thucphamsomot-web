"use client";

import Image from "next/image";
import Link from "next/link";
import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { SKU_GROUPS, SKU_PAGE_SIZE, type SkuPage, type SkuProduct } from "@/lib/sku-catalog";
import type { Locale } from "@/lib/site";

// ─── Category tabs ─────────────────────────────────────────────────────────
const CATEGORIES: Record<Locale, { slug: string; label: string }[]> = {
  vi: [
    { slug: "", label: "Tất cả" },
    ...SKU_GROUPS.map((group) => ({ slug: group.slug, label: group.label })),
  ],
  en: [
    { slug: "", label: "All" },
    ...SKU_GROUPS.map((group) => ({ slug: group.slug, label: group.labelEn })),
  ],
};

const TEXT = {
  vi: {
    unit: "Đơn vị: ",
    priceTag: "Liên hệ báo giá",
    addToCart: "Thêm vào báo giá",
    added: "Đã thêm",
    clearFilters: "Xóa bộ lọc",
    sendQuoteList: "Gửi danh sách báo giá",
    searchPlaceholder: "Tìm tên sản phẩm... (vd: cá basa, thịt vai, cải thảo)",
    searchLabel: "Tìm kiếm tên sản phẩm trong danh mục",
    clearSearch: "Xóa từ khóa tìm kiếm",
    tabsLabel: "Lọc theo nhóm hàng thực phẩm",
    empty: "Không tìm thấy sản phẩm phù hợp. Vui lòng thử từ khóa khác hoặc gửi danh sách cho TPS1.",
    emptyCta: "Gửi danh sách cần mua",
    emptyReset: "Xóa bộ lọc",
    prevPage: "Trang trước",
    nextPage: "Trang sau",
    paginationLabel: "Phân trang danh mục sản phẩm",
    loadingLabel: "Đang tải danh mục sản phẩm",
  },
  en: {
    unit: "Unit: ",
    priceTag: "Contact for quote",
    addToCart: "Add to quote",
    added: "Added",
    clearFilters: "Clear filters",
    sendQuoteList: "Send quote list",
    searchPlaceholder: "Search products... (e.g., basa fish, beef, cabbage)",
    searchLabel: "Search product catalog",
    clearSearch: "Clear search query",
    tabsLabel: "Filter by product category",
    empty: "No matching products found. Try another keyword or send your purchase list to TPS1.",
    emptyCta: "Send purchase list",
    emptyReset: "Clear filters",
    prevPage: "Previous page",
    nextPage: "Next page",
    paginationLabel: "Product catalog pagination",
    loadingLabel: "Loading product catalog",
  },
} as const;

// ─── Subtle IntersectionObserver scroll reveal (fade + 16px translateY) ───
export function SpReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`sp-reveal${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--sp-reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

// ─── English Localization Helpers for Database SKU Products ─────────────────
const EN_CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  SKU_GROUPS.map((g) => [g.slug, g.labelEn])
);

const EN_UNIT_MAP: Record<string, string> = {
  kg: "kg",
  ký: "kg",
  g: "g",
  gram: "g",
  gói: "pack",
  bịch: "bag",
  túi: "pouch",
  hộp: "box",
  chai: "bottle",
  lọ: "jar",
  hũ: "jar",
  thùng: "carton",
  lon: "can",
  can: "canister",
  lít: "liter",
  l: "liter",
  ml: "ml",
  trái: "piece",
  quả: "piece",
  củ: "piece",
  bông: "head",
  bắp: "ear",
  cây: "stalk",
  bó: "bunch",
  con: "whole",
  vỉ: "tray",
  khay: "tray",
  cái: "piece",
  chiếc: "piece",
  bộ: "set",
  đôi: "pair",
  lốc: "pack",
  miếng: "piece",
  cục: "block",
  bánh: "piece",
  xâu: "string",
  chùm: "cluster",
};

const VI_FOOD_PHRASE_DICT: Array<[RegExp, string]> = [
  // Prep & quality modifiers
  [/\bchuẩn VietGAP\b/gi, "VietGAP Certified"],
  [/\bsơ chế sạch gốc\b/gi, "Pre-trimmed"],
  [/\brửa ozon đóng túi\b/gi, "Ozone-Washed & Bagged"],
  [/\bcắt khúc theo ca bếp\b/gi, "Shift-Portioned Cut"],
  [/\bchọn cỡ đồng đều\b/gi, "Uniformly Graded"],
  [/\btuyển chọn loại 1\b/gi, "Grade-A Selected"],
  [/\bloại 1\b/gi, "Grade A"],
  [/\bgiao sáng sớm\b/gi, "Early Morning Delivery"],
  [/\bsơ chế sẵn bếp ăn\b/gi, "Kitchen-Ready Prepped"],
  [/\bđóng sọt chuẩn bếp công nghiệp\b/gi, "Crate-Packed for Canteens"],
  [/\bhàng tươi mỗi ngày\b/gi, "Daily Fresh"],
  [/\bsơ chế\b/gi, "Prepped"],
  [/\bđông lạnh\b/gi, "Frozen"],
  [/\btươi sống\b/gi, "Fresh"],
  [/\btươi\b/gi, "Fresh"],
  [/\bnhập khẩu\b/gi, "Imported"],
  [/\bkhông hạt\b/gi, "Seedless"],
  [/\bphi lê\b/gi, "Fillet"],
  [/\bcắt lát\b/gi, "Sliced"],
  [/\bthái lát\b/gi, "Sliced"],
  [/\bxay\b/gi, "Minced"],
  [/\bnguyên con\b/gi, "Whole"],
  [/\blàm sạch\b/gi, "Cleaned"],
  [/\brút xương\b/gi, "Boneless"],
  [/\bkhông xương\b/gi, "Boneless"],
  [/\bcó xương\b/gi, "Bone-In"],
  [/\bĐà Lạt\b/gi, "Da Lat"],
  // Produce
  [/\bbông cải xanh\b/gi, "Broccoli"],
  [/\bbông cải trắng\b/gi, "Cauliflower"],
  [/\bcải ngọt\b/gi, "Choy Sum (Sweet Mustard Greens)"],
  [/\bcải thìa\b/gi, "Bok Choy"],
  [/\bcải thảo\b/gi, "Napa Cabbage"],
  [/\bcải bó xôi\b/gi, "Spinach"],
  [/\bcải bẹ xanh\b/gi, "Mustard Greens"],
  [/\bbắp cải xanh\b/gi, "Green Cabbage"],
  [/\bbắp cải tím\b/gi, "Red Cabbage"],
  [/\bbắp cải\b/gi, "Cabbage"],
  [/\bxà lách lô lô\b/gi, "Lollo Lettuce"],
  [/\bxà lách\b/gi, "Lettuce"],
  [/\bcà rốt\b/gi, "Carrot"],
  [/\bkhoai tây\b/gi, "Potato"],
  [/\bkhoai lang\b/gi, "Sweet Potato"],
  [/\bkhoai môn\b/gi, "Taro"],
  [/\bcà chua\b/gi, "Tomato"],
  [/\bdưa leo\b/gi, "Cucumber"],
  [/\bớt chuông đỏ\b/gi, "Red Bell Pepper"],
  [/\bớt chuông vàng\b/gi, "Yellow Bell Pepper"],
  [/\bớt chuông xanh\b/gi, "Green Bell Pepper"],
  [/\bớt chuông\b/gi, "Bell Pepper"],
  [/\bớt hiểm\b/gi, "Bird's Eye Chili"],
  [/\bớt sừng\b/gi, "Horn Chili"],
  [/\bbắp ngọt\b/gi, "Sweet Corn"],
  [/\bbắp mỹ\b/gi, "Sweet Corn"],
  [/\bnấm đùi gà\b/gi, "King Oyster Mushroom"],
  [/\bnấm kim châm\b/gi, "Enoki Mushroom"],
  [/\bnấm bào ngư\b/gi, "Oyster Mushroom"],
  [/\bnấm rơm\b/gi, "Straw Mushroom"],
  [/\bnấm hương\b/gi, "Shiitake Mushroom"],
  [/\bnấm đông cô\b/gi, "Shiitake Mushroom"],
  [/\bnấm mèo\b/gi, "Wood Ear Mushroom"],
  [/\bbơ sáp\b/gi, "Avocado"],
  [/\bhành lá\b/gi, "Spring Onion"],
  [/\bhành tây\b/gi, "Yellow Onion"],
  [/\bhành tím\b/gi, "Shallot"],
  [/\btỏi củ\b/gi, "Garlic Bulb"],
  [/\btỏi bóc vỏ\b/gi, "Peeled Garlic"],
  [/\btỏi\b/gi, "Garlic"],
  [/\bgừng\b/gi, "Ginger"],
  [/\bsả cây\b/gi, "Lemongrass Stalk"],
  [/\bcủ cải trắng\b/gi, "White Radish (Daikon)"],
  [/\bbí đỏ hồ lô\b/gi, "Butternut Pumpkin"],
  [/\bbí đỏ\b/gi, "Pumpkin"],
  [/\bbí đao\b/gi, "Winter Melon"],
  [/\bbí ngòi\b/gi, "Zucchini"],
  [/\bbầu sao\b/gi, "Bottle Gourd (Bau Sao)"],
  [/\bbầu\b/gi, "Bottle Gourd"],
  [/\bmướp hương\b/gi, "Luffa Gourd"],
  [/\bsu su\b/gi, "Chayote"],
  [/\bsu hào\b/gi, "Kohlrabi"],
  [/\bđậu cove\b/gi, "Green Beans"],
  [/\bđậu đũa\b/gi, "Yardlong Beans"],
  [/\bđậu bắp\b/gi, "Okra"],
  [/\brau muống\b/gi, "Water Spinach (Morning Glory)"],
  [/\bmồng tơi\b/gi, "Malabar Spinach"],
  [/\brau dền\b/gi, "Amaranth Greens"],
  [/\brau ngót\b/gi, "Katuk Sweet Leaf"],
  [/\bkhổ qua\b/gi, "Bitter Melon"],
  [/\bcà tím\b/gi, "Eggplant"],
  [/\bchanh\b/gi, "Lime"],
  [/\bngò rí\b/gi, "Coriander (Cilantro)"],
  [/\bngò gai\b/gi, "Sawtooth Herb"],
  [/\brau răm\b/gi, "Vietnamese Coriander"],
  [/\bhúng quế\b/gi, "Sweet Basil"],
  [/\bgiá đỗ\b/gi, "Bean Sprouts"],
  // Pork, Beef, Poultry, Eggs
  [/\bthịt ba rọi heo\b/gi, "Pork Belly"],
  [/\bba rọi heo\b/gi, "Pork Belly"],
  [/\bba chỉ heo\b/gi, "Pork Belly"],
  [/\bnạc dăm heo\b/gi, "Pork Collar Butt"],
  [/\bnạc vai heo\b/gi, "Pork Shoulder"],
  [/\bnạc đùi heo\b/gi, "Pork Leg Lean"],
  [/\bthăn heo\b/gi, "Pork Tenderloin"],
  [/\bsườn non heo\b/gi, "Pork Baby Back Ribs"],
  [/\bsườn cốt lết\b/gi, "Pork Chop Cutlet"],
  [/\bcốt lết heo\b/gi, "Pork Chop"],
  [/\bxương ống heo\b/gi, "Pork Marrow Bones"],
  [/\bxương cổ heo\b/gi, "Pork Neck Bones"],
  [/\bgiò heo\b/gi, "Pork Hock"],
  [/\bthịt heo\b/gi, "Pork"],
  [/\bthăn nội bò\b/gi, "Beef Tenderloin"],
  [/\bthăn ngoại bò\b/gi, "Beef Striploin"],
  [/\bbắp bò\b/gi, "Beef Shank"],
  [/\bnạm bò\b/gi, "Beef Brisket"],
  [/\bgầu bò\b/gi, "Beef Brisket Point"],
  [/\bba chỉ bò\b/gi, "Beef Short Plate"],
  [/\bthịt bò\b/gi, "Beef"],
  [/\bức gà\b/gi, "Chicken Breast"],
  [/\bđùi gà góc tư\b/gi, "Chicken Leg Quarter"],
  [/\bđùi tỏi gà\b/gi, "Chicken Drumstick"],
  [/\bcánh gà\b/gi, "Chicken Wing"],
  [/\bgà ta\b/gi, "Free-Range Chicken"],
  [/\bgà công nghiệp\b/gi, "Farm Chicken"],
  [/\bvịt nguyên con\b/gi, "Whole Duck"],
  [/\bức vịt\b/gi, "Duck Breast"],
  [/\btrứng gà\b/gi, "Chicken Eggs"],
  [/\btrứng vịt\b/gi, "Duck Eggs"],
  [/\btrứng cút\b/gi, "Quail Eggs"],
  // Seafood
  [/\bcá basa\b/gi, "Basa Catfish"],
  [/\bcá điêu hồng\b/gi, "Red Tilapia"],
  [/\bcá hồi\b/gi, "Salmon"],
  [/\bcá thu\b/gi, "Mackerel"],
  [/\bcá ngừ\b/gi, "Tuna"],
  [/\bcá lóc\b/gi, "Snakehead Fish"],
  [/\bcá trê\b/gi, "Walking Catfish"],
  [/\bcá nục\b/gi, "Scad Fish"],
  [/\btôm thẻ\b/gi, "Whiteleg Shrimp"],
  [/\btôm sú\b/gi, "Black Tiger Shrimp"],
  [/\btôm nõn\b/gi, "Peeled Shrimp"],
  [/\bmực ống\b/gi, "Tube Squid"],
  [/\bmực lá\b/gi, "Bigfin Reef Squid"],
  [/\bnghêu\b/gi, "Clams"],
  // Dry goods, Seasonings, Vegetarian
  [/\bgạo thơm\b/gi, "Fragrant Jasmine Rice"],
  [/\bgạo\b/gi, "Rice"],
  [/\bnước mắm\b/gi, "Fish Sauce"],
  [/\bnước tương\b/gi, "Soy Sauce"],
  [/\bdầu ăn\b/gi, "Cooking Oil"],
  [/\bdầu hào\b/gi, "Oyster Sauce"],
  [/\btương ớt\b/gi, "Chili Sauce"],
  [/\btương cà\b/gi, "Tomato Ketchup"],
  [/\bhạt nêm\b/gi, "Seasoning Powder"],
  [/\bbột ngọt\b/gi, "MSG Seasoning"],
  [/\bđường cát\b/gi, "Granulated Sugar"],
  [/\bmuối i-ốt\b/gi, "Iodized Salt"],
  [/\btiêu đen\b/gi, "Black Pepper"],
  [/\bđậu hũ trắng\b/gi, "White Tofu"],
  [/\bđậu hũ chiên\b/gi, "Fried Tofu"],
  [/\bđậu hũ non\b/gi, "Silken Tofu"],
  [/\bđậu hũ\b/gi, "Tofu"],
  [/\bchả lụa chay\b/gi, "Vegetarian Pork Roll (Cha Lua Chay)"],
  [/\bchả giò chay\b/gi, "Vegetarian Spring Rolls"],
  [/\bthực phẩm chay\b/gi, "Vegetarian Food"],
];

function stripVietnameseDiacritics(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function translateProductNameToEn(name: string): string {
  let out = name;
  for (const [pattern, replacement] of VI_FOOD_PHRASE_DICT) {
    out = out.replace(pattern, replacement);
  }
  out = stripVietnameseDiacritics(out).replace(/\s{2,}/g, " ").trim();
  return out ? out.charAt(0).toUpperCase() + out.slice(1) : name;
}

function translateUnitToEn(unit: string): string {
  const key = unit.trim().toLowerCase();
  if (EN_UNIT_MAP[key]) return EN_UNIT_MAP[key];
  return stripVietnameseDiacritics(unit);
}

function localizeSkuProduct(product: SkuProduct, locale: Locale): SkuProduct {
  if (locale !== "en") return product;
  return {
    ...product,
    categoryLabel: EN_CATEGORY_LABELS[product.category] ?? stripVietnameseDiacritics(product.categoryLabel),
    name: translateProductNameToEn(product.name),
    unit: translateUnitToEn(product.unit),
  };
}
export function SkuRow({
  product,
  index = 99,
  locale = "vi",
}: {
  product: SkuProduct;
  index?: number;
  locale?: Locale;
}) {
  const text = TEXT[locale];
  const item = localizeSkuProduct(product, locale);

  return (
    <article className="sku-row">
      <div className="sku-row__media">
        <Image
          src={item.image}
          alt={item.name}
          fill
          priority={index < 5}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="sku-row__img"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/tps1-cover-food.jpg";
          }}
        />
      </div>

      <div className="sku-row__body">
        <div className="sku-row__info">
          <span className="sku-row__cat">{item.categoryLabel}</span>
          <h3 className="sku-row__name" title={item.name}>
            {item.name}
          </h3>
        </div>

        <div className="sku-row__price-unit">
          <span className="sku-row__unit">
            {text.unit}
            <strong>{item.unit}</strong>
          </span>
          <span className="sku-row__price">{text.priceTag}</span>
        </div>

        <div className="sku-row__action">
          <Link
            href={`${locale === "en" ? "/en/contact" : "/lien-he"}?product=${encodeURIComponent(item.name)}`}
            className="sku-row__add"
            title={`${text.addToCart}: ${item.name}`}
          >
            <span>{text.addToCart}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── Elevated 4:3 B2B Product Card for /san-pham ───────────────────────────
const SpProductCard = memo(function SpProductCard({
  product,
  locale,
  isAdded,
  onToggleAdd,
}: {
  product: SkuProduct;
  locale: Locale;
  isAdded: boolean;
  onToggleAdd: (product: SkuProduct) => void;
}) {
  const text = TEXT[locale];
  const item = localizeSkuProduct(product, locale);

  return (
    <article className="sp-card">
      <div className="sp-card__media">
        <Image
          src={item.image}
          alt={`${item.name} - ${item.categoryLabel} TPS1`}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 50vw, (max-width: 960px) 33vw, (max-width: 1200px) 25vw, 20vw"
          className="sp-card__img"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/tps1-cover-food.jpg";
          }}
        />
      </div>

      <div className="sp-card__body">
        <span className="sp-card__cat">{item.categoryLabel}</span>
        <h3 className="sp-card__name" title={item.name}>
          {item.name}
        </h3>

        <div className="sp-card__meta-line">
          <span className="sp-card__unit">
            {text.unit}
            <strong>{item.unit}</strong>
          </span>
          <span className="sp-card__price">{text.priceTag}</span>
        </div>

        <button
          type="button"
          className={`sp-card__cta${isAdded ? " is-added" : ""}`}
          aria-pressed={isAdded}
          onClick={() => onToggleAdd(item)}
        >
          {isAdded ? (
            <>
              <span>{text.added}</span>
              <span aria-hidden="true">✓</span>
            </>
          ) : (
            <>
              <span>{text.addToCart}</span>
              <span className="sp-card__arrow" aria-hidden="true">
                →
              </span>
            </>
          )}
        </button>
      </div>
    </article>
  );
});

function SpSkeletonGrid() {
  return (
    <div className="sp-grid" aria-busy="true" aria-label={TEXT.vi.loadingLabel}>
      {Array.from({ length: 10 }).map((_, idx) => (
        <div key={idx} className="sp-card sp-card--skeleton" aria-hidden="true">
          <div className="sp-card__media sp-skeleton-block" />
          <div className="sp-card__body">
            <span className="sp-skeleton-line sp-skeleton-line--cat" />
            <span className="sp-skeleton-line sp-skeleton-line--title" />
            <span className="sp-skeleton-line sp-skeleton-line--title-short" />
            <div className="sp-card__meta-line">
              <span className="sp-skeleton-line sp-skeleton-line--meta" />
            </div>
            <span className="sp-skeleton-line sp-skeleton-line--link" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── URL ?category= query sync (bọc trong Suspense an toàn) ─────────────────
function CategoryUrlSync({
  validSlugs,
  onSelectCategory,
}: {
  validSlugs: string[];
  onSelectCategory: (slug: string) => void;
}) {
  const searchParams = useSearchParams();
  const appliedCatRef = useRef<string | null>(null);

  useEffect(() => {
    const raw = searchParams.get("category") ?? "";
    const matched = raw && validSlugs.includes(raw) ? raw : "";

    const shouldSync =
      appliedCatRef.current === null
        ? Boolean(matched)
        : appliedCatRef.current !== matched;

    if (!shouldSync) return;

    const timer = window.setTimeout(() => {
      appliedCatRef.current = matched;
      onSelectCategory(matched);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [searchParams, validSlugs, onSelectCategory]);

  return null;
}

// ─── Products Grid (main export) ───────────────────────────────────────────
export function ProductsGrid({
  locale = "vi",
  initialData,
  basePath,
}: {
  locale?: Locale;
  initialData?: SkuPage;
  basePath?: string;
}) {
  const [products, setProducts] = useState<SkuProduct[]>(initialData?.products ?? []);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(!initialData);
  const [page, setPage] = useState(initialData?.page ?? 1);
  const [totalPages, setTotalPages] = useState(initialData?.totalPages ?? 1);
  const [totalCount, setTotalCount] = useState(initialData?.totalCount ?? 0);
  const [addedProducts, setAddedProducts] = useState<Map<string, string>>(() => new Map());
  const pageSize = initialData?.pageSize ?? SKU_PAGE_SIZE;

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const cacheRef = useRef(
    new Map<string, { products: SkuProduct[]; totalCount: number; totalPages: number }>(
      initialData ? [[`||${initialData.page}`, initialData]] : []
    )
  );

  const text = TEXT[locale];
  const catList = CATEGORIES[locale];
  const validSlugs = useMemo(
    () => catList.map((c) => c.slug).filter(Boolean),
    [catList]
  );

  // Per-category counts from server payload (or full local dataset)
  const categoryCounts = useMemo(() => {
    if (!initialData) return null;
    if (initialData.categoryCounts) {
      const map = new Map<string, number>();
      for (const [slug, count] of Object.entries(initialData.categoryCounts)) {
        map.set(slug, count);
      }
      return map;
    }
    if (initialData.totalPages > 1) return null;
    const map = new Map<string, number>();
    map.set("", initialData.totalCount);
    for (const p of initialData.products) {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    }
    return map;
  }, [initialData]);

  // Adaptive < 80% browser zoom: expand container to 1440px (up to 6 columns)
  useEffect(() => {
    const syncZoomOutAttr = () => {
      const pageEl = document.querySelector(".sp-catalog-page") as HTMLElement | null;
      if (!pageEl) return;
      const ratioZoom =
        window.outerWidth > 0 && window.innerWidth > 0
          ? window.outerWidth / window.innerWidth
          : 1;
      const isZoomedOut =
        (ratioZoom > 0.2 && ratioZoom < 0.8) || window.innerWidth >= 2000;
      if (isZoomedOut) {
        pageEl.setAttribute("data-sp-zoom-out", "true");
      } else {
        pageEl.removeAttribute("data-sp-zoom-out");
      }
    };

    syncZoomOutAttr();
    window.addEventListener("resize", syncZoomOutAttr);
    window.visualViewport?.addEventListener("resize", syncZoomOutAttr);
    return () => {
      window.removeEventListener("resize", syncZoomOutAttr);
      window.visualViewport?.removeEventListener("resize", syncZoomOutAttr);
    };
  }, []);

  const handleUrlCategory = useCallback((slug: string) => {
    setCategory(slug);
    setPage(1);
  }, []);

  useEffect(() => {
    const onSelectEvent = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      if (typeof slug === "string" && (slug === "" || validSlugs.includes(slug))) {
        setCategory(slug);
        setPage(1);
      }
    };
    window.addEventListener("tps1-select-category", onSelectEvent);
    return () => window.removeEventListener("tps1-select-category", onSelectEvent);
  }, [validSlugs]);

  const handleSearch = (val: string) => {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(val);
      setPage(1);
    }, 320);
  };

  const resetFilters = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setCategory("");
    setSearch("");
    setQuery("");
    setPage(1);
  };

  const handleToggleAdd = useCallback((product: SkuProduct) => {
    setAddedProducts((prev) => {
      const next = new Map(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.set(product.id, product.name);
      }
      return next;
    });
  }, []);

  const putCache = useCallback(
    (key: string, value: { products: SkuProduct[]; totalCount: number; totalPages: number }) => {
      const cache = cacheRef.current;
      if (cache.has(key)) {
        cache.delete(key);
      } else if (cache.size >= 60) {
        const oldest = cache.keys().next().value;
        if (oldest !== undefined) cache.delete(oldest);
      }
      cache.set(key, value);
    },
    []
  );

  const prefetchNextPage = useCallback(
    (cat: string, q: string, pg: number, maxPages: number) => {
      const nextPg = pg + 1;
      if (nextPg > maxPages) return;
      const nextKey = `${cat}|${q.trim().toLocaleLowerCase()}|${nextPg}`;
      if (cacheRef.current.has(nextKey)) return;

      const params = new URLSearchParams({ page: String(nextPg) });
      if (cat) params.set("category", cat);
      if (q.trim()) params.set("q", q.trim());

      void fetch(`/api/sku-products?${params.toString()}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!data || Array.isArray(data)) return;
          putCache(nextKey, {
            products: data.products || [],
            totalCount: data.totalCount || 0,
            totalPages: data.totalPages || 1,
          });
        })
        .catch(() => {
          // Ignore silent prefetch errors
        });
    },
    [putCache]
  );

  const fetchProducts = useCallback(
    async (cat: string, q: string, pg: number) => {
      const cacheKey = `${cat}|${q.trim().toLocaleLowerCase()}|${pg}`;
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        setProducts(cached.products);
        setTotalCount(cached.totalCount);
        setTotalPages(cached.totalPages);
        setLoading(false);
        prefetchNextPage(cat, q, pg, cached.totalPages);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(pg) });
        if (cat) params.set("category", cat);
        if (q.trim()) params.set("q", q.trim());

        const res = await fetch(`/api/sku-products?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("fetch failed");

        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
          setTotalCount(data.length);
          setTotalPages(1);
        } else {
          const next = {
            products: data.products || [],
            totalCount: data.totalCount || 0,
            totalPages: data.totalPages || 1,
          };
          setProducts(next.products);
          setTotalCount(next.totalCount);
          setTotalPages(next.totalPages);
          putCache(cacheKey, next);
          prefetchNextPage(cat, q, pg, next.totalPages);
        }

        const listTop = document.getElementById("sp-catalog-top");
        if (listTop && pg > 1) {
          listTop.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setProducts([]);
        setTotalCount(0);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [prefetchNextPage, putCache]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchProducts(category, query, page);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [category, query, page, fetchProducts]);

  const hasActiveFilter = Boolean(category || search.trim() || query.trim());

  const resultSummary = useMemo(() => {
    if (loading && products.length === 0) {
      return text.loadingLabel;
    }
    if (totalCount === 0 || products.length === 0) {
      return locale === "en" ? "Showing 0 products" : "Hiển thị 0 mặt hàng";
    }
    const from = (page - 1) * pageSize + 1;
    const to = Math.min(totalCount, from + products.length - 1);
    const totalLabel =
      !category && !query.trim() && totalCount >= 5000
        ? "5.000+"
        : totalCount.toLocaleString("vi-VN");
    if (locale === "en") {
      return `Showing ${from}-${to} of ${totalLabel} products`;
    }
    return `Hiển thị ${from}-${to} trong ${totalLabel} mặt hàng`;
  }, [loading, products.length, totalCount, page, pageSize, category, query, locale, text.loadingLabel]);

  const quoteListHref = useMemo(() => {
    const names = Array.from(addedProducts.values());
    const base = locale === "en" ? "/en/bao-gia" : "/bao-gia";
    if (names.length === 0) return base;
    return `${base}?product=${encodeURIComponent(names.join(", "))}`;
  }, [addedProducts, locale]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    const linkable = Boolean(basePath) && !category && !query.trim();

    const renderBtn = (
      target: number,
      content: ReactNode,
      opts: { active?: boolean; disabled?: boolean; label?: string; keyId?: string } = {}
    ) => {
      const className = `sp-page-btn${opts.active ? " is-active" : ""}`;
      const key = opts.keyId ?? opts.label ?? String(target);
      if (opts.disabled) {
        return (
          <button
            key={key}
            type="button"
            className={className}
            disabled
            aria-label={opts.label}
          >
            {content}
          </button>
        );
      }
      if (linkable) {
        return (
          <a
            key={key}
            href={target === 1 ? basePath : `${basePath}?trang=${target}`}
            className={className}
            aria-label={opts.label}
            aria-current={opts.active ? "page" : undefined}
            onClick={(e) => {
              e.preventDefault();
              setPage(target);
            }}
          >
            {content}
          </a>
        );
      }
      return (
        <button
          key={key}
          type="button"
          className={className}
          aria-label={opts.label}
          aria-current={opts.active ? "page" : undefined}
          onClick={() => setPage(target)}
        >
          {content}
        </button>
      );
    };

    const pageNums: ReactNode[] = [];
    for (let i = start; i <= end; i++) {
      pageNums.push(
        renderBtn(i, i, {
          active: page === i,
          label: locale === "en" ? `Page ${i}` : `Trang ${i}`,
          keyId: `p-${i}`,
        })
      );
    }

    return (
      <nav className="sp-pagination" aria-label={text.paginationLabel}>
        {renderBtn(Math.max(1, page - 1), text.prevPage, {
          disabled: page <= 1,
          label: text.prevPage,
          keyId: "prev",
        })}

        {start > 1 && (
          <>
            {renderBtn(1, 1, { label: locale === "en" ? "Page 1" : "Trang 1", keyId: "first" })}
            {start > 2 && (
              <span className="sp-page-ellipsis" aria-hidden="true">
                …
              </span>
            )}
          </>
        )}

        {pageNums}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <span className="sp-page-ellipsis" aria-hidden="true">
                …
              </span>
            )}
            {renderBtn(totalPages, totalPages, {
              label: locale === "en" ? `Page ${totalPages}` : `Trang ${totalPages}`,
              keyId: "last",
            })}
          </>
        )}

        {renderBtn(Math.min(totalPages, page + 1), text.nextPage, {
          disabled: page >= totalPages,
          label: text.nextPage,
          keyId: "next",
        })}
      </nav>
    );
  };

  return (
    <section className="sp-catalog-section" id="danh-muc" aria-label="Danh sách sản phẩm TPS1">
      <Suspense fallback={null}>
        <CategoryUrlSync validSlugs={validSlugs} onSelectCategory={handleUrlCategory} />
      </Suspense>

      {/* VÙNG 2: TẦNG A STICKY (HÀNG ĐIỀU KHIỂN) + TẦNG B (11 CHIP NHÓM HÀNG HIỆN ĐỦ) */}
      <div className="sp-filterbar">
        <div className="sp-container">
          <div className="sp-filter-top">
            <div className="sp-filter-status">
              <p className="sp-result-count" role="status" aria-live="polite">
                {resultSummary}
              </p>
              {hasActiveFilter && (
                <button
                  type="button"
                  className="sp-filter-reset"
                  onClick={resetFilters}
                >
                  {text.clearFilters}
                </button>
              )}
              {addedProducts.size > 0 && (
                <Link href={quoteListHref} className="sp-quote-pill">
                  {text.sendQuoteList} ({addedProducts.size}) →
                </Link>
              )}
            </div>

            <div className="sp-search">
              <Search size={16} className="sp-search__icon" aria-hidden="true" />
              <input
                type="search"
                id="sku-search-input"
                className="sp-search__input"
                placeholder={text.searchPlaceholder}
                aria-label={text.searchLabel}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="sp-search__clear"
                  onClick={() => handleSearch("")}
                  aria-label={text.clearSearch}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* VÙNG 3: NỀN XÁM XANH #F2F5F1 — KHỐI CHIP TẦNG B + LƯỚI SẢN PHẨM LẤP ĐẦY CONTAINER */}
      <div className="sp-catalog-band" id="sp-catalog-top">
        <div className="sp-container">
          <div className="sp-filter-chips-card">
            <div className="sp-chips-viewport">
              <div className="sp-chips" role="group" aria-label={text.tabsLabel}>
                {catList.map((cat) => {
                  const isActive = category === cat.slug;
                  const count = categoryCounts?.get(cat.slug);
                  return (
                    <button
                      key={cat.slug || "all"}
                      type="button"
                      aria-pressed={isActive}
                      className={`sp-chip${isActive ? " is-active" : ""}`}
                      onClick={() => {
                        setCategory(cat.slug);
                        setPage(1);
                      }}
                    >
                      {isActive && (
                        <span className="sp-chip__check" aria-hidden="true">
                          ✓
                        </span>
                      )}
                      <span>{cat.label}</span>
                      {typeof count === "number" && (
                        <span className="sp-chip__count">{count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {loading && products.length === 0 ? (
            <SpSkeletonGrid />
          ) : products.length === 0 ? (
            <div className="sp-empty" role="status">
              <p className="sp-empty__text">{text.empty}</p>
              <div className="sp-empty__actions">
                <Link
                  href={locale === "en" ? "/en/bao-gia" : "/bao-gia"}
                  className="sp-btn sp-btn--primary"
                >
                  {text.emptyCta}
                </Link>
                {hasActiveFilter && (
                  <button
                    type="button"
                    className="sp-btn sp-btn--outline"
                    onClick={resetFilters}
                  >
                    {text.emptyReset}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div
                className={`sp-grid${loading ? " is-loading" : ""}`}
                aria-busy={loading}
              >
                {products.map((product) => (
                  <SpProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    isAdded={addedProducts.has(product.id)}
                    onToggleAdd={handleToggleAdd}
                  />
                ))}
              </div>
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
