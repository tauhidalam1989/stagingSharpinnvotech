'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Client, Partner, Certificate } from '@/lib/api';

type CarouselItem = Client | Partner | Certificate;

interface LogoCarouselProps {
    items: CarouselItem[];
    title: string;
    description: string;
    lang: string;
    onItemClick?: (item: CarouselItem) => void;
    isCertificate?: boolean;
}

export default function LogoCarousel({
    items,
    title,
    description,
    lang,
    onItemClick,
    isCertificate = false
}: LogoCarouselProps) {
    const [imageErrors, setImageErrors] = useState<Record<number | string, boolean>>({});

    const getFullImageUrl = (path: string) => {
        if (!path) return '/assets/logo/SLogo.png';
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') || '';
        const isBaseLocal = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');

        let finalPath = path;
        if (path.startsWith('http')) {
            const isPathLocal = path.includes('127.0.0.1:8092');
            // Only "fix" local paths if we are NOT on a local environment
            if (!isBaseLocal && isPathLocal) {
                const uploadsIndex = path.indexOf('/uploads/');
                if (uploadsIndex !== -1) {
                    finalPath = `${baseUrl}${path.substring(uploadsIndex)}`;
                }
            }
        } else {
            finalPath = `${baseUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
        }

        // console.log(`DEBUG: path="${path}" -> finalPath="${finalPath}" (baseLocal=${isBaseLocal})`);
        return finalPath;
    };

    const getItemImage = (item: CarouselItem) => {
        if ('logo' in item) return item.logo;
        if ('image' in item) return item.image;
        return '';
    };

    const handleImageError = (id: number | string) => {
        setImageErrors(prev => ({ ...prev, [id]: true }));
    };

    return (
        <div className={`py-12 ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
            <div className="section-title mb-12 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-4">
                    <Image src="/assets/logo/SLogo.png" alt="SLogo" width={50} height={50} priority />
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 border-b-2 border-primary pb-2">{title}</h2>
                </div>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 text-center max-w-2xl">{description}</p>
            </div>

            <div className="relative overflow-visible group">
                <div className="flex gap-6 overflow-x-auto pb-8 pt-4 snap-x no-scrollbar">
                    {items.map((item, index) => {
                        const hasError = imageErrors[item.id] || false;
                        const imageUrl = hasError ? '/assets/logo/SLogo.png' : getFullImageUrl(getItemImage(item));

                        return (
                            <div
                                key={item.id || index}
                                onClick={() => onItemClick?.(item)}
                                className={`flex-shrink-0 w-64 ${isCertificate ? 'h-[180px]' : 'h-[160px]'} bg-white dark:bg-zinc-900 rounded-lg border-[1.5px] border-[#1363c6] flex items-center justify-center p-6 shadow-[0_3_10px_rgba(0,0,0,0.08)] hover:shadow-xl transition-all cursor-pointer hover:-translate-x-2 snap-center`}
                            >
                                <img
                                    src={imageUrl}
                                    alt={item.name || "Item"}
                                    onError={() => handleImageError(item.id)}
                                    className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Fading Gradients */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent pointer-events-none opacity-0 md:group-hover:opacity-100 transition-opacity z-10"></div>
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent pointer-events-none opacity-0 md:group-hover:opacity-100 transition-opacity z-10"></div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .no-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
                .rtl {
                    direction: rtl;
                }
            `}</style>
        </div>
    );
}
