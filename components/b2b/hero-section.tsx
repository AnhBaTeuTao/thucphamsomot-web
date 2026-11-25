"use client";

import { useEffect, useRef, useState } from "react";
import { getImageProps } from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { preload } from "react-dom";
import {
  ShieldCheck,
  FileText,
  CheckCircle,
  Check,
  Send,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react";
import { trackMetaLead } from "@/components/meta-pixel";
import { ScrollReveal } from "@/components/b2b/scroll-reveal";

const ThreeBackground = dynamic(
  () => import("@/components/b2b/three-background").then((mod) => mod.ThreeBackground),
  { ssr: false, loading: () => null },
);

const HERO_MOBILE_MEDIA = "(max-width: 768px)";
const DESKTOP_3D_MEDIA = "(min-width: 1024px)";

const heroImageCommon = {
  alt: "Kho hàng Thực Phẩm Số Một - Năng lực cung ứng B2B",
  fill: true,
  priority: true,
  quality: 88,
  sizes: "100vw",
};
const heroDesktopImage = getImageProps({ ...heroImageCommon, src: "/images/hero-warehouse.jpg" }).props;
const heroMobileImage = getImageProps({ ...heroImageCommon, src: "/images/hero-warehouse-mobile.jpg" }).props;

function useDesktopWebGL() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const desktopMq = window.matchMedia(DESKTOP_3D_MEDIA);
    let introDone = false;
    let idleId: number | null = null;
    let fallbackTimer: number | null = null;

    const scheduleEnable = () => {
      if (!desktopMq.matches) {
        setEnabled(false);
        return;
      }
      const run = () => {
        if (desktopMq.matches) setEnabled(true);
      };
      // Wait 320ms after Intro fully unmounts + browser idle so WebGL init never janks transition
      idleId = window.setTimeout(() => {
        if (typeof window.requestIdleCallback === "function") {
          idleId = window.requestIdleCallback(run, { timeout: 600 });
        } else {
          run();
        }
      }, 320);
    };

    const handleIntroFinished = () => {
      introDone = true;
      if (fallbackTimer !== null) {
        window.clearTimeout(fallbackTimer);
        fallbackTimer = null;
      }
      scheduleEnable();
    };

    const handleMediaChange = () => {
      if (!desktopMq.matches) {
        setEnabled(false);
      } else if (introDone) {
        scheduleEnable();
      }
    };

    window.addEventListener("tps1-intro-finished", handleIntroFinished);
    desktopMq.addEventListener("change", handleMediaChange);

    // If intro is not active on this route (e.g. /en) or as a safety fallback after 3.9s
    const checkTimer = window.setTimeout(() => {
      const introActive =
        document.documentElement.classList.contains("tps1-intro-docking") ||
        Boolean(document.querySelector(".tps1-intro"));
      if (!introActive) {
        handleIntroFinished();
      }
    }, 280);

    fallbackTimer = window.setTimeout(() => {
      handleIntroFinished();
    }, 5000);

    return () => {
      window.removeEventListener("tps1-intro-finished", handleIntroFinished);
      desktopMq.removeEventListener("change", handleMediaChange);
      window.clearTimeout(checkTimer);
      if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
      if (idleId !== null) {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleId);
        } else {
          window.clearTimeout(idleId);
        }
      }
    };
  }, []);

  return enabled;
}

type HeroStatDef = {
  value: string;
  label: string;
  targetNum: number;
  decimals?: number;
  suffix: string;
  decimalSep?: string;
};

function AnimatedHeroStat({ stat }: { stat: HeroStatDef }) {
  const [display, setDisplay] = useState(stat.value);

  useEffect(() => {
    let rafId = 0;
    let started = false;

    const runCountUp = () => {
      if (started) return;
      started = true;
      const duration = 1100;
      const startTime = performance.now();
      const decimals = stat.decimals ?? 0;
      const sep = stat.decimalSep ?? ",";

      const formatNum = (val: number) => {
        if (decimals > 0) {
          return `${val.toFixed(decimals).replace(".", sep)}${stat.suffix}`;
        }
        return `${Math.round(val)}${stat.suffix}`;
      };

      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        // easeOutExpo: silky fast launch, cushioned settle
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setDisplay(formatNum(stat.targetNum * eased));
        if (t < 1) {
          rafId = window.requestAnimationFrame(step);
        } else {
          setDisplay(stat.value);
        }
      };

      rafId = window.requestAnimationFrame(step);
    };

    window.addEventListener("tps1-intro-finished", runCountUp, { once: true });

    // If visited via SPA navigation or /en (no intro active), gently trigger once visible
    const fallbackId = window.setTimeout(() => {
      const introActive =
        document.documentElement.classList.contains("tps1-intro-docking") ||
        Boolean(document.querySelector(".tps1-intro"));
      if (!introActive) runCountUp();
    }, 320);

    return () => {
      window.removeEventListener("tps1-intro-finished", runCountUp);
      window.clearTimeout(fallbackId);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [stat.decimalSep, stat.decimals, stat.suffix, stat.targetNum, stat.value]);

  return (
    <div className="b2b-hero__stat">
      <span className="b2b-hero__stat-value">{display}</span>
      <span className="b2b-hero__stat-label">{stat.label}</span>
    </div>
  );
}

const texts = {
  vi: {
    heroStats: [
      { value: "24\u00A0giờ", label: "Thời gian gửi báo\u00A0giá", targetNum: 24, suffix: "\u00A0giờ" },
      { value: "2\u00A0giờ làm\u00A0việc", label: "Thời gian xác nhận yêu\u00A0cầu", targetNum: 2, suffix: "\u00A0giờ làm\u00A0việc" },
      { value: "109+", label: "Doanh nghiệp và bếp\u00A0ăn đang hợp\u00A0tác", targetNum: 109, suffix: "+" },
      { value: "99,8%", label: "Tỷ lệ đơn hàng giao đúng\u00A0hẹn", targetNum: 99.8, decimals: 1, decimalSep: ",", suffix: "%" },
    ] as HeroStatDef[],
    heroPills: [
      "Cung cấp hồ sơ an toàn thực\u00A0phẩm khi\u00A0cần",
      "Giá sỉ tính theo sản lượng đặt\u00A0hàng",
      "Giao hàng theo ngày, theo tuần hoặc theo\u00A0ca",
    ],
    certText: "Đạt chứng nhận ISO 22000 & HACCP",
    title: (
      <>
        Nhà cung cấp thực{"\u00A0"}phẩm{" "}
        <br className="tps1-br-md" />
        cho <span className="b2b-hero__highlight">bếp{"\u00A0"}ăn công{"\u00A0"}nghiệp,</span>{" "}
        <br className="tps1-br-md" />
        <span className="b2b-hero__highlight">trường{"\u00A0"}học</span> tại Đồng{"\u00A0"}Nai
      </>
    ),
    slogan: "Gửi trọn an tâm trong từng bữa\u00A0ăn",
    sub: "TPS1 cung cấp hơn 5.000\u00A0mặt\u00A0hàng thực\u00A0phẩm cho bếp\u00A0ăn công\u00A0nghiệp, trường\u00A0học, bệnh\u00A0viện và nhà\u00A0hàng tại Đồng\u00A0Nai, Bình\u00A0Dương, TP.HCM và Bà\u00A0Rịa\u00A0–\u00A0Vũng\u00A0Tàu. Rau củ, thịt cá tươi sống, hàng đông\u00A0lạnh, đồ\u00A0khô, gia\u00A0vị đều đặt được từ một đầu mối, có chứng từ nguồn gốc đầy đủ và giao tận bếp đúng\u00A0lịch.",
    formRibbon: "XÁC NHẬN TRONG 2\u00A0GIỜ LÀM\u00A0VIỆC",
    formSuccessTitle: "Đã nhận yêu cầu!",
    formSuccessDesc: (name: string) => (
      <>
        TPS1 đã ghi nhận yêu cầu của <strong>{name || "quý khách"}</strong>.
        <br />
        TPS1 sẽ xác nhận yêu cầu trong <strong>2{"\u00A0"}giờ làm{"\u00A0"}việc</strong> và hoàn thành báo giá trong{" "}
        <strong>24{"\u00A0"}giờ</strong>.
      </>
    ),
    formCommitmentTitle: "Cam kết dịch vụ TPS1",
    formCommitment1: "Báo giá minh bạch: Giá được tính theo số lượng đặt hàng, không có phí ẩn.",
    formCommitment2: "Hồ sơ rõ ràng: Cung cấp chứng từ và hồ sơ ATTP theo yêu cầu.",
    formNewRequest: "← Gửi yêu cầu khác",
    formTitle: "Gửi nhu cầu, nhận báo giá trong 24\u00A0giờ",
    formDesc: "Tải lên danh sách hàng cần mua, hoặc điền vài thông tin ngắn bên\u00A0dưới.",
    uploadPlaceholder: "Kéo thả hoặc tải lên danh sách hàng (Excel/PDF)",
    uploadSub: "Xác nhận trong 2\u00A0giờ làm\u00A0việc · Hoàn thành báo giá trong 24\u00A0giờ",
    companyLabel: "Tên công ty hoặc cơ sở bếp *",
    companyPlaceholder: "Ví dụ: Công ty TNHH ABC",
    phoneLabel: "SĐT hoặc Zalo liên hệ *",
    phonePlaceholder: "Nhập số điện thoại",
    categoryLabel: "Nhóm hàng quan tâm",
    catOptions: [
      "Rau củ quả tươi sạch",
      "Thịt cá hải sản",
      "Đồ khô & gia vị",
      "Tất cả các nhóm",
    ],
    notesLabel: "Mô tả ngắn nhu cầu *",
    notesPlaceholder: "Ví dụ: Cần 500 kg gà mỗi tuần, giao cho 2 bếp ăn",
    submitBtn: "Gửi yêu cầu báo giá",
    submitSubmitting: "Đang gửi yêu cầu...",
    disclaimer:
      "* TPS1 dùng thông tin này để liên hệ tư vấn và báo giá. Không dùng cho mục đích\u00A0khác.",
  },
  en: {
    heroStats: [
      { value: "24h", label: "Detailed quote turnaround", targetNum: 24, suffix: "h" },
      { value: "2 working hours", label: "Order request confirmation", targetNum: 2, suffix: " working hours" },
      { value: "109+", label: "Partner companies and kitchens", targetNum: 109, suffix: "+" },
      { value: "99.8%", label: "On-schedule deliveries", targetNum: 99.8, decimals: 1, decimalSep: ".", suffix: "%" },
    ] as HeroStatDef[],
    heroPills: [
      "Food safety records supplied on request",
      "Wholesale pricing scaled by volume",
      "Daily, weekly, or shift-based delivery",
    ],
    certText: "ISO 22000 & HACCP Certified",
    title: (
      <>
        Your reliable<br />
        B2B food supply <span>partner</span><br />
        in Dong Nai
      </>
    ),
    slogan: "Delivering peace of mind in every meal",
    sub: "Serving restaurants, company canteens, factories, schools, and hospitals across Dong Nai, Ho Chi Minh City, and neighboring provinces with 5,000+ traceable items.",
    formRibbon: "CONFIRMED WITHIN 2 WORKING HOURS",
    formSuccessTitle: "Request Received!",
    formSuccessDesc: (name: string) => (
      <>
        We have received the request from <strong>{name || "you"}</strong>.
        <br />
        TPS1 will confirm within <strong>2 working hours</strong> and deliver your quote within{" "}
        <strong>24 hours</strong>.
      </>
    ),
    formCommitmentTitle: "TPS1 Service Commitment",
    formCommitment1: "Transparent quotes: Competitive volume pricing with no hidden fees.",
    formCommitment2: "Clear documentation: Full food-safety records provided on request.",
    formNewRequest: "← Send another request",
    formTitle: "Get your quote within 24 hours",
    formDesc: "Upload your buying list or fill in a few details below.",
    uploadPlaceholder: "Drag & drop or upload buying list (Excel/PDF)",
    uploadSub: "Confirmed in 2 working hours · Detailed quote in 24 hours",
    companyLabel: "Company or Kitchen Name *",
    companyPlaceholder: "Ex: ABC Company",
    phoneLabel: "Phone or Zalo Contact *",
    phonePlaceholder: "Enter your phone number",
    categoryLabel: "Product Category",
    catOptions: [
      "Fresh vegetables & fruits",
      "Fresh meat & seafood",
      "Dry goods & kitchen seasonings",
      "All product categories",
    ],
    notesLabel: "Brief order requirements *",
    notesPlaceholder: "Ex: Need 500kg chicken weekly for 2 company canteens",
    submitBtn: "Request a quote",
    submitSubmitting: "Sending request...",
    disclaimer:
      "* TPS1 uses this information solely to provide consultation and price quotes.",
  },
};

export function B2BHeroSection({ locale = "vi" }: { locale?: "vi" | "en" }) {
  const [file, setFile] = useState<File | null>(null);
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [lastSubmitName, setLastSubmitName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const show3D = useDesktopWebGL();

  preload(heroMobileImage.src, {
    as: "image",
    imageSrcSet: heroMobileImage.srcSet,
    imageSizes: heroMobileImage.sizes,
    fetchPriority: "high",
    media: HERO_MOBILE_MEDIA,
  });
  preload(heroDesktopImage.src, {
    as: "image",
    imageSrcSet: heroDesktopImage.srcSet,
    imageSizes: heroDesktopImage.sizes,
    fetchPriority: "high",
    media: "(min-width: 769px)",
  });

  const t = texts[locale];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");
    const formData = new FormData(e.currentTarget);
    const company = formData.get("company")?.toString() || "";
    const params = new URLSearchParams(window.location.search);
    setLastSubmitName(company);

    const payload = {
      inquiryType: "buyer",
      name: company,
      company,
      phone: formData.get("phone")?.toString() || "",
      interestedIn: formData.get("category")?.toString() || "",
      message: formData.get("notes")?.toString().trim() || "",
      consent: formData.get("consent") === "yes",
      utmSource: params.get("utm_source") || "",
      utmMedium: params.get("utm_medium") || "",
      utmCampaign: params.get("utm_campaign") || "",
      utmContent: params.get("utm_content") || "",
      utmTerm: params.get("utm_term") || "",
      fbclid: params.get("fbclid") || "",
      pagePath: `${window.location.pathname}${window.location.search}`,
    };

    const apiFormData = new FormData();
    apiFormData.append("payload", JSON.stringify(payload));
    if (file) apiFormData.append("attachment", file);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        body: apiFormData,
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setFormState("success");
        trackMetaLead({ form_name: "hero_quick_rfq", facility_type: "unknown" });
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  };

  return (
    <section className="b2b-hero" aria-label="Hero B2B - Thực Phẩm Số Một">
      <div className="b2b-hero__bg">
        <picture>
          <source media={HERO_MOBILE_MEDIA} srcSet={heroMobileImage.srcSet} sizes={heroMobileImage.sizes} />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- art-directed next/image props */}
          <img {...heroDesktopImage} className="object-cover object-center" />
        </picture>
      </div>

      <div className="b2b-hero__overlay" />

      {show3D && <ThreeBackground />}

      <div className="b2b-hero__content">
        <div className="container-shell">
          <div className="b2b-hero-inner">
            {/* LEFT COLUMN: Verbatim Server Copy, Slogan, 3 Trust Badges & 2x2 Stats Grid */}
            <ScrollReveal mode="hero" className="b2b-hero__copy b2b-hero-copy">
              <div className="b2b-hero__copy-top">
                <div
                  className="b2b-hero__cert-badge"
                  role="img"
                  aria-label="Đạt chứng nhận ISO 22000 & HACCP"
                >
                  <ShieldCheck size={15} />
                  <span>{t.certText}</span>
                </div>

                <h1 className="b2b-hero__title">{t.title}</h1>

                <p className="b2b-hero__slogan">{t.slogan}</p>

                <p className="b2b-hero__sub">{t.sub}</p>

                <ul className="b2b-hero__pills" aria-label="Cam kết cung ứng thực phẩm B2B">
                  {t.heroPills.map((pill) => (
                    <li key={pill} className="b2b-hero__pill">
                      <Check size={14} className="b2b-hero__pill-icon" aria-hidden="true" />
                      <span>{pill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="b2b-hero__stats">
                {t.heroStats.map((stat, idx) => (
                  <AnimatedHeroStat key={idx} stat={stat} />
                ))}
              </div>
            </ScrollReveal>

            {/* RIGHT COLUMN: SSR-Immediate Opacity:1 Interactive Glass Panel RFQ Form */}
            <ScrollReveal
              mode="hero"
              delay={80}
              id="rfq-form"
              className="b2b-hero-form-col w-full mx-auto lg:mx-0 lg:ml-auto relative z-10 flex"
            >
              <div className="b2b-hero__glass-panel w-full bg-[#081f17]/88 backdrop-blur-xl border border-[#4ade80]/25 p-6 md:p-7 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(167,243,208,0.22)] relative overflow-hidden flex flex-col justify-between">
                <div className="b2b-hero__glass-rim" aria-hidden="true" />
                <div className="absolute -inset-2 bg-gradient-to-r from-[#14b87a]/20 to-[#0f6f4b]/20 blur-xl -z-10 rounded-3xl" />
                <div className="absolute top-0 right-0 bg-[#ff7918] text-white text-[12px] font-bold px-3.5 py-1.5 rounded-bl-xl rounded-tr-xl tracking-normal z-10 shadow-sm">
                  {t.formRibbon}
                </div>

                {formState === "success" ? (
                  <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#14b87a]/20 mb-6 relative">
                      <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#14b87a]" />
                      <CheckCircle className="w-12 h-12 text-[#4ade80]" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      {t.formSuccessTitle}
                    </h3>
                    <p className="text-white/85 text-base leading-relaxed mb-6">
                      {t.formSuccessDesc(lastSubmitName)}
                    </p>
                    <div className="bg-white/5 border border-[#14b87a]/35 rounded-xl p-5 text-left">
                      <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#4ade80]" />
                        {t.formCommitmentTitle}
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-white/85 leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] mt-2 flex-shrink-0" />
                          <div
                            dangerouslySetInnerHTML={{
                              __html: t.formCommitment1.replace(
                                /(Báo giá minh bạch|Transparent quotes):/,
                                "<strong>$1:</strong>",
                              ),
                            }}
                          />
                        </li>
                        <li className="flex items-start gap-3 text-sm text-white/85 leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] mt-2 flex-shrink-0" />
                          <div
                            dangerouslySetInnerHTML={{
                              __html: t.formCommitment2.replace(
                                /(Hồ sơ rõ ràng|Clear documentation):/,
                                "<strong>$1:</strong>",
                              ),
                            }}
                          />
                        </li>
                      </ul>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormState("idle");
                        setFile(null);
                        setLastSubmitName("");
                      }}
                      className="mt-8 min-h-[44px] px-4 text-sm font-bold text-[#4ade80] hover:text-white transition-colors inline-flex items-center gap-2 mx-auto"
                    >
                      {t.formNewRequest}
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-5 pt-4 text-left">
                      <h3 className="text-[22px] font-bold text-white tracking-tight mb-1.5 leading-snug text-balance">
                        {t.formTitle}
                      </h3>
                      <p className="text-white/75 text-sm leading-relaxed">{t.formDesc}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-white/5 hover:bg-white/10 border border-dashed border-white/25 rounded-xl p-4 cursor-pointer transition-colors flex flex-col items-center justify-center text-center gap-2.5"
                      >
                        <div className="w-11 h-11 rounded-lg bg-white/10 flex items-center justify-center text-[#4ade80]">
                          {file ? <FileText size={22} /> : <FileSpreadsheet size={22} />}
                        </div>
                        <div>
                          <p className="text-sm text-white font-bold mb-1">
                            {file ? file.name : t.uploadPlaceholder}
                          </p>
                          <p className="text-[13px] text-white/70">
                            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : t.uploadSub}
                          </p>
                        </div>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".xls,.xlsx,.csv,.pdf,.doc,.docx,.txt,image/*"
                      />

                      <div className="pt-1">
                        <label
                          htmlFor="hero-rfq-company"
                          className="block text-[13px] font-bold text-white/95 mb-1.5"
                        >
                          {t.companyLabel}
                        </label>
                        <input
                          id="hero-rfq-company"
                          type="text"
                          name="company"
                          required
                          minLength={2}
                          placeholder={t.companyPlaceholder}
                          className="w-full bg-black/25 border border-white/15 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent transition-all placeholder:text-white/45"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-end">
                        <div>
                          <label
                            htmlFor="hero-rfq-phone"
                            className="block text-[13px] font-bold text-white/95 mb-1.5 whitespace-nowrap"
                          >
                            {t.phoneLabel}
                          </label>
                          <input
                            id="hero-rfq-phone"
                            type="tel"
                            name="phone"
                            required
                            minLength={8}
                            placeholder={t.phonePlaceholder}
                            className="w-full h-[44px] bg-black/25 border border-white/15 rounded-lg py-2.5 px-3 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent transition-all placeholder:text-white/45"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="hero-rfq-category"
                            className="block text-[13px] font-bold text-white/95 mb-1.5 whitespace-nowrap"
                          >
                            {t.categoryLabel}
                          </label>
                          <select
                            id="hero-rfq-category"
                            name="category"
                            className="w-full h-[44px] bg-black/25 border border-white/15 rounded-lg py-2.5 pl-3 pr-8 text-[14px] text-white focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent transition-all appearance-none [&>option]:bg-[#0f172a]"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-opacity='0.6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                              backgroundPosition: "right 0.5rem center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "1.35em 1.35em",
                            }}
                          >
                            {t.catOptions.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="hero-rfq-notes"
                          className="block text-[13px] font-bold text-white/95 mb-1.5"
                        >
                          {t.notesLabel}
                        </label>
                        <textarea
                          id="hero-rfq-notes"
                          name="notes"
                          rows={2}
                          required
                          minLength={10}
                          placeholder={t.notesPlaceholder}
                          className="w-full bg-black/25 border border-white/15 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent transition-all placeholder:text-white/45 resize-none"
                        />
                      </div>

                      <input type="hidden" name="_subject" value="[TPS1] Yêu cầu báo giá từ Hero Form" />
                      <input type="hidden" name="_template" value="table" />

                      <button
                        type="submit"
                        disabled={formState === "submitting"}
                        className="b2b-hero__submit-btn w-full min-h-[48px] bg-[#14b87a] hover:bg-[#0f8c5c] text-white font-extrabold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,122,0.3)] hover:shadow-[0_0_28px_rgba(20,184,122,0.52)] flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <span className="b2b-hero__submit-shimmer" aria-hidden="true" />
                        {formState === "submitting" ? (
                          t.submitSubmitting
                        ) : (
                          <>
                            <Send size={18} className="rotate-[-45deg] -mt-0.5 relative z-[1]" />
                            <span className="relative z-[1]">{t.submitBtn}</span>
                          </>
                        )}
                      </button>

                      {formState === "error" && (
                        <p className="text-[13px] text-amber-300 font-semibold text-center">
                          {locale === "en"
                            ? "Could not send request. Please verify your details and try again."
                            : "Chưa gửi được yêu cầu. Quý khách vui lòng kiểm tra lại thông tin và thử lại."}
                        </p>
                      )}

                      <label className="flex items-start gap-2.5 text-[13px] text-white/85 leading-relaxed pt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          name="consent"
                          value="yes"
                          required
                          className="mt-1 h-4 w-4 shrink-0 accent-[#14b87a]"
                        />
                        <span>
                          {locale === "en"
                            ? "I agree that TPS1 may contact me regarding this quote request."
                            : "Tôi đồng ý để TPS1 liên hệ tư vấn và báo giá theo yêu cầu."}{" "}
                          <Link href="/chinh-sach/bao-mat" className="text-[#4ade80] underline underline-offset-2">
                            {locale === "en" ? "Privacy policy" : "Chính sách bảo mật"}
                          </Link>
                          .
                        </span>
                      </label>
                      <p className="text-[13px] text-white/75 text-center pt-1 px-2 leading-relaxed">
                        {t.disclaimer}
                      </p>
                    </form>
                  </>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
