import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// ─── LEGACY URL MAP (old path → new path, permanent 308) ────────────────────
// Add any routes that ever changed here to preserve SEO equity forever.
// "/" is the only home address — never redirect anything else to it accidentally.
const LEGACY_REDIRECTS: Record<string, string> = {
  '/home':                  '/',
  '/index':                 '/',
  '/index.html':            '/',
  '/category/all':          '/shop',
  '/faq':                   '/faqs',
  '/faq/':                  '/faqs',
  '/policy':                '/privacy-policy',
  '/data-privacy':          '/data-policy',
  '/shipping':              '/shipment-policy',
  '/returns':               '/return-policy',
  '/refund-policy':         '/return-policy',
  '/tnc':                   '/terms',
  '/terms-and-conditions':  '/terms',
  '/disclaimer.html':       '/disclaimer',
  '/contact-us':            '/contact',
  '/about-us':              '/about',
  '/track':                 '/track-order',
};

// ─── PATHS THAT MUST NEVER BE INDEXED ───────────────────────────────────────
const NOINDEX_PREFIXES = [
  '/admin-login',
  '/api',
  '/_next',
  '/checkout',
  '/success',
];

export async function middleware(request: NextRequest) {
  const url      = request.nextUrl.clone();
  const pathname = url.pathname;

  // ── 0. Auth: redirect logged in users from /customer/login or /customer/register ──
  const restrictedPaths = ['/customer/login', '/customer/register'];
  if (restrictedPaths.some((path) => pathname.startsWith(path))) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET
    });

    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }


  // ── 1. Remove trailing slash (except root "/") ────────────────────────────
  if (pathname !== '/' && pathname.endsWith('/')) {
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url.toString(), { status: 308 });
  }

  // ── 2. Lowercase URL enforcement (skip assets) ────────────────────────────
  const isAsset =
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    /\.(ico|png|jpg|jpeg|webp|svg|gif|css|js|woff|woff2|ttf|eot|map)$/i.test(pathname);

  if (!isAsset && pathname !== pathname.toLowerCase()) {
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url.toString(), { status: 308 });
  }

  // ── 3. Legacy URL redirects ───────────────────────────────────────────────
  if (LEGACY_REDIRECTS[pathname]) {
    url.pathname = LEGACY_REDIRECTS[pathname];
    return NextResponse.redirect(url.toString(), { status: 308 });
  }

  // ── 4. Admin Security: Protection for /dashboard ─────────────────────────
  if (pathname.startsWith('/admin-login/dashboard')) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // No user -> redirect to login
    if (!user) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }

    // FAIL-SAFE: If it's the primary Admin UUID, skip the profile lookup and grant access
    const ADMIN_UUID = '7f4b9ea2-620e-45b7-80e4-b66e1ea56579';
    
    if (user.id === ADMIN_UUID) {
      // Access Granted for Admin
    } else {
      // Check role in profiles for other users
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin-login?error=unauthorized', request.url));
      }
    }

    // Set headers for security
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  }

  // ── 4b. Admin: block indexing for the login page itself ─────────────────
  if (pathname === '/admin-login') {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  // ── 5. API + _next: noindex header ───────────────────────────────────────
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
     * Match all paths EXCEPT static assets:
     * - _next/static, _next/image
     * - favicon, logo, image files
     */
    '/((?!_next/static|_next/image|favicon|Favicon|Logo|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)).*)',
  ],
};
