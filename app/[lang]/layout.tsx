import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne, DM_Sans } from "next/font/google";
import "../globals.css";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/get-dictionary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LanguageSynchronizer from "@/components/LanguageSynchronizer";
import CookieConsent from "@/components/CookieConsent";
import { AuthProvider } from "@/context/AuthContext";

import JsonLd from "@/components/JsonLd";
import { getOrganizationSchema } from "@/lib/schema-builder";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const syne = Syne({
    variable: "--font-syne",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sharpinnvotech.com';

    return {
        title: {
            default: dict.PAGE_TITLES.DEFAULT || "Sharp Innovation",
            template: "%s | Sharp Innovation"
        },
        description: dict.PAGE_TITLES.DEFAULT || "Professional IT Solutions and Digital Transformation Services",
        metadataBase: new URL(siteUrl),
        alternates: {
            languages: {
                en: '/en',
                ar: '/ar',
            },
        },
        openGraph: {
            type: 'website',
            siteName: 'Sharp Innovation',
            locale: lang === 'ar' ? 'ar_AR' : 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            site: '@sharpinnovation',
        }
    };
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    
    // Validate locale
    if (lang !== 'en' && lang !== 'ar') {
        const { notFound } = await import('next/navigation');
        notFound();
    }

    const dict = await getDictionary(lang);
    const isRtl = lang === 'ar';
    const orgSchema = getOrganizationSchema();

    return (
        <AuthProvider lang={lang}>
            <LanguageSynchronizer lang={lang} dir={isRtl ? 'rtl' : 'ltr'} />
            <div className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${dmSans.variable} font-sans min-h-screen flex flex-col`}>
                <JsonLd schema={orgSchema} />
                <Header lang={lang} dict={dict} />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer lang={lang} dict={dict} />
                <CookieConsent lang={lang} dict={dict} />
            </div>
        </AuthProvider>
    );
}
