import type { Metadata } from "next";
import "./fonts.css";
import "./page-shell-base.css";
import "./globals.css";
import "./quick-quote.css";
import "./segment-landing.css";
import "./blog-content.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CompanyProfileWidget } from "@/components/company-profile-widget";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { SocialWidget } from "@/components/social-widget";
import { CartProvider } from "@/lib/cart-context";
import { siteConfig } from "@/lib/site";
import { FloatingCart } from "@/components/floating-cart";
import { MetaPixel } from "@/components/meta-pixel";
import { CustomerSessionProvider } from "@/lib/customer-session-context";
import { GoogleAdsTag } from "@/components/google-ads-tag";
import { MajorPageTransition } from "@/components/b2b/major-page-transition";
import { CategoryTransitionProvider } from "@/components/b2b/category-transition-provider";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    // Short brand suffix keeps page titles within Google's ~65-character display.
    template: "%s | TPS1",
  },
  description: siteConfig.description,
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: new URL(siteConfig.shareImage, siteConfig.url).toString(),
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [new URL(siteConfig.shareImage, siteConfig.url).toString()],
  },
};

const EXTENSION_ATTR_CLEANUP_SCRIPT = `(function(){try{if(window.localStorage&&window.localStorage.getItem("tps1-fx-disabled")==="1"){document.documentElement.classList.add("tps1-fx-disabled");document.documentElement.setAttribute("data-tps1-fx","off");}}catch(e){}var A=["bis_skin_checked","bis_register","bis_size","bis_id"],S="[bis_skin_checked],[bis_register],[bis_size],[bis_id]";function clean(r){if(!r||r.nodeType!==1)return;for(var i=0;i<A.length;i++){if(r.hasAttribute(A[i]))r.removeAttribute(A[i]);}var els=r.querySelectorAll(S);for(var j=0;j<els.length;j++){var el=els[j];for(var k=0;k<A.length;k++){if(el.hasAttribute(A[k]))el.removeAttribute(A[k]);}}}clean(document.documentElement);if(typeof MutationObserver==="undefined")return;var obs=new MutationObserver(function(list){for(var i=0;i<list.length;i++){var m=list[i];if(m.type==="attributes"){var t=m.target;if(t&&t.nodeType===1&&m.attributeName&&t.hasAttribute(m.attributeName))t.removeAttribute(m.attributeName);}else if(m.type==="childList"){for(var j=0;j<m.addedNodes.length;j++){if(m.addedNodes[j].nodeType===1)clean(m.addedNodes[j]);}}}});obs.observe(document.documentElement,{attributes:true,childList:true,subtree:true,attributeFilter:A});var done=function(){setTimeout(function(){obs.disconnect();},4000);};if(document.readyState==="complete")done();else window.addEventListener("load",done,{once:true});})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: EXTENSION_ATTR_CLEANUP_SCRIPT }}
        />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        {/* Site images are resized by wsrv.nl (lib/image-loader.ts); the hero image is the LCP. */}
        <link rel="preconnect" href="https://wsrv.nl" />
      </head>
      <body suppressHydrationWarning>
        <GoogleAdsTag />
        <MetaPixel />
        <CustomerSessionProvider>
          <CartProvider>
            <SeoJsonLd />
            <CategoryTransitionProvider>
              <SiteHeader />
              <MajorPageTransition>{children}</MajorPageTransition>
            </CategoryTransitionProvider>
            <CompanyProfileWidget />
            <SocialWidget />
            <SiteFooter />
            <FloatingCart />
          </CartProvider>
        </CustomerSessionProvider>
      </body>
    </html>
  );
}
