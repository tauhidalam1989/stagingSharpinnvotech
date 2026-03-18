'use client'

import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('current_user');
        if (userStr) setUser(JSON.parse(userStr));
    }, []);

    const stats = [
        { label: 'Total Blogs', value: '24', icon: 'fa-blog', color: 'bg-blue-500' },
        { label: 'Services', value: '12', icon: 'fa-concierge-bell', color: 'bg-purple-500' },
        { label: 'Active Clients', value: '48', icon: 'fa-users', color: 'bg-green-500' },
        { label: 'Pending Inquiries', value: '5', icon: 'fa-envelope', color: 'bg-orange-500' },
    ];

    return (
        <AdminLayout>
            <div className="space-y-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Welcome back, {user?.name || 'Admin'}!</h1>
                    <p className="text-zinc-500 mt-2 font-medium">Heres whats happening with your website today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                            <div className={`h-14 w-14 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-current/20`}>
                                <i className={`fas ${stat.icon} text-xl`} />
                            </div>
                            <div className="space-y-1">
                                <span className="text-3xl font-black">{stat.value}</span>
                                <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <h2 className="text-2xl font-black mb-6">Recent Activity</h2>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex gap-4">
                                    <div className="h-10 w-10 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center shrink-0">
                                        <i className="fas fa-plus text-xs text-blue-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-sm">New blog post published</p>
                                        <p className="text-xs text-zinc-500">2 hours ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-10 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <h2 className="text-2xl font-black mb-6">Quick Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-left group">
                                <i className="fas fa-plus-circle mb-4 text-blue-600 group-hover:text-white text-xl" />
                                <p className="font-bold text-sm">Add Blog</p>
                            </button>
                            <button className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-left group">
                                <i className="fas fa-plus-circle mb-4 text-blue-600 group-hover:text-white text-xl" />
                                <p className="font-bold text-sm">Add Product</p>
                            </button>
                            <button className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-left group">
                                <i className="fas fa-plus-circle mb-4 text-blue-600 group-hover:text-white text-xl" />
                                <p className="font-bold text-sm">Add Service</p>
                            </button>
                            <button className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl hover:bg-blue-600 hover:text-white transition-all text-left group">
                                <i className="fas fa-cog mb-4 text-blue-600 group-hover:text-white text-xl" />
                                <p className="font-bold text-sm">Settings</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
