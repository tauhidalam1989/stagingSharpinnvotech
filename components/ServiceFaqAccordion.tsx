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
        <div 
            key={index}
            className={`bg-[#ebf1ff] dark:bg-zinc-900/50 rounded-lg transition-all duration-300 h-fit ${
                activeIndex === isOriginalIndex 
                ? 'ring-1 ring-blue-400/30 shadow-sm' 
                : 'border-transparent'
            }`}
        >
            <button
                onClick={() => toggleFaq(isOriginalIndex)}
                className="w-full px-5 py-4 flex items-center justify-between text-left gap-4"
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
                <h3 className={`font-semibold text-sm md:text-base tracking-tight transition-colors ${
                    activeIndex === isOriginalIndex ? 'text-blue-700 dark:text-blue-400' : 'text-zinc-800 dark:text-zinc-200'
                }`}>
                    {lang === 'ar' ? faq.questionAr : faq.question}
                </h3>
                <div className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center transition-all duration-300 ${
                    activeIndex === isOriginalIndex ? 'bg-blue-600 text-white' : 'bg-blue-100 dark:bg-zinc-800 text-blue-600'
                }`}>
                    <i className={`fas ${activeIndex === isOriginalIndex ? 'fa-minus' : 'fa-plus'} text-[10px]`}></i>
                </div>
            </button>
            <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    activeIndex === isOriginalIndex ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-5 pb-5 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-normal" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                    {lang === 'ar' ? faq.answerAr : faq.answer}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-4 max-w-6xl mx-auto">
            <div className="flex-1 space-y-4">
                {leftColumn.map((faq, i) => renderFaqItem(faq, i, i * 2))}
            </div>
            <div className="flex-1 space-y-4">
                {rightColumn.map((faq, i) => renderFaqItem(faq, i, i * 2 + 1))}
            </div>
        </div>
    );
}
