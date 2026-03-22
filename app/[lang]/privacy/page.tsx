import { getDictionary, Locale } from "@/lib/get-dictionary";
import Breadcrumbs from "@/components/Breadcrumbs";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";

export default async function PrivacyPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const isRtl = lang === 'ar';
    const pageData = dict.privacy_policy_page;
    const privacy = pageData?.[lang] ?? pageData?.['en'];

    if (!privacy) return null;

    const heroIconMap = ['fa-shield-alt', 'fa-eye', 'fa-user-check'];

    return (
        <div className="flex flex-col w-full min-h-screen bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* <Breadcrumbs
                lang={lang as Locale}
                dict={dict}
                items={[{ label: privacy.title }]}
            /> */}

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#14183e] to-[#0d6efd] text-white pt-32 pb-16 md:pt-40 md:pb-24">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <span className="inline-block bg-white/10 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
                        {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{privacy.title}</h1>
                    <p className="text-lg text-white/70 !text-white mb-12">{privacy.subtitle}</p>

                    {/* Hero Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {privacy.hero_cards?.map((card: any, i: number) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-left rtl:text-right hover:bg-white/20 transition-all">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                    <i className={`fas ${heroIconMap[i] ?? 'fa-check'} text-white text-lg`}></i>
                                </div>
                                <h3 className="font-bold text-lg mb-1">{card.title}</h3>
                                <p className="text-white/70 !text-white text-sm">{card.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Introduction + Highlights */}
            <section className="container mx-auto px-4 md:px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <p className="text-lg text-zinc-700 mb-8 leading-relaxed">{privacy.introduction}</p>

                    {privacy.highlight_points && (
                        <div className="bg-[#0d6efd]/5 border border-[#0d6efd]/20 rounded-2xl p-6 mb-10">
                            <ul className="space-y-3">
                                {privacy.highlight_points.map((point: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3 text-zinc-700 font-medium">
                                        <span className="flex-shrink-0 w-6 h-6 bg-[#0d6efd] text-white rounded-full flex items-center justify-center">
                                            <i className="fas fa-check text-xs"></i>
                                        </span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>

            {/* Sections */}
            <section className="container mx-auto px-4 md:px-6 pb-12">
                <div className="max-w-4xl mx-auto space-y-10">
                    {privacy.sections?.map((section: any, idx: number) => (
                        <div key={idx} className="border border-zinc-100 rounded-2xl p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex-shrink-0 w-8 h-8 bg-[#0d6efd] text-white rounded-lg flex items-center justify-center text-sm font-bold">
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                                <h2 className="text-xl font-bold text-[#14183e]">{section.title}</h2>
                            </div>

                            {section.content && (
                                <p className="text-zinc-600 leading-relaxed mb-4">{section.content}</p>
                            )}

                            {section.items && (
                                <ul className={`space-y-2 ${isRtl ? 'pr-2' : 'pl-2'}`}>
                                    {section.items.map((item: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-zinc-700 text-sm">
                                            <span className="w-1.5 h-1.5 bg-[#0d6efd] rounded-full flex-shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {section.cards && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                                    {section.cards.map((card: any, i: number) => (
                                        <div key={i} className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
                                            <h4 className="font-semibold text-[#14183e] mb-1">{card.title}</h4>
                                            <p className="text-zinc-500 text-sm">{card.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            {privacy.cta && (
                <section className="container mx-auto px-4 md:px-6 pb-16">
                    <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#14183e] to-[#0d6efd] rounded-2xl p-8 md:p-10 text-white text-center">
                        <h3 className="text-2xl font-bold mb-2">{privacy.cta.title}</h3>
                        <p className="text-white/70 !text-white mb-6">{privacy.cta.description}</p>
                        <Link
                            href={`/${lang}/contact`}
                            className="inline-block bg-white text-[#0d6efd] font-semibold px-8 py-3 rounded-full hover:bg-white/90 transition-colors"
                        >
                            {privacy.cta.button_text}
                        </Link>
                    </div>
                </section>
            )}

            {/* Last Updated */}
            <div className="container mx-auto px-4 md:px-6 pb-8">
                <p className="text-center text-zinc-400 text-sm">{privacy.last_updated}</p>
            </div>

            <Newsletter lang={lang} dict={dict} />
        </div>
    );
}
