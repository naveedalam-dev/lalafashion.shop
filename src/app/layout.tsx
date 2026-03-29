import { Outfit, Geist, Noto_Serif, Manrope } from "next/font/google";
import "./globals.css";
import { GlobalProviders } from "@/providers";
import { generateMetadataForPage } from "@utils/helper";
import { staticSeo } from "@utils/metadata";
import { SpeculationRules } from "@components/theme/SpeculationRules";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import clsx from "clsx";
import { cn } from "@/lib/utils";

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
    keywords: ["women fashion", "kurtis", "gowns", "suits", "Pakistan fashion", "LALA Fashion", "ready-to-wear"],
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
        {/* ── Organization Schema ───────────────────────────── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://www.lalafashion.store/#organization",
              name: "LALA Fashion",
              url: "https://www.lalafashion.store",
              logo: {
                "@type": "ImageObject",
                url: "https://www.lalafashion.store/og-image.png",
                width: 200,
                height: 60,
              },
              description: "Pakistan's premium eCommerce destination for women's fashion — kurtis, gowns, suits, and ready-to-wear clothing.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "PK",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                availableLanguage: ["English", "Urdu"],
                areaServed: "PK",
              },
            }),
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
            </GlobalProviders>
            <SpeculationRules />
          </ErrorBoundary>
        </main>
        <span className="dsv-2025.04.19-7e29" />
      </body>
    </html>
  );
}
