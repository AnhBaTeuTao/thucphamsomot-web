import { makeMetadata } from "@/lib/seo";
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
  title: "B2B Food Supplier for Restaurants & Canteens in Dong Nai | TPS1",
  description:
    "Delivering peace of mind in every meal. TPS1 supplies fresh produce, meat, seafood, frozen goods, and dry goods for restaurants, corporate canteens, factories, and schools in Dong Nai & Ho Chi Minh City.",
  path: "/en",
});

export default function EnglishHomePage() {
  return (
    <main>
      {/* 1. HERO SECTION */}
      <B2BHeroSection locale="en" />

      {/* 2. PARTNER RIBBON */}
      <PartnerRibbon locale="en" />

      {/* 3. TRUST PILLARS */}
      <TrustPillars locale="en" />

      {/* 4. B2B CATALOG */}
      <B2BCatalog locale="en" />

      {/* 5. INDUSTRIES */}
      <IndustriesShowcaseSection locale="en" />

      {/* 6. SERVICE AREAS */}
      <ColdChainDispatchSection locale="en" />

      {/* 7. PROCESS & CERTIFICATIONS */}
      <ProcessCertificationsSection locale="en" />

      {/* 8. KITCHEN KNOWLEDGE */}
      <KitchenKnowledgeSection locale="en" />

      {/* 9. FAQ */}
      <HomeFaqSection locale="en" />

      {/* 10. FINAL CTA BAND */}
      <FinalCtaBandSection locale="en" />
    </main>
  );
}
