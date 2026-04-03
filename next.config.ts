import { configHeader } from '@/utils/constants';
import type { NextConfig } from "next";

// ─── PRIMARY DOMAIN (single domain — no alias enforcement needed) ─────────────
const PRIMARY_DOMAIN = 'https://www.lalafashion.store';

const nextConfig = {
  reactStrictMode: true,

  // ── Build-time safety ──────────────────────────────────────────────────────
  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // ── URL Stability: never add trailing slashes ──────────────────────────────
  trailingSlash: false,

  // ── Image optimisation ─────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // ── Permanent redirects (edge-level, before any page renders) ─────────────
  // These back up the middleware for static export / CDN edge cases.
  async redirects() {
    return [
      // ── Trailing slash removal (catch-all) ──────────────────────────────
      {
        source:       '/:path+/',
        destination:  '/:path+',
        permanent:    true,       // 308
      },

      // ── Legacy / renamed pages ──────────────────────────────────────────
      { source: '/home',                  destination: '/',                  permanent: true },
      { source: '/index',                 destination: '/',                  permanent: true },
      { source: '/index.html',            destination: '/',                  permanent: true },
      { source: '/category/all',          destination: '/shop',              permanent: true },
      { source: '/faq',                   destination: '/faqs',              permanent: true },
      { source: '/policy',                destination: '/privacy-policy',    permanent: true },
      { source: '/data-privacy',          destination: '/data-policy',       permanent: true },
      { source: '/shipping',              destination: '/shipment-policy',   permanent: true },
      { source: '/returns',               destination: '/return-policy',     permanent: true },
      { source: '/refund-policy',         destination: '/return-policy',     permanent: true },
      { source: '/tnc',                   destination: '/terms',             permanent: true },
      { source: '/terms-and-conditions',  destination: '/terms',             permanent: true },
      { source: '/disclaimer.html',       destination: '/disclaimer',        permanent: true },
      { source: '/contact-us',            destination: '/contact',           permanent: true },
      { source: '/about-us',             destination: '/about',             permanent: true },
      { source: '/track',                 destination: '/track-order',       permanent: true },

      // ── Duplicate category slug consolidation (sitemap audit 2026-04-03) ──
      { source: '/category/watch',         destination: '/category/watches',  permanent: true },
    ];
  },

  // ── Security & cache headers ───────────────────────────────────────────────
  async headers() {
    return [
      ...configHeader,
      // Security/cache handled by configHeader already
      // Never cache admin pages
      {
        source: '/admin-login/:path*',
        headers: [
          { key: 'X-Robots-Tag',  value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
      // Never cache API routes
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Robots-Tag',  value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ];
  },

  compress: true,
  experimental: {
    optimizePackageImports: ['lodash', 'date-fns'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
} satisfies NextConfig & {
  eslint?:        { ignoreDuringBuilds?: boolean };
  trailingSlash?: boolean;
};

export default nextConfig;
