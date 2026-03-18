'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAdminServices, deleteService, updateService, getServiceCategories } from '@/lib/api';
import { ServicePage, ServiceCategory } from '@/lib/api';

export default function ServiceListPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = React.use(params);
    const [services, setServices] = useState<ServicePage[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('all');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

    const fetchData = async (currentPage = pagination.page, currentSearch = search, currentCategory = categoryId) => {
        setLoading(true);
        try {
            const servicesRes = await getAdminServices({
                page: currentPage,
                limit: pagination.limit,
                search: currentSearch || undefined,
                categoryId: currentCategory === 'all' ? undefined : currentCategory
            });
            setServices(servicesRes.services);
            setPagination(prev => ({ 
                ...prev, 
                page: currentPage,
                total: servicesRes.total 
            }));
            
            if (categories.length === 0) {
                const categoriesRes = await getServiceCategories();
                setCategories(categoriesRes);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pagination.page, categoryId]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData(1);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            const res = await deleteService(id);
            if (res.success) fetchData();
            else alert(res.message || 'Error deleting service');
        } catch (error) {
            alert('An error occurred');
        }
    };

    const togglePublish = async (service: ServicePage) => {
        try {
            const res = await updateService(service.id, { isPublished: !service.isPublished });
            if (res.success) fetchData();
        } catch (error) {
            console.error('Error toggling publish status:', error);
        }
    };

    const checkBilingual = (service: ServicePage) => {
        const hasArTitle = !!service.heroTitleAr;
        const hasArTagline = !!service.heroTaglineAr;
        const hasArIntro = !!service.heroIntroductionAr;
        return hasArTitle && (hasArTagline || hasArIntro);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Service Management</h1>
                    <p className="text-sm text-zinc-500 font-medium">Manage your service pages and categories.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link 
                        href={`/${lang}/dashboard/services/categories`}
                        className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-bold px-6 py-3.5 rounded-2xl shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all font-sans"
                    >
                        <i className="fas fa-tags text-xs"></i>
                        Categories
                    </Link>
                    <Link 
                        href={`/${lang}/dashboard/services/new`}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-500/10 transition-all group"
                    >
                        <i className="fas fa-plus text-xs"></i>
                        Add Service
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                    <div className="flex flex-col md:flex-row gap-3">
                        <form onSubmit={handleSearch} className="relative flex-grow">
                            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-xs"></i>
                            <input 
                                type="text" 
                                placeholder="Search services..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            />
                        </form>
                        <select 
                            value={categoryId}
                            onChange={(e) => {
                                setCategoryId(e.target.value);
                                setPagination(prev => ({ ...prev, page: 1 }));
                            }}
                            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50/50 dark:bg-zinc-800/20 text-zinc-500 dark:text-zinc-400 text-xs font-black uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800">
                                <th className="px-8 py-5">Order</th>
                                <th className="px-8 py-5">Service Info</th>
                                <th className="px-8 py-5 text-center">Language</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6">
                                            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : services.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <i className="fas fa-concierge-bell text-3xl text-zinc-200 dark:text-zinc-800"></i>
                                            <p className="text-xs text-zinc-500 font-medium">No services found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                services.map((service) => (
                                    <tr key={service.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-8 py-4">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-black text-zinc-600 dark:text-zinc-400">
                                                {service.order || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 text-sm shadow-sm border border-blue-100 dark:border-blue-800/50">
                                                    <i className={service.cardIcon || 'fas fa-cog'}></i>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">{service.heroTitle}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-zinc-500 font-medium bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded leading-none">
                                                            {service.category?.name || 'General'}
                                                        </span>
                                                        <code className="text-[10px] text-zinc-400 font-medium">/{service.slug}</code>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <span className={`w-2 h-2 rounded-full ${service.heroTitle ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-zinc-200 dark:bg-zinc-700'}`} title="English Support"></span>
                                                <span className={`w-2 h-2 rounded-full ${checkBilingual(service) ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-200 dark:bg-zinc-700'}`} title="Arabic Support"></span>
                                            </div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-1.5">{checkBilingual(service) ? 'Bilingual' : 'English Only'}</p>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                service.isPublished 
                                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100/50 dark:border-emerald-800/30' 
                                                    : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-100/50 dark:border-amber-800/30'
                                            }`}>
                                                <span className={`w-1 h-1 rounded-full ${service.isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                {service.isPublished ? 'Live' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Link 
                                                    href={`/${lang}/dashboard/services/${service.id}`}
                                                    className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                                                    title="View"
                                                >
                                                    <i className="fas fa-eye text-xs"></i>
                                                </Link>
                                                <Link 
                                                    href={`/${lang}/dashboard/services/${service.id}/edit`}
                                                    className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <i className="fas fa-edit text-xs"></i>
                                                </Link>
                                                <button 
                                                    onClick={() => togglePublish(service)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${service.isPublished ? 'text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-zinc-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
                                                    title={service.isPublished ? 'Unpublish' : 'Publish'}
                                                >
                                                    <i className={`fas ${service.isPublished ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(service.id)}
                                                    className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <i className="fas fa-trash text-xs"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && services.length > 0 && (
                    <div className="p-6 bg-zinc-50/50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">
                            Total {pagination.total} services
                        </p>
                        <div className="flex items-center gap-3">
                            <button 
                                disabled={pagination.page === 1}
                                onClick={() => fetchData(pagination.page - 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 disabled:opacity-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
                            >
                                <i className="fas fa-chevron-left text-xs"></i>
                            </button>
                            <span className="text-sm font-black text-zinc-900 dark:text-white px-3">
                                Page {pagination.page}
                            </span>
                            <button 
                                disabled={pagination.page * pagination.limit >= pagination.total}
                                onClick={() => fetchData(pagination.page + 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 disabled:opacity-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
                            >
                                <i className="fas fa-chevron-right text-xs"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
