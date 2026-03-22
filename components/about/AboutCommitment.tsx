'use client';

import React from 'react';
import { Locale } from '@/lib/get-dictionary';

interface AboutCommitmentProps {
    lang: string;
    dict: any;
}

export default function AboutCommitment({ lang, dict }: AboutCommitmentProps) {
    const isRtl = lang === 'ar';
    const content = dict.about_redesign?.commitment || {
        badge: "Our Promise",
        title: "What You Can Always Expect from Us",
        subtitle: "We hold ourselves to a standard that goes beyond the contract — because real partnerships are built on consistent action.",
        list: [
            { "title": "Tailored Solutions", "desc": "We never apply a template to your challenge. Every solution we design starts with a deep understanding of your specific context." },
            { "title": "End-to-End Ownership", "desc": "From discovery to deployment and beyond, we stay engaged. Our team takes full ownership of outcomes." },
            { "title": "Vision 2030 Alignment", "desc": "Every solution we build is designed with Saudi Arabia's digital transformation goals in mind." },
            { "title": "Transparent Communication", "desc": "No surprises. We keep stakeholders informed at every stage with clear reporting and proactive problem-solving." },
            { "title": "Post-Delivery Support", "desc": "Our relationship doesn't end at launch. We provide dedicated support and maintenance long after your solution goes live." },
            { "title": "Security by Default", "desc": "Security is never an afterthought in our process — it is embedded into architecture and development from day one." }
        ]
    };

    return (
        <section className="bg-[#eff6ff] py-24 lg:py-32 px-6">
            <div className="container mx-auto">
                <div className="text-center mb-20 fade-up">
                    <div className="inline-block border border-blue-200 bg-blue-50/50 text-blue-600 text-[11px] font-semibold px-4 py-1.5 rounded-full tracking-widest uppercase mb-4">
                        {content.badge}
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#060E24] leading-tight mb-4 font-syne">
                        {content.title}
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto font-light leading-relaxed">
                        {content.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {content.list.map((item: any, idx: number) => (
                        <div key={idx} className="group border border-gray-100 rounded-2xl p-10 relative bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-200 fade-up">
                            <div className="text-5xl font-extrabold text-[#1650C8]/5 mb-4 font-syne group-hover:text-[#1650C8]/20 transition-all duration-500 text-start">
                                0{idx + 1}
                            </div>
                            <h4 className="text-xl font-bold text-[#060E24] mb-4 font-syne text-start group-hover:text-[#1650C8] transition-colors duration-500">{item.title}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed font-light text-start">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
