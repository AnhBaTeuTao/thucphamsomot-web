---
version: "1.0.0"
name: "TPS1 B2B Food Supply Design System"
project: "thucphamsomot.vn"
updated: "2026-11-21"
standards:
  - "getdesign.md (DESIGN.md 9-section contract)"
  - "Anti-Conflict & Anti-Bloat Protocol (Strict 4-Tier Hierarchy)"
  - "web.dev Accessibility & Mobile Readability (WCAG AA)"
  - "Zero-AI-Drift / Desktop-Mobile Isolation"

colors:
  primary: "#0f6f4b"
  primaryDark: "#133127"
  primaryHover: "#0a4f35"
  primaryDeep: "#0b6644"
  accentOrange: "#ff7918"
  goldDot: "#f5c84c"
  alertRed: "#c7372f"
  zaloBlue: "#0068ff"
  facebookBlue: "#1264d7"
  canvas: "#f7faf8"
  canvasBase: "#f6f7f4"
  canvasCatalog: "#f6f8f5"
  surface: "#ffffff"
  surfaceMint: "#edf7f1"
  surfaceMintTint: "#f5faf7"
  surfacePill: "rgba(255, 255, 255, 0.92)"
  textPrimary: "#142d21"
  textForeground: "#14231c"
  textSecondary: "#355047"
  textMuted: "#55695d"
  textSubtle: "#59665f"
  textPriceNote: "#8c6a28"
  borderSubtle: "rgba(15, 111, 75, 0.12)"
  borderHairline: "rgba(20, 35, 28, 0.08)"
  borderCatalog: "#e1e7e2"

typography:
  fontSans: '"Be Vietnam Pro", "Segoe UI", Arial, sans-serif'
  fontWeightsLoaded: [400, 500, 600, 700, 800, 900]
  desktop:
    heroTitle: "68px"
    pageHeroTitle: "56px"
    sectionTitle: "clamp(1.75rem, 3.2vw, 2.55rem)"
    contentHeading: "clamp(1.85rem, 4vw, 40px)"
    heroLead: "21px"
    megaMenuLabel: "17px"
    skuName: "15px"
    skuPricing: "12.5px"
    navLink: "0.9rem"
    topBar: "0.78rem"
    eyebrow: "0.82rem"
  mobileMinThresholds:
    viewportRange: "<= 1100px / <= 768px"
    primaryNavAndHeadings: ">= 16px"
    formInputsAndSearch: "16px"
    bodyAndDescriptions: ">= 14.5px-16px"
    subMenuItems: ">= 14.5px-15px"
    skuName: "14.5px"
    secondaryLabelsAndWidgets: ">= 13px-14px"
    topBar: "13px"
    hardFloor: "Never render informational text below 13px on mobile"
  tapTargetMinHeight:
    mobileHeaderButtons: "42px-44px"
    mobileDrawerLinks: "46px-52px"
    mobileCtaAndInputs: "46px-48px"

spacing:
  shellMaxWidth: "1280px"
  headerMaxWidth: "1340px"
  siteGutter: "clamp(24px, 4vw, 56px)"
  sectionPadDesktop: "80px 0"
  scale:
    xs: "4px"
    sm: "8px"
    md: "12px"
    base: "16px"
    lg: "20px"
    xl: "24px"
    xxl: "32px"
    section: "48px"
    heroPad: "64px"
  mobileFooterSafeBottom: "calc(116px + env(safe-area-inset-bottom))"
  mobileDrawerSafeBottom: "calc(32px + env(safe-area-inset-bottom))"

radius:
  pill: "999px"
  heroCard: "30px"
  certCard: "24px"
  quoteCard: "20px"
  megaPanel: "18px"
  accordionCard: "16px"
  skuCard: "16px"
  ctaMobile: "14px"
  subLinkCard: "12px"
  skuButton: "10px"
  desktopHeaderButton: "6px"

zIndex:
  heroBackground: 0
  heroOverlay: 1
  heroCanvas: 2
  heroContent: 3
  siteHeaderBase: 50
  topBar: 51
  companyProfileFabMobileBase: 58
  companyProfileFabMobileResponsive: 95
  siteHeaderPremiumSticky: 100
  langDropdownMenu: 100
  megaDropdownPanel: 200
  companyProfileWidgetDesktop: 999
  socialWidgetFixed: 1000
  siteHeaderWhenMobileNavOpen: 1060
  mobileNavDrawer: 1060
  customerProfileToast: 2100
  customerProfileModal: 2200

breakpoints:
  desktopFullHeader: ">= 1381px"
  desktopCompactLaptop: "1241px - 1380px"
  desktopTight: "1101px - 1240px"
  mobileTabletSwitch: "<= 1100px"
  skuTabletGrid: "<= 1024px"
  heroStack: "<= 991px"
  catalogIntroStack: "<= 900px"
  tabletStatsAndTabs: "<= 768px"
  mobileGridAndButtons: "<= 640px"
  smallPhone: "<= 480px"
  narrowFoldPhone: "<= 355px"
  landscapeShortViewport: "(max-width: 1100px) and (max-height: 500px)"

motion:
  transitionDuration: "160ms - 240ms"
  transitionEasing: "cubic-bezier(0.22, 1, 0.36, 1)"
  safeProperties: ["transform", "opacity", "background-color", "border-color", "box-shadow"]
  forbiddenPatterns: ["MotionSites dark/neon/3D bloat", "foreign --ux-* CSS variables", "CLS-inducing layout animations"]
---

# DESIGN.md — Hợp Đồng Thiết Kế UI/UX Thực Phẩm Số Một (TPS1)

Tài liệu này là **Single Source of Truth** (chuẩn mực bắt buộc theo quy chuẩn `getdesign.md` kết hợp `web.dev` Accessibility) cho toàn bộ giao diện website B2B `thucphamsomot.vn`. Mọi AI Agent và kỹ sư Frontend bắt buộc đọc file này trước khi chỉnh sửa bất kỳ thành phần giao diện nào.

---

## 0. Cơ Chế Chống Xung Đột & Chống Làm Vỡ Giao Diện (Anti-Conflict & Anti-Bloat Protocol)

Khi tiếp thu và áp dụng các tư liệu thiết kế (`getdesign.md`, `lucianlabs.dev`, `MotionSites`, `ui-ux-pro-max`, `better-ui`, `better-motion`, `impeccable`), mọi AI Agent **BẮT BUỘC** tuân thủ nghiêm ngặt cơ chế chống xung đột và chống phình code dưới đây:

### 0.1. Thứ Tự Ưu Tiên Tuyệt Đối (Strict Hierarchy of Truth)
Khi xuất hiện bất kỳ khác biệt nào giữa gợi ý của các Design Skills bên ngoài và dự án hiện tại, phải xử lý theo đúng **4 cấp từ cao xuống thấp**:

1. **CẤP 1 (TỐI THƯỢNG) — Yêu cầu cụ thể của User & Giao diện chuẩn trên Server (`https://thucphamsomot.vn/`)**:
   - Những gì đang hiển thị tốt trên Server là chuẩn gốc.
   - **Tuyệt đối KHÔNG** tự ý "thiết kế lại theo ý mình", không tự bịa thêm thanh điều hướng phụ, không đổi bố cục hay thêm thắt chi tiết ngoài yêu cầu.
2. **CẤP 2 (HỢP ĐỒNG THIẾT KẾ NỘI BỘ) — File `DESIGN.md` của dự án TPS1**:
   - Khóa cứng bảng màu thương hiệu (`#0f6f4b`, `#133127`, `#ff7918`, `#f7faf8`, `#ffffff`), font `"Be Vietnam Pro"`, quy chuẩn ngôn ngữ tiếng Việt rõ ràng (không viết tắt `"ĐVT"`, dùng chữ `"và"` rõ nghĩa), bảng phân tầng `z-index`, và ngưỡng chữ tối thiểu trên Mobile.
3. **CẤP 3 (TINH CHỈNH BỐ CỤC & ĐỘ ĐỌC) — `better-ui` + `ui-ux-pro-max` + `web.dev A11y`**:
   - Chỉ áp dụng để chuẩn hóa khoảng cách (`padding`/`gap`), căn chỉnh quang học (`optical alignment`), vùng chạm tối thiểu `44px–48px` trên mobile, độ tương phản chữ và xử lý ngắt dòng tiếng Việt (`text-wrap: balance` / `pretty`, không rớt `1` từ lẻ loi).
4. **CẤP 4 (CHỈ MƯỢN THÔNG SỐ ĐỘ MƯỢT) — `lucianlabs.dev` + `MotionSites` + `better-motion`**:
   - Chỉ mượn thông số CSS transition mượt (`160ms–240ms`, `cubic-bezier(0.22, 1, 0.36, 1)`) trên các thuộc tính không gây Layout Shift (`transform`, `opacity`, `background-color`, `border-color`, `box-shadow`).
   - **TUYỆT ĐỐI CẤM**: Không áp dụng phong cách màu mè/dark-mode/3D/neon của `MotionSites`, không chèn biến `--ux-*` ngoại lai của `lucianlabs.dev` đè lên biến CSS hiện có của dự án, không tự ý thêm hiệu ứng cuộn làm nặng trang hoặc gây giật (`CLS > 0`).

### 0.2. Kỷ Luật Chống Xung Đột CSS & Cách Ly Breakpoint (Anti-Cascade Chaos)
1. **Sửa tại chỗ & Dọn sạch code thừa (In-Place Edit & Deduplication)**:
   - Trước khi viết CSS mới vào `app/globals.css`, phải tìm tất cả các rule đang tác động lên selector đó (kể cả trong các block `@media` ở giữa và cuối file).
   - Sửa trực tiếp tại rule gốc và **XÓA** các đoạn CSS dư thừa/trùng lặp thay vì nối thêm rule mới kèm `!important` ở cuối file gây xung đột chồng chéo.
2. **Cách ly tuyệt đối Desktop vs Mobile/Tablet**:
   - Mọi chỉnh sửa dành cho Mobile/Tablet chỉ được phép nằm trong `@media (max-width: 1100px)`, `768px`, `640px`, `480px`, hoặc `359px` (cùng rule đặc thù hẹp/ngang như `355px`, `max-height: 500px`).
   - Mọi chỉnh sửa dành cho Desktop chỉ được phép nằm trong `@media (min-width: 1101px)` (hoặc các tier `1101–1240px`, `1241–1380px`, `>= 1381px`).
   - **CẤM** sửa trực tiếp vào base selector dùng chung nếu thay đổi đó chỉ nhằm mục đích phục vụ Mobile (tránh lỗi *"sửa ở điện thoại thì hỏng ở máy tính"*).
3. **Hợp đồng Z-Index duy nhất (Single Z-Index Contract)**:
   - Không đặt `z-index` tùy tiện (`999`, `1000`, `9999`) ở từng component lẻ. Mọi lớp nổi phải tuân theo bảng phân tầng trong `DESIGN.md`:
     - Nội dung trang & Card: `0 – 10`
     - Sticky Header & TopBar (trạng thái thường): `50 – 51` (Header premium sticky: `100`)
     - Desktop Mega Dropdown: `200`
     - Floating Widgets khi đóng menu (`.company-profile-fab`, `.social-widget`): `58 – 1000` (**BẮT BUỘC** ẩn đi hoặc nằm dưới Mobile Menu Drawer `1060` khi `#site-mobile-nav.is-open` để không bao giờ đè lên chữ của menu).
     - Modal / Toast hệ thống: `2100 – 2200`

### 0.3. Kỷ Luật Sạch Repo (Zero Bloat)
- **Không** cài thêm bất kỳ package mới nào vào `package.json` / `package-lock.json`.
- **Không** tạo các thư mục/file nháp của skill ngoài phạm vi được yêu cầu.
- Trước khi bàn giao bất kỳ task UI nào, **BẮT BUỘC** kiểm tra cân bằng ngoặc CSS, chạy `eslint`, `tsc --noEmit`, `npm run build` và vòng lặp F12 đa thiết bị (Mobile `320px -> 430px`, Tablet `768px -> 1024px`, Desktop `1150px -> 1920px`) để chứng minh không có bất kỳ xung đột nào giữa các màn hình.

---

## 1. Visual Theme & Atmosphere

- **Định vị thẩm mỹ**: **B2B Food Supply Chuyên Nghiệp — Sạch — Tin Cậy — Tốc Độ Cao**. Website phục vụ các Bếp trưởng, Trưởng phòng Mua hàng, Quản lý nhà hàng, khách sạn, trường học và bếp ăn công nghiệp tại Đồng Nai và các tỉnh lân cận.
- **Tôn chỉ trải nghiệm**:
  - **Không bán lẻ đại trà**: Website đóng vai trò giới thiệu năng lực cung ứng, trưng bày danh mục tham khảo (`10` nhóm `SKU_GROUPS`) và chuyển đổi khách hàng sang form **Yêu cầu báo giá** hoặc **Cổng Đối Tác VIP** (`https://dathang.thucphamsomot.vn/`).
  - **Visual Economy & Header Simplicity**: Mọi phần tử trên màn hình đều phải có chức năng rõ ràng. Tuyệt đối không tạo 2 thanh điều hướng trùng lặp nội dung trên cùng một màn hình; không lặp 2 bộ chuyển ngôn ngữ khi nút `VI v` đã hiện trên thanh Header.
  - **Độ tin cậy công nghiệp**: Khẳng định chuẩn **ISO 22000 & HACCP**, giao đúng tuyến định kỳ, chứng từ VAT đầy đủ bằng mảng màu xanh rừng sâu đáng tin cậy kết hợp thẻ trắng sắc nét và khoảng thở rộng.

---

## 2. Color Palette & Roles

Không sử dụng mã màu tùy hứng ngoài hệ token dưới đây (lưu ý `:root` trong `app/globals.css` đang dùng `--background: #f6f7f4`, `--foreground: #14231c`, `--muted-foreground: #59665f`, `--accent: #0f6f4b`, `--gold: #f5c84c`; khi chuẩn hóa mở rộng ưu tiên nhóm token `colors` trong frontmatter):

| Token / Vai trò | Mã màu | Quy chuẩn sử dụng & WCAG AA |
| --- | --- | --- |
| `primary` | `#0f6f4b` | Màu thương hiệu chính: nút CTA Header chính, viền/chữ nút outline, đường gạch chân active menu (`2px`), tiêu điểm thương hiệu. Chữ trắng `#ffffff` trên nền `#0f6f4b` đảm bảo độ tương phản cao đạt chuẩn WCAG AA. |
| `primaryDark` | `#133127` | Nền TopBar chạy chữ, màu chữ tiêu đề `h1`/`h2` đậm (`font-weight: 900`), độ tương phản cao trên nền sáng. |
| `primaryHover` / `primaryDeep` | `#0a4f35` / `#0b6644` | Trạng thái `:hover` nút chính Header (`#0a4f35`) và trạng thái mở/active trong Mobile Accordion (`#0b6644`). |
| `accentOrange` | `#ff7918` | Màu nhấn chuyển đổi cao cho nút CTA nổi bật cuối trang sản phẩm (`.sp-page__cta-button`) hoặc điểm nhấn hành động phụ; không lạm dụng quá 1 điểm nhấn bão hòa trên cùng khung nhìn. |
| `goldDot` | `#f5c84c` | Chấm phân tách (`.b2b-topbar__dot`) trên nền `#133127` của thanh thông báo B2B trên cùng. |
| `canvas` / `canvasBase` | `#f7faf8` / `#f6f7f4` | Nền tổng thể các trang, tạo độ dịu mắt, phân tách rõ với thẻ nội dung trắng (`#ffffff`). |
| `surface` / `surfaceMintTint` | `#ffffff` / `#f5faf7` | Nền thẻ nội dung, Mega Dropdown, Drawer menu và khung con Accordion (`.site-mobile-nav__sublist` dùng `#f5faf7`, item dùng `#ffffff`). |
| `textPrimary` / `textSecondary` | `#142d21` / `#355047` | Văn bản chính và văn bản phụ đọc lâu không mỏi mắt. |
| `textMuted` | `#55695d` | Nhãn phụ trợ (`Đơn vị:`, ghi chú phụ) — không dùng cho đoạn văn bản dài nếu nền không đủ sáng. |
| `borderSubtle` / `borderHairline` | `rgba(15, 111, 75, 0.12)` / `rgba(20, 35, 28, 0.08)` | Đường viền mảnh `1px` phân tầng thẻ phẳng (card, nav pill, header border) thay cho bóng đổ nặng nề. |
| Trạng thái & Kênh liên hệ | `#c7372f`, `#0068ff`, `#1264d7` | Đỏ `#c7372f` chỉ dùng cho cảnh báo/hành động hủy; `#0068ff` dành riêng cho nút **Zalo**; `#1264d7` dành riêng cho nút **Facebook**. Không dùng màu đơn độc để báo trạng thái, luôn đi kèm icon hoặc nhãn chữ. |

---

## 3. Typography Rules

### Font Stack Chuẩn Tiếng Việt
- Khai báo thống nhất: `"Be Vietnam Pro", "Segoe UI", Arial, sans-serif` (self-hosted WOFF2 subsets `vietnamese` và `latin` qua `app/fonts.css` với đủ weights `400, 500, 600, 700, 800, 900`).
- Bật `text-rendering: geometricPrecision`, `-webkit-font-smoothing: antialiased` trên `body` để dấu mũ/dấu nặng tiếng Việt sắc nét.

### Thang chữ Desktop (`>= 1101px`)
- **Hero H1 (`.hero-title`)**: `68px`, `font-weight: 900`, `line-height: 1.04`.
- **Page Hero Title (`.page-hero__title`)**: `56px`, `line-height: 1.04`, `text-wrap: balance`.
- **Section Heading (`h2.section-title`, `.sp-page__cta h2`)**: `clamp(1.75rem, 3.2vw, 2.55rem)` hoặc `clamp(1.85rem, 4vw, 40px)`, `font-weight: 900`, `line-height: 1.12–1.15`, `letter-spacing: -0.02em` đến `-0.03em`.
- **Mega Dropdown Item Label (`.site-nav__mega-label`)**: `17px`, `font-weight: 700`, `line-height: 1.25`, `white-space: nowrap`.
- **Thẻ sản phẩm (`.sku-row__name`)**: `15px`, `font-weight: 800`, `line-height: 1.4`, khóa `2` dòng (`line-clamp: 2`).
- **Menu Header (`.site-nav__link`) & Nút Header**: `0.9rem` (`14.4px` tại tier `>= 1381px`), co tự động xuống `0.86rem` (`1241–1380px`) và `0.8rem` (`1101–1240px`).

### Ngưỡng chữ tối thiểu & A11y trên Mobile (`<= 1100px` / `<= 768px`)
Tuân thủ kỷ luật đọc rõ trên thiết bị di động (`web.dev`):
1. **Tiêu đề mục, Menu chính, Nút CTA chính & Input/Search**: tối thiểu **`>= 16px`** (input bắt buộc `16px` để iOS Safari không tự động zoom khi chạm gõ; `.site-mobile-nav__link` và `.site-mobile-nav__accordion-link` là `16.5px`, `font-weight: 800`).
2. **Thân bài, Mô tả, Tên sản phẩm, Danh mục con**: tối thiểu **`14.5px–16px`**, `line-height: 1.38–1.65` (`1.6–1.65` cho đoạn văn mô tả để dấu nặng/mũ không dính dòng).
3. **Nhãn phụ (Đơn vị, ghi chú giá, nút phụ, thanh Gọi/Zalo/Facebook, TopBar)**: tối thiểu **`13px–14px`**. Tuyệt đối cấm render chữ thông tin ở cỡ `10px–12px` trên điện thoại.

### Quy tắc ngắt dòng & Viết chữ Tiếng Việt
- **Chống cắt chữ & bẹt chữ**:
  - Không áp dụng `text-transform: uppercase` kết hợp `letter-spacing` giãn rộng trên các ô số liệu chật hẹp mobile (`.b2b-scale-stat__label` trên `<= 768px` bắt buộc `text-transform: none; letter-spacing: normal`).
  - Không để `overflow: hidden` gây cắt cụt chữ 2 đầu thanh Header (`"Giới Thiệu"`, `"Liên Hệ"`).
- **Chống rớt 1 từ lẻ loi (Zero-Orphan)**:
  - Áp dụng `text-wrap: balance` cho tiêu đề, nút bấm, thẻ danh mục con; dùng `text-wrap: pretty` cho đoạn mô tả.
  - Khi xuống dòng sau từ `"và"`, phải giữ theo cụm từ có nghĩa (hoặc dùng `&nbsp;` / thẻ ngắt dòng có kiểm soát trên mobile).
- **Không viết tắt tối nghĩa**: dùng `"Đơn vị: "` thay vì `"ĐVT: "`, dùng `"(ví dụ: cá basa, thịt vai, cải thảo)"` thay vì `"(vd: ...)"`, dùng chữ `"và"` trong câu tiêu đề/mô tả tiếng Việt thay cho `"&"`.

---

## 4. Component Stylings

### 4.1. TopBar & Desktop Header (3-Tier Responsive)
- **TopBar (`.b2b-topbar`)**: Nền `#133127`, chữ trắng `rgba(255, 255, 255, 0.92)`, chấm vàng `#f5c84c`, chạy marquee `28s linear infinite` trên Desktop; trên Mobile chữ tối thiểu `13px`.
- **Header Desktop (`.site-header--premium`)**: Cao `72px`, nền `rgba(255, 255, 255, 0.98)`, `backdrop-filter: blur(8px)`, viền đáy `1px solid #eaeaea`, container tối đa `1340px`.
  - Logo thương hiệu `.site-brand__mark`: rộng `158px`, cao `52px`.
  - Thanh menu pill giữa (`.site-nav--minimal`): nền `rgba(255, 255, 255, 0.92)`, bo tròn `999px`, viền `1px solid rgba(20, 35, 28, 0.08)`, bóng nhẹ `0 12px 34px rgba(20, 35, 28, 0.06)`. Hiệu ứng hover/active bằng gạch chân `::after` cao `2px` màu `#0f6f4b` (kích hoạt `.is-active` cho `"Danh Mục Hàng Hóa"` trên cả `/san-pham`, `/danh-muc/*`, `/en/products`).
  - Cụm phải (`.site-header__actions`): Dropdown ngôn ngữ `VI v` (`.lang-dropdown-toggle`), nút outline **`Cổng Đối Tác VIP`** (`1.5px solid #0f6f4b`, `border-radius: 6px`) và nút solid **`Gửi yêu cầu báo giá`** (nền `#0f6f4b`, `border-radius: 6px`).
  - **3 tầng co giãn Desktop (tuyệt đối không rớt dòng hay cắt chữ `"Liên Hệ"`):**
    1. `>= 1381px`: Full server layout (`nav padding: 6px 22px`, `link: 0.9rem`, `logo: 158x52px`).
    2. `1241px–1380px`: Compact laptop (`gap: 12px`, `logo: 140x46px`, `nav padding: 6px 18px`, `link: 0.86rem`, CTA `0.84rem`).
    3. `1101px–1240px`: Tight desktop (`gap: 8px`, `logo: 120x38px`, `nav padding: 5px 16px`, `link: 0.8rem`, CTA `0.78rem`).

### 4.2. Desktop Mega Dropdown (`Danh Mục Hàng Hóa`)
- Panel `.site-nav__mega` căn giữa bên dưới link, rộng `min(640px, calc(100vw - 32px))`, bo góc `18px`, viền `1px solid rgba(15, 111, 75, 0.14)`, kèm cầu nối hover vô hình `::before` cao `18px` để di chuột không bị tắt đột ngột.
- **Đầu bảng (`.site-nav__mega-head`)**: Tiêu đề `DANH MỤC NGUỒN HÀNG TPS1` (EN: `TPS1 PRODUCT CATALOG`) + nút pill `Xem tất cả sản phẩm >`.
- **Lưới 2 cột (`.site-nav__mega-grid`)**: Hiển thị trọn vẹn **10 nhóm** từ `SKU_GROUPS`:
  - Mỗi ô `.site-nav__mega-item` (`border-radius: 12px`, padding `12px 14px`) gồm khung icon Lucide `40px × 40px` (nền `#edf7f2`, hover đổi `#0f6f4b` chữ trắng) + nhãn `.site-nav__mega-label` **`17px` bold khóa 1 dòng (`white-space: nowrap`)**.
  - **Không hiển thị dòng mô tả phụ** bên dưới tên nhóm hàng để giữ sự gọn gàng, dễ quét nhanh.
  - **Chống lỗi 404**: 9 nhóm có `hasPage: true` trỏ tới `/danh-muc/[slug]`; riêng nhóm `thiet-bi-bep` (`"Dụng cụ bếp"`, `hasPage: false`) bắt buộc trỏ về `/san-pham?category=thiet-bi-bep#danh-muc`.
- **Chân bảng (`.site-nav__mega-foot`)**: `Cần danh mục & quy cách riêng cho bếp?` + CTA `Gửi yêu cầu báo giá ->`.

### 4.3. Mobile Header & Drawer (`<= 1100px`)
- **Thanh Header Mobile**: Cao `60px` (`50px` khi màn hình ngang `max-height: 500px`). Giữ duy nhất 3 vùng: Logo bên trái (`108x36px` dưới `480px`), nút ngôn ngữ pill `VI v` (`min-width: 44px; min-height: 42px`) + nút hamburger/`X` (`44px × 44px`, bo tròn `9999px`).
- **Loại bỏ trùng lặp**: Không sử dụng thanh trượt ngang `.site-header__mobile-subnav`; không lặp lại khối chuyển ngôn ngữ bên trong `#site-mobile-nav`.
- **Drawer (`#site-mobile-nav`)**:
  - Đặt `max-height: calc(100dvh - var(--site-header-bottom, 108px))`, `overflow-y: auto`, `padding-bottom: calc(32px + env(safe-area-inset-bottom))` để cuộn tới mục cuối không bị khuất.
  - Nhóm CTA đầu Drawer: `Cổng Đối Tác VIP` và `Gửi yêu cầu báo giá` (`min-height: 48px`, chữ `16px`, `font-weight: 800`, bo góc `14px`; chuyển `1` cột ở `<= 640px`).
  - **Accordion `"Danh Mục Hàng Hóa"` (`.site-mobile-nav__accordion`)**: Gom link và nút mở `ChevronDown` (`52px × 52px`) vào chung một thẻ bo `16px`. Khi mở hiển thị `.site-mobile-nav__sublist` nền `#f5faf7`, lưới `2` cột (`1` cột ở `<= 355px`), chứa đủ **10 nhóm hàng dạng thẻ trắng không icon** (`min-height: 46px`, chữ **`14.5px`** `font-weight: 700`) kèm nút toàn chiều rộng `Xem tất cả sản phẩm ->` (`15px`).

### 4.4. Product Card (`.sku-row`) & Khu Vực Danh Mục (`.sku-section`)
- **Intro (`.sku-section__intro`)**: Lưới 2 cột trên Desktop (1 cột ở `<= 900px`): nhãn `NGUỒN HÀNG TPS1 TUYỂN CHỌN` (EN: `CURATED TPS1 CATALOG`), tiêu đề `Chọn nhóm hàng phù hợp với bếp`, mô tả tham khảo giá theo bảng riêng.
- **Bộ lọc (`.sku-controls`)**: Thanh tìm kiếm cao `52px` (`16px` trên mobile) với placeholder `(ví dụ: cá basa, thịt vai, cải thảo)`; hàng tab nhóm hàng tự xuống `2` hàng thoáng trên Desktop, vuốt ngang mượt không thanh cuộn ở `<= 768px`.
- **Thanh kết quả (`.sku-results-head`)**: Hiển thị số lượng sản phẩm bên trái + nút pill `.sku-portal-btn` (`Đăng nhập để xem giá & đặt hàng ->`, viền `1.5px solid #c7d8cb`, bo `999px`) bên phải.
- **Thẻ sản phẩm (`.sku-row`)**: Lưới `4` cột Desktop, `3` cột Tablet (`<= 1024px`), `2` cột Mobile (`<= 640px`).
  - Khung ảnh (`.sku-row__media`): `aspect-ratio: 4 / 3`, ảnh `.sku-row__img` dùng `object-fit: cover` (lấp đầy khung, không để viền trắng nham nhở, hover `scale(1.05)`).
  - Nhãn danh mục (`.sku-row__cat-badge`): Đặt nổi ở góc trên trái ảnh (`top: 10px; left: 10px`), nền `rgba(255, 255, 255, 0.94)` với `backdrop-filter: blur(4px)`.
  - Thân thẻ (`.sku-row__body`): Tên `.sku-row__name` khóa `2` dòng; hàng thông tin `.sku-row__pricing` chia `Đơn vị: ...` và `Giá theo bảng riêng` trên cùng `1` hàng ngang trên Desktop (xếp dọc gọn trên `<= 640px` với cỡ chữ `13px`); nút `.sku-row__btn` nền `#edf7f1` chữ `#0a744e` (`height: 40px` Desktop, `42px` Mobile, `44px` dưới `359px`) với nhãn **`Nhận báo giá →`**.

### 4.5. Bottom Floating Widgets
- **Thanh liên hệ nhanh (`.social-widget`)**:
  - Desktop (`>= 1101px`): Dọc cố định góc dưới phải (`right: 24px; bottom: 24px`), 3 nút tròn `52px × 52px` (Điện thoại `#0f6f4b`, Zalo `#0068ff`, Facebook `#1264d7`).
  - Mobile (`<= 1100px`): Thanh 3 cột cố định đáy màn hình (`width: calc(100% - 20px)`, `right: 10px`, `bottom: calc(12px + env(safe-area-inset-bottom))`), nút cao `46px`, chữ **`13.5px`** (`12.5px` chỉ ở màn siêu hẹp `<= 350px` nếu cần), nhãn `"Gọi"`, `"Zalo"`, `"Facebook"`.
- **Nút Hồ sơ năng lực (`.company-profile-fab`)**:
  - Desktop (`>= 1101px`): Nút tròn `52px × 52px` tại `right: 24px; bottom: 220px`, kèm thẻ cố định bên trái `.company-profile-widget` (`z-index: 999`).
  - Mobile (`<= 1100px`): Nút FAB gọn tại `right: 12px; bottom: calc(70px + env(safe-area-inset-bottom))`, ẩn `.company-profile-widget` bên trái để không che chữ.

---

## 5. Layout Principles

- **Container Shell**: `.container-shell` dùng `width: min(calc(100% - var(--site-gutter)), var(--site-shell-max))` (`1280px` cho nội dung trang, `1340px` riêng cho `.site-header .container-shell`).
- **Chống tràn ngang (Zero-Overflow)**: Cả `html` và `body` giữ `overflow-x: clip` (không dùng `overflow-x: hidden` trên root vì dễ làm hỏng `position: sticky` của Header).
- **Khoảng trắng & Phân tách**: Nhịp section chuẩn `80px` trên/dưới trên Desktop; dùng nền xen kẽ (`#ffffff` vs `#f6f8f5` / `#f7faf8`) và viền mảnh `1px` thay cho đường kẻ đậm.
- **Khoảng đệm an toàn đáy trang (Bottom Safe Area)**: Trên Mobile (`<= 1100px`), `.site-footer` bắt buộc có `padding-bottom: calc(116px + env(safe-area-inset-bottom)) !important` để thanh `.social-widget` và `.company-profile-fab` cố định ở đáy không bao giờ che nội dung bản quyền hoặc link footer.

---

## 6. Depth & Elevation (Z-Index Contract)

Tuân thủ tuyệt đối bậc thang `z-index` đã thiết lập để triệt tiêu lỗi đè lớp phủ khi mở Menu Mobile hoặc Modal:

| Tầng | Selector | `z-index` | Quy tắc phối hợp bắt buộc |
| --- | --- | --- | --- |
| Tầng nền & Hero | `.b2b-hero__bg` / `__overlay` / `__canvas` / `__content` | `0 → 3` | Nội dung Hero luôn nằm trên lớp phủ và Canvas 3D. |
| Thanh Header thường | `.site-header` / `.b2b-topbar` / `.site-header--premium` | `50` / `51` / `100` | Sticky top; dropdown ngôn ngữ ở `100`. |
| FAB HSNL Mobile | `.company-profile-fab` (Mobile) | `58` / `95` | Nằm dưới Header và Mobile Nav, cách đáy `70px`. |
| Mega Dropdown Desktop | `.site-nav__mega` | `200` | Nổi rõ trên toàn bộ Hero và Card trang. |
| Widget nổi cố định | `.company-profile-widget` / `.social-widget` | `999` / `1000` | Nổi trên nội dung trang bình thường. |
| **Mobile Menu đang mở** | `.site-header:has(#site-mobile-nav.is-open)`, `.site-mobile-nav` | **`1060`** | **Bắt buộc** đi kèm rule ẩn `.social-widget` và `.company-profile-fab` (`display: none !important`) cùng `body { overflow: hidden }` khi `#site-mobile-nav.is-open`, ngăn thanh Gọi/Zalo/Facebook đè lên chữ trong Drawer. |
| Thông báo & Modal | `.customer-profile-toast` / `.customer-profile-modal` | `2100` / `2200` | Lớp cao nhất trên toàn hệ thống. |

---

## 7. Responsive Behavior & Device Matrix

### Nguyên tắc tách biệt Desktop & Mobile
- **Bảo lưu tuyệt đối Desktop (`>= 1101px`)**: Mọi quy tắc ghi đè dành cho điện thoại/tablet bắt buộc đóng gói trong `@media (max-width: 1100px)` (hoặc nhỏ hơn: `1024px`, `991px`, `900px`, `768px`, `640px`, `480px`, `355px`). Ngược lại, những style đặc thù Desktop Header (`site-nav--minimal`) chỉ nằm ở base Desktop / `@media (min-width: 1101px)`.
- **Không dùng `display: none` hay `opacity: 0` tùy tiện làm mất phần tử thông tin trên Mobile** (ví dụ nền kho lạnh `.b2b-hero__bg` và các thẻ chỉ số `.b2b-hero__stats` phải giữ hiển thị ở `<= 640px`).

### Ma trận Viewport Kiểm Thử Bắt Buộc
1. **Desktop lớn / Chuẩn F12**: `1920px`, `1440px`, `1366px`, `1280px` (Windows 125% scaling rơi vào tier `1241–1380px`), `1101px` (mốc biên ngay trước khi chuyển Mobile Drawer).
2. **Tablet & Mobile chuẩn**:
   - `768px` (iPad / Tablet dọc — kiểm tra stack 2 cột, tab cuộn ngang).
   - `430 × 932 px` (iPhone 14/15 Pro Max — màn hình rộng cao cấp).
   - `412 × 915 px` (Google Pixel 7 / Galaxy S24).
   - `390 × 844 px` (iPhone 12/13/14/15).
   - `375 × 667 px` (iPhone SE).
   - `360 × 800 px` (Samsung Galaxy A55 — chuẩn phổ thông Việt Nam).
   - `320 × 892 px` (Samsung Galaxy Z Fold 5 gập ngoài — bắt buộc `Zero-Clip`, `.site-mobile-nav__sublist` tự chuyển `1` cột ở `<= 355px`).
3. **Mobile xoay ngang**: `(max-width: 1100px) and (max-height: 500px)` — thu gọn chiều cao header (`50px`) và hero padding (`18px`) để hiển thị được nội dung chính ngay màn hình đầu.

---

## 8. Do's and Don'ts (Hard Anti-Patterns)

### DO (Bắt buộc thực hiện)
- **DO** giữ nguyên bố cục 3-tier Desktop Header và Mega Dropdown 10 nhóm hàng; luôn gắn cầu nối hover và xử lý route an toàn cho nhóm `hasPage: false`.
- **DO** giữ kích thước vùng chạm từ `42px–48px` cho mọi nút điều hướng, nút chọn ngôn ngữ, tab danh mục và nút hành động trên Mobile.
- **DO** dùng `"Be Vietnam Pro"`, cỡ chữ tối thiểu `13px–14px` cho nhãn phụ và `14.5px–16.5px` cho nội dung/menu trên Mobile.
- **DO** đặt `aspect-ratio` rõ ràng (như `4 / 3` với `object-fit: cover` cho thẻ `.sku-row`) để ảnh không méo hoặc chừa khoảng trắng nham nhở.
- **DO** kiểm tra `body:has(#site-mobile-nav.is-open)` khi thêm bất kỳ widget nổi nào để bảo đảm nó tự ẩn khi Drawer mở.

### DON'T (Tuyệt đối cấm)
- **DON'T** sửa CSS Mobile làm vỡ hoặc đổi giao diện Desktop (`>= 1101px`), và ngược lại.
- **DON'T** dùng cỡ chữ `< 13px` cho thông tin hiển thị trên Mobile (kể cả badge, ghi chú đơn vị, nút liên hệ, nhãn dưới số liệu).
- **DON'T** để xảy ra lỗi che mất nửa chữ, cắt chữ hai mép Header (`"Giới Thiệu"`, `"Liên Hệ"`), tràn viền ngang (`scrollWidth > clientWidth`), hay thanh nổi đáy che nút/footer.
- **DON'T** chèn lại thanh `.site-header__mobile-subnav` hoặc khối đổi ngôn ngữ thứ hai vào trong `#site-mobile-nav`.
- **DON'T** viết tắt gây khó hiểu trên UI (`"ĐVT:"`, `"vd:"`, `"SL"` thay cho `"Số lượng"`), không lạm dụng `text-transform: uppercase` + tracking rộng làm bẹt chữ tiếng Việt trên cột hẹp, và không rớt 1 từ lẻ loi đơn độc xuống dòng mới.
- **DON'T** dùng `transition: all` tràn lan cho hiệu ứng phức tạp hoặc animate `width`/`height`/`top`/`left`; ưu tiên `transform` và `opacity` kết hợp tôn trọng trải nghiệm mượt.

---

## 9. Agent Prompt Guide & Iterative F12 Verification Loop

Mỗi AI Agent khi nhận yêu cầu chỉnh sửa hoặc thiết kế mới giao diện cho TPS1 **bắt buộc** thực hiện đúng quy trình 5 bước sau:

1. **Đọc `DESIGN.md` trước khi viết bất kỳ dòng CSS/JSX nào**: Đối chiếu toàn bộ màu sắc, font size, radius, z-index và breakpoints về các giá trị đã khóa ở phần YAML Frontmatter.
2. **Kiểm tra tách lớp & chống trùng lặp**: Xác minh thay đổi chỉ tác động đúng phạm vi `@media` mục tiêu (Desktop `>= 1101px` vs Mobile `<= 1100px`) và không tạo thêm thanh điều hướng/nút chuyển ngữ dư thừa.
3. **Chạy kiểm định tĩnh bắt buộc**:
   - `npx eslint <affected-files>`
   - `npx tsc --noEmit`
   - `npm run build` (Next.js production build phải pass mã thoát `0`).
4. **Vòng lặp kiểm tra F12 trực quan đa thiết bị (Iterative F12 Verification Loop)**:
   Mở trình duyệt / Chrome DevTools kiểm tra trực tiếp trang bị ảnh hưởng ở các mốc viewport tối thiểu: `1440px`, `1280px`, `1101px`, `768px`, `390px`, `360px`, `320px` (cả trạng thái đóng và mở Mega Menu / Mobile Drawer) và ghi nhận **Mismatch Ledger**:

| Viewport | Kiểm tra tràn ngang (`scrollWidth <= innerWidth`) | Độ rõ chữ (`>= 13px / 14.5px / 16px`) | Cắt chữ / Che lớp phủ (`z-index`) | Ngắt dòng tiếng Việt / Tap target (`>= 44px`) | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| `1440px` / `1280px` / `1101px` | Đạt | Đạt | Đạt | Đạt | PASS |
| `768px` / `390px` / `360px` / `320px` | Đạt | Đạt | Đạt | Đạt | PASS |

5. **Chỉ bàn giao khi `Mismatch Ledger = 0 lỗi`** ở cả trạng thái tĩnh lẫn tương tác (hover dropdown, mở mobile accordion, cuộn xuống cuối trang, kiểm tra Next.js DevTools không phát sinh lỗi hydration/console).
