'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/get-dictionary';

interface AboutCTAProps {
    lang: string;
    dict: any;
}

export default function AboutCTA({ lang, dict }: AboutCTAProps) {
    const isRtl = lang === 'ar';
    const content = dict.about_redesign?.cta || {
        title: "Ready to Work with Sharp Innovations?",
        subtitle: "Let's discuss how we can help your organization grow, transform, and stay secure in a digital world.",
        contact: "Contact Us Today",
        explore: "Explore Our Services"
    };

    return (
        <section className="bg-[#1650C8] py-24 lg:py-32 px-6 text-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0F3A9A] via-[#1650C8] to-[#06B6D4]/30" />
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="container mx-auto relative z-10 fade-up">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 font-syne leading-tight">
                    {content.title}
                </h2>
                <p className="text-white/70 text-lg md:text-xl font-light max-w-2xl !text-white mx-auto mb-12">
                    {content.subtitle}
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                    <Link
                        href={`/${lang}/contact`}
                        className="bg-white text-[#1650C8] px-10 py-4 rounded-xl font-bold text-base shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
                    >
                        {content.contact}
                    </Link>
                    <Link
                        href={`/${lang}/services`}
                        className="bg-transparent text-white border-2 border-white/50 px-10 py-4 rounded-xl font-bold text-base transition-all duration-300 hover:bg-white/10 hover:border-white"
                    >
                        {content.explore}
                    </Link>
                </div>
            </div>
        </section>
    );
}
