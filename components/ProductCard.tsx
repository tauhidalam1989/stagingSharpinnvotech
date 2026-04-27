'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/lib/get-dictionary';
import { Product } from '@/lib/api';

interface ProductCardProps {
    product: Product;
    lang: Locale;
    dict: any;
}

export default function ProductCard({ product, lang, dict }: ProductCardProps) {
    const title = lang === 'ar' && product.titleAr ? product.titleAr : product.title;
    const description = lang === 'ar' && product.shortDescriptionAr ? product.shortDescriptionAr : product.shortDescription;

    const isIconClass = (str: string | undefined) => {
        if (!str) return false;
        const s = str.trim();
        return s.startsWith('fa-') ||
            s.startsWith('fas') ||
            s.startsWith('fab') ||
            s.startsWith('far') ||
            s.includes(' fa-') ||
            s.includes('fab ') ||
            s.includes('fas ') ||
            s.includes('far ');
    };

    // Determine what to show as the icon - prioritize cardIcon
    const displayIconClass = product.cardIcon && isIconClass(product.cardIcon)
        ? product.cardIcon
        : null;

    const getFullImageUrl = (path: string) => {
        if (!path || isIconClass(path)) return null;

        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') || '';
        const isBaseLocal = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');

        if (path.startsWith('http')) {
            const isPathLocal = path.includes('127.0.0.1:8092');
            if (!isBaseLocal && isPathLocal) {
                const uploadsIndex = path.indexOf('/uploads/');
                if (uploadsIndex !== -1) {
                    return `${baseUrl}${path.substring(uploadsIndex)}`;
                }
            }
            return path;
        }
        return `${baseUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
    };

    const cardIconUrl = getFullImageUrl(product.cardIcon || '');

    return (
        <Link
            href={`/${lang}/products/${product.slug}`}
            className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-[32px] p-7 border border-zinc-100 dark:border-zinc-800 transition-all hover:border-blue-500 hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.15)] hover:-translate-y-2 overflow-hidden"
        >
            <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[18px] bg-blue-50 dark:bg-blue-500/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm overflow-hidden">
                    {displayIconClass ? (
                        <i className={`${displayIconClass} text-2xl transition-transform duration-500 group-hover:scale-110`}></i>
                    ) : cardIconUrl ? (
                        <div className="relative w-8 h-8">
                            <Image
                                src={cardIconUrl}
                                alt={title}
                                fill
                                className="object-contain transition-all duration-500 group-hover:brightness-0 group-hover:invert"
                            />
                        </div>
                    ) : (
                        <i className="fas fa-cube text-2xl transition-transform duration-500 group-hover:scale-110"></i>
                    )}
                </div>

                <h3 className="text-xl font-black mb-3 text-[#1a6bf5] group-hover:text-blue-600 transition-colors leading-tight">
                    {title}
                </h3>

                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 font-medium line-clamp-3">
                    {description || (lang === 'ar' ? 'اكتشف المزيد عن منتجاتنا المتميزة وكيف يمكننا مساعدتك.' : 'Explore more about our premium products and how we can help you.')}
                </p>

                <div className="mt-auto flex items-center text-xs font-black uppercase tracking-widest text-blue-600">
                    <span className="group-hover:mr-2 transition-all duration-300">{dict?.COMMON?.READ_MORE || (lang === 'ar' ? 'اقرأ المزيد' : 'Read More')}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">→</span>
                </div>
            </div>
        </Link>
    );
}
