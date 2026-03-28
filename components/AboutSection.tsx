import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/lib/get-dictionary';

export default function AboutSection({ lang, dict }: { lang: Locale; dict: any }) {
    const isRtl = lang === 'ar';
    const aboutImage = isRtl ? '/img/Arabic.svg' : '/img/English.svg';

    return (
        <section className="pt-0 pb-4 bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 md:px-16 lg:px-24">
                <div className={`grid grid-cols-1 gap-8 lg:gap-10 lg:grid-cols-12 lg:items-start ${isRtl ? 'lg:flex-row-reverse' : ''}`}>

                    {/* Left side: Image Cluster */}
                    <div className="lg:col-span-6 relative">
                        <div className="relative z-10 w-full group">
                            <Image
                                src={aboutImage}
                                alt="Sharp Innovations Specializations"
                                width={800}
                                height={1000}
                                className="h-auto w-full drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                                priority
                            />
                        </div>
                    </div>

                    {/* Right side: Welcome Content */}
                    <div className="lg:col-span-6 space-y-4 lg:pl-8">
                        <div className={`flex ${isRtl ? 'justify-end' : 'justify-start'}`}>
                            <div className="inline-block rounded-full border border-[#0d6efd]/20 bg-blue-50/50 px-4 py-1.5 text-xs font-bold text-[#0d6efd]">
                                {dict.ABOUT_US || (isRtl ? 'نبذة عنا' : 'About Us')}
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-[#1c1c1c] dark:text-white leading-[1.2]">
                            {dict.WELCOME_MESSAGE || (isRtl ? 'مرحباً بكم في شركة ابتكارات حادة لتكنولوجيا المعلومات' : 'Welcome to Sharp Innovations Company for Information Technology')}
                        </h1>
                        <div className={`space-y-3 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
                            <p className="text-sm md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal mb-6 max-w-3xl">{dict.about_page?.p1}</p>
                            <p className="text-sm md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal mb-6 max-w-3xl">{dict.about_page?.p2}</p>
                            <p className="text-sm md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal mb-6 max-w-3xl">{dict.about_page?.p3}</p>
                        </div>

                        <div className={`flex flex-wrap items-center gap-6 pt-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                            <Link
                                href={`/${lang}/about`}
                                className="bg-[#0d6efd] text-white px-10 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:scale-105 transition-all"
                            >
                                {dict.READ_MORE || 'Read More'}
                            </Link>

                            {/* <div className="flex items-center gap-4">
                                <a href="https://x.com/sharpInnvo1351" target="_blank" className="h-10 w-10 flex items-center justify-center rounded-full border border-zinc-200 text-[#0d6efd] hover:bg-[#0d6efd] hover:text-white hover:border-transparent transition-all shadow-sm"><i className="fab fa-twitter text-sm"></i></a>
                                <a href="https://www.facebook.com/profile.php?id=61556338118947" target="_blank" className="h-10 w-10 flex items-center justify-center rounded-full border border-zinc-200 text-[#0d6efd] hover:bg-[#0d6efd] hover:text-white hover:border-transparent transition-all shadow-sm"><i className="fab fa-facebook-f text-sm"></i></a>
                                <a href="https://www.instagram.com/sharpinnovations2104/" target="_blank" className="h-10 w-10 flex items-center justify-center rounded-full border border-zinc-200 text-[#0d6efd] hover:bg-[#0d6efd] hover:text-white hover:border-transparent transition-all shadow-sm"><i className="fab fa-instagram text-sm"></i></a>
                                <a href="https://www.linkedin.com/company/sharp-innovations" target="_blank" className="h-10 w-10 flex items-center justify-center rounded-full border border-zinc-200 text-[#0d6efd] hover:bg-[#0d6efd] hover:text-white hover:border-transparent transition-all shadow-sm"><i className="fab fa-linkedin-in text-sm"></i></a>
                            </div> */}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
