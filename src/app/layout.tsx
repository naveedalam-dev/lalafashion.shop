import { Outfit, Geist, Noto_Serif, Manrope } from "next/font/google";
import "./globals.css";
import { GlobalProviders } from "@/providers";
import { generateMetadataForPage } from "@utils/helper";
import { staticSeo } from "@utils/metadata";
import { SpeculationRules } from "@components/theme/SpeculationRules";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const notoSerif = Noto_Serif({ subsets: ["latin"], variable: "--font-noto-serif", weight: ["400", "700"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", weight: ["300", "400", "500", "600", "700"] });

export const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  variable: "--font-outfit",
  display: "optional",
  preload: true,
});

export async function generateMetadata() {
  return {
    // metadataBase is REQUIRED — without it Next.js resolves relative URLs to localhost
    metadataBase: new URL('https://www.lalafashion.store'),
    ...(await generateMetadataForPage("", staticSeo.default)),
    // Site-wide identity
    applicationName: "LALA Fashion",
    keywords: ["luxury gifts", "premium watches", "exquisite jewelry", "luxury accessories", "Pakistan premium store", "LALA Fashion", "lifestyle products"],
    authors: [{ name: "LALA Fashion", url: "https://www.lalafashion.store" }],
    creator: "LALA Fashion",
    publisher: "LALA Fashion",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon:    [{ url: "/Favicon.png", type: "image/png" }],
      shortcut: "/Favicon.png",
      apple:   "/Favicon.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        {/* ── GEO & E-E-A-T Schema ───────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": "https://www.lalafashion.store/#organization",
                name: "LALA FASHION",
                url: "https://www.lalafashion.store",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.lalafashion.store/Logo.png",
                  width: 200,
                  height: 60,
                },
                description: "Pakistan's premium digital destination for luxury gifts, precision watches, and exquisite jewelry.",
                sameAs: [
                  "https://x.com/lalafashion_shp",
                  "https://www.instagram.com/lalafashion.shp/",
                  "https://www.threads.com/@lalafashion.shp",
                  "https://www.tiktok.com/@lalafashion.shp"
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": ["LocalBusiness", "Store"],
                "@id": "https://www.lalafashion.store/#localbusiness",
                name: "LALA FASHION",
                url: "https://www.lalafashion.store",
                image: "https://www.lalafashion.store/Logo.png",
                telephone: "+92 339 2255 235",
                email: "support@lalafashion.store",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "HOUSE NO PD 145 D1 G FLOOR MAIN STREET PINDORA SATELLITE TOWN",
                  addressLocality: "Rawalpindi",
                  addressRegion: "Punjab",
                  addressCountry: "PK"
                },
                openingHoursSpecification: [
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"],
                    opens: "09:00",
                    closes: "20:00"
                  },
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: "Friday",
                    opens: "10:00",
                    closes: "22:00"
                  }
                ],
                priceRange: "$$"
              }
            ]),
          }}
        />
        {/* ── WebSite + SearchAction Schema ─────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://www.lalafashion.store/#website",
              name: "LALA Fashion",
              url: "https://www.lalafashion.store",
              publisher: {
                "@id": "https://www.lalafashion.store/#organization",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://www.lalafashion.store/shop?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      
{/* TikTok Pixel Code Start */}
<script dangerouslySetInnerHTML={{ __html: `!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};


  ttq.load('D99L713C77U03DOJCBLG');
  ttq.page();
}(window, document, 'ttq');` }}></script>
{/* TikTok Pixel Code End */}
</head>
      <body
        suppressHydrationWarning
        className={clsx(
          "min-h-screen font-outfit text-foreground bg-background antialiased",
          outfit.variable,
          notoSerif.variable,
          manrope.variable
        )}>
        <main>
          <ErrorBoundary>
            <GlobalProviders>
              {children}
              <WhatsAppButton />
            </GlobalProviders>
            <SpeculationRules />
          </ErrorBoundary>
        </main>
        <span className="dsv-2025.04.19-7e29" />
      </body>
    </html>
  );
}
