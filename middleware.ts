import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth_token')?.value;

    // Protection logic for /dashboard
    // We want to protect everything under /dashboard EXCEPT /dashboard/login
    if (pathname.includes('/dashboard')) {
        const isLoginPage = pathname.includes('/dashboard/login');

        if (!token && !isLoginPage) {
            // Redirect to login if no token and not on login page
            // We need to extract the locale from the pathname
            const segments = pathname.split('/');
            const locale = segments[1] || 'en';
            const url = new URL(`/${locale}/dashboard/login`, request.url);
            return NextResponse.redirect(url);
        }

        if (token && isLoginPage) {
            // Redirect to dashboard if token exists and on login page
            const segments = pathname.split('/');
            const locale = segments[1] || 'en';
            const url = new URL(`/${locale}/dashboard`, request.url);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    // Only run middleware on dashboard routes
    matcher: ['/:lang/dashboard/:path*', '/dashboard/:path*'],
};
