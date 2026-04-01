'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Locale } from '@/lib/get-dictionary';

interface Slide {
    tagline: string;
    title: string;
    description: string;
    image: string;
    path?: string;
}

export default function Hero({ lang, dict }: { lang: Locale; dict: any }) {
    const [activeSlide, setActiveSlide] = useState(0);
    const [transitionEnabled, setTransitionEnabled] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const activeSlideRef = useRef(0);
    const totalSlidesRef = useRef(0);

    const homeDict = dict?.HOMEs || {};

    const baseSlides: Slide[] = [
        {
            tagline: homeDict.HERO_TAGLINE || '',
            title: homeDict.HERO_TITLE_SLIDE0 || '',
            description: homeDict.HERO_DESCRIPTION_SLIDE0 || '',
            image: '/img/Slider/slider.svg',
            path: `/${lang}/services`
        },
        {
            tagline: homeDict.HERO_TAGLINE || '',
            title: homeDict.HERO_TITLE_SLIDE1 || '',
            description: homeDict.HERO_DESCRIPTION_SLIDE1 || '',
            image: '/img/Slider/Managed_IT.svg',
            path: `/${lang}/services`
        },
        {
            tagline: homeDict.HERO_TAGLINE || '',
            title: homeDict.HERO_TITLE_SLIDE2 || '',
            description: homeDict.HERO_DESCRIPTION_SLIDE2 || '',
            image: '/img/Slider/3.svg',
            path: `/${lang}/services`
        },
        {
            tagline: homeDict.HERO_TAGLINE || '',
            title: homeDict.HERO_TITLE_SLIDE3 || '',
            description: homeDict.HERO_DESCRIPTION_SLIDE3 || '',
            image: '/img/Slider/2.svg',
            path: `/${lang}/services`
        },
        {
            tagline: homeDict.HERO_TAGLINE || '',
            title: homeDict.HERO_TITLE_SLIDE4 || '',
            description: homeDict.HERO_DESCRIPTION_SLIDE4 || '',
            image: '/img/Slider/Mobile_App_Development.svg',
            path: `/${lang}/services`
        },
        {
            tagline: homeDict.HERO_TAGLINE || '',
            title: homeDict.HERO_TITLE_SLIDE5 || '',
            description: homeDict.HERO_DESCRIPTION_SLIDE5 || '',
            image: '/img/Slider/ERP_Solutions_Services.svg',
            path: `/${lang}/services`
        }
    ];

    const slides = [...baseSlides, baseSlides[0]];
    totalSlidesRef.current = slides.length;

    // ─── Timer helpers ────────────────────────────────────────────────
    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const startTimer = () => {
        stopTimer();
        timerRef.current = setInterval(() => {
            const next = activeSlideRef.current + 1;
            activeSlideRef.current = next;
            setActiveSlide(next);
        }, 5000);
    };

    // ─── Reset carousel to slide 0 instantly (no animation) ──────────
    const resetCarousel = () => {
        stopTimer();
        setTransitionEnabled(false);
        activeSlideRef.current = 0;
        setActiveSlide(0);

        setTimeout(() => {
            setTransitionEnabled(true);
            startTimer();
        }, 50);
    };

    // ─── Mount / unmount ──────────────────────────────────────────────
    useEffect(() => {
        resetCarousel();
        return () => stopTimer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Page Visibility API ──────────────────────────────────────────
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                resetCarousel();
            } else {
                stopTimer();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ─── Infinite loop snap-back ──────────────────────────────────────
    const handleTransitionEnd = () => {
        if (activeSlideRef.current === totalSlidesRef.current - 1) {
            setTransitionEnabled(false);
            activeSlideRef.current = 0;
            setActiveSlide(0);

            setTimeout(() => {
                setTransitionEnabled(true);
            }, 50);
        }
    };

    // ─── Indicator click ──────────────────────────────────────────────
    const handleIndicatorClick = (index: number) => {
        activeSlideRef.current = index;
        setTransitionEnabled(true);
        setActiveSlide(index);
        startTimer();
    };

    // ─── Render a single slide ────────────────────────────────────────
    const renderSlide = (slide: Slide, index: number) => (
        <div key={index} className="w-full min-h-[600px] lg:h-full flex-shrink-0">
            <div
                className="container mx-auto flex h-full items-center px-4 md:px-6 pt-[100px] lg:pt-[20px]"
                dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
                <div className="grid grid-cols-1 gap-2 lg:gap-8 lg:grid-cols-2 lg:items-center w-full">
                    <div className="space-y-3 lg:space-y-5 lg:self-center py-2 lg:py-0 text-center w-full">
                        <h1 className="text-3xl font-bold tracking-tight md:text-5xl lg:text-[2.8rem] leading-[1.2]">
                            {slide.title}
                        </h1>
                        <p className="mx-auto max-w-[600px] text-base md:text-base !text-white font-medium leading-relaxed">
                            {slide.description}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-4 lg:pt-6">
                            {slide.path && (
                                <Link
                                    href={slide.path}
                                    className="rounded-full bg-white px-10 py-3.5 text-base font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50 active:scale-95"
                                >
                                    {homeDict.READ_MORE || 'Read More'}
                                </Link>
                            )}
                            <Link
                                href={`/${lang}/contact`}
                                className="rounded-full border-2 border-white px-10 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
                            >
                                {homeDict.CONTACT_US || 'Contact Us'}
                            </Link>
                        </div>
                    </div>
                    <div className="flex lg:self-end justify-center lg:justify-end items-end h-full mt-2 lg:mt-0">
                        <Image
                            src={encodeURI(slide.image)}
                            alt={slide.title || 'Hero image'}
                            width={550}
                            height={420}
                            className="h-auto w-[75%] sm:w-[45%] lg:w-[80%] max-w-[350px] lg:max-w-[500px] object-contain mb-[-5px] lg:mb-[-10px] drop-shadow-2xl mx-auto lg:mx-0 lg:translate-y-4"
                            priority={index === 0}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <section className="relative min-h-[500px] h-auto lg:h-[600px] w-full overflow-hidden bg-[#0d6efd] text-white">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="container mx-auto relative h-full">
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: 'url("/img/bg-hero.png")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                </div>
            </div>

            {/* Sliding Carousel */}
            <div className="relative min-h-[600px] lg:h-full w-full z-10" dir="ltr">
                <div
                    className={`flex w-full min-h-[600px] lg:h-full${transitionEnabled ? ' transition-transform duration-1000 ease-in-out' : ''}`}
                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {slides.map((slide, index) => renderSlide(slide, index))}
                </div>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2 z-20">
                {baseSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleIndicatorClick(index)}
                        className={`h-2 w-8 rounded-full transition-all ${activeSlide % baseSlides.length === index ? 'bg-white' : 'bg-white/30'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}
