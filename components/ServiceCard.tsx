'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/lib/get-dictionary';
import { ServicePage } from '@/lib/api';

interface ServiceCardProps {
    service: ServicePage;
    lang: Locale;
    dict: any;
}

export default function ServiceCard({ service, lang, dict }: ServiceCardProps) {
    const title = lang === 'ar' && service.heroTitleAr ? service.heroTitleAr : service.heroTitle;
    const description = lang === 'ar' && service.heroTaglineAr ? service.heroTaglineAr : service.heroTagline;
    
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
    const displayIconClass = service.cardIcon && isIconClass(service.cardIcon) 
        ? service.cardIcon 
        : (service.heroIcon && isIconClass(service.heroIcon) ? service.heroIcon : null);

    const getFullImageUrl = (path: string) => {
        if (!path || isIconClass(path)) return null;
        
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') || '';
        const isBaseLocal = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
        
        if (path.startsWith('http')) {
            const isPathLocal = path.includes('127.0.0.1:8093');
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

    const heroIconUrl = getFullImageUrl(service.heroIcon || '');

    return (
        <Link
            href={`/${lang}/services/${service.slug}`}
            className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-[32px] p-7 border border-zinc-100 dark:border-zinc-800 transition-all hover:border-blue-500 hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.15)] hover:-translate-y-2 overflow-hidden"
        >

            <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[18px] bg-blue-50 dark:bg-blue-500/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm overflow-hidden">
                    {displayIconClass ? (
                        <i className={`${displayIconClass} text-2xl transition-transform duration-500 group-hover:scale-110`}></i>
                    ) : heroIconUrl ? (
                        <div className="relative w-8 h-8">
                            <Image 
                                src={heroIconUrl} 
                                alt={title} 
                                fill 
                                className="object-contain transition-all duration-500 group-hover:brightness-0 group-hover:invert"
                            />
                        </div>
                    ) : (
                        <i className="fas fa-cog text-2xl animate-spin-slow"></i>
                    )}
                </div>
                
                <h3 className="text-xl font-black mb-3 text-[#1a6bf5] group-hover:text-blue-600 transition-colors leading-tight">
                    {title}
                </h3>
                
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 font-medium line-clamp-3">
                    {description || (lang === 'ar' ? 'اكتشف المزيد عن خدماتنا المتميزة وكيف يمكننا مساعدتك.' : 'Explore more about our premium services and how we can help you.')}
                </p>
                
                <div className="mt-auto flex items-center text-xs font-black uppercase tracking-widest text-blue-600">
                    <span className="group-hover:mr-2 transition-all duration-300">{dict.SERVICE.READ_MORE}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">→</span>
                </div>
            </div>
        </Link>
    );
}
