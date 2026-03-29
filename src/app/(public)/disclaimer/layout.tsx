import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Disclaimer | LALA Fashion",
  description: "Legal disclaimer for lalafashion.store — all content is provided for informational purposes only.",
  alternates: { canonical: "https://www.lalafashion.store/disclaimer" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: "Disclaimer | LALA Fashion", description: "Legal disclaimer for lalafashion.store.", url: "https://www.lalafashion.store/disclaimer", siteName: "LALA Fashion", type: "website", images: [{ url: "https://www.lalafashion.store/og-image.png", width: 1200, height: 630 }] },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
