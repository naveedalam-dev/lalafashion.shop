import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─── PRIMARY DOMAIN ─────────────────────────────────────────────────────────
const PRIMARY_DOMAIN = 'www.lalafashion.store';
const PRIMARY_ORIGIN = `https://${PRIMARY_DOMAIN}`;

// ─── OLD / ALIAS DOMAINS to redirect to primary ─────────────────────────────
const ALIAS_DOMAINS = [
  'lalafashion.store',      // non-www → force www
  'udesigner.tech',         // old domain
  'www.udesigner.tech',     // old domain www
];

// ─── LEGACY URL MAP (old path → new path, permanent 308) ────────────────────
// Add any routes that ever changed here to preserve SEO equity forever.
const LEGACY_REDIRECTS: Record<string, string> = {
  '/home':              '/',
  '/index':             '/',
  '/index.html':        '/',
  '/shop':              '/category/all',
  '/faq':               '/faqs',
  '/faq/':              '/faqs',
  '/policy':            '/privacy-policy',
  '/data-privacy':      '/data-policy',
  '/shipping':          '/shipment-policy',
  '/returns':           '/return-policy',
  '/refund-policy':     '/return-policy',
  '/tnc':               '/terms',
  '/terms-and-conditions': '/terms',
  '/disclaimer.html':   '/disclaimer',
  '/contact-us':        '/contact',
  '/about-us':          '/about',
  '/track':             '/track-order',
};

// ─── PATHS THAT MUST NEVER BE INDEXED (no-index guard) ──────────────────────
const NOINDEX_PREFIXES = [
  '/admin-login',
  '/api',
  '/_next',
];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const pathname = url.pathname;

  // ── 1. Strip port for local dev comparison ──────────────────────────────
  const bareHost = hostname.split(':')[0];

  // ── 2. Domain enforcement (alias → primary), skip in local dev ──────────
  const isLocalDev =
    bareHost === 'localhost' ||
    bareHost === '127.0.0.1' ||
    bareHost.endsWith('.local');

  if (!isLocalDev && ALIAS_DOMAINS.includes(bareHost)) {
    const dest = `${PRIMARY_ORIGIN}${pathname}${url.search}`;
    return NextResponse.redirect(dest, { status: 301 });
  }

  // ── 3. Force HTTPS (Vercel handles this, but belt-and-suspenders) ────────
  if (!isLocalDev && url.protocol === 'http:') {
    url.protocol = 'https:';
    url.host = PRIMARY_DOMAIN;
    return NextResponse.redirect(url.toString(), { status: 301 });
  }

  // ── 4. Remove trailing slash (except root "/") ──────────────────────────
  if (pathname !== '/' && pathname.endsWith('/')) {
    const clean = pathname.slice(0, -1);
    url.pathname = clean;
    return NextResponse.redirect(url.toString(), { status: 308 });
  }

  // ── 5. Lowercase URL enforcement ─────────────────────────────────────────
  // Only apply to non-asset paths
  const isAsset =
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    /\.(ico|png|jpg|jpeg|webp|svg|gif|css|js|woff|woff2|ttf|eot|map)$/i.test(pathname);

  if (!isAsset && pathname !== pathname.toLowerCase()) {
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url.toString(), { status: 308 });
  }

  // ── 6. Legacy URL redirects (permanent 308 = GET-safe 301 variant) ───────
  if (LEGACY_REDIRECTS[pathname]) {
    url.pathname = LEGACY_REDIRECTS[pathname];
    return NextResponse.redirect(url.toString(), { status: 308 });
  }

  // ── 7. Block direct access to admin with proper headers ──────────────────
  // (Admin auth is handled by admin layout, this just adds headers)
  const isAdmin = pathname.startsWith('/admin-login');
  if (isAdmin) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  }

  // ── 8. Add X-Robots-Tag noindex for API routes ───────────────────────────
  const isNoindex = NOINDEX_PREFIXES.some((p) => pathname.startsWith(p));
  if (isNoindex) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static   (static files)
     * - _next/image    (image optimization)
     * - favicon.ico / favicon.png
     * - public folder images
     */
    '/((?!_next/static|_next/image|favicon|Favicon|Logo|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)).*)',
  ],
};
