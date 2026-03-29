import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shipment Policy | LALA Fashion",
  description: "Shipping zones, delivery timelines, and everything about how LALA Fashion delivers to you.",
  alternates: { canonical: "https://www.lalafashion.store/shipment-policy" },
  openGraph: { title: "Shipment Policy | LALA Fashion", description: "Shipping zones, delivery timelines, and everything about how we deliver.", url: "https://www.lalafashion.store/shipment-policy", siteName: "LALA Fashion", type: "website", images: [{ url: "https://www.lalafashion.store/og-image.png", width: 1200, height: 630 }] },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
