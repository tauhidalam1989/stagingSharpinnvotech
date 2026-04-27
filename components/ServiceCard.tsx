'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/lib/get-dictionary';
import { ServicePage } from '@/lib/api';

interface ServiceCardProps {
    service: ServicePage;
    lang: Locale;
    dict: any;
    categoryName?: string;
    categoryId?: string;
}

export default function ServiceCard({ service, lang, dict, categoryName, categoryId }: ServiceCardProps) {
    const isAr = lang === 'ar';
    const title = isAr && service.heroTitleAr ? service.heroTitleAr : service.heroTitle;
    const description = isAr && service.heroTaglineAr ? service.heroTaglineAr : service.heroTagline;

    // Category-based Theme Mapping
    const getTheme = (id: string | undefined, catName: string | undefined) => {
        const n = (catName || '').toLowerCase();

        // Security/Cyber -> Blue
        if (n.includes('cyber') || n.includes('security') || n.includes('أمن')) {
            return {
                border: 'hover:border-blue-500',
                iconBg: 'bg-blue-50 group-hover:bg-blue-600',
                iconColor: 'text-blue-600 group-hover:text-white',
                text: 'group-hover:text-blue-600',
                accent: 'group-hover:bg-blue-500/10',
                shadow: 'hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.3)]',
                btn: 'text-blue-600'
            };
        }

        // Network/Infrastructure -> Cyan
        if (n.includes('network') || n.includes('infra') || n.includes('شبكة')) {
            return {
                border: 'hover:border-cyan-500',
                iconBg: 'bg-cyan-50 group-hover:bg-cyan-600',
                iconColor: 'text-cyan-600 group-hover:text-white',
                text: 'group-hover:text-cyan-600',
                accent: 'group-hover:bg-cyan-500/10',
                shadow: 'hover:shadow-[0_20px_50px_-20px_rgba(6,182,212,0.3)]',
                btn: 'text-cyan-600'
            };
        }

        // Enterprise/Consultancy -> Amber
        if (n.includes('enterprise') || n.includes('oracle') || n.includes('أوراكل') || n.includes('استشار')) {
            return {
                border: 'hover:border-amber-500',
                iconBg: 'bg-amber-50 group-hover:bg-amber-600',
                iconColor: 'text-amber-600 group-hover:text-white',
                text: 'group-hover:text-amber-600',
                accent: 'group-hover:bg-amber-500/10',
                shadow: 'hover:shadow-[0_20px_50px_-20px_rgba(245,158,11,0.3)]',
                btn: 'text-amber-600'
            };
        }

        // Software/Dev -> Indigo
        if (n.includes('software') || n.includes('app') || n.includes('برمج')) {
            return {
                border: 'hover:border-indigo-500',
                iconBg: 'bg-indigo-50 group-hover:bg-indigo-600',
                iconColor: 'text-indigo-600 group-hover:text-white',
                text: 'group-hover:text-indigo-600',
                accent: 'group-hover:bg-indigo-500/10',
                shadow: 'hover:shadow-[0_20px_50px_-20px_rgba(99,102,241,0.3)]',
                btn: 'text-indigo-600'
            };
        }

        // Default -> Use Deterministic Fallback if ID available, else Blue
        if (id) {
            const palette = [
                { border: 'hover:border-rose-500', iconBg: 'bg-rose-50 group-hover:bg-rose-600', iconColor: 'text-rose-600 group-hover:text-white', text: 'group-hover:text-rose-600', accent: 'group-hover:bg-rose-500/10', shadow: 'hover:shadow-[0_20px_50px_-20px_rgba(244,63,94,0.3)]', btn: 'text-rose-600' },
                { border: 'hover:border-violet-500', iconBg: 'bg-violet-50 group-hover:bg-violet-600', iconColor: 'text-violet-600 group-hover:text-white', text: 'group-hover:text-violet-600', accent: 'group-hover:bg-violet-500/10', shadow: 'hover:shadow-[0_20px_50px_-20px_rgba(139,92,246,0.3)]', btn: 'text-violet-600' },
                { border: 'hover:border-fuchsia-500', iconBg: 'bg-fuchsia-50 group-hover:bg-fuchsia-600', iconColor: 'text-fuchsia-600 group-hover:text-white', text: 'group-hover:text-fuchsia-600', accent: 'group-hover:bg-fuchsia-500/10', shadow: 'hover:shadow-[0_20px_50px_-20px_rgba(217,70,239,0.3)]', btn: 'text-fuchsia-600' },
                { border: 'hover:border-emerald-500', iconBg: 'bg-emerald-50 group-hover:bg-emerald-600', iconColor: 'text-emerald-600 group-hover:text-white', text: 'group-hover:text-emerald-600', accent: 'group-hover:bg-emerald-500/10', shadow: 'hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.3)]', btn: 'text-emerald-600' },
                { border: 'hover:border-orange-500', iconBg: 'bg-orange-50 group-hover:bg-orange-600', iconColor: 'text-orange-600 group-hover:text-white', text: 'group-hover:text-orange-600', accent: 'group-hover:bg-orange-500/10', shadow: 'hover:shadow-[0_20px_50px_-20px_rgba(249,115,22,0.3)]', btn: 'text-orange-600' },
            ];
            const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return palette[hash % palette.length];
        }

        return {
            border: 'hover:border-[#0d6efd]',
            iconBg: 'bg-blue-50 group-hover:bg-[#0d6efd]',
            iconColor: 'text-[#0d6efd] group-hover:text-white',
            text: 'group-hover:text-[#0d6efd]',
            accent: 'group-hover:bg-[#0d6efd]/10',
            shadow: 'hover:shadow-[0_20px_50px_-20px_rgba(13,110,253,0.3)]',
            btn: 'text-[#0d6efd]'
        };
    };

    const theme = getTheme(categoryId, categoryName);

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

    const heroIconUrl = getFullImageUrl(service.heroIcon || '');

    return (
        <Link
            href={`/${lang}/services/${service.slug}`}
            className={`group relative flex flex-col bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-100 dark:border-zinc-800 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] ${theme.border} ${theme.shadow} overflow-hidden`}
        >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-zinc-50 dark:bg-zinc-800 rounded-bl-[100px] -mr-8 -mt-8 transition-all duration-500 ${theme.accent} group-hover:scale-150`}></div>

            <div className="relative z-10">
                <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl ${theme.iconBg} ${theme.iconColor} transition-all duration-500 shadow-sm border border-zinc-50 dark:border-zinc-700 overflow-hidden`}>
                    {displayIconClass ? (
                        <i className={`${displayIconClass} text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}></i>
                    ) : heroIconUrl ? (
                        <div className="relative w-9 h-9">
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

                <h3 className={`font-syne text-2xl font-bold mb-4 text-zinc-900 dark:text-white ${theme.text} transition-colors leading-tight`}>
                    {title}
                </h3>

                <p className="font-dm-sans text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-8 font-light line-clamp-3">
                    {description || (lang === 'ar' ? 'اكتشف المزيد عن خدماتنا المتميزة وكيف يمكننا مساعدتك.' : 'Explore more about our premium services and how we can help you.')}
                </p>

                <div className={`mt-auto flex items-center text-xs font-bold uppercase tracking-widest ${theme.btn}`}>
                    <span className="transition-all duration-300">{dict.SERVICE.READ_MORE}</span>
                    <span className={`transition-all duration-300 transform ${isAr ? 'mr-2 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'}`}>
                        {isAr ? '←' : '→'}
                    </span>
                </div>
            </div>
        </Link>
    );
}
