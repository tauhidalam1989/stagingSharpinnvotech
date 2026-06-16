'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface MenuItem {
    path: string;
    icon: string;
    label: string;
    roles?: string[];
    iconColor?: string;
}

export default function DashboardSidebar({ lang }: { lang: string }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const menuItems: MenuItem[] = [
        { path: `/${lang}/dashboard`, icon: 'fa-tachometer-alt', label: 'Dashboard' },
        { path: `/${lang}/dashboard/products`, icon: 'fa-box', label: 'Products', iconColor: 'text-blue-500' },
        { path: `/${lang}/dashboard/products/categories`, icon: 'fa-tags', label: 'Product Categories', iconColor: 'text-cyan-500' },
        { path: `/${lang}/dashboard/products/new`, icon: 'fa-plus-circle', label: 'Add Product', iconColor: 'text-blue-400' },
        { path: `/${lang}/dashboard/services`, icon: 'fa-concierge-bell', label: 'Services', iconColor: 'text-blue-600' },
        { path: `/${lang}/dashboard/services/categories`, icon: 'fa-layer-group', label: 'Service Categories', iconColor: 'text-purple-500' },
        { path: `/${lang}/dashboard/services/new`, icon: 'fa-plus-circle', label: 'Add Service', iconColor: 'text-blue-400' },
        { path: `/${lang}/dashboard/blogs`, icon: 'fa-blog', label: 'Blogs', iconColor: 'text-amber-500' },
        { path: `/${lang}/dashboard/blogs/new`, icon: 'fa-plus-circle', label: 'Add Blog', iconColor: 'text-blue-400' },
        { path: `/${lang}/dashboard/client-partner`, icon: 'fa-handshake', label: 'Clients & Partners', iconColor: 'text-teal-500' },
        { path: `/${lang}/dashboard/portfolio`, icon: 'fa-briefcase', label: 'Portfolio management', iconColor: 'text-indigo-600' },
        { path: `/${lang}/dashboard/users`, icon: 'fa-users-cog', label: 'Users', roles: ['super_admin'], iconColor: 'text-indigo-500' },
        { path: `/${lang}/dashboard/settings`, icon: 'fa-cog', label: 'Settings', iconColor: 'text-zinc-500' },
        { path: `/${lang}/dashboard/newsletter`, icon: 'fa-envelope-open-text', label: 'Newsletter', roles: ['super_admin'], iconColor: 'text-blue-500' },
        { path: `/${lang}/dashboard/analytics`, icon: 'fa-chart-bar', label: 'Analytics', roles: ['super_admin'], iconColor: 'text-rose-500' }
    ];

    // Find the best matching menu item (longest path that matches the current pathname)
    const activeItem = React.useMemo(() => {
        return [...menuItems]
            .filter(item => {
                const path = item.path;
                if (path === `/${lang}/dashboard`) return pathname === path;
                return pathname === path || pathname.startsWith(`${path}/`);
            })
            .sort((a, b) => b.path.length - a.path.length)[0];
    }, [pathname, lang]);

    return (
        <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-screen sticky top-0">
            {/* Header section with centered logo - Compacted & Less Bold */}
            <div className="pt-5 pb-3 flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-white rounded-[18px] shadow-md shadow-blue-500/5 flex items-center justify-center p-2 border border-zinc-50 transition-transform hover:scale-105 duration-300">
                    <img src="/logo/SLogo.png" alt="Logo" className="w-full h-auto" />
                </div>
                <h2 className="text-[#1200ff] text-base font-bold tracking-tight uppercase leading-none">Admin Panel</h2>
                <div className="w-[70%] h-[2px] bg-gradient-to-r from-[#00f2fe] to-[#1200ff] mt-1 rounded-full opacity-80"></div>
            </div>

            <nav className="flex-grow px-3 space-y-1 overflow-y-auto mt-3 custom-scrollbar">
                {menuItems.map((item) => {
                    if (item.roles && user && !item.roles.includes(user.role)) return null;

                    const active = activeItem?.path === item.path;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-[15px] transition-all font-semibold text-sm group ${active
                                    ? 'bg-gradient-to-r from-[#00f2fe] to-[#1200ff] text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-gradient-to-r hover:from-[#00f2fe]/10 hover:to-[#1200ff]/10 hover:text-[#1200ff]'
                                }`}
                        >
                            <div className={`w-6 flex justify-center transition-colors ${active ? 'text-white' : 'group-hover:text-[#1200ff] ' + (item.iconColor || 'text-zinc-400')}`}>
                                <i className={`fas ${item.icon} text-base`}></i>
                            </div>
                            <span className="truncate">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto border-t border-zinc-50 dark:border-zinc-800/50">
                <div className="flex items-center gap-3 mb-6 px-1">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00f2fe] to-[#1200ff] rounded-[15px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative w-11 h-11 rounded-[14px] bg-white dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-md text-zinc-800 dark:text-white font-bold text-lg">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0).toUpperCase() || 'A'
                            )}
                        </div>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user?.name || 'Super Admin'}</p>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest truncate">{user?.role || 'SUPER_ADMIN'}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full relative group"
                >
                    <div className="relative w-full flex items-center justify-center gap-2 px-3 py-3 rounded-[15px] bg-gradient-to-r from-[#00f2fe] to-[#1200ff] text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">
                        <i className="fas fa-sign-out-alt text-base"></i>
                        <span className="uppercase tracking-widest">Logout</span>
                    </div>
                </button>
            </div>
        </aside>
    );
}
