import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth_token')?.value;

    // Check if the path starts with a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // If visiting /dashboard without a locale, redirect to the default locale
    if (!pathnameHasLocale && (pathname === '/dashboard' || pathname.startsWith('/dashboard/'))) {
        const url = new URL(`/${defaultLocale}${pathname}`, request.url);
        return NextResponse.redirect(url);
    }

    // Protection logic for /[lang]/dashboard
    if (pathname.includes('/dashboard')) {
        const isLoginPage = pathname.includes('/dashboard/login');

        if (!token && !isLoginPage) {
            // Re-extract locale safely
            const segments = pathname.split('/');
            const locale = locales.includes(segments[1]) ? segments[1] : defaultLocale;
            const url = new URL(`/${locale}/dashboard/login`, request.url);
            return NextResponse.redirect(url);
        }

        if (token && isLoginPage) {
            // Already logged in, go to dashboard
            const segments = pathname.split('/');
            const locale = locales.includes(segments[1]) ? segments[1] : defaultLocale;
            const url = new URL(`/${locale}/dashboard`, request.url);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    // Run middleware on dashboard routes (localized or not)
    matcher: ['/:lang/dashboard/:path*', '/dashboard/:path*', '/dashboard'],
};
