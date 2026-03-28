'use client';

import React from 'react';
import { Locale } from '@/lib/get-dictionary';

interface AboutStoryProps {
    lang: string;
    dict: any;
}

export default function AboutStory({ lang, dict }: AboutStoryProps) {
    const isRtl = lang === 'ar';
    const content = dict.about_redesign?.story || {
        badge: "Our Story",
        year: "2023",
        card_title: "Our Foundation",
        card_desc: "Sharp Innovations was born from a vision — to bring enterprise-grade technology to every business in the Kingdom, regardless of size or sector.",
        location: "Riyadh, Saudi Arabia",
        title: "A Company Built with Purpose",
        p1: "Sharp Innovations was founded in 2023 by a group of industry veterans who saw a clear gap in the Saudi market — businesses needed a reliable, deeply technical partner who could deliver real transformation, not just technology.",
        p2: "From our headquarters in Riyadh, we have grown into a trusted name across government and private sectors, delivering solutions in Artificial Intelligence, Cybersecurity, Automation, and Application Services that directly contribute to Saudi Arabia's Vision 2030.",
        p3: "We don't believe in one-size-fits-all. Every engagement begins with listening — understanding the unique challenges, goals, and context of each client before a single line of code is written.",
        highlight: "\"Our mission is not to sell technology — it's to solve problems, build trust, and create measurable value for every organization we serve.\""
    };

    return (
        <section className="bg-white pt-16 pb-24 lg:pt-20 lg:pb-32 px-6">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Visual Card Side */}
                    <div className={`relative fade-up ${isRtl ? 'lg:order-last' : ''}`}>
                        <div className="bg-[#060E24] rounded-3xl p-10 lg:p-14 relative overflow-hidden shadow-2xl">
                            {/* Accent Line */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1650C8] to-[#06B6D4] ${isRtl ? 'rotate-180' : ''}`} />

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                                    <svg className="w-7 h-7 stroke-[#38BDF8] fill-none stroke-[1.5]" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                                    </svg>
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-4 font-syne">{content.card_title}</h3>
                                <p className="text-white/50 text-base leading-relaxed !text-white font-light">{content.card_desc}</p>
                            </div>

                            {/* Ghost Year */}
                            <div className={`absolute bottom-4 ${isRtl ? 'left-8' : 'right-8'} text-white/[0.03] text-8xl lg:text-9xl font-black font-syne select-none`}>
                                {content.year}
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className={`absolute -bottom-10 lg:-bottom-16 ${isRtl ? 'left-4 lg:-left-6' : 'right-4 lg:-right-6'} bg-[#1650C8] rounded-xl lg:rounded-2xl px-6 py-4 lg:px-8 lg:py-6 shadow-2xl border border-white/10 z-20`}>
                            <div className="text-white text-2xl lg:text-3xl font-bold font-syne uppercase tracking-tighter">{content.location.split(',')[0]}</div>
                            <div className="text-white/70 text-xs lg:text-sm font-light mt-1">{content.location}</div>
                        </div>
                    </div>

                    {/* Text Content Side */}
                    <div className="text-start">
                        <div className="inline-block border border-[#1650C8]/30 text-[#1650C8] text-[11px] font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase mb-6">
                            {content.badge}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#060E24] leading-tight mb-8 font-syne">
                            {content.title}
                        </h2>

                        <div className="space-y-6 text-gray-600 font-light leading-relaxed text-sm">
                            <p>{content.p1}</p>
                            <p>{content.p2}</p>
                            <p>{content.p3}</p>
                        </div>

                        <div className={`mt-12 p-8 bg-gray-50 ${isRtl ? 'border-r-4' : 'border-l-4'} border-[#1650C8] ${isRtl ? 'rounded-l-2xl' : 'rounded-r-2xl'} italic text-[#060E24] font-medium leading-relaxed`}>
                            {content.highlight}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
