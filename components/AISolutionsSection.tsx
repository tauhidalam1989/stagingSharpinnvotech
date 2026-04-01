'use client';

import { useState } from 'react';
import { Locale } from '@/lib/get-dictionary';
import Link from 'next/link';

const ProductCard = ({ item }: { item: any }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                backgroundColor: isHovered ? '#0d6efd' : undefined,
                borderColor: isHovered ? '#0d6efd' : undefined,
                transform: isHovered ? 'translateY(-8px)' : undefined,
                boxShadow: isHovered ? '0 20px 40px rgba(13,110,253,0.3)' : undefined
            }}
            className={`p-10 rounded-xl border flex flex-col items-center text-center transition-all duration-300 cursor-pointer h-full ${isHovered
                ? 'bg-[#0d6efd] border-[#0d6efd]'
                : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'
                }`}
        >
            <div
                style={{
                    backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : undefined,
                    color: isHovered ? 'white' : '#0d6efd'
                }}
                className={`mb-8 flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300 ${isHovered ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                    }`}
            >
                <i className={`${item.icon} text-3xl`}></i>
            </div>

            <h3
                style={{ color: isHovered ? 'white' : undefined }}
                className={`text-xl font-bold mb-4 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-zinc-900 dark:text-white'
                    }`}
            >
                {item.title}
            </h3>

            <p
                style={{ color: isHovered ? 'rgba(255, 255, 255, 0.9)' : undefined }}
                className={`leading-relaxed text-sm transition-colors duration-300 ${isHovered ? 'text-white/90' : 'text-zinc-500 dark:text-zinc-400'
                    }`}
            >
                {item.desc}
            </p>
        </div>
    );
};

export default function AISolutionsSection({ lang, dict }: { lang: Locale; dict: any }) {
    const isRtl = lang === 'ar';
    const sectionData = dict.SERVICE || {};
    const products = sectionData.PRODUCTS || [];

    return (
        <section className="pt-12 pb-24 bg-zinc-50 dark:bg-zinc-950">
            <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1400px]">

                {/* Header Section - Exactly as Angular Screenshot */}
                <div className={`mb-16 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className="inline-block px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50/30 mb-6">
                        <span className="text-blue-500 font-medium text-sm">
                            {sectionData.OUR_SERVICES || (isRtl ? 'منتجاتنا' : 'Our Products')}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white leading-tight mb-6">
                        {sectionData.TITLE || (isRtl ? 'حلول الذكاء الاصطناعي الممتازة لأعمالك' : 'Our Excellent AI Solutions for Your Business')}
                    </h2>

                    <p className="text-sm md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal mb-6 max-w-3xl">
                        {sectionData.DESCRIPTION || (isRtl ? 'نقدم حلول الذكاء الاصطناعي المتقدمة لمساعدتك في تنمية أعمالك. استكشف خدماتنا المصممة لتلبية احتياجاتك.' : 'We provide cutting-edge AI solutions to help your business grow. Explore our services tailored to meet your needs test.')}
                    </p>

                    <Link
                        href={`/${lang}/products`}
                        className="bg-[#0d6efd] text-white px-10 py-4 rounded-full font-bold text-sm hover:bg-[#0b5ed7] transition-all shadow-md active:scale-95 inline-block"
                    >
                        {sectionData.READ_MORE || (isRtl ? 'اقرأ المزيد' : 'Read More')}
                    </Link>
                </div>

                {/* Products Grid - 4 columns as per screenshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((item: any, index: number) => (
                        <ProductCard key={index} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}
