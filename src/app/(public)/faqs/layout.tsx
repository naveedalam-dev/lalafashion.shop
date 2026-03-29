import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | LALA Fashion",
  description: "Frequently asked questions about orders, shipping, returns, and more at LALA Fashion.",
  alternates: { canonical: "https://www.lalafashion.store/faqs" },
  openGraph: {
    title: "FAQs | LALA Fashion",
    description: "Frequently asked questions about orders, shipping, returns, and more at LALA Fashion.",
    url: "https://www.lalafashion.store/faqs",
    siteName: "LALA Fashion",
    type: "website",
    images: [{ url: "https://www.lalafashion.store/og-image.png", width: 1200, height: 630, alt: "LALA Fashion" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQs | LALA Fashion",
    description: "Frequently asked questions about LALA Fashion.",
    images: ["https://www.lalafashion.store/og-image.png"],
  },
};

export default function FaqsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
