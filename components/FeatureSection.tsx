import Image from 'next/image';
import { Locale } from '@/lib/get-dictionary';

export default function FeatureSection({ lang, dict }: { lang: Locale; dict: any }) {
    const isRtl = lang === 'ar';
    const features = [
        dict.FEATURESS.FEATURE_ONE,
        dict.FEATURESS.FEATURE_TWO,
    ];

    return (
        <section className="relative py-24 bg-[#14183e] text-white overflow-hidden">
            <div
                className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'url("/img/bg-hero.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 gap-12 lg:gap-16 lg:grid-cols-2 lg:items-center">
                    <div className="space-y-8">
                        <div className="inline-block rounded-full border border-[#0d6efd] text-[#0d6efd] px-4 py-1.5 text-sm font-semibold">
                            {dict.FEATURESS.WHY_CHOOSE_US}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                            {dict.FEATURESS.TITLE}
                        </h2>
                        <p className="text-zinc-300 leading-relaxed max-w-xl text-lg opacity-80">
                            {dict.FEATURESS.DESCRIPTION}
                        </p>

                        <div className="space-y-4">
                            {features.map((feature: any, index: number) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0d6efd]">
                                        <i className="fas fa-check text-[10px] text-white"></i>
                                    </div>
                                    <p className="text-zinc-300 text-sm leading-relaxed">{feature}</p>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Stats Cards */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-8">
                            <div className="flex items-center gap-4 sm:gap-6 rounded-2xl bg-white/5 p-6 sm:p-8 backdrop-blur-md border border-white/10 group transition-all duration-300 hover:bg-[#0d6efd]/10 hover:border-[#0d6efd]/30">
                                <div className="h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded-full bg-white/10 text-[#0d6efd] group-hover:scale-110 group-hover:bg-[#0d6efd] group-hover:text-white transition-all duration-300 text-2xl sm:text-4xl">
                                    <i className="far fa-smile-beam"></i>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl sm:text-4xl font-black">50+</span>
                                    <span className="text-[10px] sm:text-xs font-bold text-zinc-400 tracking-wider">
                                        {dict.FEATURESS.HAPPY_CLIENTS}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 sm:gap-6 rounded-2xl bg-white/5 p-6 sm:p-8 backdrop-blur-md border border-white/10 group transition-all duration-300 hover:bg-[#0d6efd]/10 hover:border-[#0d6efd]/30">
                                <div className="h-12 w-12 sm:h-16 sm:w-16 flex items-center justify-center rounded-full bg-white/10 text-[#0d6efd] group-hover:scale-110 group-hover:bg-[#0d6efd] group-hover:text-white transition-all duration-300 text-xl sm:text-3xl">
                                    <i className="fas fa-briefcase"></i>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl sm:text-4xl font-black">100+</span>
                                    <span className="text-[10px] sm:text-xs font-bold text-zinc-400 tracking-wider">
                                        {dict.FEATURESS.PROJECT_COMPLETE}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side Image */}
                    <div className="relative group">
                        <div className="relative z-10 w-full transform transition-all duration-700 group-hover:scale-105">
                            <Image
                                src="/img/IT.svg"
                                alt="Sharp Innovations IT"
                                width={800}
                                height={600}
                                className="h-auto w-full drop-shadow-[0_0_50px_rgba(13,110,253,0.3)]"
                                priority
                            />
                        </div>
                        <div className="absolute top-1/2 left-1/2 -z-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}
