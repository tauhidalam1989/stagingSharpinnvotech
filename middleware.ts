import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth_token')?.value;

    // 1. Skip if it's an internal Next.js path or API
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // 2. Handle Case for /home vs /
    // If it's /home or /[lang]/home, redirect to the corresponding root locale path
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

        if (token && isLoginPage) {
            const url = new URL(`/${locale}/dashboard`, request.url);
            return NextResponse.redirect(url);
        }
    }

    // 5. Universal Redirect for locale-less paths (e.g., /about -> /en/about)
    if (!pathnameHasLocale) {
        const url = new URL(`/${defaultLocale}${pathname}`, request.url);
        return NextResponse.redirect(url);
    }

    const response = NextResponse.next();
    response.headers.set('x-pathname', pathname);
    return response;
}

export const config = {
    // Run middleware on all paths except static files
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|img|assets|clients|cybersecurity|isocert|logo|office|partner).*)'],
};
