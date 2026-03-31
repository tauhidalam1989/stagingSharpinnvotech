'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProductCategories, getPublishedProducts, ProductCategory, Product } from '@/lib/api';
import { Loader2, Package, ChevronRight, LayoutGrid } from 'lucide-react';

export default function ProductsMegaMenu({ lang, onClose }: { lang: string; onClose?: () => void }) {
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isRtl = lang === 'ar';

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [catsRes, prdsRes] = await Promise.all([
                    getProductCategories(),
                    getPublishedProducts()
                ]);
                const sortedCats = (Array.isArray(catsRes) ? catsRes : [])
                    .filter((c: ProductCategory) => c.isActive)
                    .sort((a: ProductCategory, b: ProductCategory) => a.order - b.order);
                setCategories(sortedCats);
                setProducts(Array.isArray(prdsRes) ? prdsRes : []);
                if (sortedCats.length > 0) setActiveCategoryId(sortedCats[0].id);
            } catch (error) {
                console.error('Failed to load mega menu data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const activeProducts = products.filter(p => p.categoryId === activeCategoryId);

    const renderProductIcon = (product: Product) => {
        const isIconClass = (str?: string) => {
            if (!str) return false;
            const s = str.trim();
            return s.startsWith('fa-') || s.startsWith('fas') || s.startsWith('fab') || s.startsWith('far') || s.includes(' fa-');
        };
        const iconClass = product.cardIcon && isIconClass(product.cardIcon)
            ? product.cardIcon
            : (product.heroIcon && isIconClass(product.heroIcon) ? product.heroIcon : null);

        if (iconClass) return <i className={`${iconClass} text-[16px]`}></i>;

        const rawPath = product.cardIcon || product.heroIcon || '';
        if (rawPath && !isIconClass(rawPath)) {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') || '';
            const iconUrl = rawPath.startsWith('http') ? rawPath : `${baseUrl}/${rawPath.startsWith('/') ? rawPath.slice(1) : rawPath}`;
            return (
                <div className="relative w-5 h-5">
                    <Image src={iconUrl} alt="" fill className="object-contain" />
                </div>
            );
        }
        return <Package className="w-5 h-5" />;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20 bg-[#0d6efd]">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

    if (categories.length === 0) return null;

    return (
        <div className="w-full bg-[#034077] text-white border-t border-white/20 shadow-2xl overflow-hidden py-8 min-h-[420px]">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* LEFT SECTION — CATEGORIES */}
                    <div className="w-full lg:w-[450px] shrink-0">
                        <div className="flex items-center gap-2 mb-6 px-2 opacity-80">
                            <LayoutGrid className="w-4 h-4" />
                            <h3 className="text-[12px] font-black tracking-[0.2em] uppercase !text-white">
                                {lang === 'ar' ? 'فئات' : 'Categories'}
                            </h3>
                        </div>

                        <div className="flex flex-col gap-1 max-h-[330px] overflow-y-auto custom-scrollbar pr-2 pt-1">
                            {categories.map((cat) => {
                                const isActive = activeCategoryId === cat.id;
                                const name = isRtl ? cat.nameAr || cat.name : cat.name;
                                return (
                                    <button
                                        key={cat.id}
                                        onMouseEnter={() => setActiveCategoryId(cat.id)}
                                        className={`w-full flex items-center gap-3 px-1 py-2 transition-all duration-200 text-start group relative ${isActive
                                            ? 'text-white'
                                            : 'text-white/70 hover:text-white'
                                            }`}
                                    >
                                        <div className={`w-7 h-7 flex items-center justify-center shrink-0 transition-colors ${isActive ? 'text-white font-bold scale-110' : 'text-white/40 group-hover:text-white/80'
                                            }`}>
                                            {cat.icon ? <i className={`${cat.icon} text-sm`}></i> : <Package className="w-4 h-4" />}
                                        </div>
                                        <div className="relative flex-1 min-w-0">
                                            <span className="text-[14px] font-bold whitespace-nowrap overflow-hidden block">
                                                {name}
                                            </span>
                                            {/* Underline effect */}
                                            <div className={`absolute -bottom-1 left-0 h-[2px] bg-[#0d6efd] transition-all duration-300 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-100'}`} />
                                        </div>
                                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform ${isRtl ? 'rotate-180' : ''} ${isActive ? 'opacity-100 translate-x-1' : 'opacity-0'} ml-auto`} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* DIVIDER */}
                    <div className="hidden lg:block w-px bg-white/10" />

                    {/* RIGHT SECTION — PRODUCTS */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <div className="flex items-center gap-2 opacity-80">
                                <LayoutGrid className="w-4 h-4" />
                                <h3 className="text-[12px] font-black tracking-[0.2em] uppercase">
                                    {lang === 'ar' ? 'المنتجات' : 'Products'}
                                </h3>
                            </div>
                            <Link
                                href={`/${lang}/products`}
                                onClick={onClose}
                                className="text-[13px] font-bold hover:underline transition-all opacity-80 hover:opacity-100"
                            >
                                {lang === 'ar' ? 'عرض كل المنتجات' : 'View All Products'}
                            </Link>
                        </div>

                        {activeProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-white/40">
                                <Package className="w-12 h-12 mb-4 opacity-20 !text-white" />
                                <p className="text-[14px] !text-white">{lang === 'ar' ? 'لا توجد منتجات' : 'No products in this category'}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-2 pt-1">
                                {activeProducts.map((product, i) => {
                                    const title = isRtl ? product.titleAr || product.title : product.title;
                                    return (
                                        <Link
                                            key={product.id}
                                            href={`/${lang}/products/${product.slug}`}
                                            onClick={onClose}
                                            className="group bg-white/10 hover:bg-white/20 border border-white/5 hover:border-white/20 p-2.5 rounded-2xl transition-all duration-300 flex items-center gap-3"
                                        >
                                            <div className="w-9.5 h-9.5 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white transition-all group-hover:scale-105">
                                                {renderProductIcon(product)}
                                            </div>
                                            <span className="text-[13.5px] font-bold leading-tight group-hover:translate-x-1 transition-transform">
                                                {title}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
