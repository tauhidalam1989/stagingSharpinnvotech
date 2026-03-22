'use client';

import React from 'react';
import { Locale } from '@/lib/get-dictionary';

interface AboutHeroProps {
    lang: string;
    dict: any;
}

export default function AboutHero({ lang, dict }: AboutHeroProps) {
    const isRtl = lang === 'ar';
    const content = dict.about_redesign?.hero || {
        badge: "About Sharp Innovations",
        title: "Built to Innovate. Driven to Protect.",
        description: "We are a Riyadh-based technology company on a mission to empower businesses through intelligent, secure, and future-ready digital solutions.",
        stats: [
            { num: "2023", label: "Year Founded", suffix: "." },
            { num: "50", label: "Happy Clients", suffix: "+" },
            { num: "100", label: "Projects Delivered", suffix: "+" },
            { num: "5", label: "Core Specializations", suffix: "+" }
        ]
    };

    return (
        <section className="relative min-h-[520px] flex items-center bg-[#0d6efd] text-white px-6 pt-32 pb-24 lg:pt-40 lg:pb-40 overflow-hidden">
            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(white 1px, transparent 1px),
                        linear-gradient(90deg, white 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* Glow Effects */}
            <div className="absolute -top-[100px] -right-[100px] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_65%)] pointer-events-none" />
            <div className="absolute -bottom-[150px] left-[20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_65%)] pointer-events-none" />

            <div className="container mx-auto relative z-10">
                <div className={`max-w-[800px] ${isRtl ? 'mr-0 ml-auto' : ''}`}>
                    <div className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-4 py-1.5 rounded-full text-[12px] font-medium tracking-wider uppercase mb-8 animate-fade-in-up">
                        <span className="w-2 h-2 bg-[#06B6D4] rounded-full animate-pulse" />
                        {content.badge}
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 animate-fade-in-up animation-delay-100 text-start">
                        {isRtl ? (
                            <>نبتكر لـ <em className="not-italic text-[#38BDF8]">نطور.</em> نتحرك لـ نحمي.</>
                        ) : (
                            <>Built to <em className="not-italic text-[#38BDF8]">Innovate.</em><br />Driven to Protect.</>
                        )}
                    </h1>

                    <p className="text-base md:text-base text-white/70 leading-relaxed max-w-[600px] mb-12 font-light animate-fade-in-up animation-delay-200 !text-white text-start">
                        {content.description}
                    </p>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-12 border-t border-white/10 animate-fade-in-up animation-delay-300">
                        {content.stats.map((stat: any, idx: number) => {
                            const cardColors = [
                                'bg-[#060E24]',
                                'bg-[#060E24]',
                                'bg-[#060E24]',
                                'bg-[#060E24]'
                            ];
                            return (
                                <div
                                    key={idx}
                                    className={`p-6 rounded-2xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-[#060E24] hover:-translate-y-1 ${cardColors[idx % cardColors.length]} text-start`}
                                >
                                    <div className="text-3xl md:text-4xl font-bold font-syne mb-1">
                                        {stat.num}<span className="text-[#38BDF8]">{stat.suffix}</span>
                                    </div>
                                    <div className="text-[10px] md:text-[11px] text-white/60 font-light tracking-widest uppercase border-t border-white/10 pt-3">
                                        {stat.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
