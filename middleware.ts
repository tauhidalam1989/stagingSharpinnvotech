import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ar'];
const defaultLocale = 'en';

export default function proxy(request: NextRequest) {
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

    return NextResponse.next();
}
