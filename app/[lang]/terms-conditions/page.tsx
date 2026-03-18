import { getDictionary, Locale } from "@/lib/get-dictionary";
import Breadcrumbs from "@/components/Breadcrumbs";
import Newsletter from "@/components/Newsletter";

export default async function TermsConditionsPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const isRtl = lang === 'ar';
    const pageData = dict.terms_conditions_page;
    const terms = pageData?.[lang] ?? pageData?.['en'];

    if (!terms) return null;

    const heroIconMap = ['fa-user-shield', 'fa-gavel', 'fa-cogs'];

    return (
        <div className="flex flex-col w-full min-h-screen bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
            <Breadcrumbs
                lang={lang as Locale}
                dict={dict}
                items={[{ label: terms.title }]}
            />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#14183e] to-[#1e3a8a] text-white py-16 md:py-24">
                <div className="container mx-auto px-4 md:px-6 text-center">
                    <span className="inline-block bg-white/10 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
                        {isRtl ? 'الشروط والأحكام' : 'Terms & Conditions'}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{terms.title}</h1>
                    <p className="text-lg text-white/70 !text-white mb-12">{terms.subtitle}</p>

                    {/* Hero Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {terms.hero_cards?.map((card: any, i: number) => (
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

            {/* Introduction */}
            <section className="container mx-auto px-4 md:px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    <p className="text-lg text-zinc-700 leading-relaxed bg-zinc-50 border border-zinc-100 rounded-2xl p-6">
                        {terms.introduction}
                    </p>
                </div>
            </section>

            {/* Sections */}
            <section className="container mx-auto px-4 md:px-6 pb-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {terms.sections?.map((section: any, idx: number) => (
                        <div key={idx} className="border border-zinc-100 rounded-2xl p-6 md:p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-5">
                                <span className="flex-shrink-0 w-8 h-8 bg-[#14183e] text-white rounded-lg flex items-center justify-center text-sm font-bold">
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
                                            <span className="w-1.5 h-1.5 bg-[#14183e] rounded-full flex-shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {section.cards && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                                    {section.cards.map((card: any, i: number) => (
                                        <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-4">
                                            <h4 className="font-semibold text-red-800 mb-1">{card.title}</h4>
                                            <p className="text-red-600 text-sm">{card.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Card */}
            {terms.contact_card && (
                <section className="container mx-auto px-4 md:px-6 pb-16">
                    <div className="max-w-4xl mx-auto bg-zinc-900 rounded-2xl p-8 md:p-10 text-white">
                        <div className="flex items-start gap-5">
                            <div className="flex-shrink-0 w-12 h-12 bg-[#0d6efd] rounded-xl flex items-center justify-center">
                                <i className="fas fa-envelope text-white text-lg"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">{terms.contact_card.title}</h3>
                                <p className="text-zinc-400 !text-white mb-3">{terms.contact_card.description}</p>
                                <a
                                    href={`mailto:${terms.contact_card.email}`}
                                    className="text-[#0d6efd] font-semibold hover:underline"
                                >
                                    {terms.contact_card.email}
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Last Updated */}
            <div className="container mx-auto px-4 md:px-6 pb-8">
                <p className="text-center text-zinc-400 text-sm">{terms.last_updated}</p>
            </div>

            <Newsletter lang={lang} dict={dict} />
        </div>
    );
}
