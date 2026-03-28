'use client'

import { useState, useEffect } from 'react';
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
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isClient, setIsClient] = useState(false);

    // Ensure we're on the client before rendering dynamic content
    useEffect(() => {
        setIsClient(true);
    }, []);

    const homeDict = dict?.HOMEs || {};

    // Check if dictionary content is loaded
    const isDictLoaded = Boolean(homeDict.HERO_TITLE_SLIDE0);

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

    useEffect(() => {
        if (!isDictLoaded) return; // Don't start timer until content is loaded

        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [activeSlide, isTransitioning, isDictLoaded]);

    const handleNext = () => {
        if (!isTransitioning) return;
        setActiveSlide((prev) => prev + 1);
    };

    const handleTransitionEnd = () => {
        if (activeSlide === slides.length - 1) {
            setIsTransitioning(false);
            setActiveSlide(0);
            setTimeout(() => {
                setIsTransitioning(true);
            }, 50);
        }
    };

    const handleIndicatorClick = (index: number) => {
        setIsTransitioning(true);
        setActiveSlide(index);
    };

    // Show loading skeleton until dictionary is loaded
    if (!isClient || !isDictLoaded) {
        return (
            <section className="relative min-h-[500px] h-auto lg:h-[600px] w-full overflow-hidden bg-[#0d6efd] text-white">
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
                {/* Optional: Add a loading spinner or skeleton here */}
                <div className="relative flex items-center justify-center h-full">
                    <div className="animate-pulse text-white text-xl">Loading...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="relative min-h-[500px] h-auto lg:h-[600px] w-full overflow-hidden bg-[#0d6efd] text-white">
            {/* ... rest of your existing JSX ... */}
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

            <div className="relative min-h-[600px] lg:h-full w-full z-10" dir="ltr">
                <div
                    className={`flex w-full min-h-[600px] lg:h-full ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
                    style={{
                        transform: `translateX(-${activeSlide * 100}%)`,
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className="w-full min-h-[600px] lg:h-full flex-shrink-0"
                        >
                            <div className="container mx-auto flex h-full items-center px-4 md:px-6 pt-[100px] lg:pt-[20px]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
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
                                            width={650}
                                            height={500}
                                            className="h-auto w-[85%] sm:w-[50%] lg:w-full max-w-[400px] lg:max-w-none object-contain mb-[-10px] lg:mb-[-10px] drop-shadow-2xl mx-auto lg:mx-0 lg:translate-y-4"
                                            priority={index === 0}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2 z-20">
                {baseSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleIndicatorClick(index)}
                        className={`h-2 w-8 rounded-full transition-all ${activeSlide % baseSlides.length === index ? 'bg-white' : 'bg-white/30'}`}
                    />
                ))}
            </div>
        </section>
    );
}
