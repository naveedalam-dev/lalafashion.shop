// ─── SITE IDENTITY ────────────────────────────────────────────────────────────
export const SITE_NAME        = 'LALA Fashion';
export const SITE_DESCRIPTION = 'Modern Lifestyle — Discover Pakistan\'s premium destination for watches, glasses, exquisite jewellery, and the latest electronics at LALA Fashion.';
export const PRIMARY_DOMAIN   = 'https://www.lalafashion.store';
export const OG_IMAGE         = `${PRIMARY_DOMAIN}/og-image.png`;

// ─── STATIC SEO DATA ──────────────────────────────────────────────────────────
export const staticSeo = {
  default: {
    title:       `${SITE_NAME} — Premium Luxury & Lifestyle`,
    description: SITE_DESCRIPTION,
    image:       OG_IMAGE,
    canonical:   PRIMARY_DOMAIN,
  },
  register: {
    title:       `Create Account | ${SITE_NAME}`,
    description: `Sign up for ${SITE_NAME} for exclusive access to luxury gifts and premium accessories.`,
    image:       OG_IMAGE,
    canonical:   `${PRIMARY_DOMAIN}/customer/register`,
  },
  login: {
    title:       `Login | ${SITE_NAME}`,
    description: `Login to your ${SITE_NAME} account.`,
    image:       OG_IMAGE,
    canonical:   `${PRIMARY_DOMAIN}/customer/login`,
  },
  forget: {
    title:       `Reset Password | ${SITE_NAME}`,
    description: 'Recover your account by resetting your password.',
    image:       OG_IMAGE,
    canonical:   `${PRIMARY_DOMAIN}/customer/forget-password`,
  },
  about: {
    title:       `About Us | ${SITE_NAME}`,
    description: `Learn about ${SITE_NAME} — who we are and what we stand for.`,
    image:       OG_IMAGE,
    canonical:   `${PRIMARY_DOMAIN}/about`,
  },
  contact: {
    title:       `Contact Us | ${SITE_NAME}`,
    description: `Get in touch with the ${SITE_NAME} team.`,
    image:       OG_IMAGE,
    canonical:   `${PRIMARY_DOMAIN}/contact`,
  },
  faqs: {
    title:       `FAQs | ${SITE_NAME}`,
    description: 'Frequently asked questions about orders, shipping, and returns.',
    image:       OG_IMAGE,
    canonical:   `${PRIMARY_DOMAIN}/faqs`,
  },
  privacyPolicy: {
    title:       `Privacy Policy | ${SITE_NAME}`,
    description: 'How we collect, use, and protect your personal information.',
    image:       OG_IMAGE,
    canonical:   `${PRIMARY_DOMAIN}/privacy-policy`,
  },
  dataPolicy: {
    title:       `Data Policy | ${SITE_NAME}`,
    description: 'Our data processing and retention policy.',
    image:       OG_IMAGE,
    canonical:   `${PRIMARY_DOMAIN}/data-policy`,
  },
  returnPolicy: {
    title:       `Return Policy | ${SITE_NAME}`,
    description: 'Everything you need to know about returning an item.',
    image:       OG_IMAGE,
    canonical:   `${PRIMARY_DOMAIN}/return-policy`,
  },
  shipmentPolicy: {
    title:       `Shipment Policy | ${SITE_NAME}`,
    description: 'Shipping zones, timelines, and delivery information.',
    image:       OG_IMAGE,
    canonical:   `${PRIMARY_DOMAIN}/shipment-policy`,
  },
  terms: {
    title:       `Terms & Conditions | ${SITE_NAME}`,
    description: 'Read our terms and conditions of service.',
    image:       OG_IMAGE,
    canonical:   `${PRIMARY_DOMAIN}/terms`,
  },
  disclaimer: {
    title:       `Disclaimer | ${SITE_NAME}`,
    description: 'Legal disclaimer for lalafashion.store.',
    image:       OG_IMAGE,
    canonical:   `${PRIMARY_DOMAIN}/disclaimer`,
  },
  trackOrder: {
    title:       `Track Your Order | ${SITE_NAME}`,
    description: 'Enter your order ID to get real-time delivery updates.',
    image:       OG_IMAGE,
    canonical:   `${PRIMARY_DOMAIN}/track-order`,
  },
  success: {
    title:       `Order Confirmed | ${SITE_NAME}`,
    description: 'Your order has been successfully placed. Thank you!',
    image:       OG_IMAGE,
    canonical:   `${PRIMARY_DOMAIN}/success`,
  },
};
