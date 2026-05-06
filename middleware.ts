import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export default function proxy(request: NextRequest) {
    const host = request.headers.get('host');
    const { pathname, search } = request.nextUrl;
    const protocol = request.headers.get('x-forwarded-proto') || 'http';

    // 1. Enforce HTTPS and non-WWW (301 Redirect)
    // Only in production to avoid issues with local dev
    if (process.env.NODE_ENV === 'production' && host) {
        const isWww = host.startsWith('www.');
        const isHttp = protocol === 'http';

        if (isWww || isHttp) {
            const newHost = host.replace('www.', '');
            // Create the new URL with https and the non-www host
            const newUrl = new URL(`${pathname}${search}`, `https://${newHost}`);
            return NextResponse.redirect(newUrl, 301);
        }
    }

    const token = request.cookies.get('auth_token')?.value;

    // 1. Skip if it's an internal Next.js path, API, or static file
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.match(/\.(png|jpe?g|gif|svg|webp|ico|pdf|woff2?|eot|ttf|mp4|webm)$/i) ||
        pathname === '/favicon.ico' ||
        pathname === '/sitemap.xml' ||
        pathname === '/robots.txt'
    ) {
        return NextResponse.next();
    }

    // 2. Handle Case for /home vs /
    const isHomePath = pathname === '/home' || locales.some(l => pathname === `/${l}/home`);
    if (isHomePath) {
        const segments = pathname.split('/');
        const locale = locales.includes(segments[1]) ? segments[1] : defaultLocale;
        const url = new URL(`/${locale}`, request.url);
        return NextResponse.redirect(url);
    }

    // 3. Check if the path starts with a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // 4. Protection logic for /[lang]/dashboard
    if (pathname.includes('/dashboard')) {
        const isLoginPage = pathname.includes('/dashboard/login');
        const segments = pathname.split('/');
        const locale = locales.includes(segments[1]) ? segments[1] : defaultLocale;

        if (!token && !isLoginPage) {
            const url = new URL(`/${locale}/dashboard/login`, request.url);
            return NextResponse.redirect(url);
        }
    }

    // 5. Universal Redirect for locale-less paths (e.g., /about -> /en/about)
    if (!pathnameHasLocale) {
        const url = new URL(`/${defaultLocale}${pathname}`, request.url);
        return NextResponse.redirect(url);
    }

    const response = NextResponse.next();

    // Add Security Headers
    // const securityHeaders = {
    //     'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://db.onlinewebfonts.com; img-src 'self' blob: data: https://sharpinnovation-api.sharpinnvotech.com http://127.0.0.1:8092; font-src 'self' https://cdnjs.cloudflare.com https://db.onlinewebfonts.com; connect-src 'self' https://sharpinnovation-api.sharpinnvotech.com http://127.0.0.1:8092; frame-ancestors 'none';",
    //     'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    //     'X-Frame-Options': 'DENY',
    //     'X-Content-Type-Options': 'nosniff',
    //     'Referrer-Policy': 'strict-origin-when-cross-origin',
    //     'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    // };
    const securityHeaders = {
        'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://www.googletagmanager.com;
    connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://sharpinnovation-api.sharpinnvotech.com http://127.0.0.1:8092;
    img-src 'self' blob: data: https://www.google-analytics.com https://sharpinnovation-api.sharpinnvotech.com http://127.0.0.1:8092;
    style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://db.onlinewebfonts.com;
    font-src 'self' https://cdnjs.cloudflare.com https://db.onlinewebfonts.com;
    frame-ancestors 'none';
  `.replace(/\n/g, ''),
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };

    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    response.headers.set('x-pathname', pathname);
    return response;
}
