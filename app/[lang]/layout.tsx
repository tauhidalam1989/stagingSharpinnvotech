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

    return (
        <AuthProvider lang={lang}>
            <LanguageSynchronizer lang={lang} dir={isRtl ? 'rtl' : 'ltr'} />
            <div className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${dmSans.variable} font-sans min-h-screen flex flex-col`}>
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
