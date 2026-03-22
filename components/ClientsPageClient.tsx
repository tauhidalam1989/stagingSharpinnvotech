'use client'

import React, { useState } from 'react';
import LogoCarousel from './LogoCarousel';
import { Locale } from '@/lib/get-dictionary';
import { Client, Partner, Certificate } from '@/lib/api';

interface ClientsPageClientProps {
    clients: Client[];
    partners: Partner[];
    certificates: Certificate[];
    lang: Locale;
    dict: any;
}

export default function ClientsPageClient({
    clients,
    partners,
    certificates,
    lang,
    dict
}: ClientsPageClientProps) {
    const [activeTab, setActiveTab] = useState<'clients' | 'partners' | 'certificates'>('clients');

    const getImageUrl = (path: string | undefined | null) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/v1', '') || '';
        return `${baseUrl}/${path.replace(/\\/g, '/').replace(/^\//, '')}`;
    };

    const isAr = lang === 'ar';

    const t = dict?.CLIENTS_PAGE || {
        TABS: {
            CLIENTS: isAr ? 'العملاء' : 'Clients',
            PARTNERS: isAr ? 'الشركاء' : 'Partners',
            CERTIFICATES: isAr ? 'الشهادات' : 'Certificates'
        },
        CLIENTS: {
            TITLE: isAr ? 'عملاؤنا' : 'Our Clients',
            DESCRIPTION: isAr ? 'نحن فخورون بالعمل مع هؤلاء القادة' : 'We are proud to work with these industry leaders'
        },
        PARTNERS: {
            TITLE: isAr ? 'شركاؤنا' : 'Our Partners',
            DESCRIPTION: isAr ? 'نتعاون مع رواد التكنولوجيا' : 'We collaborate with technology leaders'
        },
        CERTIFICATES: {
            TITLE: isAr ? 'شهاداتنا' : 'Our Certificates',
            DESCRIPTION: isAr ? 'تم الاعتراف بتميزنا' : 'Recognized for our excellence'
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'clients':
                return (
                    <div className="w-full">
                        <LogoCarousel 
                            items={clients as any} 
                            lang={lang} 
                            title={t.CLIENTS.TITLE}
                            description={t.CLIENTS.DESCRIPTION}
                        />
                    </div>
                );
            case 'partners':
                return (
                    <div className="w-full">
                        <LogoCarousel 
                            items={partners as any} 
                            lang={lang} 
                            title={t.PARTNERS.TITLE}
                            description={t.PARTNERS.DESCRIPTION}
                        />
                    </div>
                );
            case 'certificates':
                return (
                    <div className="w-full">
                        <LogoCarousel 
                            items={certificates.map(c => ({ ...c, logo: (c as any).image })) as any} 
                            lang={lang} 
                            title={t.CERTIFICATES.TITLE}
                            description={t.CERTIFICATES.DESCRIPTION}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 pt-32 pb-12 md:pt-40 md:pb-20">
            <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16">
                <div className="flex flex-col items-center mb-12">
                    <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl mb-8">
                        <button
                            onClick={() => setActiveTab('clients')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                activeTab === 'clients'
                                    ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                        >
                            {t.TABS.CLIENTS}
                        </button>
                        <button
                            onClick={() => setActiveTab('partners')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                activeTab === 'partners'
                                    ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                        >
                            {t.TABS.PARTNERS}
                        </button>
                        <button
                            onClick={() => setActiveTab('certificates')}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                activeTab === 'certificates'
                                    ? 'bg-white dark:bg-zinc-800 text-blue-600 shadow-sm'
                                    : 'text-zinc-500 hover:text-zinc-700'
                            }`}
                        >
                            {t.TABS.CERTIFICATES}
                        </button>
                    </div>
                </div>

                {renderContent()}
            </div>
        </div>
    );
}
