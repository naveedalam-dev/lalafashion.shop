import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | LALA Fashion",
  description: "Learn about LALA Fashion — our story, values, and commitment to premium women's fashion in Pakistan since 2020.",
  alternates: { canonical: "https://www.lalafashion.store/about" },
  openGraph: {
    title: "About Us | LALA Fashion",
    description: "Learn about LALA Fashion — our story, values, and commitment to premium women's fashion in Pakistan.",
    url: "https://www.lalafashion.store/about",
    siteName: "LALA Fashion",
    type: "website",
    images: [{ url: "https://www.lalafashion.store/og-image.png", width: 1200, height: 630, alt: "LALA Fashion" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | LALA Fashion",
    description: "Learn about LALA Fashion — our story, values, and commitment to premium women's fashion in Pakistan.",
    images: ["https://www.lalafashion.store/og-image.png"],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
