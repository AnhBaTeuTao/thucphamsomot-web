import fs from "fs";
import path from "path";
import { ScrollReveal } from "@/components/b2b/scroll-reveal";

const texts = {
  vi: {
    ariaLabel: "Nhãn hàng và đối tác thương mại tin dùng",
    label: "Nhãn hàng & đối tác thương mại tin dùng",
    markers: [
      "5.000+ mã hàng chính ngạch",
      "100% rõ nguồn gốc xuất xứ",
      "Cung ứng sỉ ổn định mỗi ngày",
    ],
    altPrefix: "Đối tác",
  },
  en: {
    ariaLabel: "Trusted suppliers and partner brands",
    label: "Official Sourcing from Trusted Brands and Partners",
    markers: [
      "5,000+ Official B2B SKUs",
      "100% Traceable Origin",
      "Stable Daily Wholesale Supply",
    ],
    altPrefix: "Partner",
  },
};

export function PartnerRibbon({ locale = "vi" }: { locale?: "vi" | "en" }) {
  let logos: string[] = [];
  try {
    const logosDir = path.join(process.cwd(), "public/images/partners/logos");
    logos = fs
      .readdirSync(logosDir)
      .filter((file) => file.endsWith(".png"))
      .sort((a, b) => a.localeCompare(b));
  } catch (error) {
    console.warn("Could not read partners logo directory", error);
  }

  if (logos.length === 0) return null;

  const displayLogos = [...logos, ...logos];
  const t = texts[locale];

  return (
    <section className="b2b-partners" aria-label={t.ariaLabel}>
      <ScrollReveal className="container-shell">
        <div className="b2b-partners__label">
          <span className="b2b-partners__line b2b-partners__line--left" aria-hidden="true" />
          <span className="b2b-partners__badge">{t.label}</span>
          <span className="b2b-partners__line b2b-partners__line--right" aria-hidden="true" />
        </div>

        <div className="b2b-partners__markers" aria-label="Chỉ dấu cam kết nguồn hàng chính ngạch">
          {t.markers.map((marker) => (
            <span key={marker} className="b2b-partners__marker">
              <span className="b2b-partners__marker-dot" aria-hidden="true" />
              <span>{marker}</span>
            </span>
          ))}
        </div>
      </ScrollReveal>

      <div className="b2b-partners__track-wrap b2b-partners-marquee">
        <div className="b2b-partners__track b2b-partners-track">
          {displayLogos.map((filename, i) => (
            <div
              key={`${filename}-${i}`}
              className="b2b-partner-logo"
              aria-hidden={i >= logos.length ? "true" : undefined}
            >
              <div className="b2b-partner-logo__tile">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/partners/logos/${filename}`}
                  alt={
                    i < logos.length
                      ? `${t.altPrefix} ${filename.replace(".png", "").replace(/_/g, " ")}`
                      : ""
                  }
                  width={132}
                  height={52}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  className="b2b-partner-logo__img"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
