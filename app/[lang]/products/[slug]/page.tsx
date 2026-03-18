import { getDictionary, Locale } from "@/lib/get-dictionary";
import { getProductBySlug } from "@/lib/api";
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
    const product = await getProductBySlug(slug);

    if (!product) return {};

    const title = lang === 'ar' ? (product.metaTitleAr || product.heroTitleAr) : (product.metaTitle || product.heroTitle);
    const description = lang === 'ar' ? (product.metaDescriptionAr || product.heroDescriptionAr) : (product.metaDescription || product.heroDescription);

    return {
        title: title,
        description: description,
        keywords: lang === 'ar' ? product.metaKeywordsAr : product.metaKeywords,
    };
}

const getImageUrl = (path: string | undefined | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') || '';
    return `${baseUrl}/${path.replace(/\\/g, '/').replace(/^\//, '')}`;
};

const renderIcon = (item: any, fallback: string, className = "text-sm") => {
    // 1. Check if it's explicitly a FontAwesome icon or has FA data
    if (item.iconType === 'fa' || item.iconFA || (!item.iconPath && (item.icon || typeof item === 'string'))) {
        const iconClass = item.iconFA || item.icon || (typeof item === 'string' ? item : fallback);
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

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>;
}) {
    const { lang, slug } = await params;
    const dict = await getDictionary(lang);
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const isAr = lang === 'ar';

    return (
        <div className="flex flex-col w-full min-h-screen bg-white dark:bg-zinc-950 overflow-x-hidden font-sans" dir={isAr ? 'rtl' : 'ltr'}>

            <div className="bg-[#f3f4ff] dark:bg-zinc-900/50">
                <Breadcrumbs
                    lang={lang}
                    dict={dict}
                    items={[
                        { label: isAr ? 'منتجاتنا' : 'Products', href: `/${lang}/products` },
                        { label: isAr ? (product.titleAr || product.title) : product.title }
                    ]}
                />

                {/* HERO SECTION */}
                <section className="relative pt-2 md:pt-4 pb-6 md:pb-8 overflow-hidden">
                    <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16 relative z-10">
                        <div className="max-w-4xl lg:ps-12">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                                <span className="text-blue-600 font-semibold tracking-widest uppercase text-[10px]">
                                    {isAr ? 'تفاصيل المنتج' : 'Product Detail'}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm">
                                    {renderIcon(product.heroIcon || product.cardIcon, 'fas fa-rocket', 'text-lg md:text-xl')}
                                </div>
                                <HighlightedTitle
                                    title={isAr ? (product.heroTitleAr || product.titleAr || product.title) : (product.heroTitle || product.title)}
                                    className="text-2xl md:text-2xl lg:text-3xl font-semibold text-zinc-900 dark:text-white tracking-tight leading-tight"
                                />
                            </div>

                            {(isAr ? product.heroSubtitleAr : product.heroSubtitle) && (
                                <h4 className="text-sm font-semibold text-[#1bd7de] mb-2 leading-tight">
                                    {isAr ? product.heroSubtitleAr : product.heroSubtitle}
                                </h4>
                            )}

                            <p className="text-sm md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal mb-6 max-w-3xl">
                                {isAr ? (product.heroDescriptionAr || product.shortDescriptionAr) : (product.heroDescription || product.shortDescription)}
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {(product.heroPrimaryCtaText || product.heroPrimaryCtaTextAr) && (
                                    <Link
                                        href={product.heroPrimaryCtaLink || '#'}
                                        className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-0.5 block text-xs md:text-sm"
                                    >
                                        {isAr ? (product.heroPrimaryCtaTextAr || product.heroPrimaryCtaText) : (product.heroPrimaryCtaText || 'Request Demo')}
                                    </Link>
                                )}
                                {(product.heroSecondaryCtaText || product.heroSecondaryCtaTextAr) && (
                                    <Link
                                        href={product.heroSecondaryCtaLink || '#'}
                                        className="px-6 py-2.5 bg-transparent border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white font-bold rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all hover:-translate-y-0.5 block text-xs md:text-sm"
                                    >
                                        {isAr ? (product.heroSecondaryCtaTextAr || product.heroSecondaryCtaText) : (product.heroSecondaryCtaText || 'Learn More')}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800"></div>

            {/* ABOUT THE SOLUTION */}
            <section className="py-16 relative overflow-hidden bg-[#f3f4ff] dark:bg-zinc-900/40">
                <div className="container mx-auto px-6 md:px-16 lg:px-24">
                    <div className={`flex flex-col lg:flex-row items-start gap-16 ${isAr ? 'lg:flex-row-reverse' : ''}`}>
                        <div className="flex-1 lg:max-w-[60%]">
                            <div className={`mb-6 ${isAr ? 'text-right' : 'text-left'}`}>
                                <h4 className="text-xl md:text-2xl font-bold text-[#1a6bf5] mb-4 tracking-tight">
                                    {isAr ? (product.aboutTitleAr || 'حول الحل') : (product.aboutTitle || 'About the Solution')}
                                </h4>
                            </div>
                            <p className="text-sm md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal whitespace-pre-line">
                                {isAr ? product.aboutContentAr : product.aboutContent}
                            </p>
                        </div>
                        <div className="flex-1 lg:max-w-[35%] relative">
                            <div className="relative rounded-[24px] overflow-hidden flex items-center justify-center p-0">
                                {(() => {
                                    const url = getImageUrl(product.aboutImage);
                                    if (!url) return <div className="w-[400px] h-[300px] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center rounded-xl"><i className="fas fa-image text-3xl text-zinc-300"></i></div>;
                                    return (
                                        <Image
                                            src={url}
                                            alt={product.aboutImageAlt || ""}
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

            {/* HOW IT WORKS */}
            {product.howItWorks && product.howItWorks.length > 0 && (
                <section className="py-12 bg-zinc-50 dark:bg-zinc-900/30">
                    <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16 text-center">
                        <div className="mb-10 max-w-xl mx-auto">
                            <h2 className="text-xl md:text-2xl font-semibold text-[#141d72] dark:text-blue-400 tracking-tight">
                                {isAr ? "كيف يعمل؟" : "How It Works"}
                            </h2>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {product.howItWorks.map((item, idx) => (
                                    <div key={idx} className="group capability-card">
                                        <div className="capability-icon-box mx-auto">
                                            {renderIcon(item, 'fas fa-arrow-right', 'text-base')}
                                        </div>
                                        <h3 className="relative z-10 text-sm font-bold text-[#1e293b] dark:text-white mb-2 tracking-tight uppercase">
                                            {isAr ? item.titleAr : item.title}
                                        </h3>
                                        <p className="relative z-10 text-[#64748b] dark:text-zinc-400 font-normal text-[13px] leading-relaxed">
                                            {isAr ? item.descriptionAr : item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* KEY FEATURES */}
            <section className="py-12 bg-[#f3f4ff] dark:bg-zinc-950">
                <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16">
                    <div className={`flex flex-col lg:flex-row items-center gap-12 ${isAr ? 'lg:flex-row-reverse' : ''}`}>
                        <div className="lg:w-2/5 flex justify-center">
                            <div className="relative rounded-2xl overflow-hidden max-w-[500px] h-[380px] w-full group">
                                {(() => {
                                    const img = product.keyFeaturesImages?.[0];
                                    const url = getImageUrl(img);
                                    if (!url) return <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center rounded-xl"><i className="fas fa-microchip text-4xl text-zinc-300"></i></div>;
                                    return (
                                        <Image
                                            src={url}
                                            alt={product.keyFeaturesImageAlt || ""}
                                            width={500}
                                            height={400}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    );
                                })()}
                            </div>
                        </div>
                        <div className="lg:w-3/5">
                            <div className="mb-8 text-center">
                                <h2 className="text-2xl md:text-3xl font-bold text-[#1a6bf5] tracking-tight">
                                    {isAr ? (product.keyFeaturesTitleAr || 'المميزات الرئيسية') : (product.keyFeaturesTitle || 'Key Features')}
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-7">
                                {(isAr ? (product.keyFeaturesListAr || product.keyFeaturesList) : product.keyFeaturesList)?.map((feature: any, idx: number, list: any[]) => {
                                    const isLastInRowMobile = (idx + 1) % 2 === 0 || idx === (list.length - 1);
                                    const isLastInRowDesktop = (idx + 1) % 3 === 0 || idx === (list.length - 1);

                                    return (
                                        <div key={idx} className={`flex flex-col items-center text-center px-4 py-2 group ${!isLastInRowMobile ? 'border-e' : ''} ${!isLastInRowDesktop ? 'lg:border-e' : 'lg:border-none'} border-blue-100 dark:border-zinc-800`}>
                                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform shadow-lg shadow-blue-600/20">
                                                {renderIcon(feature, 'fas fa-check', 'text-base')}
                                            </div>
                                            <h4 className="font-bold text-[13px] text-[#334155] dark:text-zinc-200 tracking-tight leading-snug max-w-[140px]">
                                                {isAr ? feature.textAr || feature.text : feature.text}
                                            </h4>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BENEFITS & IMPACT */}
            {product.benefits && product.benefits.length > 0 && (
                <section className="py-16 bg-[#14183e] text-white relative overflow-hidden">
                    <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16 max-w-7xl relative z-10">
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
                                {isAr ? "الفوائد والأثر" : "Benefits & Impact"}
                            </h2>
                            <p className="text-sm text-zinc-400 font-normal italic">
                                {isAr ? "تم تصميم حلولنا لتقديم أقصى قيمة واثر إيجابي." : "Solutions tailored specifically for your business operations."}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {product.benefits.map((benefit, idx) => (
                                <div key={idx} className="relative bg-white rounded-3xl p-6 pt-10 flex flex-col items-center min-h-[140px] transform transition-transform duration-500 hover:-translate-y-2 hover:scale-110 shadow-2xl group text-center will-change-transform">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#f0f7ff] flex items-center justify-center text-[#1a6bf5] shadow-lg group-hover:scale-110 transition-transform border-4 border-[#14183e]">
                                        {renderIcon(benefit, 'fas fa-shield-alt', 'text-2xl')}
                                    </div>
                                    <span className="font-extrabold text-[#0f172a] text-base leading-snug tracking-tight mb-3">
                                        {isAr ? benefit.titleAr || benefit.title : benefit.title}
                                    </span>
                                    <p className="text-[#64748b] text-[13px] font-normal leading-relaxed">
                                        {isAr ? benefit.descriptionAr : benefit.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* VISION ALIGNMENT */}
            {product.visionItems && product.visionItems.length > 0 && (
                <section className="py-12 bg-[#f3f4ff] dark:bg-zinc-900/50">
                    <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16 text-center">
                        <div className="mb-10 max-w-xl mx-auto">
                            <h2 className="text-xl md:text-2xl font-semibold text-[#141d72] dark:text-blue-400 tracking-tight uppercase">
                                {isAr ? product.visionTitleAr || 'محاذاة رؤية 2030' : product.visionTitle || 'Vision 2030 Alignment'}
                            </h2>
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 pt-8">
                            {product.visionItems.map((item: any, idx: number) => (
                                <div key={idx} className="relative bg-zinc-50 dark:bg-zinc-900 px-8 py-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-2 hover:border-blue-500/20 hover:bg-blue-50/10 transform transition-transform duration-500 hover:scale-110 group shadow-sm will-change-transform min-w-[200px]">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform shadow-md border-4 border-[#f3f4ff] dark:border-[#141d2b]">
                                        {renderIcon(item, 'fas fa-rocket', 'text-base')}
                                    </div>
                                    <span className="font-bold text-zinc-900 dark:text-white text-sm tracking-tight uppercase text-center">
                                        {isAr ? item.textAr || item.text : item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* WHY SHARP INNVOTECH */}
            {(product.whySharpTitle || product.whySharpTitleAr) && (
                <section className="py-16 bg-white dark:bg-zinc-950">
                    <div className="container mx-auto px-6 md:px-16 lg:px-24">
                        <div className={`flex flex-col lg:flex-row items-center gap-16 ${isAr ? 'lg:flex-row-reverse' : ''}`}>
                            <div className="flex-1 lg:max-w-[60%] order-2 lg:order-1">
                                <div className={`mb-6 ${isAr ? 'text-right' : 'text-left'}`}>
                                    <div className="inline-block px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50/30 mb-4">
                                        <span className="text-[#141d72] dark:text-blue-400 font-bold text-[10px] tracking-widest uppercase">
                                            {isAr ? 'لماذا شارب' : 'Why Sharp'}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#141d72] dark:text-blue-400 mb-4 tracking-tight leading-tight">
                                        {isAr ? product.whySharpTitleAr : product.whySharpTitle}
                                    </h2>
                                </div>
                                <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed whitespace-pre-line">
                                    {isAr ? product.whySharpContentAr : product.whySharpContent}
                                </p>
                            </div>
                            <div className="flex-1 flex justify-center order-1 lg:order-2">
                                <div className="relative rounded-2xl overflow-hidden max-w-[500px] h-[380px] w-full group">
                                    {(() => {
                                        const url = getImageUrl(product.whySharpImage);
                                        if (!url) return <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center"><i className="fas fa-building text-4xl text-zinc-300"></i></div>;
                                        return (
                                            <Image
                                                src={url}
                                                alt={product.whySharpImageAlt || ""}
                                                width={500}
                                                height={400}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA BANNER */}
            <section className="py-6 bg-[#f3f4ff] dark:bg-zinc-900/50">
                <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16">
                    <div className="bg-blue-600 rounded-2xl py-6 px-8 md:py-7 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-blue-600/20 relative overflow-hidden group max-w-5xl mx-auto">
                        <div className="relative z-10 text-center md:text-left">
                            <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight">
                                {isAr ? product.ctaTitleAr : product.ctaTitle || (isAr ? 'ابدأ الخطوة التالية' : 'Drive next step')}
                            </h2>
                            <p className="text-blue-100/90 text-sm md:text-base !text-white mt-2 font-medium">
                                {isAr ? product.ctaDescriptionAr : product.ctaDescription || (isAr ? 'حول سير عملك في دقائق.' : 'Transform your workflow in minutes.')}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-end gap-3 relative z-10">
                            {(product.ctaButton1Text || product.ctaButton1TextAr) && (
                                <Link
                                    href={product.ctaButton1Link || '#'}
                                    className="px-6 py-2.5 bg-white text-blue-600 font-bold rounded-full hover:bg-zinc-100 transition-all transform hover:scale-105 active:scale-95 text-xs md:text-sm shadow-md"
                                >
                                    {isAr ? (product.ctaButton1TextAr || product.ctaButton1Text) : product.ctaButton1Text}
                                </Link>
                            )}
                            {(product.ctaButton2Text || product.ctaButton2TextAr) && (
                                <Link
                                    href={product.ctaButton2Link || '#'}
                                    className="px-6 py-2.5 bg-transparent border border-white/50 text-white font-semibold rounded-full hover:bg-white/10 transition-all transform hover:scale-105 active:scale-95 text-xs md:text-sm"
                                >
                                    {isAr ? (product.ctaButton2TextAr || product.ctaButton2Text) : product.ctaButton2Text}
                                </Link>
                            )}
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-colors duration-500"></div>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            {product.faqs && product.faqs.length > 0 && (
                <section className="py-12 bg-[#f3f4ff] dark:bg-zinc-900/50">
                    <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16">
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-semibold text-[#141d72] dark:text-blue-400 mb-2 uppercase tracking-tight">
                                {isAr ? "الأسئلة المتكررة" : "Frequently Asked Questions"}
                            </h2>
                            <div className="h-1 w-12 bg-blue-600 mx-auto rounded-full"></div>
                        </div>
                        <ServiceFaqAccordion faqs={product.faqs as any} lang={lang} />
                    </div>
                </section>
            )}
        </div>
    );
}
