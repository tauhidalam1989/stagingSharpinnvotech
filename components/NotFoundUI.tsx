'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

export default function NotFoundUI({ lang, dict }: { lang: string; dict: any }) {
    const isRtl = lang === 'ar';
    const t = dict?.NOT_FOUND || {
        TITLE: "404 - Page Not Found",
        SUBTITLE: "Oops! It seems you've wandered into a digital void.",
        DESCRIPTION: "The page you're looking for doesn't exist or has been moved. Don't worry, even the best explorers get lost sometimes.",
        BACK_TO_HOME: "Return to Base",
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
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    return (
        <div className={`min-h-screen flex flex-col bg-slate-50 ${isRtl ? 'font-arabic' : 'font-sans'}`}>
            {/* Header Matching Main Design */}
            <header className="sticky top-0 z-50 w-full bg-[#0d6efd] text-white shadow-sm transition-all duration-300">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo */}
                        <Link href={`/${lang}`} className="flex items-center gap-2">
                            <Image
                                src={lang === 'en' ? '/img/d1.png' : '/img/d2.png'}
                                alt="Sharp Innovations"
                                width={180}
                                height={60}
                                priority
                                className="h-[45px] sm:h-[60px] w-auto"
                            />
                        </Link>
                        
                        {/* Action Button */}
                        <Link 
                            href={`/${lang}`}
                            className="px-6 py-2 bg-white text-[#0d6efd] rounded-full font-bold hover:bg-blue-50 transition-all shadow-xl active:scale-95"
                        >
                            {t.BACK_TO_HOME}
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                {/* Hero 404 Section */}
                <section className="relative overflow-hidden pt-20 pb-12 px-6">
                    <div className="container mx-auto max-w-5xl text-center relative z-10">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative inline-block mb-8"
                        >
                            <h1 className="text-[12rem] md:text-[18rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-600 to-blue-200 leading-none select-none tracking-tighter">
                                404
                            </h1>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                                <div className="absolute top-0 left-0 w-full h-full animate-pulse bg-blue-400 opacity-20 blur-3xl rounded-full"></div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="max-w-2xl mx-auto"
                        >
                            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                {t.SUBTITLE}
                            </motion.h2>
                            <motion.p variants={itemVariants} className="text-lg text-slate-600 mb-10 leading-relaxed">
                                {t.DESCRIPTION}
                            </motion.p>
                            <motion.div variants={itemVariants}>
                                <Link 
                                    href={`/${lang}`}
                                    className="inline-flex items-center gap-2 text-blue-600 font-bold text-lg hover:underline decoration-2 underline-offset-8 transition-all"
                                >
                                    <i className={`fas ${isRtl ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
                                    {t.BACK_TO_HOME}
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>
                </section>

                {/* Additional Sections about the website */}
                <section className="bg-white py-24 px-6 border-y border-slate-100">
                    <div className="container mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.EXPLORE_SOLUTIONS}</h3>
                            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <Link href={`/${lang}/services`} className="group p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500">
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                    <i className="fas fa-rocket text-2xl"></i>
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-4">AI Solutions</h4>
                                <p className="text-slate-600 leading-relaxed">Discover our cutting-edge AI products and services for various industries.</p>
                            </Link>

                            <Link href={`/${lang}/about`} className="group p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500">
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                    <i className="fas fa-building text-2xl"></i>
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-4">About SIIT</h4>
                                <p className="text-slate-600 leading-relaxed">Learn about our mission, vision and how we align with Saudi Vision 2030.</p>
                            </Link>

                            <Link href={`/${lang}/careers`} className="group p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500">
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                    <i className="fas fa-users text-2xl"></i>
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-4">Grow With Us</h4>
                                <p className="text-slate-600 leading-relaxed">Check out our latest job openings and join our innovative team.</p>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Help Section */}
                <section className="bg-slate-900 py-24 px-6 relative overflow-hidden">
                    <div className="container mx-auto max-w-4xl text-center relative z-10">
                        <h3 className="text-3xl font-bold text-white mb-6">{t.NEED_HELP}</h3>
                        <p className="text-slate-300 text-lg mb-10">{t.SEARCH_READY}</p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <Link href={`/${lang}/contact`} className="px-10 py-4 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-100 transition-all active:scale-95 shadow-xl">
                                {t.CONTACT_US}
                            </Link>
                            <Link href={`/${lang}/faq`} className="px-10 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all active:scale-95">
                                Visit Help Center
                            </Link>
                        </div>
                    </div>
                    {/* Background Texture */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                </section>
            </main>
        </div>
    );
}
