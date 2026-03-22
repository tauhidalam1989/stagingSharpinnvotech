'use client';

import React from 'react';
import { Locale } from '@/lib/get-dictionary';

interface AboutValuesProps {
    lang: string;
    dict: any;
}

export default function AboutValues({ lang, dict }: AboutValuesProps) {
    const isRtl = lang === 'ar';
    const content = dict.about_redesign?.values || {
        badge: "What We Stand For",
        title: "Our Core Values",
        subtitle: "The principles that guide how we work, how we think, and how we treat every client and partner.",
        list: [
            { icon: "innovation", title: "Innovation", desc: "Constantly exploring new frontiers to deliver smarter, more powerful solutions." },
            { icon: "integrity", title: "Integrity", desc: "Honesty and transparency in every promise, every proposal, and every interaction." },
            { icon: "excellence", title: "Excellence", desc: "Setting the highest bar for quality — in code, in service, and in outcomes." },
            { icon: "security", title: "Security", desc: "Treating every client's data and infrastructure as if it were our own — with zero compromise." },
            { icon: "partnership", title: "Partnership", desc: "We succeed only when our clients succeed — that's not a tagline, it's how we operate." }
        ]
    };

    const icons: any = {
        innovation: (
            <svg viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        ),
        integrity: (
            <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        ),
        excellence: (
            <svg viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        ),
        security: (
            <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
        ),
        partnership: (
            <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
        )
    };

    const valueIconsOrder = ["innovation", "integrity", "excellence", "security", "partnership"];

    return (
        <section className="bg-[#060E24] py-24 lg:py-32 px-6 relative overflow-hidden">
            {/* Dot Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.12] pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(22,80,200,1) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

            <div className="container mx-auto relative z-10">
                <div className="text-center mb-20 fade-up">
                    <div className="inline-block border border-[#1650C8]/50 bg-[#1650C8]/10 text-[#38BDF8] text-[11px] font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4">
                        {content.badge}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 font-syne">
                        {content.title}
                    </h2>
                    <p className="text-white/40 max-w-xl mx-auto font-light !text-white leading-relaxed">
                        {content.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {content.list.map((value: any, idx: number) => (
                        <div key={idx} className="group bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 py-10 flex flex-col items-center text-center transition-all duration-300 hover:bg-[#1650C8]/15 hover:border-[#1650C8]/50 hover:-translate-y-2 fade-up">
                            <div className="h-14 w-14 bg-[#1650C8]/20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
                                <div className="w-7 h-7 stroke-[#38BDF8] fill-none stroke-[1.5]">
                                    {icons[valueIconsOrder[idx]]}
                                </div>
                            </div>
                            <h4 className="text-white text-lg font-bold mb-3 font-syne">{value.title}</h4>
                            <p className="text-white/40 text-sm leading-relaxed !text-white font-light">{value.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
