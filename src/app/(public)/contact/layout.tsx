import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | LALA Fashion",
  description: "Get in touch with the LALA Fashion team. Reach us by phone, email, or visit our studio in Islamabad.",
  alternates: { canonical: "https://www.lalafashion.store/contact" },
  openGraph: {
    title: "Contact Us | LALA Fashion",
    description: "Get in touch with the LALA Fashion team. Reach us by phone, email, or visit our studio in Islamabad.",
    url: "https://www.lalafashion.store/contact",
    siteName: "LALA Fashion",
    type: "website",
    images: [{ url: "https://www.lalafashion.store/og-image.png", width: 1200, height: 630, alt: "LALA Fashion" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | LALA Fashion",
    description: "Get in touch with the LALA Fashion team.",
    images: ["https://www.lalafashion.store/og-image.png"],
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
