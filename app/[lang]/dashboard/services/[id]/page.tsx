'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ServicePage, getServiceById, updateService, deleteService } from '@/lib/api';

export default function ServiceDetailPage({ params }: { params: Promise<{ lang: string, id: string }> }) {
    const { lang, id } = React.use(params);
    const router = useRouter();
    const [service, setService] = useState<ServicePage | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('hero');

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await getServiceById(parseInt(id));
                setService(data);
            } catch (error) {
                console.error('Error fetching service:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    const handleTogglePublish = async () => {
        if (!service) return;
        const newStatus = !service.isPublished;
        const res = await updateService(service.id, { isPublished: newStatus });
        if (res.success) {
            setService(prev => prev ? { ...prev, isPublished: newStatus } : null);
        } else {
            alert(res.message);
        }
    };

    const handleDelete = async () => {
        if (!service || !confirm('Are you sure you want to delete this service?')) return;
        const res = await deleteService(service.id);
        if (res.success) {
            router.push(`/${lang}/dashboard/services`);
        } else {
            alert(res.message);
        }
    };

    const getImageUrl = (path: string) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
        const baseUrl = API_URL.replace('/v1', '');
        return `${baseUrl}/${path.startsWith('/') ? path.substring(1) : path}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="p-8 text-center text-zinc-500 font-medium">
                Service not found.
            </div>
        );
    }

    const checkBilingual = () => {
        return !!service.heroTitleAr;
    };

    const tabs = [
        { id: 'hero', label: 'Hero', icon: 'fa-clapperboard' },
        { id: 'process', label: 'Process', icon: 'fa-diagram-project' },
        { id: 'capabilities', label: 'Capabilities', icon: 'fa-bolt' },
        { id: 'wcu', label: 'Why Us', icon: 'fa-award' },
        { id: 'industries', label: 'Industries', icon: 'fa-building' },
        { id: 'critical', label: 'Impact', icon: 'fa-chart-pie' },
        { id: 'about', label: 'About', icon: 'fa-info-circle' },
        { id: 'faq', label: 'FAQ/CTA', icon: 'fa-circle-question' }
    ];

    return (
        <div className="max-w-[1400px] mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-blue-600 transition-all shadow-sm"
                    >
                        <i className="fas fa-arrow-left text-sm"></i>
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                service.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                                <span className={`w-1 h-1 rounded-full ${service.isPublished ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                                {service.isPublished ? 'Published' : 'Draft'}
                            </span>
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2.5 border-l border-zinc-200 dark:border-zinc-800">
                                #{service.id}
                            </span>
                        </div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">{service.heroTitle}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleTogglePublish}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm border ${
                            service.isPublished 
                                ? 'bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100/80' 
                                : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100/80'
                        }`}
                    >
                        <i className={`fas ${service.isPublished ? 'fa-eye-slash' : 'fa-eye'} mr-2 text-[10px]`}></i>
                        {service.isPublished ? 'Draft' : 'Publish'}
                    </button>
                    <Link 
                        href={`/${lang}/dashboard/services/${service.id}/edit`}
                        className="px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold hover:opacity-90 transition-all shadow-lg shadow-zinc-200/50 dark:shadow-none"
                    >
                        <i className="fas fa-edit mr-2 text-[10px]"></i>
                        Edit
                    </Link>
                    <button 
                        onClick={handleDelete}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all border border-red-100"
                    >
                        <i className="fas fa-trash text-sm"></i>
                    </button>
                </div>
            </div>

            {/* Dashboard Overview row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Category', value: service.category?.name || 'General Service', icon: 'fa-layer-group', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Views', value: service.views || 0, icon: 'fa-chart-line', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Order', value: service.order || 0, icon: 'fa-sort', color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Status', value: checkBilingual() ? 'Bilingual' : 'English Only', icon: 'fa-language', color: 'text-amber-600', bg: 'bg-amber-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center text-sm`}>
                            <i className={`fas ${stat.icon}`}></i>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest truncate">{stat.label}</p>
                            <p className="text-sm font-black text-zinc-900 dark:text-white truncate">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Layout Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Previews & Content */}
                <div className="lg:col-span-9 space-y-6">
                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-[20px] border border-zinc-200 dark:border-zinc-700 w-fit">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                    activeTab === tab.id 
                                        ? 'bg-white dark:bg-zinc-900 text-blue-600 shadow-sm border border-zinc-200/50 dark:border-zinc-700' 
                                        : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                                }`}
                            >
                                <i className={`fas ${tab.icon} text-xs`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden min-h-[500px]">
                        <div className="p-6">
                            {activeTab === 'hero' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="relative flex flex-col md:flex-row items-center gap-8">
                                        <div className="flex-grow space-y-6">
                                            <div className="space-y-3">
                                                <div className="flex gap-2">
                                                    <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest border border-blue-100">Hero Section</span>
                                                </div>
                                                <div className="space-y-1">
                                                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white leading-tight">{service.heroTitle}</h2>
                                                    {service.heroTitleAr && <h2 className="text-2xl font-black text-zinc-500 leading-tight" dir="rtl">{service.heroTitleAr}</h2>}
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Tagline</p>
                                                    <p className="text-sm text-zinc-600 font-bold">{service.heroTagline || 'No tagline set'}</p>
                                                    {service.heroTaglineAr && <p className="text-sm text-zinc-400 font-bold text-right" dir="rtl">{service.heroTaglineAr}</p>}
                                                </div>
                                                <div className="space-y-2 pt-2">
                                                    <p className="text-[11px] font-black text-blue-600 uppercase tracking-widest">Introduction</p>
                                                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">{service.heroIntroduction || 'No introduction set'}</p>
                                                    {service.heroIntroductionAr && <p className="text-xs text-zinc-400 font-medium leading-relaxed text-right" dir="rtl">{service.heroIntroductionAr}</p>}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                 <div className="px-6 py-3 rounded-xl bg-blue-600 text-white font-black text-[11px] uppercase tracking-wider shadow-lg shadow-blue-500/20">{service.primaryCtaText || 'Consult Now'}</div>
                                                 <div className="px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-black text-[11px] uppercase tracking-wider">{service.secondaryCtaText || 'View Details'}</div>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-64 shrink-0">
                                            <div className="aspect-square rounded-[32px] bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xl">
                                                {service.heroImage ? (
                                                    <img src={getImageUrl(service.heroImage)} alt="Hero" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-7xl text-zinc-200 dark:text-zinc-800">
                                                        <i className={service.heroIcon || 'fas fa-cog'}></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-3 text-[10px] text-center text-zinc-400 font-bold uppercase tracking-widest">
                                                Hero Graphic
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'process' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{service.processSectionTitle || 'Our Methodology'}</h3>
                                        {service.processSectionTitleAr && <h3 className="text-xl font-black text-zinc-500 tracking-tight text-right" dir="rtl">{service.processSectionTitleAr}</h3>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {(service.process || []).map((step, i) => (
                                            <div key={i} className="p-6 rounded-[28px] bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/20 space-y-4">
                                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center text-blue-600 text-xl border border-zinc-100 dark:border-zinc-800">
                                                    <i className={step.icon || 'fas fa-arrow-right'}></i>
                                                </div>
                                                <div className="space-y-2">
                                                    <h5 className="font-black text-xs uppercase tracking-tight text-zinc-900 dark:text-white">{step.title}</h5>
                                                    <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{step.description}</p>
                                                    {step.titleAr && <h5 className="font-black text-[10px] text-zinc-400 text-right mt-2" dir="rtl">{step.titleAr}</h5>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'capabilities' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="space-y-2 text-center max-w-2xl mx-auto">
                                        <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">{service.capabilitiesSectionTitle || 'Core Capabilities'}</h3>
                                        {service.capabilitiesSectionTitleAr && <h3 className="text-2xl font-black text-zinc-500 tracking-tight" dir="rtl">{service.capabilitiesSectionTitleAr}</h3>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {(service.capabilities || []).map((cap, i) => (
                                            <div key={i} className="p-8 rounded-[40px] bg-white dark:bg-zinc-900 border-2 border-zinc-50 dark:border-zinc-800/50 hover:border-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group text-center">
                                                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                                                    <i className={cap.icon || 'fas fa-rocket'}></i>
                                                </div>
                                                <div className="mt-8 space-y-4">
                                                    <h5 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">{cap.title}</h5>
                                                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">{cap.description}</p>
                                                    {cap.titleAr && <h5 className="text-xs font-black text-zinc-400 pt-2" dir="rtl">{cap.titleAr}</h5>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'wcu' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <span className="text-[11px] font-black text-blue-600 uppercase tracking-[0.3em]">Value Proposition</span>
                                                <h3 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">{service.whyChooseUsSectionTitle || 'Why Choose Us'}</h3>
                                                {service.whyChooseUsSectionTitleAr && <h3 className="text-3xl font-black text-zinc-500 tracking-tight text-right underline decoration-blue-500/20 underline-offset-8" dir="rtl">{service.whyChooseUsSectionTitleAr}</h3>}
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-sm font-medium leading-relaxed text-zinc-500 whitespace-pre-wrap">{service.whyChooseUsDescription}</p>
                                                {service.whyChooseUsDescriptionAr && <p className="text-sm font-medium leading-relaxed text-zinc-400 whitespace-pre-wrap text-right" dir="rtl">{service.whyChooseUsDescriptionAr}</p>}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                                {(service.whyChooseUs || []).map((item, i) => (
                                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-700/50">
                                                        <div className="w-10 h-10 shrink-0 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-blue-600 shadow-sm">
                                                            <i className={item.iconFA || 'fas fa-check-circle'}></i>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight">{item.title}</p>
                                                            {item.titleAr && <p className="text-[11px] font-bold text-zinc-400" dir="rtl">{item.titleAr}</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-zinc-900 rounded-[48px] p-12 text-white relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-blue-500/30"></div>
                                            <div className="relative z-10 space-y-8">
                                                <i className="fas fa-quote-left text-5xl text-blue-500/30"></i>
                                                <p className="text-xl font-black leading-relaxed tracking-tight italic">{service.whyChooseUsBottomNote || "Delivering excellence through precision and innovation."}</p>
                                                {service.whyChooseUsBottomNoteAr && <p className="text-lg font-black leading-relaxed tracking-tight text-right text-white/70" dir="rtl">{service.whyChooseUsBottomNoteAr}</p>}
                                                <div className="pt-8 flex items-center gap-4">
                                                    <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                                                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Quality Assurance</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'industries' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                                        <div className="lg:col-span-7 space-y-8">
                                            <div className="space-y-4">
                                                <h3 className="text-4xl font-black text-zinc-900 dark:text-white leading-tight tracking-tight">{service.industriesSectionTitle || 'Industries We Serve'}</h3>
                                                {service.industriesSectionTitleAr && <h3 className="text-3xl font-black text-zinc-500 leading-tight tracking-tight text-right" dir="rtl">{service.industriesSectionTitleAr}</h3>}
                                                <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-xl">{service.industriesSectionDescription}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                {(service.industries || []).map((industry, i) => (
                                                    <div key={i} className="group p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-800/30 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-[1.03]">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 text-blue-600 flex items-center justify-center text-xl shadow-sm group-hover:bg-white/20 group-hover:text-white transition-colors">
                                                                <i className={industry.iconFA || 'fas fa-industry'}></i>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black uppercase tracking-tight">{industry.title}</p>
                                                                {industry.titleAr && <p className="text-[10px] font-bold opacity-60 text-right" dir="rtl">{industry.titleAr}</p>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="lg:col-span-5">
                                            <div className="aspect-[4/5] rounded-[56px] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl relative group">
                                                {service.industriesImage ? (
                                                    <img src={getImageUrl(service.industriesImage)} alt="Industries" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                                        <i className="fas fa-city text-7xl text-zinc-200 dark:text-zinc-700"></i>
                                                    </div>
                                                )}
                                                <div className="absolute inset-x-8 bottom-8 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] text-white">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-60">Impact Area</p>
                                                    <p className="text-sm font-bold leading-relaxed">{service.industriesSectionBottomNote || 'Tailored solutions for diverse sectors.'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'critical' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="relative p-12 rounded-[56px] border-4 border-zinc-100 dark:border-zinc-800 overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 border-l border-b border-zinc-100 dark:border-zinc-800 rounded-bl-3xl">
                                            <i className="fas fa-shield-halved text-4xl text-blue-600/20"></i>
                                        </div>
                                        <div className="max-w-3xl space-y-8">
                                            <div className="space-y-4">
                                                <h3 className="text-5xl font-black text-zinc-900 dark:text-white leading-tight tracking-tighter">{service.criticalSectionTitle || 'Critical Business Impact'}</h3>
                                                {service.criticalSectionTitleAr && <h3 className="text-3xl font-black text-zinc-500 tracking-tight text-right underline decoration-blue-500 decoration-4 underline-offset-8" dir="rtl">{service.criticalSectionTitleAr}</h3>}
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-lg font-bold text-zinc-500 leading-relaxed">{service.criticalSectionDescription}</p>
                                                {service.criticalSectionDescriptionAr && <p className="text-md font-bold text-zinc-400 text-right" dir="rtl">{service.criticalSectionDescriptionAr}</p>}
                                            </div>
                                            <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                                                {(service.criticalCards || []).map((card, i) => (
                                                    <div key={i} className="relative pl-8 border-l-2 border-blue-600/30">
                                                        <div className="absolute left-[-11px] top-0 w-5 h-5 rounded-full bg-blue-600 border-4 border-white dark:border-zinc-900 shadow-sm"></div>
                                                        <p className="text-xs font-black uppercase text-zinc-400 tracking-[0.2em] mb-2">Metric 0{i+1}</p>
                                                        <p className="text-md font-black text-zinc-900 dark:text-white uppercase tracking-tight leading-snug">{card.title}</p>
                                                        {card.titleAr && <p className="text-xs font-bold text-zinc-400 mt-2 text-right" dir="rtl">{card.titleAr}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'about' && (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                     <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20"><i className="fas fa-heart text-sm"></i></div>
                                                     <h4 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">Philosophy</h4>
                                                </div>
                                                <h3 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">{service.aboutSectionTitle || 'Our Approach'}</h3>
                                                {service.aboutSectionTitleAr && <h3 className="text-3xl font-black text-zinc-500 tracking-tight text-right leading-tight" dir="rtl">{service.aboutSectionTitleAr}</h3>}
                                            </div>
                                            <div className="space-y-6">
                                                <p className="text-sm font-medium leading-relaxed text-zinc-500 whitespace-pre-wrap">{service.aboutSectionDescription}</p>
                                                {service.aboutSectionDescriptionAr && <p className="text-sm font-medium leading-relaxed text-zinc-400 whitespace-pre-wrap text-right" dir="rtl">{service.aboutSectionDescriptionAr}</p>}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                                {(service.aboutPillars || []).map((pillar, i) => (
                                                    <div key={i} className="flex gap-4">
                                                        <div className="w-8 h-8 shrink-0 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center text-xs self-start mt-1">
                                                            <i className={pillar.iconType === 'fa' ? pillar.iconFA || 'fas fa-shield' : 'fas fa-star'}></i>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight">{pillar.title}</p>
                                                            {pillar.titleAr && <p className="text-[10px] font-bold text-zinc-400" dir="rtl">{pillar.titleAr}</p>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="relative group">
                                            <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-[56px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative aspect-square rounded-[48px] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-zinc-100 dark:bg-zinc-800">
                                                {service.aboutSectionImage ? (
                                                    <img src={getImageUrl(service.aboutSectionImage)} alt="About" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-7xl text-zinc-200 dark:text-zinc-700">
                                                        <i className="fas fa-handshake"></i>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'faq' && (
                                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm"><i className="fas fa-circle-question text-sm"></i></div>
                                            <h4 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight uppercase tracking-widest">Common Questions</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {(service.faqs || []).map((faq, i) => (
                                                <div key={i} className="p-8 rounded-[40px] bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/50 space-y-6">
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight">{faq.question}</p>
                                                        {faq.questionAr && <p className="text-xs font-black text-zinc-400 text-right" dir="rtl">{faq.questionAr}</p>}
                                                    </div>
                                                    <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-700/50">
                                                        <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{faq.answer}</p>
                                                        {faq.answerAr && <p className="text-[11px] text-zinc-400 font-medium leading-relaxed text-right" dir="rtl">{faq.answerAr}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-12 rounded-[56px] bg-blue-600 text-white space-y-8 relative overflow-hidden text-center shadow-2xl shadow-blue-500/40">
                                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
                                        <div className="relative z-10 space-y-6">
                                            <div className="space-y-2">
                                                <h3 className="text-4xl font-black tracking-tight leading-none">{service.ctaMessage || "Ready to project?"}</h3>
                                                {service.ctaMessageAr && <h3 className="text-3xl font-black tracking-tight leading-none opacity-80" dir="rtl">{service.ctaMessageAr}</h3>}
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                                <div className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform">{service.ctaPrimaryText || 'Contact Us'}</div>
                                                <div className="px-8 py-4 bg-blue-700/50 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-700 transition-colors">{service.ctaSecondaryText || 'Request Demo'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Metadata Sidebar */}
                <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-zinc-50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Service Core</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {[
                                { label: 'Route Path', value: `/${service.slug}`, font: 'font-mono text-blue-600' },
                                { label: 'Category', value: service.category?.name || 'General' },
                                { label: 'Total Steps', value: service.process?.length || 0 },
                                { label: 'Total Caps', value: service.capabilities?.length || 0 },
                                { label: 'Created', value: service.createdAt ? new Date(service.createdAt).toLocaleDateString() : 'N/A' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-700/50 transition-colors">
                                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">{item.label}</span>
                                    <span className={`text-[11px] font-bold text-zinc-800 dark:text-zinc-200 truncate ${item.font || ''}`}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-zinc-50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">SEO & Growth</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {[
                                { label: 'SEO Title', value: service.metaTitle, ar: service.metaTitleAr },
                                { label: 'SEO Keywords', value: service.metaKeywords, ar: service.metaKeywordsAr },
                                { label: 'Meta Description', value: service.metaDescription, ar: service.metaDescriptionAr }
                            ].map((seo, i) => (
                                <div key={i} className="space-y-1.5 px-1">
                                    <p className="text-[9px] font-black text-blue-600/60 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                                        {seo.label}
                                    </p>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 leading-normal line-clamp-3">{seo.value || 'Not optimized'}</p>
                                        {seo.ar && <p className="text-[10px] font-bold text-zinc-400 leading-normal text-right truncate" dir="rtl">{seo.ar}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
