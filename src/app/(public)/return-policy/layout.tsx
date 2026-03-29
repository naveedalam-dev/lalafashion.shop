import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Return Policy | LALA Fashion",
  description: "Everything you need to know about returning an item purchased from LALA Fashion.",
  alternates: { canonical: "https://www.lalafashion.store/return-policy" },
  openGraph: { title: "Return Policy | LALA Fashion", description: "Everything you need to know about returning an item.", url: "https://www.lalafashion.store/return-policy", siteName: "LALA Fashion", type: "website", images: [{ url: "https://www.lalafashion.store/og-image.png", width: 1200, height: 630 }] },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
