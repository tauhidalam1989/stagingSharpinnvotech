'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { Locale } from '@/lib/get-dictionary';

export default function Header({ lang, dict }: { lang: string; dict: any }) {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/home` || pathname === '/';
    const isDashboard = pathname.includes('/dashboard');
    const isRtl = lang === 'ar';

    if (isDashboard) return null;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        handleScroll(); // Check initial scroll
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const navLinks = [
        { href: `/${lang}`, label: dict.HOME, icon: 'fa-home' },
        { href: `/${lang}/about`, label: dict.ABOUT, icon: 'fa-info-circle' },
        { href: `/${lang}/services`, label: dict.SERVICES, icon: 'fa-cog' },
        { href: `/${lang}/products`, label: dict.PRODUCTS, icon: 'fa-shopping-bag' },
        { href: `/${lang}/careers`, label: dict.CAREERS, icon: 'fa-briefcase' },
        { href: `/${lang}/contact`, label: dict.CONTACT, icon: 'fa-envelope' },
        { href: `/${lang}/blogs`, label: lang === 'ar' ? 'المدونات' : 'Blogs', icon: 'fa-rss' },
    ];

    const headerClasses = isHomePage
        ? isScrolled || isMenuOpen
            ? 'bg-[#0d6efd] text-white shadow-lg'
            : 'bg-transparent text-white'
        : 'bg-[#0d6efd] text-white shadow-sm';

    return (
        <>
            <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${headerClasses}`}>
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo */}
                        <Link href={`/${lang}`} className="flex items-center gap-2">
                            <Image
                                src={lang === 'en' ? '/img/d1.png' : '/img/d2.png'}
                                alt="Sharp Innovations"
                                width={180}
                                height={60}
                                priority
                                className="h-[45px] sm:h-[60px] w-auto"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-[35px]">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-[19px] font-medium transition-colors ${pathname === link.href
                                            ? 'text-white'
                                            : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <LanguageSwitcher currentLang={lang} />
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-white focus:outline-none z-50"
                            aria-label="Toggle Menu"
                        >
                            {isMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="4" x2="20" y1="12" y2="12" />
                                    <line x1="4" x2="20" y1="6" y2="6" />
                                    <line x1="4" x2="20" y1="18" y2="18" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                                {/* Mobile Navigation Sidebar */}
                <div
                    className={`lg:hidden fixed inset-0 z-40 bg-[#0a163d] transition-transform duration-300 ease-in-out overflow-y-auto ${isMenuOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')
                        }`}
                >
                    <div className="flex flex-col h-full p-6 pt-10">
                        {/* Mobile Logo & Close Button Area */}
                        <div className="flex items-center justify-between border-b-2 border-white/40 pb-4 relative">
                            <Link href={`/${lang}`} onClick={() => setIsMenuOpen(false)}>
                                <Image
                                    src={lang === 'en' ? '/img/d1.png' : '/img/d2.png'}
                                    alt="Sharp Innovations"
                                    width={180}
                                    height={60}
                                    className="h-[50px] w-auto"
                                />
                            </Link>
                        </div>

                        {/* Language Switcher in Menu */}
                        <div className="border-b-2 border-white/40">
                            <div className="flex items-center gap-5 py-4 px-2 text-white">
                                <i className="fa fa-globe text-2xl w-8 text-center"></i>
                                <div onClick={() => setIsMenuOpen(false)}>
                                    <LanguageSwitcher currentLang={lang} />
                                </div>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-col">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-5 py-4 px-2 border-b-2 border-white/40 transition-colors ${pathname === link.href
                                            ? 'text-white'
                                            : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    <i className={`fas ${link.icon} text-2xl w-8 text-center`}></i>
                                    <span className="text-[18px] font-bold">{link.label}</span>
                                </Link>
                            ))}
                        </nav>

                        {/* Bottom Banner Image */}
                        <div className="mt-auto pt-8 flex justify-center w-full">
                            <Image
                                src="/img/Banner3.svg"
                                alt="Sharp Innovations Banner"
                                width={400}
                                height={200}
                                className="w-full h-auto object-contain opacity-100"
                            />
                        </div>
                    </div>
                </div>
            </header>
            {/* Overlay background when menu is open */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </>
    );
}
