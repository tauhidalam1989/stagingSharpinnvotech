import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/get-dictionary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LanguageSynchronizer from "@/components/LanguageSynchronizer";
import CookieConsent from "@/components/CookieConsent";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return {
        title: dict.PAGE_TITLES.DEFAULT,
        description: dict.PAGE_TITLES.DEFAULT,
        alternates: {
            languages: {
                en: '/en',
                ar: '/ar',
            },
        },
    };
}

import { AuthProvider } from "@/context/AuthContext";

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const isRtl = lang === 'ar';

    return (
        <AuthProvider lang={lang}>
            <LanguageSynchronizer lang={lang} dir={isRtl ? 'rtl' : 'ltr'} />
            <Header lang={lang} dict={dict} />
            <main className="flex-grow">
                {children}
            </main>
            <Footer lang={lang} dict={dict} />
            <CookieConsent lang={lang} dict={dict} />
        </AuthProvider>
    );
}
