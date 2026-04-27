'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Image from 'next/image';
import { Locale } from '@/lib/get-dictionary';

export default function ClientsSection({
    lang,
    dict,
    clients = [],
    partners = [],
    certificates = []
}: {
    lang: Locale;
    dict: any;
    clients?: any[];
    partners?: any[];
    certificates?: any[];
}) {
    const isRtl = lang === 'ar';
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const getFullImageUrl = (path: string) => {
        if (!path) return '/assets/logo/SLogo.png';
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') || '';
        const isBaseLocal = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');

        let finalPath = path;
        if (path.startsWith('http')) {
            const isPathLocal = path.includes('127.0.0.1:8092');
            if (!isBaseLocal && isPathLocal) {
                const uploadsIndex = path.indexOf('/uploads/');
                if (uploadsIndex !== -1) {
                    finalPath = `${baseUrl}${path.substring(uploadsIndex)}`;
                }
            }
        } else {
            finalPath = `${baseUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
        }
        return finalPath;
    };

    const SectionHeader = ({ title, subtitle, icon }: { title: string, subtitle: string, icon: string }) => (
        <div className="text-center mb-10 px-4">
            <div className="flex flex-row items-center justify-center gap-5 mb-4 group">
                <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20 transition-transform duration-500 group-hover:scale-110">
                    <i className={`fas ${icon} text-2xl`} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#333]">
                    {title}
                </h2>
            </div>
            <p className="text-zinc-600 text-sm font-normal max-w-2xl mx-auto">
                {subtitle}
            </p>
        </div>
    );

    const Carousel = ({ items, autoplayTimeout = 3000 }: { items: any[], autoplayTimeout?: number }) => {
        const [itemsToShow, setItemsToShow] = useState(4);
        const [currentIndex, setCurrentIndex] = useState(0);
        const [transitionEnabled, setTransitionEnabled] = useState(true);
        const [isPaused, setIsPaused] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const handleResize = () => {
                if (window.innerWidth < 640) setItemsToShow(2);
                else if (window.innerWidth < 1024) setItemsToShow(3);
                else setItemsToShow(4);
            };
            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);

        // Clone items for infinite loop: [last items] [real items] [first items]
        const displayItems = useMemo(() => {
            if (items.length === 0) return [];
            if (items.length <= itemsToShow) return items;
            return [
                ...items.slice(-itemsToShow),
                ...items,
                ...items.slice(0, itemsToShow)
            ];
        }, [items, itemsToShow]);

        // Adjust index to start at the real items
        useEffect(() => {
            if (items.length > 0) {
                setCurrentIndex(items.length <= itemsToShow ? 0 : itemsToShow);
            }
        }, [items.length, itemsToShow]);

        const totalPages = Math.ceil(items.length / itemsToShow);

        // Active dot calculation Based on real item index
        const realIndex = items.length <= itemsToShow
            ? currentIndex
            : (currentIndex - itemsToShow + items.length) % items.length;
        const currentDot = Math.floor(realIndex / itemsToShow);

        const nextSlide = useCallback(() => {
            if (!transitionEnabled || items.length <= itemsToShow) return;
            setCurrentIndex(prev => prev + 1);
        }, [transitionEnabled, items.length, itemsToShow]);

        const handleTransitionEnd = () => {
            if (items.length <= itemsToShow) return;
            if (currentIndex >= items.length + itemsToShow) {
                setTransitionEnabled(false);
                setCurrentIndex(itemsToShow);
            } else if (currentIndex <= 0) {
                setTransitionEnabled(false);
                setCurrentIndex(items.length);
            }
        };

        useEffect(() => {
            if (!transitionEnabled) {
                const timer = setTimeout(() => setTransitionEnabled(true), 50);
                return () => clearTimeout(timer);
            }
        }, [transitionEnabled]);

        useEffect(() => {
            if (isPaused || items.length <= itemsToShow) return;
            const timer = setInterval(nextSlide, autoplayTimeout);
            return () => clearInterval(timer);
        }, [nextSlide, isPaused, items.length, itemsToShow, autoplayTimeout]);

        if (items.length === 0) return null;

        return (
            <div
                className="w-full mb-12 last:mb-0"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <div className="relative overflow-hidden px-4 md:px-0 pt-10 pb-4">
                    <div
                        ref={containerRef}
                        className={`flex gap-4 ${transitionEnabled ? 'transition-transform duration-700 ease-in-out' : ''}`}
                        onTransitionEnd={handleTransitionEnd}
                        style={{
                            transform: `translateX(-${(currentIndex * (100 / itemsToShow))}%)`,
                            direction: 'ltr'
                        }}
                    >
                        {displayItems.map((item, index) => (
                            <div
                                key={`${item.id || index}-${index}`}
                                className="flex-shrink-0 px-4"
                                style={{ width: `calc(${100 / itemsToShow}%)` }}
                                onClick={() => setSelectedImage(item.logo || item.image || '/assets/logo/SLogo.png')}
                            >
                                <div className="group relative bg-white border-[1.5px] border-[#1363c6]/40 hover:border-[#1363c6] rounded-xl p-6 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(19,99,198,0.15)] flex items-center justify-center h-[160px] w-full max-w-[300px] mx-auto cursor-pointer hover:-translate-y-3">
                                    <Image
                                        src={getFullImageUrl(item.logo || item.image || '/assets/logo/SLogo.png')}
                                        alt={item.name || 'Logo'}
                                        width={180}
                                        height={100}
                                        className="max-h-[120px] w-auto object-contain transition-all duration-500 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center gap-3 mt-10">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setTransitionEnabled(true);
                                    setCurrentIndex(idx * itemsToShow + itemsToShow);
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
            </div>
        );
    };

    return (
        <section className="pt-2 pb-10 bg-white overflow-hidden">
            <div className="container mx-auto">

                {/* Valued Clients */}
                {clients.length > 0 && (
                    <div className="mb-14">
                        <SectionHeader
                            title={dict.clientsPage?.clients?.title || (isRtl ? 'عملائنا المميزين' : 'Our Valued Clients')}
                            subtitle={dict.clientsPage?.clients?.description || (isRtl ? 'نحن فخورون بالعمل مع قادة الصناعة هؤلاء' : 'We\'re proud to partner with industry leaders across multiple sectors')}
                            icon="fa-users"
                        />
                        <Carousel items={clients} autoplayTimeout={2000} />
                    </div>
                )}

                {/* Strategic Partnerships */}
                {partners.length > 0 && (
                    <div className="mb-14">
                        <SectionHeader
                            title={dict.clientsPage?.partners?.title || (isRtl ? 'الشراكات الاستراتيجية' : 'Strategic Partnerships')}
                            subtitle={dict.clientsPage?.partners?.description || (isRtl ? 'نتعاون مع رواد التكنولوجيا لتقديم حلول متميزة' : 'Collaborating with technology leaders to deliver exceptional solutions')}
                            icon="fa-handshake"
                        />
                        <Carousel items={partners} autoplayTimeout={3000} />
                    </div>
                )}

                {/* Certifications */}
                {certificates.length > 0 && (
                    <div>
                        <SectionHeader
                            title={dict.clientsPage?.certificates?.title || (isRtl ? 'شهاداتنا' : 'Our Certifications')}
                            subtitle={dict.clientsPage?.certificates?.description || (isRtl ? 'تم الاعتراف بنا لالتزامنا بالجودة والتميز' : 'Recognized for our commitment to quality and excellence')}
                            icon="fa-award"
                        />
                        <Carousel items={certificates} autoplayTimeout={4000} />
                    </div>
                )}
            </div>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative max-w-4xl w-full bg-white rounded-2xl p-2 shadow-2xl animate-in zoom-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute -top-12 right-0 text-white text-4xl hover:text-zinc-300 transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            &times;
                        </button>
                        <div className="p-8 flex items-center justify-center bg-zinc-50 rounded-xl min-h-[400px]">
                            <Image
                                src={getFullImageUrl(selectedImage)}
                                alt="Preview"
                                width={800}
                                height={600}
                                className="max-h-[70vh] w-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
