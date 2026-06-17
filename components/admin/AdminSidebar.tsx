'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface MenuItem {
    path: string;
    icon: string;
    label: string;
    roles?: string[];
}

const menuItems: MenuItem[] = [
    { path: '/admin/dashboard', icon: 'fa-tachometer-alt', label: 'Dashboard' },
    { path: '/admin/products', icon: 'fa-box', label: 'Products' },
    { path: '/admin/product-categories', icon: 'fa-tags', label: 'Product Categories' },
    { path: '/admin/services', icon: 'fa-concierge-bell', label: 'Services' },
    { path: '/admin/service-categories', icon: 'fa-tags', label: 'Service Categories' },
    { path: '/admin/blogs', icon: 'fa-blog', label: 'Blog Posts' },
    { path: '/admin/product-details', icon: 'fa-cube', label: 'Product Details' },
    { path: '/admin/profile', icon: 'fa-user-circle', label: 'My Profile' },
    { path: '/admin/clients-partners', icon: 'fa-handshake', label: 'Clients & Partners' },
    { path: '/admin/users', icon: 'fa-users-cog', label: 'User Management', roles: ['super_admin'] },
    { path: '/admin/settings', icon: 'fa-cog', label: 'Settings' }
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        localStorage.removeItem('token_expiry');
        router.push('/admin/login');
    };

    return (
        <aside className={`bg-zinc-950 text-white min-h-screen transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'} border-r border-zinc-800 flex flex-col`}>
            <div className="p-6 flex items-center justify-between">
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl">S</div>
                        <span className="font-black text-xl tracking-tight">SIIT ADMIN</span>
                    </div>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-zinc-900 transition-colors"
                >
                    <i className={`fas ${collapsed ? 'fa-indent' : 'fa-outdent'}`} />
                </button>
            </div>

            <nav className="flex-grow px-4 space-y-2 mt-8">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                }`}
                        >
                            <i className={`fas ${item.icon} w-6 text-center text-lg ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-white'}`} />
                            {!collapsed && <span className="font-bold text-sm tracking-tight">{item.label}</span>}
                            {isActive && !collapsed && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 mt-auto">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 py-4 w-full rounded-2xl text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm"
                >
                    <i className="fas fa-sign-out-alt w-6 text-center text-lg" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
