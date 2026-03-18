'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
    getProductStats,
    getBlogStats,
    getServiceStats,
    getAdminProducts,
    getAdminBlogs,
    getAdminServices,
    Blog,
    Product,
    ServicePage
} from '@/lib/api';

export default function DashboardPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any[]>([]);
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);
    const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
    const [recentServices, setRecentServices] = useState<ServicePage[]>([]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch stats in parallel
                const [pStats, bStats, sStats] = await Promise.all([
                    getProductStats(),
                    getBlogStats(),
                    getServiceStats()
                ]);

                const totalViews = (Number(pStats.totalViews) || 0) + (Number(bStats.totalViews) || 0) + (Number(sStats.totalViews) || 0);

                setStats([
                    { label: 'Total Products', value: pStats.total || '0', published: pStats.published || '0', draft: pStats.draft || '0', icon: 'fa-cogs', gradient: 'from-cyan-400 to-blue-600' },
                    { label: 'Total Blogs', value: bStats.total || '0', published: bStats.published || '0', draft: bStats.draft || '0', icon: 'fa-rss', gradient: 'from-cyan-300 to-blue-700' },
                    { label: 'Total Services', value: sStats.total || '0', published: sStats.published || '0', draft: sStats.draft || '0', icon: 'fa-concierge-bell', gradient: 'from-cyan-400 to-indigo-600' },
                    { label: 'Total Views', value: totalViews.toString(), published: null, draft: null, icon: 'fa-eye', gradient: 'from-cyan-400 to-blue-800' },
                    { label: 'Total Likes', value: bStats.totalLikes || '0', published: null, draft: null, icon: 'fa-heart', gradient: 'from-cyan-400 to-blue-600' },
                ]);

                // Fetch recent items
                const [pList, bList, sList] = await Promise.all([
                    getAdminProducts({ limit: 4, sortBy: 'createdAt', sortOrder: 'DESC' }),
                    getAdminBlogs({ limit: 4, sortBy: 'createdAt', sortOrder: 'DESC' }),
                    getAdminServices({ limit: 4, sortBy: 'createdAt', sortOrder: 'DESC' })
                ]);

                setRecentProducts(pList.products || []);
                setRecentBlogs(bList.blogs || []);
                setRecentServices(sList.services || []);

            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const RecentSection = ({ title, items, icon, lang, type }: any) => (
        <div className="bg-white dark:bg-zinc-900 rounded-[24px] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm shadow-zinc-200/50 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f2fe] to-[#1200ff] font-black text-lg">{title}</h2>
                <Link
                    href={`/${lang}/dashboard/${type}`}
                    className="text-zinc-400 hover:text-blue-600 transition-colors flex items-center gap-2 text-xs font-bold bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 rounded-full uppercase tracking-widest"
                >
                    View All <i className="fas fa-arrow-right text-[10px]"></i>
                </Link>
            </div>
            <div className="space-y-4">
                {items.length === 0 ? (
                    <div className="py-10 text-center text-zinc-400 font-bold uppercase tracking-widest text-xs">
                        No recent {type} found
                    </div>
                ) : (
                    items.map((item: any, i: number) => (
                        <div key={i} className="bg-zinc-50/50 dark:bg-zinc-800/30 p-5 rounded-[20px] flex items-center justify-between group hover:bg-white dark:hover:bg-zinc-800 transition-all hover:shadow-lg hover:shadow-zinc-200/50 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700">
                            <div className="space-y-2 max-w-[70%]">
                                <h3 className="text-zinc-800 dark:text-zinc-100 font-black text-sm truncate">{item.title || item.heroTitle}</h3>
                                <div className="flex items-center gap-4">
                                    <span className={`text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${item.isPublished ? 'bg-gradient-to-r from-[#00f2fe] to-[#1200ff]' : 'bg-zinc-400'}`}>
                                        {item.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                    <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={
                                        type === 'services' 
                                            ? `/${lang}/dashboard/${type}/${item.id}/edit` 
                                            : `/${lang}/dashboard/${type}/edit/${item.id}`
                                    }
                                    className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                >
                                    <i className="fas fa-edit text-xs"></i>
                                </Link>
                                <Link
                                    href={
                                        type === 'blogs' 
                                            ? `/${lang}/dashboard/${type}/view/${item.id}` 
                                            : `/${lang}/dashboard/${type}/${item.id}`
                                    }
                                    className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                >
                                    <i className="fas fa-eye text-xs"></i>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                    Welcome back, {user?.name || 'Administrator'}!
                </h1>
                <p className="text-zinc-500 font-medium">Here&apos;s what&apos;s happening on your platform today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className={`bg-gradient-to-r ${stat.gradient} p-4 rounded-[24px] shadow-xl shadow-blue-500/10 flex items-center gap-4 relative overflow-hidden group min-h-[105px]`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/30 flex-shrink-0 relative z-10">
                            <i className={`fas ${stat.icon} text-lg`}></i>
                        </div>

                        <div className="flex flex-col gap-2 relative z-10 flex-grow">
                            <div>
                                <p className="text-[10px] font-black text-white/90 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-white leading-none tracking-tight">{stat.value}</p>
                            </div>

                            {stat.published !== null && (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="bg-white/20 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-full border border-white/10">
                                        {stat.published} Published
                                    </span>
                                    <span className="bg-blue-900/40 backdrop-blur-md text-white/80 text-[8px] font-black px-2 py-1 rounded-full">
                                        {stat.draft} Draft
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentSection
                    title="Recent Products"
                    lang={lang}
                    type="products"
                    items={recentProducts}
                />
                <RecentSection
                    title="Recent Blogs"
                    lang={lang}
                    type="blogs"
                    items={recentBlogs}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentSection
                    title="Recent Services"
                    lang={lang}
                    type="services"
                    items={recentServices}
                />
                <div className="hidden lg:block"></div>
            </div>

            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight uppercase">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Add New Blog', icon: 'fa-plus', path: `/${lang}/dashboard/blogs/new`, color: 'bg-blue-600 hover:bg-blue-700' },
                        { label: 'Add New Service', icon: 'fa-plus', path: `/${lang}/dashboard/services/new`, color: 'bg-purple-600 hover:bg-purple-700' },
                        { label: 'Add New Product', icon: 'fa-plus', path: `/${lang}/dashboard/products/new`, color: 'bg-amber-600 hover:bg-amber-700' },
                    ].map((action) => (
                        <Link
                            key={action.label}
                            href={action.path}
                            className={`${action.color} text-white p-6 rounded-[24px] flex items-center justify-between group transition-all shadow-sm hover:shadow-lg`}
                        >
                            <span className="font-black text-sm uppercase tracking-widest">{action.label}</span>
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center transition-transform group-hover:scale-110">
                                <i className={`fas ${action.icon}`}></i>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
