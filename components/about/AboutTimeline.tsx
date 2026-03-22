'use client';

import React from 'react';
import { Locale } from '@/lib/get-dictionary';

interface AboutTimelineProps {
    lang: string;
    dict: any;
}

export default function AboutTimeline({ lang, dict }: AboutTimelineProps) {
    const isRtl = lang === 'ar';
    const content = dict.about_redesign?.journey || {
        badge: "Our Journey",
        title: "How We Got Here",
        subtitle: "From a bold idea in Riyadh to a growing force in regional technology — our story is still being written.",
        timeline: [
            { "year": "2023 — Q1", "title": "Company Founded", "desc": "Sharp Innovations was established in Riyadh by a team of experienced technology and business professionals with a shared vision to transform how organizations leverage technology." },
            { "year": "2023 — Q3", "title": "First Major Client Wins", "desc": "Secured partnerships with key government and enterprise clients, delivering our first AI and cybersecurity projects and establishing our reputation for technical depth and reliability." },
            { "year": "2024", "title": "Strategic Partnerships Formed", "desc": "Formalized technology alliances with HP, Oracle, Trend Micro, and Odoo — expanding our portfolio and enabling us to deliver more comprehensive, integrated solutions to clients." },
            { "year": "2025 — Present", "title": "100+ Projects & Growing", "desc": "Crossed the milestone of 100 successful project deliveries across AI, cybersecurity, GIS, fleet management, and enterprise software — serving 50+ satisfied clients across multiple sectors." }
        ]
    };

    return (
        <section className="bg-white py-24 lg:py-32 px-6">
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

                <div className="relative mt-16">
                    {/* Vertical Line */}
                    <div className={`absolute ${isRtl ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#1650C8] via-[#06B6D4] to-transparent hidden md:block`} />

                    <div className="space-y-12 md:space-y-24">
                        {content.timeline.map((item: any, idx: number) => {
                            const isEven = idx % 2 === 1;
                            return (
                                <div key={idx} className={`relative flex flex-col md:flex-row items-center justify-center gap-0 md:gap-16 ${isEven ? 'md:flex-row-reverse' : ''} fade-up`}>
                                    {/* Content Card */}
                                    <div className={`w-full md:w-[calc(50%-40px)] group`}>
                                        <div className={`bg-blue-50 p-8 rounded-2xl border border-gray-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:bg-white hover:border-[#1650C8]/20 group-hover:scale-[1.02] text-start`}>
                                            <div className="text-[12px] font-bold text-[#1650C8] tracking-widest uppercase mb-2 font-syne opacity-80">{item.year}</div>
                                            <h4 className="text-xl font-bold text-[#060E24] mb-3 font-syne">{item.title}</h4>
                                            <p className="text-gray-500 text-sm leading-relaxed font-light">{item.desc}</p>
                                        </div>
                                    </div>

                                    {/* Middle Dot */}
                                    <div className={`hidden md:flex absolute ${isRtl ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} top-1/2 -translate-y-1/2 h-10 w-10 bg-[#1650C8] rounded-full z-10 items-center justify-center shadow-[0_0_0_6px_rgba(22,80,200,0.15)] transition-transform duration-300 group-hover:scale-110`}>
                                        <svg className="w-5 h-5 stroke-white fill-none stroke-[2]" viewBox="0 0 24 24">
                                            {idx === 0 && <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />}
                                            {idx === 1 && (
                                                <>
                                                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                                                </>
                                            )}
                                            {idx === 2 && (
                                                <>
                                                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                                                </>
                                            )}
                                            {idx === 3 && <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />}
                                        </svg>
                                    </div>

                                    {/* Empty Side for Grid Alignment */}
                                    <div className="hidden md:block w-full md:w-[calc(50%-40px)]" />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
