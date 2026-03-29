import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Terms & Conditions | LALA Fashion",
  description: "Read the terms and conditions governing your use of lalafashion.store and all purchases.",
  alternates: { canonical: "https://www.lalafashion.store/terms" },
  openGraph: { title: "Terms & Conditions | LALA Fashion", description: "Terms and conditions for lalafashion.store.", url: "https://www.lalafashion.store/terms", siteName: "LALA Fashion", type: "website", images: [{ url: "https://www.lalafashion.store/og-image.png", width: 1200, height: 630 }] },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
