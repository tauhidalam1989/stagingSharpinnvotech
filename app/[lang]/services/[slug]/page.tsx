import { getDictionary, Locale } from "@/lib/get-dictionary";
import { getServiceBySlug, ServicePage } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFaqAccordion from "@/components/ServiceFaqAccordion";
import { MessageSquare, ArrowUpRight, Briefcase } from "lucide-react";

export async function generateMetadata({
    params
}: {
    params: Promise<{ lang: string; slug: string }>
}) {
    const { lang, slug } = await params;
    const service = await getServiceBySlug(slug);

    if (!service) return {};

    const title = lang === 'ar' ? (service.metaTitleAr || service.heroTitleAr) : (service.metaTitle || service.heroTitle);
    const description = lang === 'ar' ? (service.metaDescriptionAr || service.heroIntroductionAr) : (service.metaDescription || service.heroIntroduction);

    return {
        title: title,
        description: description,
        keywords: lang === 'ar' ? service.metaKeywordsAr : service.metaKeywords,
    };
}

const getImageUrl = (path: string | undefined | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') || '';
    return `${baseUrl}/${path.replace(/\\/g, '/').replace(/^\//, '')}`;
};

const renderIcon = (item: { iconType?: string; iconFA?: string; iconPath?: string; icon?: string }, fallback: string, className = "text-sm") => {
    // 1. Check if it's explicitly a FontAwesome icon
    if (item.iconType === 'fa' || item.iconFA || (!item.iconPath && item.icon)) {
        const iconClass = item.iconFA || item.icon || fallback;
        // Ensure it has fas or fab or far prefix
        const finalClass = (iconClass.startsWith('fa') || iconClass.includes('fa-')) ? iconClass : `fas fa-${iconClass}`;
        return <i className={`${finalClass} ${className}`}></i>;
    }

    // 2. Check if it's a file path icon
    if (item.iconType === 'file' || item.iconPath) {
        const url = getImageUrl(item.iconPath);
        if (url) {
            return <Image src={url} alt="" width={16} height={16} className="object-contain" />;
        }
    }

    // 3. Fallback
    return <i className={`${fallback} ${className}`}></i>;
};

const HighlightedTitle = ({ title, className }: { title: string; className?: string }) => {
    if (!title) return null;
    const words = title.trim().split(/\s+/);
    if (words.length <= 2) return <h1 className={className}>{title}</h1>;

    return (
        <h1 className={className}>
            {words.slice(0, words.length - 2).join(' ')}{' '}
            <span className="text-cyan-300">{words.slice(-2).join(' ')}</span>
        </h1>
    );
};

export default async function ServiceDetailPage({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>;
}) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang);
    const service = await getServiceBySlug(slug);

    if (!service) {
        notFound();
    }

    const isAr = lang === 'ar';

    return (
        <div className="flex flex-col w-full min-h-screen bg-white dark:bg-zinc-950 overflow-x-hidden" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="bg-[#f3f4ff] dark:bg-zinc-900/50">


                {/* 1. HERO SECTION */}
                <section className="relative bg-[#0d6efd] pt-32 pb-20 md:pt-30 md:pb-32 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
                    {/* Background patterns */}
                    <div
                        className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{
                            backgroundImage: `radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)`,
                            backgroundSize: '32px 32px'
                        }}
                    ></div>

                    {/* Animated Orbs */}
                    <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[80px] pointer-events-none"></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-4xl">
                            {/* Hero Pill */}
                            <div className="inline-flex items-center gap-2 border border-white/30 bg-white/10 text-blue-50 text-[11px] font-bold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase">
                                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                                {isAr ? 'تفاصيل الخدمة' : 'Service Detail'}
                            </div>

                            {/* Icon + Title */}
                            <div className="flex items-start gap-4 md:gap-6 mb-8">
                                <div className="shrink-0 p-3 md:p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm shadow-xl text-white flex items-center justify-center">
                                    {(service.heroIcon || service.cardIcon) ? (
                                        <i className={`${service.heroIcon || service.cardIcon} text-2xl md:text-4xl`}></i>
                                    ) : (
                                        <i className="fas fa-certificate text-2xl md:text-4xl"></i>
                                    )}
                                </div>
                                <HighlightedTitle
                                    title={isAr ? (service.heroTitleAr || service.heroTitle) : service.heroTitle}
                                    className="font-syne text-2xl md:text-4xl lg:text-4xl font-extrabold text-white leading-[1.1]"
                                />
                            </div>

                            {/* Description */}
                            <p className="font-dm-sans text-lg md:text-sm text-white/70 font-light leading-relaxed !text-white mb-12 max-w-2xl">
                                {isAr ? service.heroIntroductionAr : service.heroIntroduction}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4">
                                {(service.primaryCtaText || service.primaryCtaTextAr) && (
                                    <Link
                                        href={`/${lang}/contact`}
                                        className="group inline-flex items-center justify-center gap-3 bg-white text-[#0d6efd] px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:bg-cyan-400 hover:text-white hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/20"
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                        <span>{isAr ? (service.primaryCtaTextAr || service.primaryCtaText) : (service.primaryCtaText || 'Get Started')}</span>
                                        <ArrowUpRight className="w-5 h-5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                                    </Link>
                                )}
                                {(service.secondaryCtaText || service.secondaryCtaTextAr) && (
                                    <Link
                                        href={`/${lang}/contact`}
                                        className="inline-flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 backdrop-blur-sm"
                                    >
                                        <Briefcase className="w-5 h-5" />
                                        <span>{isAr ? (service.secondaryCtaTextAr || service.secondaryCtaText) : (service.secondaryCtaText || 'Learn More')}</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800"></div>

            {/* 2. ABOUT SECTION */}
            {(service.aboutSectionTitle || service.aboutSectionTitleAr) && (
                <section className="pt-4 md:pt-6 pb-10 relative overflow-hidden bg-[#f3f4ff] dark:bg-zinc-900/40">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row items-start gap-12">
                            <div className="flex-1">
                                <h2 className="text-xl md:text-2xl font-bold text-[#1a6bf5] mb-4 tracking-tight">
                                    {isAr ? service.aboutSectionTitleAr : service.aboutSectionTitle}
                                </h2>
                                <div className="text-sm md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal mb-8">
                                    {isAr ? service.aboutSectionDescriptionAr : service.aboutSectionDescription}
                                </div>

                                {service.aboutPillars && service.aboutPillars.length > 0 && (
                                    <div className="grid grid-cols-2 gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-6">
                                        {service.aboutPillars.map((pillar: any, idx: number) => (
                                            <div key={idx} className="flex flex-col items-center text-center gap-3 md:flex-row md:text-left md:items-center md:gap-4 md:rtl:text-right group relative md:pr-4">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-950 flex items-center justify-center text-blue-600 flex-shrink-0 shadow-sm shadow-blue-900/5 transition-transform duration-300 group-hover:scale-110">
                                                    {renderIcon(pillar, 'fas fa-shield-alt', 'text-base')}
                                                </div>
                                                <span className="font-bold text-[13px] md:text-sm text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
                                                    {isAr ? pillar.titleAr : pillar.title}
                                                </span>
                                                {idx % 2 === 0 && (
                                                    <div className="absolute right-0 rtl:left-0 rtl:right-auto top-1/2 -translate-y-1/2 h-8 w-px bg-zinc-200 dark:bg-zinc-800"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {(service.aboutSectionBottomNote || service.aboutSectionBottomNoteAr) && (
                                    <div className="mt-8 font-normal italic text-xs text-zinc-500">
                                        {isAr ? service.aboutSectionBottomNoteAr : service.aboutSectionBottomNote}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 lg:max-w-[35%] relative">
                                <div className="relative overflow-hidden flex items-center justify-center">
                                    {(() => {
                                        const url = getImageUrl(service.aboutSectionImage);
                                        if (!url) return <div className="w-[400px] h-[300px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center rounded-xl"><i className="fas fa-image text-3xl text-zinc-300"></i></div>;
                                        return (
                                            <Image
                                                src={url}
                                                alt={isAr ? (service.aboutSectionImageAltAr || '') : (service.aboutSectionImageAlt || '')}
                                                width={400}
                                                height={300}
                                                className="w-full h-auto object-contain"
                                            />
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {service.capabilities && service.capabilities.length > 0 && (
                <section className="py-20 bg-zinc-50 dark:bg-zinc-900/30">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16 px-4">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1a6bf5] tracking-tight leading-tight">
                                {isAr ? (service.capabilitiesSectionTitleAr || 'قدراتنا') : (service.capabilitiesSectionTitle || 'Our Capabilities')}
                            </h2>
                        </div>
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                                {service.capabilities.map((item: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-100 dark:border-zinc-800 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-blue-500 hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.3)] overflow-hidden"
                                    >
                                        {/* Background Accent */}
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-50 dark:bg-zinc-800 rounded-bl-[100px] -mr-8 -mt-8 transition-all duration-500 group-hover:bg-blue-500/10 group-hover:scale-150"></div>

                                        <div className="relative z-10">
                                            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white transition-all duration-500 shadow-sm border border-zinc-50 dark:border-zinc-700 overflow-hidden">
                                                {renderIcon(item, 'fas fa-rocket', 'text-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12')}
                                            </div>

                                            <h3 className="font-syne text-2xl font-bold mb-4 text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight">
                                                {isAr ? item.titleAr : item.title}
                                            </h3>

                                            <p className="font-dm-sans text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6 font-light">
                                                {isAr ? item.descriptionAr : item.description}
                                            </p>

                                            {/* <div className="mt-auto flex items-center text-blue-600 text-xs font-bold uppercase tracking-widest">
                                                <span className={`transition-all duration-300 transform ${isAr ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}>
                                                    {isAr ? '←' : '→'}
                                                </span>
                                            </div> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {(service.industriesSectionTitle || service.industriesSectionTitleAr) && (
                <section className="py-12">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <div className={`order-2 lg:order-1 ${isAr ? 'lg:order-2' : ''} flex justify-center`}>
                                <div className="relative rounded-2xl overflow-hidden max-w-[500px] h-[380px] w-full group">
                                    {(() => {
                                        const url = getImageUrl(service.industriesImage);
                                        if (!url) return <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"><i className="fas fa-industry text-4xl text-zinc-300"></i></div>;
                                        return (
                                            <Image
                                                src={url}
                                                alt=""
                                                width={500}
                                                height={400}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        );
                                    })()}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    <div className="absolute bottom-4 left-0 right-0 px-4">
                                        <div className="bg-[#1a6bf5] text-white text-center py-2.5 rounded-xl font-bold text-sm shadow-xl tracking-wide uppercase">
                                            {isAr ? service.industriesSectionTitleAr : service.industriesSectionTitle}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`order-1 lg:order-2 ${isAr ? 'lg:order-1' : ''}`}>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#141d72] dark:text-blue-400 mb-4 tracking-tight leading-tight">
                                    {isAr ? service.industriesSectionTitleAr : service.industriesSectionTitle}
                                </h2>
                                <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed mb-8 text-left">
                                    {isAr ? service.industriesSectionDescriptionAr : service.industriesSectionDescription}
                                </p>

                                {service.industries && service.industries.length > 0 && (
                                    <div className="grid grid-cols-2 gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-6">
                                        {service.industries.map((ind: any, idx: number) => (
                                            <div key={idx} className="flex flex-col items-center text-center gap-3 md:flex-row md:items-center md:gap-4 md:text-left md:rtl:text-right group relative md:pr-4">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1a6bf5] flex-shrink-0 group-hover:bg-[#1a6bf5] group-hover:text-white transition-all duration-300 shadow-sm border border-blue-100/50 dark:border-blue-900/30">
                                                    {renderIcon(ind, 'fas fa-industry', 'text-sm')}
                                                </div>
                                                <div className="flex-1 flex justify-between items-center group-hover:translate-x-1 transition-transform duration-300">
                                                    <span className="font-bold text-sm text-[#334155] dark:text-zinc-200 tracking-tight">
                                                        {isAr ? ind.titleAr : ind.title}
                                                    </span>
                                                </div>
                                                {idx % 2 === 0 && (
                                                    <div className="absolute right-0 rtl:left-0 rtl:right-auto top-1/2 -translate-y-1/2 h-8 w-px bg-zinc-200 dark:bg-zinc-800"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="mt-10 text-zinc-400 dark:text-zinc-500 italic text-sm font-medium border-t border-zinc-100 dark:border-zinc-800 pt-6">
                                    {isAr ? "كل صناعة رقمية أولاً في المملكة العربية السعودية تتطلب حماية على مستوى التطبيق." : "Every digital-first industry in Saudi Arabia requires application-level protection."}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {(service.criticalSectionTitle || service.criticalSectionTitleAr) && (
                <section className="py-12 bg-[#050b1a] text-white relative overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight tracking-tight">
                                    {(() => {
                                        const title = isAr ? service.criticalSectionTitleAr : service.criticalSectionTitle;
                                        if (!title) return null;
                                        const words = title.trim().split(/\s+/);
                                        if (words.length <= 2) return title;
                                        return (
                                            <>
                                                {words.slice(0, words.length - 2).join(' ')}{' '}
                                                <span className="text-[#1a6bf5]">{words.slice(-2).join(' ')}</span>
                                            </>
                                        );
                                    })()}
                                </h2>
                                <p className="text-base text-zinc-400 font-normal mb-6 leading-relaxed">
                                    {isAr ? service.criticalSectionDescriptionAr : service.criticalSectionDescription}
                                </p>
                                <Link
                                    href={service.criticalSectionButtonLink || '#'}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600/10 border border-blue-500/50 text-white font-bold rounded-xl hover:bg-blue-600/20 transition-all duration-300 group shadow-[0_0_20px_rgba(37,99,235,0.1)] hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]"
                                >
                                    {isAr
                                        ? (service.criticalSectionButtonTextAr || service.criticalSectionButtonText || 'أمن تطبيقات أعمالك')
                                        : (service.criticalSectionButtonText || 'Secure Your Business Applications')}
                                    <span className={`transition-transform duration-300 ${isAr ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 text-lg`}>→</span>
                                </Link>
                            </div>
                            <div className="w-full">
                                <span className="text-blue-500 font-bold uppercase tracking-[0.25em] mb-10 block text-[10px]">
                                    {isAr
                                        ? (service.criticalRightTitleAr || service.criticalRightTitle || "نظرة عامة")
                                        : (service.criticalRightTitle || "Key Features")}
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
                                    {service.criticalCards && service.criticalCards.length > 0 && service.criticalCards.map((card: any, idx: number) => (
                                        <div key={idx} className="relative bg-white rounded-3xl p-5 pt-8 flex flex-col items-center min-h-[110px] transition-transform duration-300 hover:-translate-y-2 shadow-xl border border-white/10 group text-center">
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#f0f7ff] flex items-center justify-center text-[#1a6bf5] shadow-md group-hover:scale-110 transition-transform duration-300">
                                                {renderIcon(card, 'fas fa-shield-alt', 'text-xl')}
                                            </div>
                                            <span className="font-extrabold text-[#0f172a] text-lg leading-snug tracking-tight mt-2">
                                                {isAr ? card.titleAr : card.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {(service.whyChooseUsSectionTitle || service.whyChooseUsSectionTitleAr) && (
                <section className="py-12 bg-[#f3f4ff] dark:bg-zinc-900/50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-10">
                            <h2 className="text-xl md:text-2xl font-semibold text-[#141d72] dark:text-blue-400 mb-3">
                                {isAr ? service.whyChooseUsSectionTitleAr : service.whyChooseUsSectionTitle}
                            </h2>
                            <p className="text-sm text-zinc-500 font-normal">
                                {isAr ? service.whyChooseUsDescriptionAr : service.whyChooseUsDescription}
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 mt-12">
                            {service.whyChooseUs && service.whyChooseUs.length > 0 && service.whyChooseUs.map((item: any, idx: number) => (
                                <div key={idx} className="relative bg-white dark:bg-zinc-900 px-8 py-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-2 hover:border-blue-500/20 hover:bg-blue-50/10 transition-all duration-300 hover:scale-105 group shadow-sm min-w-[220px]">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform shadow-md border-4 border-[#f3f4ff] dark:border-[#1a1f2e]">
                                        {renderIcon(item, 'fas fa-check', 'text-sm')}
                                    </div>
                                    <span className="font-bold text-zinc-900 dark:text-white text-sm tracking-tight text-center mt-3">
                                        {isAr ? item.titleAr : item.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="py-8 md:py-12" dir={isAr ? 'rtl' : 'ltr'}>
                <div className="container mx-auto px-6">
                    <div className="relative rounded-[32px] bg-[#0d6efd] p-6 md:p-8 lg:p-10 overflow-hidden shadow-2xl shadow-blue-200">
                        {/* Background patterns */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 border-[40px] border-white/10 rounded-full"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-start">
                            <div className="lg:w-2/3">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-6">
                                    {isAr
                                        ? (service.ctaMessageAr || service.ctaMessage || 'ابدأ الخطوة التالية')
                                        : (service.ctaMessage || 'Drive next step')}
                                </h2>
                                <p className="text-sm text-white/70 font-light leading-relaxed !text-white max-w-2xl">
                                    {isAr ? 'حول سير عملك في دقائق.' : 'Transform your workflow in minutes.'}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                <Link
                                    href={`/${lang}/contact`}
                                    className="group inline-flex items-center justify-center gap-3 bg-white text-[#0d6efd] px-10 py-5 rounded-2xl font-bold transition-all duration-300 hover:bg-cyan-400 hover:text-white hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/20"
                                >
                                    <MessageSquare className="w-5 h-5" />
                                    <span>{isAr ? 'طلب نسخة تجريبية' : 'Request a Demo'}</span>
                                    <ArrowUpRight className="w-5 h-5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                                </Link>
                                <Link
                                    href={`/${lang}/contact`}
                                    className="inline-flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white px-10 py-5 rounded-2xl font-bold transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 backdrop-blur-sm"
                                >
                                    <Briefcase className="w-5 h-5" />
                                    <span>{isAr ? 'تحدث إلى خبرائنا' : 'Talk to our Experts'}</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {service.faqs && service.faqs.length > 0 && (
                <section className="pt-12 pb-4 bg-white dark:bg-zinc-950 overflow-hidden">
                    <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1400px]">
                        <div className="mx-auto text-center mb-12" style={{ maxWidth: '600px' }}>
                            <div className="inline-block border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-1 text-sm font-semibold text-blue-600 mb-4 tracking-wide">
                                {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-white tracking-tight">
                                {isAr ? 'الأسئلة الأكثر شيوعاً' : 'Popular FAQs'}
                            </h1>
                        </div>
                        <ServiceFaqAccordion faqs={service.faqs as any} lang={lang} />
                    </div>
                </section>
            )}
        </div>
    );
}
