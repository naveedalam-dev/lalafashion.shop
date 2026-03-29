import type { Metadata } from "next";

const BASE = "https://www.lalafashion.store";
const SITE = "LALA Fashion";
const LOGO = `${BASE}/og-image.png`;

// ─── Self-referencing canonical metadata factory ─────────────────────────────
// Returns a complete Metadata object with unique title, description,
// canonical that EXACTLY matches the sitemap URL, and index/follow.
export function makePageMeta({
  slug,
  title,
  description,
  noindex = false,
}: {
  slug: string;        // e.g. "about" | "faqs" | "" (homepage)
  title: string;
  description: string;
  noindex?: boolean;
}): Metadata {
  // Homepage canonical has NO trailing slash and NO path segment
  const canonical = slug ? `${BASE}/${slug}` : BASE;

  return {
    metadataBase: new URL(BASE),
    title,
    description,
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE,
      type: "website",
      images: [{ url: LOGO, width: 1200, height: 630, alt: SITE }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [LOGO],
    },
  };
}

// ─── Pre-built metadata for every static public page ─────────────────────────
// Import and re-export as `export const metadata = PAGE_META.about` in each page.

export const PAGE_META = {
  about: makePageMeta({
    slug: "about",
    title: "About Us | LALA Fashion — Pakistan's Premium Luxury Store",
    description: "Learn about LALA Fashion — a Pakistan-based digital destination offering premium luxury gifts, jewelry, watches, and high-end accessories since 2020.",
  }),

  contact: makePageMeta({
    slug: "contact",
    title: "Contact Us | LALA Fashion",
    description: "Get in touch with the LALA Fashion team. We're here to help with orders, returns, and any questions about our products.",
  }),

  faqs: makePageMeta({
    slug: "faqs",
    title: "FAQs | LALA Fashion — Frequently Asked Questions",
    description: "Answers to your most common questions about ordering, shipping, returns, payments, and products at LALA Fashion.",
  }),

  privacyPolicy: makePageMeta({
    slug: "privacy-policy",
    title: "Privacy Policy | LALA Fashion",
    description: "How LALA Fashion collects, uses, and protects your personal information. Read our full privacy policy.",
  }),

  dataPolicy: makePageMeta({
    slug: "data-policy",
    title: "Data Policy | LALA Fashion",
    description: "Our data processing and retention policy for customers of lalafashion.store.",
  }),

  returnPolicy: makePageMeta({
    slug: "return-policy",
    title: "Return & Refund Policy | LALA Fashion",
    description: "Everything you need to know about returning or exchanging a product at LALA Fashion. Easy returns within 7 days.",
  }),

  shipmentPolicy: makePageMeta({
    slug: "shipment-policy",
    title: "Shipping Policy | LALA Fashion",
    description: "Shipping zones, delivery timelines, and courier information for LALA Fashion orders across Pakistan.",
  }),

  terms: makePageMeta({
    slug: "terms",
    title: "Terms & Conditions | LALA Fashion",
    description: "Read the terms and conditions governing the use of lalafashion.store and your purchases.",
  }),

  disclaimer: makePageMeta({
    slug: "disclaimer",
    title: "Disclaimer | LALA Fashion",
    description: "Legal disclaimer for lalafashion.store — all content is for informational purposes only.",
  }),

  trackOrder: makePageMeta({
    slug: "track-order",
    title: "Track Your Order | LALA Fashion",
    description: "Enter your order ID or email to get real-time delivery status updates for your LALA Fashion order.",
  }),

  // Noindex pages — transactional, not for indexing
  success: makePageMeta({
    slug: "success",
    title: "Order Confirmed | LALA Fashion",
    description: "Your LALA Fashion order has been placed successfully.",
    noindex: true,
  }),
} as const;
