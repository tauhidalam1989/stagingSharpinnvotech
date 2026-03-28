'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Blog } from '@/lib/api';
import { Locale } from '@/lib/get-dictionary';

interface BlogSidebarProps {
    blog: Blog;
    lang: Locale;
    dict: any;
}

export default function BlogSidebar({ blog, lang, dict }: BlogSidebarProps) {
    const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
    const gallery = blog.gallery || [];
    const hasGallery = gallery.length > 0;

    const getImageUrl = (path: string | undefined) => {
        if (!path) return '/img/slider/2.svg';
        if (path.startsWith('http')) return path;
        return `${process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '')}/${path}`;
    };

    const nextGalleryImage = () => {
        if (currentGalleryIndex < gallery.length - 1) {
            setCurrentGalleryIndex(prev => prev + 1);
        }
    };

    const prevGalleryImage = () => {
        if (currentGalleryIndex > 0) {
            setCurrentGalleryIndex(prev => prev - 1);
        }
    };

    return (
        <aside className="lg:col-span-1 flex flex-col gap-6 mt-6">
            {/* Gallery / Featured Image Section */}
            {hasGallery ? (
                <div className="bg-white dark:bg-zinc-900 rounded-[24px] overflow-hidden shadow-xl border border-zinc-100 dark:border-zinc-800 p-1.5 animate-slide-up">
                    <div className="space-y-3">
                        <div className="relative aspect-[4/3] rounded-[18px] overflow-hidden group">
                            <Image
                                src={getImageUrl(gallery[currentGalleryIndex])}
                                alt={blog.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {gallery.length > 1 && (
                                <>
                                    <button
                                        onClick={prevGalleryImage}
                                        disabled={currentGalleryIndex === 0}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-900/90 shadow-lg flex items-center justify-center text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed z-10 hover:bg-white transition-colors text-xs"
                                    >
                                        <i className={`fas fa-chevron-${lang === 'ar' ? 'right' : 'left'}`}></i>
                                    </button>
                                    <button
                                        onClick={nextGalleryImage}
                                        disabled={currentGalleryIndex === gallery.length - 1}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-900/90 shadow-lg flex items-center justify-center text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed z-10 hover:bg-white transition-colors text-xs"
                                    >
                                        <i className={`fas fa-chevron-${lang === 'ar' ? 'left' : 'right'}`}></i>
                                    </button>
                                </>
                            )}
                        </div>

                        {gallery.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1 px-1 scrollbar-none">
                                {gallery.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentGalleryIndex(i)}
                                        className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all ${i === currentGalleryIndex ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-900' : 'opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={getImageUrl(img)}
                                            alt={`${blog.title} - ${i + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                blog.featuredImage && (
                    <div className="rounded-[24px] overflow-hidden shadow-xl animate-slide-up bg-zinc-100 dark:bg-zinc-900">
                        <div className="relative aspect-[4/3] overflow-hidden group">
                            <Image
                                src={getImageUrl(blog.featuredImage)}
                                alt={blog.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    </div>
                )
            )}

            {/* CTA Card - Compacted */}
            <div className="bg-[#1a6bf5] dark:bg-blue-600 rounded-[24px] p-6 text-white relative overflow-hidden group shadow-2xl shadow-blue-500/20 animate-slide-up animation-delay-300">
                {/* Decorative background circle */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                <h4 className="text-xl font-black mb-3 relative z-10">
                    {lang === 'ar' ? 'هل تحتاج إلى استشارة؟' : 'Need Expert Advice?'}
                </h4>
                <p className="text-blue-50/80 mb-6 text-xs font-medium !text-white leading-relaxed relative z-10">
                    {lang === 'ar'
                        ? 'فريقنا متاح لمساعدتك في تحديات التكنولوجيا.'
                        : 'Our team is ready to help you navigate tech challenges.'}
                </p>
                <Link
                    href={`/${lang}/contact`}
                    className="inline-flex items-center justify-center w-full bg-white text-blue-600 px-5 py-3 rounded-xl font-black uppercase tracking-wider text-[10px] hover:bg-blue-50 transition-all hover:scale-[1.02] active:scale-[0.98] relative z-10 shadow-lg"
                >
                    {lang === 'ar' ? 'اتصل بنا الآن' : 'Contact Us Now'}
                </Link>
            </div>
        </aside>
    );
}
