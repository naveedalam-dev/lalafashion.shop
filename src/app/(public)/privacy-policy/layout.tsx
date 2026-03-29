import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy Policy | LALA Fashion",
  description: "How LALA Fashion collects, uses, and protects your personal information.",
  alternates: { canonical: "https://www.lalafashion.store/privacy-policy" },
  openGraph: { title: "Privacy Policy | LALA Fashion", description: "How LALA Fashion collects, uses, and protects your personal information.", url: "https://www.lalafashion.store/privacy-policy", siteName: "LALA Fashion", type: "website", images: [{ url: "https://www.lalafashion.store/og-image.png", width: 1200, height: 630 }] },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
