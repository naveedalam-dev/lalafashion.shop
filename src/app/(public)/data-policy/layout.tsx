import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Data Policy | LALA Fashion",
  description: "Our data processing and retention policy for customers of lalafashion.store.",
  alternates: { canonical: "https://www.lalafashion.store/data-policy" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: "Data Policy | LALA Fashion", description: "Our data processing and retention policy.", url: "https://www.lalafashion.store/data-policy", siteName: "LALA Fashion", type: "website", images: [{ url: "https://www.lalafashion.store/og-image.png", width: 1200, height: 630 }] },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
