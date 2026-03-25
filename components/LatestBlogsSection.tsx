'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, Calendar } from 'lucide-react';
import { Blog } from '@/lib/api';

interface LatestBlogsSectionProps {
  lang: string;
  dict: any;
  blogs: Blog[];
}

export default function LatestBlogsSection({ lang, dict, blogs }: LatestBlogsSectionProps) {
  const isAr = lang === 'ar';
  
  const [itemsToShow, setItemsToShow] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsToShow(1);
      else if (window.innerWidth < 1024) setItemsToShow(2);
      else if (window.innerWidth < 1280) setItemsToShow(3);
      else setItemsToShow(4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayItems = useMemo(() => {
    if (!blogs || blogs.length === 0) return [];
    if (blogs.length <= itemsToShow) return blogs;
    return [
      ...blogs.slice(-itemsToShow),
      ...blogs,
      ...blogs.slice(0, itemsToShow)
    ];
  }, [blogs, itemsToShow]);

  useEffect(() => {
    if (blogs && blogs.length > 0) {
      setCurrentIndex(blogs.length <= itemsToShow ? 0 : itemsToShow);
    }
  }, [blogs?.length, itemsToShow]);

  if (!blogs || blogs.length === 0) return null;

  const totalPages = Math.ceil(blogs.length / itemsToShow);

  const realIndex = blogs.length <= itemsToShow
    ? currentIndex
    : (currentIndex - itemsToShow + blogs.length) % blogs.length;
  const currentDot = Math.floor(realIndex / itemsToShow);

  const nextSlide = useCallback(() => {
    if (!transitionEnabled || blogs.length <= itemsToShow) return;
    setCurrentIndex(prev => prev + 1);
  }, [transitionEnabled, blogs.length, itemsToShow]);

  const handleTransitionEnd = () => {
    if (blogs.length <= itemsToShow) return;
    if (currentIndex >= blogs.length + itemsToShow) {
      setTransitionEnabled(false);
      setCurrentIndex(itemsToShow);
    } else if (currentIndex <= 0) {
      setTransitionEnabled(false);
      setCurrentIndex(blogs.length);
    }
  };

  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => setTransitionEnabled(true), 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);

  useEffect(() => {
    if (isPaused || blogs.length <= itemsToShow) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused, blogs.length, itemsToShow]);

  const t = {
    title: isAr ? 'أحدث المقالات' : 'Latest Insights',
    subtitle: isAr ? 'استكشف أحدث الأخبار والمقالات في مجال التكنولوجيا' : 'Discover the latest news and articles in technology',
    readMore: isAr ? 'اقرأ المزيد' : 'Read More'
  };

  return (
    <section className="py-20 bg-white" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-6 mb-12">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#060E24] font-syne mb-4">
            {t.title}
          </h2>
          <p className="text-zinc-500 max-w-2xl text-lg">
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        {/* Added py-8 and -my-8 to give room for shadows avoiding cut-offs */}
        <div className="relative overflow-hidden px-4 md:px-0 py-8 -my-8">
          <div
            ref={containerRef}
            className={`flex ${transitionEnabled ? 'transition-transform duration-700 ease-in-out' : ''}`}
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(-${(currentIndex * (100 / itemsToShow))}%)`,
              direction: 'ltr' 
            }}
          >
            {displayItems.map((blog, idx) => {
              const date = new Date(blog.createdAt);
              const formattedDate = date.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              });

              return (
                <div 
                  key={`${blog.id}-${idx}`} 
                  dir={isAr ? 'rtl' : 'ltr'}
                  className="flex-shrink-0 px-4"
                  style={{ width: `calc(${100 / itemsToShow}%)` }}
                >
                  <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-zinc-100 overflow-hidden h-full flex flex-col">
                    <div className="relative h-48 md:h-56 w-full shrink-0">
                      {blog.featuredImage ? (
                        <Image
                          src={blog.featuredImage}
                          alt={blog.featuredImageAlt || blog.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-200 flex items-center justify-center">
                          <span className="text-zinc-400">No Image</span>
                        </div>
                      )}
                      {blog.categories && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1650C8]">
                          {typeof blog.categories === 'string' 
                              ? blog.categories.split(',')[0] 
                              : blog.categories[0]}
                        </div>
                      )}
                    </div>
                    <div className="p-6 md:p-8 flex flex-col grow">
                      <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mb-4 shrink-0">
                        <div className="flex items-center gap-1.5 border border-zinc-200 px-3 py-1.5 rounded-full">
                          <Calendar className="w-3.5 h-3.5" />
                          {formattedDate}
                        </div>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-zinc-900 leading-tight mb-4 font-syne line-clamp-2 shrink-0">
                        {isAr && blog.titleAr ? blog.titleAr : blog.title}
                      </h3>
                      <div className="mt-auto pt-4 shrink-0">
                        <Link 
                          href={`/${lang}/blogs/${blog.slug}`}
                          className="inline-flex items-center gap-2 text-[#1650C8] font-semibold text-sm hover:underline"
                        >
                          {t.readMore}
                          {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-12">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTransitionEnabled(true);
                  setCurrentIndex(idx * itemsToShow + (blogs.length <= itemsToShow ? 0 : itemsToShow));
                }}
                className={`h-3 rounded-full transition-all duration-300 ${currentDot === idx
                  ? 'w-10 bg-[#0d6efd]'
                  : 'w-3 bg-zinc-300 hover:bg-zinc-400'
                }`}
                aria-label={`Go to slide group ${idx + 1}`}
                suppressHydrationWarning
              />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-16">
          <Link
            href={`/${lang}/blogs`}
            className="px-10 py-4 bg-[#1650C8] text-white rounded-[20px] font-bold text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3 group"
          >
            {isAr ? 'عرض كل المقالات' : 'View All Insights'}
            <div className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors group-hover:bg-white/20`}>
              <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
