import { getDictionary, Locale } from "@/lib/get-dictionary";
import { getProductBySlug, getMediaUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceFaqAccordion from "@/components/ServiceFaqAccordion";
import { MessageSquare, ArrowUpRight, Briefcase } from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getProductSchema, getBreadcrumbSchema } from "@/lib/schema-builder";

export async function generateMetadata({
    params
}: {
    params: Promise<{ lang: string; slug: string }>
}) {
    const { lang, slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) return {};

    const title = lang === 'ar' ? (product.metaTitleAr || product.heroTitleAr || product.titleAr) : (product.metaTitle || product.heroTitle || product.title);
    const description = lang === 'ar' ? (product.metaDescriptionAr || product.heroDescriptionAr || product.shortDescriptionAr) : (product.metaDescription || product.heroDescription || product.shortDescription);

    return {
        title: title,
        description: description,
        keywords: lang === 'ar' ? product.metaKeywordsAr : product.metaKeywords,
        alternates: {
            canonical: `/${lang}/products/${slug}`,
        }
    };
}

const renderIcon = (item: any, fallback: string, className = "text-sm") => {
    // 1. Check if it's explicitly a FontAwesome icon or has FA data
    if (item.iconType === 'fa' || item.iconFA || (!item.iconPath && (item.icon || typeof item === 'string'))) {
        const iconClass = item.iconFA || item.icon || (typeof item === 'string' ? item : fallback);
        const finalClass = (iconClass.startsWith('fa') || iconClass.includes('fa-')) ? iconClass : `fas fa-${iconClass}`;
        return <i className={`${finalClass} ${className}`}></i>;
    }

    // 2. Check if it's a file path icon
    if (item.iconType === 'file' || item.iconPath) {
        const url = getMediaUrl(item.iconPath);
        if (url) {
            return <Image src={url} alt="" width={16} height={16} className="object-contain" />;
        }
    }

    // 3. Fallback
    return <i className={`${fallback} ${className}`}></i>;
};

const HighlightedTitle = ({ title, className }: { title: string; className?: string }) => {
    const renderTitle = (text: string) => {
        const words = text.split(' ');
        if (words.length <= 2) return <span className="text-cyan-300">{text}</span>;

        const mainPart = words.slice(0, words.length - 2).join(' ');
        const lastTwo = words.slice(words.length - 2).join(' ');

        return (
            <>
                {mainPart} <span className="text-cyan-300">{lastTwo}</span>
            </>
        );
    };

    if (!title) return null;

    return (
        <h1 className={className}>
            {renderTitle(title)}
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

    const productSchema = getProductSchema(product, lang);
    const breadcrumbSchema = getBreadcrumbSchema([
        { name: isAr ? 'الرئيسية' : 'Home', item: `/${lang}` },
        { name: isAr ? 'المنتجات' : 'Products', item: `/${lang}/products` },
        { name: isAr ? (product.titleAr || product.title) : product.title, item: `/${lang}/products/${slug}` }
    ], lang);

    return (
        <div className="flex flex-col w-full min-h-screen bg-white dark:bg-zinc-950 overflow-x-hidden font-sans" dir={isAr ? 'rtl' : 'ltr'}>
            <JsonLd schema={productSchema} />
            <JsonLd schema={breadcrumbSchema} />

            <div className="bg-[#f3f4ff] dark:bg-zinc-900/50">


                {/* HERO SECTION */}
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
                                {isAr ? 'تفاصيل المنتج' : 'Product Detail'}
                            </div>

                            {/* Icon + Title */}
                            <div className="flex items-start gap-4 md:gap-6 mb-8">
                                <div className="shrink-0 p-2.5 md:p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm shadow-xl text-white flex items-center justify-center">
                                    {(product.heroIcon || product.cardIcon) ? (
                                        <i className={`${product.heroIcon || product.cardIcon} text-lg md:text-2xl`}></i>
                                    ) : (
                                        <i className="fas fa-certificate text-lg md:text-2xl"></i>
                                    )}
                                </div>
                                <HighlightedTitle
                                    title={isAr ? (product.heroTitleAr || product.titleAr || product.title) : (product.heroTitle || product.title)}
                                    className="font-syne text-2xl md:text-4xl lg:text-4xl font-extrabold text-white leading-[1.1]"
                                />
                            </div>

                            {/* Description */}
                            <p className="font-dm-sans text-lg md:text-sm text-white/70 font-light leading-relaxed !text-white mb-12 max-w-2xl">
                                {isAr ? (product.heroDescriptionAr || product.shortDescriptionAr) : (product.heroDescription || product.shortDescription)}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4">
                                {(product.heroPrimaryCtaText || product.heroPrimaryCtaTextAr) && (
                                    <Link
                                        href={product.heroPrimaryCtaLink || '#'}
                                        className="group inline-flex items-center justify-center gap-3 bg-white text-[#0d6efd] px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:bg-cyan-400 hover:text-white hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/20"
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                        <span>{isAr ? (product.heroPrimaryCtaTextAr || product.heroPrimaryCtaText) : (product.heroPrimaryCtaText || 'Request Demo')}</span>
                                        <ArrowUpRight className="w-5 h-5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                                    </Link>
                                )}
                                {(product.heroSecondaryCtaText || product.heroSecondaryCtaTextAr) && (
                                    <Link
                                        href={product.heroSecondaryCtaLink || '#'}
                                        className="inline-flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 backdrop-blur-sm"
                                    >
                                        <Briefcase className="w-5 h-5" />
                                        <span>{isAr ? (product.heroSecondaryCtaTextAr || product.heroSecondaryCtaText) : (product.heroSecondaryCtaText || 'Learn More')}</span>
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
                <div className="container mx-auto px-6">
                    <div className={`flex flex-col lg:flex-row items-start gap-16 ${isAr ? 'lg:flex-row-reverse' : ''}`}>
                        <div className="flex-1">
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
                                    const url = getMediaUrl(product.aboutImage);
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
                <section className="py-20 bg-zinc-50 dark:bg-zinc-900/30">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1a6bf5] tracking-tight leading-tight px-4">
                                {isAr ? "كيف يعمل؟" : "How It Works"}
                            </h2>
                        </div>
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                                {product.howItWorks.map((item: any, idx) => (
                                    <div
                                        key={idx}
                                        className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-100 dark:border-zinc-800 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-blue-500 hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.3)] overflow-hidden"
                                    >
                                        {/* Background Accent */}
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-50 dark:bg-zinc-800 rounded-bl-[100px] -mr-8 -mt-8 transition-all duration-500 group-hover:bg-blue-500/10 group-hover:scale-150"></div>

                                        <div className="relative z-10">
                                            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white transition-all duration-500 shadow-sm border border-zinc-50 dark:border-zinc-700 overflow-hidden">
                                                {renderIcon(item, 'fas fa-arrow-right', 'text-base transition-all duration-500 group-hover:scale-110 group-hover:rotate-12')}
                                            </div>
                                            <h3 className="font-syne text-2xl font-bold mb-4 text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors leading-tight uppercase">
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

            {/* KEY FEATURES */}
            <section className="py-12 bg-[#f3f4ff] dark:bg-zinc-950">
                <div className="container mx-auto px-6">
                    <div className={`flex flex-col lg:flex-row items-center gap-12 ${isAr ? 'lg:flex-row-reverse' : ''}`}>
                        <div className="lg:w-2/5 flex justify-center">
                            <div className="relative rounded-2xl overflow-hidden max-w-[500px] h-[380px] w-full group">
                                {(() => {
                                    const img = product.keyFeaturesImages?.[0];
                                    const url = getMediaUrl(img);
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
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="text-center mb-16">
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
                    <div className="container mx-auto px-6 text-center">
                        <div className="mb-10">
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
                    <div className="container mx-auto px-6">
                        <div className={`flex flex-col lg:flex-row items-center gap-16 ${isAr ? 'lg:flex-row-reverse' : ''}`}>
                            <div className="flex-1 order-2 lg:order-1">
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
                                        const url = getMediaUrl(product.whySharpImage);
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
            <section className="py-8 md:py-12" dir={isAr ? 'rtl' : 'ltr'}>
                <div className="container mx-auto px-6">
                    <div className="relative rounded-[32px] bg-[#0d6efd] p-6 md:p-8 lg:p-10 overflow-hidden shadow-2xl shadow-blue-200">
                        {/* Background patterns */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] translate-x-1/2"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 border-[40px] border-white/10 rounded-full"></div>

                        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-start">
                            <div className="lg:w-2/3">
                                <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight mb-6">
                                    {isAr ? product.ctaTitleAr : product.ctaTitle || (isAr ? 'ابدأ الخطوة التالية' : 'Drive next step')}
                                </h2>
                                <p className="text-sm text-white/70 font-light leading-relaxed !text-white max-w-2xl">
                                    {isAr ? product.ctaDescriptionAr : product.ctaDescription || (isAr ? 'حول سير عملك في دقائق.' : 'Transform your workflow in minutes.')}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                {(product.ctaButton1Text || product.ctaButton1TextAr) && (
                                    <Link
                                        href={product.ctaButton1Link || `/${lang}/contact`}
                                        className="group inline-flex items-center justify-center gap-3 bg-white text-[#0d6efd] px-10 py-5 rounded-2xl font-bold transition-all duration-300 hover:bg-cyan-400 hover:text-white hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/20"
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                        <span>{isAr ? (product.ctaButton1TextAr || product.ctaButton1Text) : product.ctaButton1Text}</span>
                                        <ArrowUpRight className="w-5 h-5 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                                    </Link>
                                )}
                                {(product.ctaButton2Text || product.ctaButton2TextAr) && (
                                    <Link
                                        href={product.ctaButton2Link || `/${lang}/products`}
                                        className="inline-flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white px-10 py-5 rounded-2xl font-bold transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 backdrop-blur-sm"
                                    >
                                        <Briefcase className="w-5 h-5" />
                                        <span>{isAr ? (product.ctaButton2TextAr || product.ctaButton2Text) : product.ctaButton2Text}</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            {product.faqs && product.faqs.length > 0 && (
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
                        <ServiceFaqAccordion faqs={product.faqs as any} lang={lang} />
                    </div>
                </section>
            )}
        </div>
    );
}
