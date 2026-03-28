import { getDictionary, Locale } from "@/lib/get-dictionary";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";
import {
    ShieldCheck,
    Eye,
    UserCheck,
    ChevronRight,
    Lock,
    Mail,
    Star,
    Rocket,
    CheckCircle2,
    FileText,
    ArrowRight
} from "lucide-react";
import * as motion from "framer-motion/client";

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

    const heroIcons = [
        <ShieldCheck key="shield" className="w-6 h-6 text-cyan-300" />,
        <Eye key="eye" className="w-6 h-6 text-blue-300" />,
        <UserCheck key="user" className="w-6 h-6 text-purple-300" />
    ];

    return (
        <main className="flex flex-col w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>

            {/* Premium Hero Section */}
            <section className="relative bg-[#0d6efd] pt-32 pb-20 md:pt-30 md:pb-32 overflow-hidden">
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
                            <Lock className="w-3 h-3 text-cyan-300 fill-cyan-300" />
                            {isRtl ? 'حماية البيانات' : 'DATA PROTECTION'}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="font-syne text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-8"
                        >
                            {privacy.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="font-dm-sans text-lg text-white/80 leading-relaxed max-w-2xl !text-white mb-16"
                        >
                            {privacy.subtitle}
                        </motion.p>

                        {/* Hero Highlight Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {privacy.hero_cards?.map((card: any, i: number) => (
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

            {/* Introduction & Highlights Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto space-y-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative p-8 md:p-12 bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10" />
                            <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-300 leading-relaxed font-syne font-bold italic border-l-4 border-blue-600 pl-8 dark:border-blue-400">
                                {privacy.introduction}
                            </p>
                        </motion.div>

                        {privacy.highlight_points && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {privacy.highlight_points.map((point: string, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-4 p-5 bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl border border-blue-200/50 dark:border-blue-900/30"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{point}</span>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-12 bg-zinc-100/50 dark:bg-zinc-900/30 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto space-y-10">
                        {privacy.sections?.map((section: any, idx: number) => (
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
                                            <div key={i} className="bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 transition-all hover:bg-blue-600 hover:border-blue-700 hover:shadow-lg group/card">
                                                <h4 className="font-syne font-bold text-zinc-900 dark:text-white mb-2 group-hover/card:text-white transition-colors">{card.title}</h4>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed group-hover/card:!text-white transition-colors">
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

            {/* CTA Section */}
            {privacy.cta && (
                <section className="py-24 bg-white dark:bg-zinc-950 relative overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="max-w-5xl mx-auto bg-gradient-to-r from-[#141d72] to-[#0d6efd] rounded-[3rem] p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                            <div className="relative z-10 space-y-8">
                                <h3 className="text-3xl md:text-5xl font-syne font-black">{privacy.cta.title}</h3>
                                <p className="text-xl text-white/80 max-w-2xl mx-auto font-dm-sans !text-white">
                                    {privacy.cta.description}
                                </p>
                                <Link
                                    href={`/${lang}/contact`}
                                    className="group inline-flex items-center gap-4 bg-white text-blue-600 px-10 py-5 rounded-2xl font-black transition-all hover:scale-105 shadow-xl hover:shadow-white/20"
                                >
                                    {privacy.cta.button_text}
                                    <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-2 ${isRtl ? 'rotate-180 group-hover:-translate-x-2' : ''}`} />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Final Footer / Last Updated */}
            {/* <section className="py-12 bg-[#0d6efd] text-white text-center relative overflow-hidden">
                    <div className="container mx-auto px-6 max-w-4xl relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md mb-8 rotate-[-12deg]">
                            <Star className="w-8 h-8 text-white fill-white" />
                        </div>
                        <p className="text-lg md:text-xl font-syne font-bold opacity-80 uppercase tracking-[0.2em]">
                            {privacy.last_updated}
                        </p>
                    </div>
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
                </section> */}

            <Newsletter lang={lang} dict={dict} />
        </main>
    );
}
