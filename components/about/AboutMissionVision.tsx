'use client';

import React from 'react';
import { Locale } from '@/lib/get-dictionary';

interface AboutMissionVisionProps {
    lang: string;
    dict: any;
}

export default function AboutMissionVision({ lang, dict }: AboutMissionVisionProps) {
    const isRtl = lang === 'ar';
    const content = dict.about_redesign?.mv || {
        badge: "Purpose & Direction",
        title: "What Drives Us Every Day",
        subtitle: "Two guiding principles that shape every decision, every solution, and every relationship we build.",
        mission_title: "Our Mission",
        mission_desc: "To empower organizations across Saudi Arabia and the wider region by delivering innovative, secure, and intelligent technology solutions — built around the unique needs of each client and aligned with the ambitions of Vision 2030.",
        vision_title: "Our Vision",
        vision_desc: "To become the most trusted technology partner in the region — recognized not only for technical excellence but for the long-term impact we create for our clients, our people, and the digital economy of Saudi Arabia."
    };

    return (
        <section className="bg-gray-50 py-24 lg:py-32 px-6">
            <div className="container mx-auto">
                <div className="text-center mb-20 fade-up">
                    <div className="inline-block border border-[#1650C8]/30 text-[#1650C8] text-[11px] font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4">
                        {content.badge}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#060E24] leading-tight mb-4 font-syne">
                        {content.title}
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto font-light leading-relaxed">
                        {content.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Mission Card */}
                    <div className="group bg-white rounded-2xl p-10 lg:p-14 border border-gray-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl fade-up">
                        <div className={`absolute top-4 ${isRtl ? 'left-8' : 'right-8'} text-7xl lg:text-8xl font-black text-[#1650C8]/[0.05] select-none font-syne`}>01</div>
                        <div className="h-14 w-14 bg-[#1650C8]/10 rounded-2xl flex items-center justify-center mb-8">
                            <svg className="w-8 h-8 stroke-[#1650C8] fill-none stroke-[1.5]" viewBox="0 0 24 24">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-[#060E24] mb-6 font-syne text-start">{content.mission_title}</h3>
                        <p className="text-gray-500 leading-relaxed font-light text-start">{content.mission_desc}</p>

                        {/* Hover Accent */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1650C8] to-[#06B6D4] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${isRtl ? 'origin-right' : 'origin-left'}`} />
                    </div>

                    {/* Vision Card */}
                    <div className="group bg-white rounded-2xl p-10 lg:p-14 border border-gray-100 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl fade-up">
                        <div className={`absolute top-4 ${isRtl ? 'left-8' : 'right-8'} text-7xl lg:text-8xl font-black text-[#06B6D4]/[0.05] select-none font-syne`}>02</div>
                        <div className="h-14 w-14 bg-[#06B6D4]/10 rounded-2xl flex items-center justify-center mb-8">
                            <svg className="w-8 h-8 stroke-[#06B6D4] fill-none stroke-[1.5]" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-[#060E24] mb-6 font-syne text-start">{content.vision_title}</h3>
                        <p className="text-gray-500 leading-relaxed font-light text-start">{content.vision_desc}</p>

                        {/* Hover Accent */}
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1650C8] to-[#06B6D4] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${isRtl ? 'origin-right' : 'origin-left'}`} />
                    </div>
                </div>
            </div>
        </section>
    );
}
