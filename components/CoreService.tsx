'use client'

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/lib/get-dictionary';

export default function CoreService({ lang, dict }: { lang: Locale; dict: any }) {
    const isRtl = lang === 'ar';
    const services = dict.core_services || [];
    const [activeTab, setActiveTab] = useState(0);

    const selectedService = services[activeTab];

    if (!services || services.length === 0) return null;

    return (
        <section className="py-24 bg-[#F4F7FE] dark:bg-zinc-900 overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Tabs Sidebar */}
                    <div className="lg:w-1/3 flex flex-col gap-3">
                        {services.map((service: any, index: number) => (
                            <div
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`
                                    flex items-center gap-4 px-6 py-5 rounded-lg cursor-pointer transition-all duration-300
                                    ${activeTab === index
                                        ? 'bg-[#0d6efd] text-white shadow-lg ' + (isRtl ? '-translate-x-2' : 'translate-x-2')
                                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-sm'}
                                `}
                            >
                                <div className={`w-10 h-10 flex items-center justify-center rounded-full ${activeTab === index ? 'bg-white/20' : 'bg-[#F4F7FE] dark:bg-zinc-900'}`}>
                                    <Image
                                        src={service.icon}
                                        alt={service.title}
                                        width={24}
                                        height={24}
                                        className={activeTab === index ? 'brightness-0 invert' : ''}
                                    />
                                </div>
                                <span className="font-bold text-sm uppercase tracking-wide">{service.title}</span>
                            </div>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="lg:w-2/3 bg-white dark:bg-zinc-800 rounded-2xl p-8 md:p-12 shadow-xl shadow-blue-500/5 min-h-[420px] flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2 space-y-6">
                            <h2 className="text-3xl font-black text-[#14183e] dark:text-white leading-tight">
                                {selectedService?.title}
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                                {selectedService?.description}
                            </p>
                            <Link
                                href={`/${lang}${selectedService?.path || '#'}`}
                                className="inline-flex items-center gap-2 text-[#0d6efd] font-black text-sm uppercase tracking-widest group"
                            >
                                {isRtl ? 'استكشف المزيد' : 'Explore More'}
                                <i className={`fas fa-arrow-${isRtl ? 'left' : 'right'} transition-transform group-hover:${isRtl ? '-translate-x-1' : 'translate-x-1'}`}></i>
                            </Link>
                        </div>
                        <div className="md:w-1/2 relative group">
                            {selectedService?.img && (
                                <Image
                                    src={selectedService.img}
                                    alt={selectedService.title}
                                    width={500}
                                    height={400}
                                    className="w-full h-auto drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
