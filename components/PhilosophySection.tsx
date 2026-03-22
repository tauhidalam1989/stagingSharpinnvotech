import Image from 'next/image';
import { Locale } from '@/lib/get-dictionary';

export default function PhilosophySection({ lang, dict }: { lang: Locale; dict: any }) {
    const isRtl = lang === 'ar';

    const philosophyPoints = [
        dict.FEATURESS?.FEATURE_ONE || (isRtl ? 'ثقة عبر القارات' : 'Trusted across continents'),
        dict.FEATURESS?.FEATURE_TWO || (isRtl ? 'دقة مدفوعة بالاستراتيجية' : 'Strategy-driven precision'),
        isRtl ? 'خبرة تقنية عميقة' : 'Deep technical expertise',
        isRtl ? 'شراكة حقيقية' : 'Genuine partnership',
    ];

    return (
        <section className="relative py-24 bg-[#212529] text-white overflow-hidden">
            {/* Background Pattern Layer */}

            <div className="container relative z-10 mx-auto px-4 md:px-6 lg:px-6">
                <div
                    className="absolute inset-0 z-0 opacity-40 pointer-events-none"
                    style={{
                        backgroundImage: 'url("/img/bg-hero.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">

                    <div className="lg:col-span-7 space-y-8">
                        <div className={`inline-block rounded-full border border-white/20 bg-white/5 px-6 py-1.5 text-sm font-semibold backdrop-blur-sm ${isRtl ? 'text-right' : 'text-left'}`}>
                            {dict.FEATURESS?.WHY_CHOOSE_US || 'Why Choose Sharp Innovations?'}
                        </div>
                        <h2 className={`text-4xl md:text-4xl font-black tracking-tight leading-tight ${isRtl ? 'text-right' : 'text-left'}`}>
                            {dict.FEATURESS?.TITLE || (isRtl ? 'نحن شركة شارب إينوفيشنز لتكنولوجيا المعلومات' : 'We Are Sharp Innovations Company')}
                        </h2>
                        <p className={`text-sm md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed !text-white font-normal mb-6 max-w-3xl ${isRtl ? 'text-right' : 'text-left'}`}>
                            {dict.FEATURESS?.DESCRIPTION}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {philosophyPoints.map((point, index) => (
                                <div key={index} className={`flex items-start gap-4 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0d6efd] text-white mt-0.5">
                                        <i className="fas fa-check text-[8px]"></i>
                                    </div>
                                    <p className="text-zinc-300 !text-white font-medium">{point}</p>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Stats Cards - Angular Design */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-10">
                            <div className={`flex items-center gap-6 rounded-2xl bg-white/5 p-8 backdrop-blur-md border border-white/10 group hover:bg-white/10 transition-colors ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                                <div className="h-20 w-20 flex items-center justify-center rounded-full bg-white/10 text-[#0d6efd] group-hover:scale-110 transition-transform">
                                    <i className="far fa-smile-beam text-5xl"></i>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black">50+</span>
                                    <span className="text-sm font-medium text-zinc-400 !text-white capitalize">
                                        {dict.FEATURESS?.HAPPY_CLIENTS || 'Happy Clients'}
                                    </span>
                                </div>
                            </div>

                            <div className={`flex items-center gap-6 rounded-2xl bg-white/5 p-8 backdrop-blur-md border border-white/10 group hover:bg-white/10 transition-colors ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                                <div className="h-20 w-20 flex items-center justify-center rounded-2xl bg-white/10 text-[#0d6efd] group-hover:scale-110 transition-transform">
                                    <i className="fas fa-briefcase text-4xl"></i>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black">100+</span>
                                    <span className="text-sm font-medium text-zinc-400 !text-white capitalize">
                                        {dict.FEATURESS?.PROJECT_COMPLETE || 'Projects Completed'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
                        <div className="relative z-10 w-full group">
                            <div className="absolute -inset-4 bg-[#0d6efd]/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <Image
                                src="/img/IT.svg"
                                alt="Sharp Philosophy"
                                width={800}
                                height={800}
                                className="h-auto w-full relative z-10 drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
