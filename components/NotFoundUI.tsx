'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

export default function NotFoundUI({ lang, dict }: { lang: string; dict: any }) {
    const isRtl = lang === 'ar';
    const t = dict?.NOT_FOUND || {
        TITLE: "404 - Page Not Found",
        SUBTITLE: "Oops! It seems you've wandered into a digital void.",
        DESCRIPTION: "The page you're looking for doesn't exist or has been moved. Don't worry, even the best explorers get lost sometimes.",
        BACK_TO_HOME: "Home Page",
        EXPLORE_SOLUTIONS: "Explore Our Solutions",
        NEED_HELP: "Still Need Assistance?",
        LATEST_UPDATES: "Check Our Latest Highlights",
        CONTACT_US: "Contact Support",
        SEARCH_READY: "Our team is ready to help you find what you need.",
        HOME_BUTTON: "Home"
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        }
    };

    return (
        <div className={`w-full overflow-hidden ${isRtl ? 'font-arabic' : 'font-sans'}`} dir={isRtl ? 'rtl' : 'ltr'}>

            {/* Hero 404 Section - Deep Blue for Navbar Visibility */}
            <section className="relative min-h-[70vh] flex items-center justify-center pt-32 pb-20 px-6 bg-[#0d6efd] overflow-hidden">
                {/* Visual Enhancements */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="relative inline-block mb-4"
                    >
                        <h1 className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem] font-syne font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 leading-none select-none tracking-tighter drop-shadow-2xl">
                            404
                        </h1>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10">
                            <div className="w-full h-full bg-white opacity-10 blur-[80px] rounded-full scale-110"></div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-2xl mx-auto"
                    >
                        <motion.h2
                            variants={itemVariants}
                            className="font-syne text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
                        >
                            {t.SUBTITLE}
                        </motion.h2>
                        <motion.p
                            variants={itemVariants}
                            className="font-dm-sans text-lg md:text-xl text-white/80 mb-10 leading-relaxed font-light !text-white"
                        >
                            {t.DESCRIPTION}
                        </motion.p>
                        <motion.div variants={itemVariants}>
                            <Link
                                href={`/${lang}`}
                                className="group inline-flex items-center gap-3 bg-white text-[#0d6efd] px-10 py-4 rounded-2xl font-bold transition-all duration-300 hover:bg-cyan-400 hover:text-white hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/30"
                            >
                                <i className={`fas ${isRtl ? 'fa-arrow-right' : 'fa-arrow-left'} transition-transform group-hover:-translate-x-1 translate-x-0`}></i>
                                {t.BACK_TO_HOME}
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Explore Solutions Section */}
            <section className="bg-white dark:bg-zinc-950 py-24 px-6 relative">
                <div className="container mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h3 className="font-syne text-2xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">
                            {t.EXPLORE_SOLUTIONS}
                        </h3>
                        <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Link href={`/${lang}/services`} className="group relative p-10 rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all duration-500 hover:-translate-y-2 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.2)] overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] transition-all duration-500 group-hover:scale-150"></div>
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                <i className="fas fa-rocket text-2xl group-hover:scale-110 group-hover:rotate-12 transition-transform"></i>
                            </div>
                            <h4 className="font-syne text-2xl font-bold text-zinc-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">AI Solutions</h4>
                            <p className="font-dm-sans text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">Discover our cutting-edge AI products and services for various industries.</p>
                        </Link>

                        <Link href={`/${lang}/about`} className="group relative p-10 rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all duration-500 hover:-translate-y-2 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.2)] overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] transition-all duration-500 group-hover:scale-150"></div>
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                <i className="fas fa-building text-2xl group-hover:scale-110 group-hover:rotate-12 transition-transform"></i>
                            </div>
                            <h4 className="font-syne text-2xl font-bold text-zinc-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">About SIIT</h4>
                            <p className="font-dm-sans text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">Learn about our mission, vision and how we align with Saudi Vision 2030.</p>
                        </Link>

                        <Link href={`/${lang}/careers`} className="group relative p-10 rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 transition-all duration-500 hover:-translate-y-2 hover:bg-white dark:hover:bg-zinc-800 hover:shadow-[0_20px_50px_-20px_rgba(59,130,246,0.2)] overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] transition-all duration-500 group-hover:scale-150"></div>
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                <i className="fas fa-users text-2xl group-hover:scale-110 group-hover:rotate-12 transition-transform"></i>
                            </div>
                            <h4 className="font-syne text-2xl font-bold text-zinc-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">Grow With Us</h4>
                            <p className="font-dm-sans text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">Check out our latest job openings and join our innovative team.</p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Help & Support Banner - High Impact */}
            <section className="py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="relative rounded-[40px] bg-[#0d6efd] overflow-hidden p-12 md:p-20 text-center shadow-2xl">
                        {/* Background patterns */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-[-20deg] translate-x-1/2"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 border-[40px] border-blue-500/10 rounded-full"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h3 className="font-syne text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                                {t.NEED_HELP}
                            </h3>
                            <p className="font-dm-sans text-zinc-400 text-lg md:text-xl mb-12 font-light leading-relaxed !text-white">
                                {t.SEARCH_READY}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Link href={`/${lang}/contact`} className="group inline-flex items-center justify-center gap-3 bg-white text-zinc-900 px-10 py-5 rounded-2xl font-bold transition-all duration-300 hover:bg-black hover:text-white hover:scale-105 active:scale-95 shadow-xl">
                                    <i className="fas fa-comment-dots"></i>
                                    {t.CONTACT_US}
                                </Link>
                                <Link href={`/${lang}/faq`} className="group inline-flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white px-10 py-5 rounded-2xl font-bold transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 backdrop-blur-sm">
                                    <i className="fas fa-question-circle"></i>
                                    Visit Help Center
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
