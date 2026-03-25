import { getDictionary, Locale } from "@/lib/get-dictionary";
import { getServiceBySlug, ServicePage } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFaqAccordion from "@/components/ServiceFaqAccordion";

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
            <span className="text-[#1a6bf5] font-semibold">{words.slice(-2).join(' ')}</span>
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
                <section className="relative pt-32 pb-6 md:pb-8 overflow-hidden">
                    {/* <Breadcrumbs 
                        lang={lang as Locale} 
                        dict={dict} 
                        items={[
                            { label: isAr ? 'خدماتنا' : 'Services', href: `/${lang}/services` },
                            { label: isAr ? (service.heroTitleAr || service.heroTitle) : service.heroTitle }
                        ]} 
                        isLight={true}
                    /> */}
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="w-full">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                                <span className="text-blue-600 font-semibold tracking-widest uppercase text-[10px]">
                                    {isAr ? 'تفاصيل الخدمة' : 'Service Detail'}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
                                    {(service.heroIcon || service.cardIcon) ? (
                                        <i className={`${service.heroIcon || service.cardIcon} text-lg md:text-xl`}></i>
                                    ) : (
                                        <i className="fas fa-certificate text-lg md:text-xl"></i>
                                    )}
                                </div>
                                <HighlightedTitle
                                    title={isAr ? (service.heroTitleAr || service.heroTitle) : service.heroTitle}
                                    className="text-2xl md:text-2xl lg:text-3xl font-semibold text-zinc-900 dark:text-white tracking-tight leading-tight"
                                />
                            </div>

                            <p className="text-sm md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal mb-6">
                                {isAr ? service.heroIntroductionAr : service.heroIntroduction}
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {(service.primaryCtaText || service.primaryCtaTextAr) && (
                                    <Link
                                        href={`/${lang}/contact`}
                                        className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5 block text-xs md:text-sm"
                                    >
                                        {isAr ? (service.primaryCtaTextAr || service.primaryCtaText) : (service.primaryCtaText || 'Get Started')}
                                    </Link>
                                )}
                                {(service.secondaryCtaText || service.secondaryCtaTextAr) && (
                                    <Link
                                        href={`/${lang}/contact`}
                                        className="px-6 py-2.5 bg-transparent border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all hover:-translate-y-0.5 block text-xs md:text-sm"
                                    >
                                        {isAr ? (service.secondaryCtaTextAr || service.secondaryCtaText) : (service.secondaryCtaText || 'Learn More')}
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
                <section className="py-12 bg-zinc-50 dark:bg-zinc-900/30">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-10">
                            <h2 className="text-xl md:text-2xl font-semibold text-[#141d72] dark:text-blue-400 tracking-tight">
                                {isAr ? (service.capabilitiesSectionTitleAr || 'قدراتنا') : (service.capabilitiesSectionTitle || 'Our Capabilities')}
                            </h2>
                        </div>
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {service.capabilities.map((item: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className="group capability-card"
                                    >
                                        <div className="capability-icon-box">
                                            {renderIcon(item, 'fas fa-rocket', 'text-2xl')}
                                        </div>

                                        <h3 className="relative z-10 text-base font-bold text-[#1e293b] dark:text-white mb-2 tracking-tight">
                                            {isAr ? item.titleAr : item.title}
                                        </h3>

                                        <p className="relative z-10 text-[#64748b] dark:text-zinc-400 font-bold text-[13px] leading-relaxed max-w-[200px]">
                                            {isAr ? item.descriptionAr : item.description}
                                        </p>
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

            <section className="py-6 bg-[#f3f4ff] dark:bg-zinc-900/50">
                <div className="container mx-auto px-6">
                    <div className="bg-blue-600 rounded-2xl py-6 px-8 md:py-7 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-blue-600/20 relative overflow-hidden group mx-auto">
                        <div className="relative z-10 text-center md:text-left">
                            <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight">
                                {isAr
                                    ? (service.ctaMessageAr || service.ctaMessage || 'ابدأ الخطوة التالية')
                                    : (service.ctaMessage || 'Drive next step')}
                            </h2>
                            <p className="text-blue-100/90 text-sm md:text-base !text-white mt-2 font-medium">
                                {isAr ? 'حول سير عملك في دقائق.' : 'Transform your workflow in minutes.'}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-end gap-3 relative z-10">
                            <Link
                                href={`/${lang}/contact`}
                                className="px-6 py-2.5 bg-white text-blue-600 font-bold rounded-full hover:bg-zinc-100 transition-all transform hover:scale-105 active:scale-95 text-xs md:text-sm shadow-md"
                            >
                                {isAr ? 'طلب نسخة تجريبية' : 'Request a Demo'}
                            </Link>
                            <Link
                                href={`/${lang}/contact`}
                                className="px-6 py-2.5 bg-transparent border border-white/50 text-white font-semibold rounded-full hover:bg-white/10 transition-all transform hover:scale-105 active:scale-95 text-xs md:text-sm"
                            >
                                {isAr ? 'تحدث إلى خبرائنا' : 'Talk to our Experts'}
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-colors duration-500"></div>
                    </div>
                </div>
            </section>

            {service.faqs && service.faqs.length > 0 && (
                <section className="py-12 bg-[#f3f4ff] dark:bg-zinc-900/50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-semibold text-[#141d72] dark:text-blue-400 mb-2">
                                {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
                            </h2>
                            <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full"></div>
                        </div>
                        <ServiceFaqAccordion faqs={service.faqs as any} lang={lang} />
                    </div>
                </section>
            )}
        </div>
    );
}
