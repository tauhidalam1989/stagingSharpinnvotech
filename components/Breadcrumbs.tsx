import Link from 'next/link';
import { Locale } from '@/lib/get-dictionary';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    lang: Locale;
    dict: any;
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ lang, dict, items }: BreadcrumbsProps) {
    const isRtl = lang === 'ar';

    return (
        <section className="bg-zinc-50/50 py-3 border-b border-zinc-100 dark:border-zinc-800 mt-20 sm:mt-24">
            <div className="container mx-auto px-4 md:px-6">
                    <nav className="flex items-center gap-2 text-[14px] sm:text-[15px] font-medium overflow-x-auto no-scrollbar whitespace-nowrap py-1" aria-label="Breadcrumb">
                    <div className="flex items-center gap-2 shrink-0">
                        <i className={`fa fa-home text-zinc-900 leading-none ${isRtl ? 'ml-1' : 'mr-1'}`}></i>
                        <Link
                            href={`/${lang}`}
                            className="text-[#0d6efd] hover:underline transition-colors"
                        >
                            {dict.HOME || (isRtl ? 'الرئيسية' : 'Home')}
                        </Link>
                    </div>
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 shrink-0">
                            <span className="text-zinc-400 mx-1">|</span>
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="text-[#0d6efd] hover:underline transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-zinc-600 truncate max-w-[150px] sm:max-w-none">
                                    {item.label}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </section>
    );
}
