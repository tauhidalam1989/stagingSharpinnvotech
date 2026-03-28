'use client'

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/lib/get-dictionary';

export default function ServiceSection({ lang, dict }: { lang: Locale; dict: any }) {
    const services = dict.core_services || [];
    const [activeIndex, setActiveIndex] = useState(0);
    const isRtl = lang === 'ar';

    const activeService = services[activeIndex] || services[0];

    return (
        <section className="pt-0 pb-10 bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="container mx-auto px-6 md:px-16 lg:px-24 max-w-7xl">
                {/* Angular-style vertical tabs layout */}
                <div className={`flex flex-col lg:flex-row gap-8 items-start ${isRtl ? 'lg:flex-row-reverse' : ''}`}>

                    {/* Left side: Service Tabs */}
                    <div className={`w-full lg:w-[320px] shrink-0 ${isRtl ? 'lg:border-l lg:pl-6' : 'lg:border-r lg:pr-6'} border-zinc-100 dark:border-zinc-800`}>
                        <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-1 no-scrollbar scroll-smooth">
                            {services.map((service: any, index: number) => (
                                <button
                                    key={index}
                                    suppressHydrationWarning
                                    onClick={() => setActiveIndex(index)}
                                    className={`flex-none lg:w-full flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-2.5 lg:py-3 transition-all duration-300 relative group
                                        ${index === activeIndex
                                            ? `bg-blue-50/50 text-[#0d6efd] ${isRtl ? 'border-b-2 lg:border-b-0 lg:border-r-4' : 'border-b-2 lg:border-b-0 lg:border-l-4'} border-blue-600`
                                            : `text-zinc-500 hover:bg-[#0d6efd] hover:text-white border-transparent ${isRtl ? 'lg:border-r-4' : 'lg:border-l-4'}`
                                        }`}
                                >
                                    <div className={`flex h-6 w-6 lg:h-8 lg:w-8 shrink-0 items-center justify-center transition-all duration-300 ${index === activeIndex ? 'opacity-100' : 'opacity-60 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert'}`}>
                                        <Image
                                            src={service.icon}
                                            alt={service.title}
                                            width={32}
                                            height={32}
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                    {/* <span className={`font-bold text-sm lg:text-sm whitespace-nowrap ${isRtl ? 'lg:text-right' : 'lg:text-left'}`}>
                                        {service.title}
                                    </span> */}
                                    <span className={`font-bold lg:font-normal text-sm lg:text-sm whitespace-nowrap ${isRtl ? 'lg:text-right' : 'lg:text-left'}`}>
                                        {service.title}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right side: Active Service Content */}
                    <div className="flex-1 min-w-0">
                        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                            {/* Content Stack (Text on top, Image at bottom - Angular style) */}
                            <div className="flex flex-col gap-4">

                                <div className="space-y-3">
                                    <h3 className="text-3xl font-bold text-[#1363C6] leading-tight" suppressHydrationWarning={true}>
                                        {activeService?.title}
                                    </h3>
                                    {/* <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[17px]"> */}
                                    <p className="text-sm md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal mb-6 max-w-3xl">
                                        {activeService?.description}
                                    </p>

                                    <div className="pt-4">
                                        <Link
                                            href={`/${lang}/services`}
                                            className="inline-flex items-center gap-3 bg-[#1363C6] text-white px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-[#0d4fa3] hover:-translate-y-1 transition-all shadow-lg shadow-blue-600/20"
                                        >
                                            {isRtl ? 'استكشف المزيد' : 'Explore More'}
                                            <i className={`fas ${isRtl ? 'fa-arrow-left' : 'fa-arrow-right'} text-xs`}></i>
                                        </Link>
                                    </div>
                                </div>

                                {/* Banner/Tech Graphic Image - Centered and Below Text */}
                                {/* <div className="relative group max-w-xl mx-auto w-full">
                                    <div className="relative z-10 overflow-hidden rounded-2xl">
                                        <Image
                                            src={activeService?.img || '/img/artificial intelligence.png'}
                                            alt={activeService?.title}
                                            width={600}
                                            height={350}
                                            className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="absolute -inset-4 bg-blue-50/50 -z-10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                </div> */}

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
