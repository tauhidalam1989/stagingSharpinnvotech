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
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const baseSlides: Slide[] = [
        {
            tagline: dict.HOMEs.HERO_TAGLINE,
            title: dict.HOMEs.HERO_TITLE_SLIDE0,
            description: dict.HOMEs.HERO_DESCRIPTION_SLIDE0,
            image: '/img/Slider/slider.svg',
            path: `/${lang}/services/cybersecurity-consulting`
        },
        {
            tagline: dict.HOMEs.HERO_TAGLINE,
            title: dict.HOMEs.HERO_TITLE_SLIDE1,
            description: dict.HOMEs.HERO_DESCRIPTION_SLIDE1,
            image: '/img/Slider/Managed_IT.svg',
            path: `/${lang}/services/it-server-admin`
        },
        {
            tagline: dict.HOMEs.HERO_TAGLINE,
            title: dict.HOMEs.HERO_TITLE_SLIDE2,
            description: dict.HOMEs.HERO_DESCRIPTION_SLIDE2,
            image: '/img/Slider/3.svg',
            path: `/${lang}/services/NOC`
        },
        {
            tagline: dict.HOMEs.HERO_TAGLINE,
            title: dict.HOMEs.HERO_TITLE_SLIDE3,
            description: dict.HOMEs.HERO_DESCRIPTION_SLIDE3,
            image: '/img/Slider/2.svg',
            path: `/${lang}/services/web-app-development`
        },
        {
            tagline: dict.HOMEs.HERO_TAGLINE,
            title: dict.HOMEs.HERO_TITLE_SLIDE4,
            description: dict.HOMEs.HERO_DESCRIPTION_SLIDE4,
            image: '/img/Slider/Mobile_App_Development.svg',
            path: `/${lang}/services/mobile-app-development`
        },
        {
            tagline: dict.HOMEs.HERO_TAGLINE,
            title: dict.HOMEs.HERO_TITLE_SLIDE5,
            description: dict.HOMEs.HERO_DESCRIPTION_SLIDE5,
            image: '/img/Slider/ERP_Solutions_Services.svg',
            path: `/${lang}/services/web-app-development`
        }
    ];

    // Cloned slides for seamless loop
    const slides = [...baseSlides, baseSlides[0]];

    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [activeSlide, isTransitioning]);

    const handleNext = () => {
        if (!isTransitioning) return;
        setActiveSlide((prev) => prev + 1);
    };

    const handleTransitionEnd = () => {
        if (activeSlide === slides.length - 1) {
            setIsTransitioning(false);
            setActiveSlide(0);
            // Re-enable transition after the jump
            setTimeout(() => {
                setIsTransitioning(true);
            }, 50);
        }
    };

    const handleIndicatorClick = (index: number) => {
        setIsTransitioning(true);
        setActiveSlide(index);
    };

    return (
        <section className="relative min-h-[500px] h-auto lg:h-[600px] w-full overflow-hidden bg-[#0d6efd] text-white">
            {/* Background Image Layer */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url("/img/bg-hero.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            <div className="relative min-h-[500px] lg:h-full w-full z-10">
                <div
                    className={`flex w-full min-h-[500px] lg:h-full ${isTransitioning ? 'transition-transform duration-1000 ease-in-out' : ''}`}
                    style={{
                        transform: `translateX(-${activeSlide * 100}%)`,
                        visibility: mounted ? 'visible' : 'hidden'
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className="w-full min-h-[500px] lg:h-full flex-shrink-0"
                        >
                            <div className="container mx-auto flex h-full items-center px-4 md:px-6 pt-[100px] lg:pt-[20px]">
                                <div className="grid grid-cols-1 gap-2 lg:gap-8 lg:grid-cols-2 lg:items-center w-full">
                                    <div className="space-y-3 lg:space-y-5 lg:self-center py-2 lg:py-0 text-center w-full">
                                        <div className="inline-block rounded-full border border-white text-white px-6 py-2.5 text-base font-medium animate-slide-up">
                                            {slide.tagline}
                                        </div>
                                        <h1 className="text-3xl font-bold tracking-tight md:text-5xl lg:text-[2.8rem] leading-[1.2] animate-slide-up animation-delay-100">
                                            {slide.title}
                                        </h1>
                                        <p className="mx-auto max-w-[600px] text-base md:text-base !text-white font-medium leading-relaxed animate-slide-up animation-delay-200">
                                            {slide.description}
                                        </p>
                                        <div className="flex flex-wrap justify-center gap-4 pt-4 lg:pt-6 animate-slide-up animation-delay-300">
                                            {slide.path && (
                                                <Link
                                                    href={slide.path}
                                                    className="rounded-full bg-white px-10 py-3.5 text-base font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50 active:scale-95"
                                                >
                                                    {dict.HOMEs.READ_MORE}
                                                </Link>
                                            )}
                                            <Link
                                                href={`/${lang}/contact`}
                                                className="rounded-full border-2 border-white px-10 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
                                            >
                                                {dict.HOMEs.CONTACT_US}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="flex lg:self-end justify-center lg:justify-end items-end h-full mt-2 lg:mt-0">
                                        <Image
                                            src={encodeURI(slide.image)}
                                            alt={slide.title}
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
