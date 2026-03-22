'use client'

import { useState } from 'react';
import { Locale } from '@/lib/get-dictionary';
import FAQAccordion from './FAQAccordion';

interface FAQPageClientProps {
    lang: string;
    dict: any;
}

export default function FAQPageClient({ lang, dict }: FAQPageClientProps) {
    const faqList1 = [
        { question: dict.FAQ.QUESTION1, answer: dict.FAQ.ANSWER1 },
        { question: dict.FAQ.QUESTION2, answer: dict.FAQ.ANSWER2 },
        { question: dict.FAQ.QUESTION3, answer: dict.FAQ.ANSWER3 },
        { question: dict.FAQ.QUESTION4, answer: dict.FAQ.ANSWER4 },
    ];

    const faqList2 = [
        { question: dict.FAQ.QUESTION5, answer: dict.FAQ.ANSWER5 },
        { question: dict.FAQ.QUESTION6, answer: dict.FAQ.ANSWER6 },
        { question: dict.FAQ.QUESTION7, answer: dict.FAQ.ANSWER7 },
        { question: dict.FAQ.QUESTION8, answer: dict.FAQ.ANSWER8 },
    ];

    const [openId, setOpenId] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        setOpenId(prev => prev === id ? null : id);
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-white">
            {/* Header */}
            <section className="pt-32 pb-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-block border border-zinc-200 rounded-full px-4 py-1 text-sm font-semibold text-blue-600 mb-4 tracking-wide">
                        {dict.FAQ.POPULAR_FAQS}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-white tracking-tight">
                        {dict.FAQ.TITLE}
                    </h1>
                    <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
                        {lang === 'ar' ? 'اعثر على إجابات للأسئلة الأكثر شيوعاً حول خدماتنا وحلولنا.' : 'Find answers to common questions about our services and solutions.'}
                    </p>
                </div>
            </section>

            {/* FAQs Grid */}
            <section className="pb-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 items-start">
                        <div className="flex flex-col">
                            {faqList1.map((faq, i) => (
                                <FAQAccordion 
                                    key={`faq-page-left-${i}`} 
                                    id={`faq-page-left-${i}`}
                                    question={faq.question} 
                                    answer={faq.answer} 
                                    isOpen={openId === `faq-page-left-${i}`}
                                    onToggle={() => handleToggle(`faq-page-left-${i}`)}
                                />
                            ))}
                        </div>
                        <div className="flex flex-col">
                            {faqList2.map((faq, i) => (
                                <FAQAccordion 
                                    key={`faq-page-right-${i}`} 
                                    id={`faq-page-right-${i}`}
                                    question={faq.question} 
                                    answer={faq.answer} 
                                    isOpen={openId === `faq-page-right-${i}`}
                                    onToggle={() => handleToggle(`faq-page-right-${i}`)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
