'use client'
import { useState } from 'react';
import { Locale } from '@/lib/get-dictionary';
import FAQAccordion from './FAQAccordion';

export default function FAQSection({ lang, dict }: { lang: Locale; dict: any }) {
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

    const isRtl = lang === 'ar';
    const [openId, setOpenId] = useState<string | null>(null);
    const handleToggle = (id: string) => {
        setOpenId(prev => prev === id ? null : id);
    };

    return (
        <section className="pt-12 pb-4 bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1400px]">
                <div className="mx-auto text-center mb-12" style={{ maxWidth: '500px' }}>
                    <div className="inline-block border border-zinc-200 rounded-full px-4 py-1 text-sm font-semibold text-blue-600 mb-4 tracking-wide">
                        {dict.FAQ.POPULAR_FAQS}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-white tracking-tight">
                        {dict.FAQ.TITLE}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
                    <div className="flex flex-col">
                        {faqList1.map((faq, index) => (
                            <FAQAccordion
                                key={`faq-home-left-${index}`}
                                id={`faq-home-left-${index}`}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openId === `faq-home-left-${index}`}
                                onToggle={() => handleToggle(`faq-home-left-${index}`)}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col">
                        {faqList2.map((faq, index) => (
                            <FAQAccordion
                                key={`faq-home-right-${index}`}
                                id={`faq-home-right-${index}`}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openId === `faq-home-right-${index}`}
                                onToggle={() => handleToggle(`faq-home-right-${index}`)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
