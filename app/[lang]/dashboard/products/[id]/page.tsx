'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, getProductById, updateProduct, deleteProduct } from '@/lib/api';

export default function ProductDetailPage({ params }: { params: Promise<{ lang: string, id: string }> }) {
    const { lang, id } = React.use(params);
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('hero');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(parseInt(id));
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleTogglePublish = async () => {
        if (!product) return;
        const newStatus = !product.isPublished;
        const res = await updateProduct(product.id, { isPublished: newStatus });
        if (res.success) {
            setProduct(prev => prev ? { ...prev, isPublished: newStatus } : null);
        } else {
            alert(res.message);
        }
    };

    const handleDelete = async () => {
        if (!product || !confirm('Are you sure you want to delete this product?')) return;
        const res = await deleteProduct(product.id);
        if (res.success) {
            router.push(`/${lang}/dashboard/products`);
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

    if (!product) {
        return (
            <div className="p-8 text-center text-zinc-500 font-medium">
                Product not found.
            </div>
        );
    }

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
                                product.isPublished ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                                <span className={`w-1 h-1 rounded-full ${product.isPublished ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                                {product.isPublished ? 'Published' : 'Draft'}
                            </span>
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2.5 border-l border-zinc-200 dark:border-zinc-800">
                                #{product.id}
                            </span>
                        </div>
                        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">{product.title}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleTogglePublish}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm border ${
                            product.isPublished 
                                ? 'bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100/80' 
                                : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100/80'
                        }`}
                    >
                        <i className={`fas ${product.isPublished ? 'fa-eye-slash' : 'fa-eye'} mr-2 text-[10px]`}></i>
                        {product.isPublished ? 'Draft' : 'Publish'}
                    </button>
                    <Link 
                        href={`/${lang}/dashboard/products/edit/${product.id}`}
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
                    { label: 'Category', value: product.category?.name || 'Uncategorized', icon: 'fa-tag', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Views', value: product.views || 0, icon: 'fa-chart-line', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Display Order', value: product.order || 0, icon: 'fa-sort', color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Language Status', value: product.heroTitleAr ? 'Bilingual' : 'English Only', icon: 'fa-globe', color: 'text-amber-600', bg: 'bg-amber-50' }
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
                        {[
                            { id: 'hero', label: 'Hero', icon: 'fa-clapperboard' },
                            { id: 'overview', label: 'About', icon: 'fa-align-left' },
                            { id: 'features', label: 'Features', icon: 'fa-list-check' },
                            { id: 'howItWorks', label: 'Flow', icon: 'fa-wand-magic-sparkles' },
                            { id: 'vision', label: 'Vision', icon: 'fa-bolt' },
                            { id: 'gallery', label: 'Media', icon: 'fa-images' },
                            { id: 'faq', label: 'FAQ', icon: 'fa-circle-question' }
                        ].map((tab) => (
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
                                                {(product.heroSubtitle || product.heroSubtitleAr) && (
                                                    <div className="flex gap-2">
                                                        {product.heroSubtitle && <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest border border-blue-100">{product.heroSubtitle}</span>}
                                                        {product.heroSubtitleAr && <span className="px-3 py-1.5 rounded-full bg-zinc-50 text-zinc-600 text-[9px] font-black uppercase tracking-widest border border-zinc-100" dir="rtl">{product.heroSubtitleAr}</span>}
                                                    </div>
                                                )}
                                                <div className="space-y-1">
                                                    <h2 className="text-3xl font-black text-zinc-900 dark:text-white leading-tight">{product.heroTitle || product.title}</h2>
                                                    {product.heroTitleAr && <h2 className="text-2xl font-black text-zinc-500 leading-tight" dir="rtl">{product.heroTitleAr}</h2>}
                                                </div>
                                                <div className="space-y-3 max-w-lg">
                                                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">{product.heroDescription || product.shortDescription}</p>
                                                    {product.heroDescriptionAr && <p className="text-xs text-zinc-400 font-medium leading-relaxed text-right" dir="rtl">{product.heroDescriptionAr}</p>}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <div className="px-6 py-3 rounded-xl bg-blue-600 text-white font-black text-[11px] uppercase tracking-wider shadow-lg shadow-blue-500/20">{product.heroPrimaryCtaText || 'Learn More'}</div>
                                                <div className="px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-black text-[11px] uppercase tracking-wider">{product.heroSecondaryCtaText || 'Contact Us'}</div>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-64 shrink-0">
                                            <div className="aspect-[4/5] rounded-[32px] bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                                {product.heroIcon && (product.heroIcon.includes('.') || product.heroIcon.includes('/')) ? (
                                                    <img src={getImageUrl(product.heroIcon)} alt={product.heroImageAlt || ''} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-7xl text-zinc-200 dark:text-zinc-800">
                                                        <i className={product.heroIcon || 'fas fa-rocket'}></i>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-3 text-[10px] text-center text-zinc-400 font-bold uppercase tracking-widest line-clamp-1">
                                                {product.heroImageAlt || 'Hero Image'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'overview' && (
                                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* About Section */}
                                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs"><i className="fas fa-file-lines"></i></span>
                                            <h4 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">{product.aboutTitle || 'About Product'}</h4>
                                        </div>
                                        <div className="space-y-6">
                                            <p className="text-sm font-medium leading-relaxed text-zinc-500 whitespace-pre-wrap">{product.aboutContent || 'No description provided.'}</p>
                                            {product.aboutContentAr && <p className="text-sm font-medium leading-relaxed text-zinc-400 whitespace-pre-wrap text-right" dir="rtl">{product.aboutContentAr}</p>}
                                        </div>
                                    </div>
                                    {product.aboutImage && (
                                        <div className="relative group">
                                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative aspect-video rounded-[40px] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl">
                                                <img src={getImageUrl(product.aboutImage)} alt={product.aboutImageAlt || ''} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="mt-4 text-[11px] font-black uppercase text-zinc-400 tracking-widest text-center">
                                                {product.aboutImageAlt} | {product.aboutImageAltAr}
                                            </div>
                                        </div>
                                    )}
                                </section>

                                {/* Benefits Cards */}
                                <section className="space-y-8">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs"><i className="fas fa-gem"></i></span>
                                        <h4 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Main Benefits</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {(product.benefits || []).map((benefit, i) => (
                                            <div key={i} className="p-8 rounded-[36px] bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-700/50 space-y-6 group hover:translate-y-[-4px] transition-all duration-300 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none">
                                                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center text-blue-600 text-2xl border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform">
                                                    <i className={benefit.icon}></i>
                                                </div>
                                                <div className="space-y-3">
                                                    <h5 className="font-black text-zinc-900 dark:text-white uppercase tracking-tight text-sm">{benefit.title}</h5>
                                                    <p className="text-xs text-zinc-500 font-medium leading-relaxed">{benefit.description}</p>
                                                    {benefit.titleAr && <h5 className="font-black text-zinc-400 text-xs text-right mt-2" dir="rtl">{benefit.titleAr}</h5>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'features' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <section className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                                    <div className="lg:col-span-3 space-y-8">
                                        <div className="space-y-4">
                                            <h4 className="text-4xl font-black text-zinc-900 dark:text-white leading-tight tracking-tight">{product.keyFeaturesTitle || 'Key Features'}</h4>
                                            {product.keyFeaturesTitleAr && <h4 className="text-3xl font-black text-zinc-500 leading-tight tracking-tight text-right" dir="rtl">{product.keyFeaturesTitleAr}</h4>}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {(product.keyFeaturesList || []).map((feature, i) => (
                                                <div key={i} className="flex items-center gap-4 p-5 rounded-[24px] bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-800/20 text-emerald-700 dark:text-emerald-400 group">
                                                    <div className="w-10 h-10 shrink-0 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">
                                                        <i className={feature.icon}></i>
                                                    </div>
                                                    <span className="text-sm font-black uppercase tracking-tight">{feature.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="grid grid-cols-1 gap-4">
                                            {(product.keyFeaturesImages || []).map((img, i) => (
                                                <div key={i} className="aspect-video rounded-[32px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xl hover:scale-[1.02] transition-transform duration-500">
                                                    <img src={getImageUrl(img)} alt={product.keyFeaturesImageAlt || ''} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-[11px] font-black uppercase text-zinc-400 tracking-widest text-center px-4">
                                            {product.keyFeaturesImageAlt} | {product.keyFeaturesImageAltAr}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'howItWorks' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="max-w-xl mx-auto text-center space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-blue-600">The Process</h4>
                                    <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">How It Works</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {(product.howItWorks || []).map((item, i) => (
                                        <div key={i} className="relative group">
                                            {i < (product.howItWorks?.length || 0) - 1 && (
                                                <div className="hidden lg:block absolute top-[44px] left-[calc(100%-20px)] w-full h-[1px] border-t border-dashed border-zinc-200 dark:border-zinc-800 z-0"></div>
                                            )}
                                            <div className="space-y-6 text-center relative z-10">
                                                <div className="w-20 h-20 mx-auto rounded-[28px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl flex items-center justify-center text-blue-600 text-3xl group-hover:shadow-blue-500/10 group-hover:scale-110 transition-all">
                                                    <i className={item.icon}></i>
                                                </div>
                                                <div className="space-y-2">
                                                    <h5 className="font-black text-sm uppercase tracking-tight">{item.title}</h5>
                                                    <p className="text-xs text-zinc-500 leading-relaxed max-w-[180px] mx-auto">{item.description}</p>
                                                    {item.titleAr && <h5 className="font-black text-xs text-zinc-400 mt-2" dir="rtl">{item.titleAr}</h5>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'vision' && (
                            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <section className="p-12 rounded-[56px] bg-zinc-900 dark:bg-black text-white space-y-12 overflow-hidden relative border border-white/10 shadow-2xl">
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -mr-64 -mt-64"></div>
                                    <div className="relative z-10 space-y-8">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500">{product.visionSubtitle || 'Our Vision'}</h4>
                                                <h2 className="text-4xl font-black leading-tight tracking-tight">{product.visionTitle || 'The Future of Business'}</h2>
                                            </div>
                                            <div className="space-y-4 text-right" dir="rtl">
                                                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-blue-400">{product.visionSubtitleAr}</h4>
                                                <h2 className="text-3xl font-black leading-tight tracking-tight text-white/90">{product.visionTitleAr}</h2>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                            {(product.visionItems || []).map((item, i) => (
                                                <div key={i} className="p-8 rounded-[40px] bg-white/5 border border-white/5 backdrop-blur-md space-y-6 group hover:bg-white/10 transition-all">
                                                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"><i className={item.icon}></i></div>
                                                    <div className="space-y-4">
                                                        <p className="font-bold text-sm text-zinc-100 leading-relaxed">{item.text}</p>
                                                        {item.textAr && <p className="font-bold text-xs text-zinc-400 leading-relaxed text-right" dir="rtl">{item.textAr}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                    {product.whySharpImage && (
                                        <div className="aspect-square rounded-[56px] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl">
                                            <img src={getImageUrl(product.whySharpImage)} alt={product.whySharpImageAlt || ''} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 flex items-center gap-3">
                                                <span className="w-8 h-[1px] bg-zinc-300"></span>
                                                Why Choose Sharp
                                            </h4>
                                            <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight">{product.whySharpTitle || 'Excellence in Innovation'}</h2>
                                            {product.whySharpTitleAr && <h2 className="text-3xl font-black text-zinc-500 tracking-tight text-right" dir="rtl">{product.whySharpTitleAr}</h2>}
                                        </div>
                                        <div className="space-y-6">
                                            <p className="text-sm font-medium leading-relaxed text-zinc-500 whitespace-pre-wrap">{product.whySharpContent}</p>
                                            {product.whySharpContentAr && <p className="text-sm font-medium leading-relaxed text-zinc-400 whitespace-pre-wrap text-right" dir="rtl">{product.whySharpContentAr}</p>}
                                        </div>
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {(product.gallery || []).map((img, i) => (
                                        <div key={i} className="relative group aspect-square rounded-[32px] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg hover:shadow-2xl transition-all duration-500">
                                            <img src={getImageUrl(img)} alt={product.galleryAlt || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                                <i className="fas fa-search-plus text-white text-2xl"></i>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {(product.galleryAlt || product.galleryAltAr) && (
                                    <div className="text-[11px] font-black uppercase text-zinc-400 tracking-widest text-center">
                                        {product.galleryAlt} | {product.galleryAltAr}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'faq' && (
                            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {(product.faqs || []).map((faq, i) => (
                                    <details key={i} className="group bg-zinc-50 dark:bg-zinc-800/30 rounded-[32px] border border-zinc-100 dark:border-zinc-800/50 overflow-hidden">
                                        <summary className="px-8 py-7 flex items-center justify-between cursor-pointer list-none font-black text-zinc-900 dark:text-white uppercase tracking-tight text-sm">
                                            <div className="flex gap-4">
                                                <span className="text-blue-600/50">0{i + 1}</span>
                                                <span>{faq.question}</span>
                                            </div>
                                            <i className="fas fa-plus text-xs text-zinc-400 group-open:rotate-45 group-open:text-red-500 transition-all"></i>
                                        </summary>
                                        <div className="px-12 pb-8">
                                            <div className="p-8 bg-white dark:bg-zinc-900 rounded-[28px] border border-zinc-100 dark:border-zinc-800 shadow-inner">
                                                <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-6">{faq.answer}</p>
                                                {faq.questionAr && (
                                                    <div className="pt-6 border-t border-zinc-50 dark:border-zinc-800 text-right" dir="rtl">
                                                        <p className="font-black text-sm text-zinc-800 dark:text-zinc-200 mb-4">{faq.questionAr}</p>
                                                        <p className="text-sm text-zinc-400 font-medium leading-relaxed">{faq.answerAr}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

                {/* Right: Metadata Sidebar */}
                <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-zinc-50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Records</h3>
                        </div>
                        <div className="p-4 space-y-3">
                            {[
                                { label: 'Slug Path', value: `/${product.slug}`, font: 'font-mono' },
                                { label: 'Category EN', value: product.category?.name || 'Standard' },
                                { label: 'Category AR', value: product.category?.nameAr || '-', dir: 'rtl' },
                                { label: 'Created On', value: product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A' },
                                { label: 'Last Update', value: product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-700/50 transition-colors">
                                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">{item.label}</span>
                                    <span className={`text-[11px] font-bold text-zinc-800 dark:text-zinc-200 truncate ${item.font || ''}`} dir={item.dir || 'ltr'}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-zinc-50 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">SEO Audit</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {[
                                { label: 'Meta Title', value: product.metaTitle, ar: product.metaTitleAr },
                                { label: 'Keywords', value: product.metaKeywords, ar: product.metaKeywordsAr },
                                { label: 'Meta Description', value: product.metaDescription, ar: product.metaDescriptionAr }
                            ].map((seo, i) => (
                                <div key={i} className="space-y-1.5 px-1">
                                    <p className="text-[9px] font-black text-blue-600/60 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                                        {seo.label}
                                    </p>
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 leading-normal line-clamp-3">{seo.value || 'None'}</p>
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
