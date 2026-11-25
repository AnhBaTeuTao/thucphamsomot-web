import { makeMetadata } from "@/lib/seo";
import { HomeIntroLoader } from "@/components/b2b/home-intro-loader";
import { B2BHeroSection } from "@/components/b2b/hero-section";
import { PartnerRibbon } from "@/components/b2b/partner-ribbon";
import { TrustPillars } from "@/components/b2b/trust-pillars";
import { B2BCatalog } from "@/components/b2b/catalog-section";
import {
  ColdChainDispatchSection,
  FinalCtaBandSection,
  HomeFaqSection,
  IndustriesShowcaseSection,
  KitchenKnowledgeSection,
  ProcessCertificationsSection,
} from "@/components/b2b/home-sections";

export const metadata = makeMetadata({
  title: "Nhà cung cấp thực phẩm cho nhà hàng, bếp ăn tại Đồng Nai | TPS1",
  description:
    "Gửi trọn an tâm trong từng bữa ăn. TPS1 cung cấp rau củ, thịt cá, hàng đông lạnh, đồ khô cho nhà hàng, quán ăn, bếp công ty, trường học tại Đồng Nai, TP.HCM.",
  path: "/",
});

export default function HomePage() {
  return (
    <main>
      {/* 0. CINEMATIC LOGO INTRO & HEADER DOCKING */}
      <HomeIntroLoader />

      {/* 1. HERO SECTION */}
      <B2BHeroSection />

      {/* 2. PARTNER RIBBON */}
      <PartnerRibbon />

      {/* 3. TRUST PILLARS */}
      <TrustPillars />

      {/* 4. B2B CATALOG */}
      <B2BCatalog />

      {/* 5. INDUSTRIES */}
      <IndustriesShowcaseSection />

      {/* 6. SERVICE AREAS */}
      <ColdChainDispatchSection />

      {/* 7. PROCESS & CERTIFICATIONS */}
      <ProcessCertificationsSection />

      {/* 8. KITCHEN KNOWLEDGE */}
      <KitchenKnowledgeSection />

      {/* 9. FAQ */}
      <HomeFaqSection />

      {/* 10. FINAL CTA BAND */}
      <FinalCtaBandSection />
    </main>
  );
}
