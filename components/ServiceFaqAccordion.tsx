'use client';

import { useState } from 'react';
import { FAQItem } from '@/lib/api';
import { Locale } from '@/lib/get-dictionary';

interface ServiceFaqAccordionProps {
    faqs: FAQItem[];
    lang: Locale;
}

export default function ServiceFaqAccordion({ faqs, lang }: ServiceFaqAccordionProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    if (!faqs || faqs.length === 0) return null;

    const leftColumn = faqs.filter((_, i) => i % 2 === 0);
    const rightColumn = faqs.filter((_, i) => i % 2 !== 0);

    const renderFaqItem = (faq: FAQItem, index: number, isOriginalIndex: number) => (
        <div key={index} className="mb-[15px] overflow-hidden">
            <div
                onClick={() => toggleFaq(isOriginalIndex)}
                className={`w-full flex items-center justify-between p-4 md:p-5 text-left cursor-pointer transition-all duration-300 rounded-[2px] ${
                    activeIndex === isOriginalIndex ? 'text-white' : 'text-zinc-800'
                }`}
                style={{
                    backgroundColor: activeIndex === isOriginalIndex ? '#0d6efd' : '#F4F7FE'
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        toggleFaq(isOriginalIndex);
                    }
                }}
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
                <span className="text-sm font-bold">
                    {lang === 'ar' ? faq.questionAr : faq.question}
                </span>
                <span className={`flex-shrink-0 transition-all duration-300 ${lang === 'ar' ? 'mr-4' : 'ml-4'} ${
                    activeIndex === isOriginalIndex ? 'rotate-180 text-white' : 'text-zinc-400 rotate-0'
                }`}>
                    <i className="fas fa-chevron-down" />
                </span>
            </div>
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: activeIndex === isOriginalIndex ? '1000px' : '0',
                    opacity: activeIndex === isOriginalIndex ? '1' : '0',
                    visibility: activeIndex === isOriginalIndex ? 'visible' : 'hidden',
                    backgroundColor: '#ffffff'
                }}
            >
                <div className="p-[15px] pt-[15px] text-zinc-600 leading-relaxed text-sm" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {lang === 'ar' ? faq.answerAr : faq.answer}
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 w-full max-w-[1400px] mx-auto">
            <div className="flex flex-col">
                {leftColumn.map((faq, i) => renderFaqItem(faq, i, i * 2))}
            </div>
            <div className="flex flex-col">
                {rightColumn.map((faq, i) => renderFaqItem(faq, i, i * 2 + 1))}
            </div>
        </div>
    );
}
