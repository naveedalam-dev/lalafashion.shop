import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Track Your Order | LALA Fashion",
  description: "Enter your order ID or email to get real-time delivery status updates for your LALA Fashion order.",
  alternates: { canonical: "https://www.lalafashion.store/track-order" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: { title: "Track Your Order | LALA Fashion", description: "Track your LALA Fashion order in real time.", url: "https://www.lalafashion.store/track-order", siteName: "LALA Fashion", type: "website", images: [{ url: "https://www.lalafashion.store/og-image.png", width: 1200, height: 630 }] },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
