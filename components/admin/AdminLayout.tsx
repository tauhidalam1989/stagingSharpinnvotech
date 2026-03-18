'use client'

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('auth_token');
        const expiry = localStorage.getItem('token_expiry');
        const isExpired = expiry ? parseInt(expiry) < Date.now() : true;

        if ((!token || isExpired) && pathname !== '/admin/login') {
            router.push('/admin/login');
        } else if (token && !isExpired && pathname === '/admin/login') {
            router.push('/admin/dashboard');
        } else {
            setLoading(false);
        }
    }, [pathname, router]);

    if (loading && pathname !== '/admin/login') {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="flex bg-zinc-50 dark:bg-zinc-950 min-h-screen font-sans">
            <AdminSidebar />
            <main className="flex-grow p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
