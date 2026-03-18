'use client';

import React from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = React.use(params);
    const { loading } = useAuth();
    const pathname = usePathname();

    // Don't show the dashboard layout on the login page
    const isLoginPage = pathname.includes('/dashboard/login');

    if (isLoginPage) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-zinc-500 font-medium">Loading session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950">
            <DashboardSidebar lang={lang} />
            <div className="flex-grow flex flex-col min-w-0">
                <DashboardNavbar />
                <main className="p-8 flex-grow">
                    {children}
                </main>
            </div>
        </div>
    );
}
