import { getDictionary, Locale } from "@/lib/get-dictionary";
import Newsletter from "@/components/Newsletter";
import {
    ShieldCheck,
    Gavel,
    Settings,
    ChevronRight,
    Info,
    Mail,
    Star,
    Rocket,
    AlertCircle,
    FileText
} from "lucide-react";
import * as motion from "framer-motion/client";

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

    const heroIcons = [
        <ShieldCheck key="shield" className="w-6 h-6 text-cyan-300" />,
        <Gavel key="gavel" className="w-6 h-6 text-blue-300" />,
        <Settings key="settings" className="w-6 h-6 text-purple-300" />
    ];

    return (
        <main className="flex flex-col w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>

            {/* Premium Hero Section */}
            <section className="relative bg-[#0d6efd] pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                {/* Background patterns */}
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)`,
                        backgroundSize: '32px 32px'
                    }}
                ></div>

                {/* Animated Orbs */}
                <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
                <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[80px] pointer-events-none animate-pulse"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 border border-white/30 bg-white/10 text-white text-[11px] font-bold px-4 py-1.5 rounded-full mb-8 tracking-widest uppercase"
                        >
                            <ShieldCheck className="w-3 h-3 text-cyan-300 fill-cyan-300" />
                            {isRtl ? 'اتفاقية الاستخدام' : 'LEGAL AGREEMENT'}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="font-syne text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-8"
                        >
                            {terms.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="font-dm-sans text-lg text-white/80 leading-relaxed max-w-2xl !text-white mb-16"
                        >
                            {terms.subtitle}
                        </motion.p>

                        {/* Hero Highlight Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {terms.hero_cards?.map((card: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                                    className="group p-6 rounded-[2rem] bg-[#060E24]/60 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all duration-500 text-left rtl:text-right"
                                >
                                    <div className="mb-4 p-3 w-fit rounded-xl bg-white/5 group-hover:scale-110 transition-transform duration-500">
                                        {heroIcons[i] || <FileText className="w-6 h-6 text-white" />}
                                    </div>
                                    <h3 className="text-lg font-syne font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-white/50 leading-relaxed font-dm-sans !text-white">
                                        {card.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Introduction Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative group p-8 md:p-12 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10" />
                            <div className="flex flex-col md:flex-row gap-8 items-center">
                                <div className="hidden md:flex flex-shrink-0 w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl items-center justify-center">
                                    <Info className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                                </div>
                                <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 leading-relaxed font-syne font-bold italic">
                                    {terms.introduction}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Main Content Sections */}
            <section className="py-12 bg-zinc-100/50 dark:bg-zinc-900/30 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto space-y-10">
                        {terms.sections?.map((section: any, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800 shadow-sm transition-all duration-500 hover:shadow-xl"
                            >
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-syne font-black text-xl shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                                        {String(idx + 1).padStart(2, '0')}
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-syne font-black text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                        {section.title}
                                    </h2>
                                </div>

                                {section.content && (
                                    <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 font-dm-sans">
                                        {section.content}
                                    </p>
                                )}

                                {section.items && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                        {section.items.map((item: string, i: number) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800 group/item transition-colors hover:bg-zinc-100">
                                                <ChevronRight className={`w-5 h-5 mt-0.5 text-blue-600 transition-transform group-hover/item:translate-x-1 ${isRtl ? 'rotate-180 group-hover/item:-translate-x-1' : ''}`} />
                                                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {section.cards && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                                        {section.cards.map((card: any, i: number) => (
                                            <div key={i} className="bg-red-500/5 dark:bg-red-500/10 border border-red-200 dark:border-red-900/30 rounded-3xl p-6 transition-all hover:bg-red-500/10">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                                    <h4 className="font-syne font-bold text-red-700 dark:text-red-400">{card.title}</h4>
                                                </div>
                                                <p className="text-sm text-red-800/70 dark:text-red-300/60 leading-relaxed">
                                                    {card.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
                {/* Decorative backgrounds */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/5 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-400/5 rounded-full blur-3xl -z-10" />
            </section>

            {/* Contact Support Section */}
            {terms.contact_card && (
                <section className="py-24 bg-white dark:bg-zinc-950 relative overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-5xl mx-auto bg-[#141d72] dark:bg-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 grid grid-cols-1 lg:grid-cols-5"
                        >
                            <div className="lg:col-span-3 p-12 md:p-16 space-y-8">
                                <h3 className="text-3xl md:text-5xl font-syne font-black text-white leading-tight">
                                    {terms.contact_card.title}
                                </h3>
                                <p className="text-lg text-white/70 leading-relaxed font-dm-sans !text-white">
                                    {terms.contact_card.description}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                                    <a href={`mailto:${terms.contact_card.email}`} className="group flex items-center gap-4 bg-[#0d6efd] text-white px-8 py-5 rounded-2xl font-black transition-all hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25">
                                        {isRtl ? 'اتصل بالدعم' : 'Contact Support'}
                                        <Mail className={`w-5 h-5 transition-transform group-hover:scale-110 ${isRtl ? 'rotate-180' : ''}`} />
                                    </a>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">{isRtl ? 'بريد الدعم' : 'SUPPORT EMAIL'}</span>
                                        <span className="text-lg font-black text-white">{terms.contact_card.email}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-2 relative bg-blue-600 min-h-[300px]">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
                                    <Rocket className="w-20 h-20 text-white relative z-10" />
                                </div>
                                <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/50 to-transparent">
                                    <p className="text-white text-lg font-syne font-bold italic leading-relaxed text-center !text-white">
                                        {isRtl
                                            ? '"نحن هنا لضمان تجربة عادلة وآمنة لجميع شركائنا."'
                                            : '"We are here to ensure a fair and safe experience for all our partners."'
                                        }
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Final Footer / Last Updated */}
            {/* <section className="py-12 bg-[#0d6efd] text-white text-center relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md mb-8 rotate-3">
                        <Star className="w-8 h-8 text-white fill-white" />
                    </div>
                    <p className="text-lg md:text-xl font-syne font-bold opacity-80 uppercase tracking-[0.2em]">
                        {terms.last_updated}
                    </p>
                </div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
            </section> */}

            <Newsletter lang={lang} dict={dict} />
        </main>
    );
}
