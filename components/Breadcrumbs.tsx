import Link from 'next/link';
import { Locale } from '@/lib/get-dictionary';
import { Home, ChevronRight, ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    lang: Locale;
    dict: any;
    items: BreadcrumbItem[];
    isLight?: boolean;
    listingPage?: boolean;
}

export default function Breadcrumbs({ lang, dict, items, isLight = false, listingPage = false }: BreadcrumbsProps) {
    const isRtl = lang === 'ar';
    const Chevron = isRtl ? ChevronLeft : ChevronRight;

    // Use tighter padding for listing pages to match their hero layout (px-6)
    // Use wider padding for detail pages to match their specialized containers
    const paddingClasses = listingPage 
        ? "px-6" 
        : "px-6 md:px-10 lg:px-12 xl:px-16";

    return (
        <div className="absolute top-[84px] left-0 right-0 z-20 w-full" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className={`container mx-auto ${paddingClasses}`}>
                <nav 
                    className={`flex items-center gap-2 text-[12px] md:text-[13px] font-bold animate-fade-in`} 
                    aria-label="Breadcrumb"
                >
                    <div className="flex items-center gap-1.5 shrink-0">
                        <Home className="w-3.5 h-3.5 text-cyan-300" />
                        <Link
                            href={`/${lang}`}
                            className="text-cyan-300 hover:text-white transition-colors"
                        >
                            {dict.COMMON?.HOME || dict.HOME || (isRtl ? 'الرئيسية' : 'Home')}
                        </Link>
                    </div>
                    
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-1.5 shrink-0">
                            <Chevron className={`w-3 h-3 ${isLight ? 'text-zinc-400' : 'text-white/40'}`} />
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="text-cyan-300 hover:text-white transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={`${isLight ? 'text-zinc-600' : 'text-white'} truncate max-w-[120px] sm:max-w-none`}>
                                    {item.label}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}
