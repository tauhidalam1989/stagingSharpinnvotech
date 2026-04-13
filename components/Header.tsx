'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import ServicesMegaMenu from './ServicesMegaMenu';
import ProductsMegaMenu from './ProductsMegaMenu';
import { getServiceCategories, getPublishedServices, getProductCategories, getPublishedProducts, ServiceCategory, ServicePage, ProductCategory, Product } from '@/lib/api';
import { Locale } from '@/lib/get-dictionary';

export default function Header({ lang, dict }: { lang: string; dict: any }) {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isServicesHovered, setIsServicesHovered] = useState(false);
    const [isProductsHovered, setIsProductsHovered] = useState(false);

    // Mobile accordion state
    const [mobileExpandedMenu, setMobileExpandedMenu] = useState<'services' | 'products' | null>(null);
    const [mobileExpandedCatId, setMobileExpandedCatId] = useState<number | null>(null);

    // Data for mobile submenus
    const [svcCategories, setSvcCategories] = useState<ServiceCategory[]>([]);
    const [svcItems, setSvcItems] = useState<ServicePage[]>([]);
    const [prdCategories, setPrdCategories] = useState<ProductCategory[]>([]);
    const [prdItems, setPrdItems] = useState<Product[]>([]);
    const [mobileDataLoaded, setMobileDataLoaded] = useState(false);

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
        setIsServicesHovered(false);
        setIsProductsHovered(false);
        setMobileExpandedMenu(null);
        setMobileExpandedCatId(null);
    }, [pathname]);

    // Preload mobile submenu data when drawer is first opened
    useEffect(() => {
        if (!isMenuOpen || mobileDataLoaded) return;
        const load = async () => {
            try {
                const [sc, sv, pc, pv] = await Promise.all([
                    getServiceCategories(),
                    getPublishedServices(),
                    getProductCategories(),
                    getPublishedProducts(),
                ]);
                setSvcCategories((Array.isArray(sc) ? sc : []).filter((c: ServiceCategory) => c.isActive).sort((a: ServiceCategory, b: ServiceCategory) => a.order - b.order));
                setSvcItems(Array.isArray(sv) ? sv : []);
                setPrdCategories((Array.isArray(pc) ? pc : []).filter((c: ProductCategory) => c.isActive).sort((a: ProductCategory, b: ProductCategory) => a.order - b.order));
                setPrdItems(Array.isArray(pv) ? pv : []);
                setMobileDataLoaded(true);
            } catch (e) { console.error('Mobile menu preload failed', e); }
        };
        load();
    }, [isMenuOpen, mobileDataLoaded]);

    const navLinks = [
        { href: `/${lang}`, label: dict.HOME, icon: 'fa-home' },
        { href: `/${lang}/about`, label: dict.ABOUT, icon: 'fa-info-circle' },
        { href: `/${lang}/services`, label: dict.SERVICES, icon: 'fa-cog' },
        { href: `/${lang}/products`, label: dict.PRODUCTS, icon: 'fa-shopping-bag' },
        { href: `/${lang}/blogs`, label: lang === 'ar' ? 'المدونات' : 'Blogs', icon: 'fa-rss' },
        { href: `/${lang}/careers`, label: dict.CAREERS, icon: 'fa-briefcase' },
        { href: `/${lang}/contact`, label: dict.CONTACT, icon: 'fa-envelope' },

    ];

    const headerClasses = isHomePage
        ? isScrolled || isMenuOpen
            ? 'bg-[#0d6efd] text-white shadow-lg'
            : 'bg-transparent text-white'
        : 'bg-[#0d6efd] text-white shadow-sm';

    return (
        <>
            <header
                className={`fixed top-0 z-50 w-full transition-all duration-300 ${headerClasses} ${(isServicesHovered || isProductsHovered) ? 'bg-[#0d6efd] text-white shadow-lg' : ''}`}
                onMouseLeave={() => { setIsServicesHovered(false); setIsProductsHovered(false); }}
            >
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
                        <nav className="hidden lg:flex items-center gap-[35px] h-full">
                            {navLinks.map((link) => {
                                const isServices = link.href === `/${lang}/services`;
                                const isProducts = link.href === `/${lang}/products`;

                                if (isServices) return (
                                    <div
                                        key={link.href}
                                        className="relative h-full flex items-center"
                                        onMouseEnter={() => { setIsServicesHovered(true); setIsProductsHovered(false); }}
                                        onMouseLeave={() => setIsServicesHovered(false)}
                                    >
                                        <Link
                                            href={link.href}
                                            className={`text-[19px] py-4 font-medium transition-colors ${pathname === link.href || isServicesHovered ? 'text-white' : 'text-white/80 hover:text-white'}`}
                                        >
                                            {link.label}
                                        </Link>

                                    </div>
                                );

                                if (isProducts) return (
                                    <div
                                        key={link.href}
                                        className="relative h-full flex items-center"
                                        onMouseEnter={() => { setIsProductsHovered(true); setIsServicesHovered(false); }}
                                        onMouseLeave={() => setIsProductsHovered(false)}
                                    >
                                        <Link
                                            href={link.href}
                                            className={`text-[19px] py-4 font-medium transition-colors ${pathname === link.href || isProductsHovered ? 'text-white' : 'text-white/80 hover:text-white'}`}
                                        >
                                            {link.label}
                                        </Link>

                                    </div>
                                );

                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onMouseEnter={() => { setIsServicesHovered(false); setIsProductsHovered(false); }}
                                        className={`text-[19px] font-medium transition-colors ${pathname === link.href ? 'text-white' : 'text-white/80 hover:text-white'}`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}

                            <LanguageSwitcher currentLang={lang} />


                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            suppressHydrationWarning
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
                    <div className="flex flex-col min-h-full p-6 pt-10">
                        {/* Logo */}
                        <div className="flex items-center justify-between border-b-2 border-white/40 pb-4">
                            <Link href={`/${lang}`} onClick={() => setIsMenuOpen(false)}>
                                <Image src={lang === 'en' ? '/img/d1.png' : '/img/d2.png'} alt="Sharp Innovations" width={180} height={60} className="h-[50px] w-auto" />
                            </Link>
                        </div>

                        {/* Theme and Language Switchers */}
                        <div className="border-b-2 border-white/40">
                            <div className="flex items-center gap-5 py-4 px-6 text-white">
                                <i className="fa fa-globe text-2xl w-8 text-center"></i>
                                <div onClick={() => setIsMenuOpen(false)}>
                                    <LanguageSwitcher currentLang={lang} />
                                </div>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-col">
                            {navLinks.map((link) => {
                                const isServices = link.href === `/${lang}/services`;
                                const isProducts = link.href === `/${lang}/products`;

                                /* ── Services Accordion ── */
                                if (isServices) {
                                    const isOpen = mobileExpandedMenu === 'services';
                                    return (
                                        <div key={link.href}>
                                            {/* Row */}
                                            <button
                                                suppressHydrationWarning
                                                onClick={() => {
                                                    setMobileExpandedMenu(isOpen ? null : 'services');
                                                    setMobileExpandedCatId(null);
                                                }}
                                                className="w-full flex items-center justify-between gap-5 py-4 px-2 border-b-2 border-white/40 text-white/80 hover:text-white transition-colors"
                                            >
                                                <div className="flex items-center gap-5">
                                                    <i className={`fas ${link.icon} text-2xl w-8 text-center`}></i>
                                                    <span className="text-[18px] font-bold">{link.label}</span>
                                                </div>
                                                <i className={`fas fa-chevron-down text-sm text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                                            </button>

                                            {/* Categories accordion panel */}
                                            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                {/* View All row */}
                                                <Link href={`/${lang}/services`} onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center gap-3 py-3 pl-12 pr-4 border-b border-white/10 bg-white/5 text-white/60 hover:text-white text-[13px] font-semibold uppercase tracking-widest transition-colors !text-white">
                                                    <i className="fas fa-th-large text-xs"></i>
                                                    {lang === 'ar' ? 'عرض كل الخدمات' : 'View All Services'}
                                                </Link>

                                                {svcCategories.length === 0 && (
                                                    <p className="text-white/30 text-xs py-4 pl-12">{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
                                                )}

                                                {svcCategories.map(cat => {
                                                    const catName = isRtl ? cat.nameAr || cat.name : cat.name;
                                                    const isCatOpen = mobileExpandedCatId === cat.id;
                                                    const catServices = svcItems.filter(s => s.categoryId === cat.id);
                                                    return (
                                                        <div key={cat.id}>
                                                            {/* Category row */}
                                                            <button
                                                                suppressHydrationWarning
                                                                onClick={() => setMobileExpandedCatId(isCatOpen ? null : cat.id)}
                                                                className={`w-full flex items-center justify-between gap-3 py-3 pl-10 pr-4 border-b border-white/10 transition-colors ${isCatOpen ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 text-sm shrink-0 !text-white">
                                                                        {cat.icon ? <i className={cat.icon}></i> : <i className="fas fa-layer-group"></i>}
                                                                    </div>
                                                                    <span className="text-[14px] font-semibold !text-white text-start leading-tight">{catName}</span>
                                                                </div>
                                                                <i className={`fas fa-chevron-down text-xs text-white/40 transition-transform duration-300 ${isCatOpen ? 'rotate-180' : ''}`}></i>
                                                            </button>

                                                            {/* Services list */}
                                                            <div className={`overflow-hidden transition-all duration-300 bg-white/5 ${isCatOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                                {catServices.length === 0 && (
                                                                    <p className="text-white/30 text-xs py-3 pl-16">{lang === 'ar' ? 'لا توجد خدمات' : 'No services'}</p>
                                                                )}
                                                                {catServices.map(svc => {
                                                                    const title = isRtl ? svc.heroTitleAr || svc.heroTitle : svc.heroTitle;
                                                                    return (
                                                                        <Link
                                                                            key={svc.id}
                                                                            href={`/${lang}/services/${svc.slug}`}
                                                                            onClick={() => setIsMenuOpen(false)}
                                                                            className="flex items-center gap-3 py-3 pl-16 pr-4 border-b border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                                                                        >
                                                                            <div className="w-5 h-5 flex items-center justify-center text-white/40 text-xs shrink-0 !text-white">
                                                                                {svc.cardIcon ? <i className={svc.cardIcon}></i> : svc.heroIcon ? <i className={svc.heroIcon}></i> : <i className="fas fa-circle text-[6px]"></i>}
                                                                            </div>
                                                                            <span className="text-[13px] font-medium leading-tight !text-white text-start flex-1">{title}</span>
                                                                        </Link>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                }

                                /* ── Products Accordion ── */
                                if (isProducts) {
                                    const isOpen = mobileExpandedMenu === 'products';
                                    return (
                                        <div key={link.href}>
                                            <button
                                                suppressHydrationWarning
                                                onClick={() => {
                                                    setMobileExpandedMenu(isOpen ? null : 'products');
                                                    setMobileExpandedCatId(null);
                                                }}
                                                className="w-full flex items-center justify-between gap-5 py-4 px-2 border-b-2 border-white/40 text-white/80 hover:text-white transition-colors"
                                            >
                                                <div className="flex items-center gap-5">
                                                    <i className={`fas ${link.icon} text-2xl w-8 text-center`}></i>
                                                    <span className="text-[18px] font-bold">{link.label}</span>
                                                </div>
                                                <i className={`fas fa-chevron-down text-sm text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                                            </button>

                                            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <Link href={`/${lang}/products`} onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center gap-3 py-3 pl-12 pr-4 border-b border-white/10 bg-white/5 text-white/60 hover:text-white text-[13px] font-semibold uppercase tracking-widest transition-colors !text-white">
                                                    <i className="fas fa-th-large text-xs"></i>
                                                    {lang === 'ar' ? 'عرض كل المنتجات' : 'View All Products'}
                                                </Link>

                                                {prdCategories.length === 0 && (
                                                    <p className="text-white/30 text-xs py-4 pl-12">{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
                                                )}

                                                {prdCategories.map(cat => {
                                                    const catName = isRtl ? cat.nameAr || cat.name : cat.name;
                                                    const isCatOpen = mobileExpandedCatId === cat.id;
                                                    const catProducts = prdItems.filter(p => p.categoryId === cat.id);
                                                    return (
                                                        <div key={cat.id}>
                                                            <button
                                                                suppressHydrationWarning
                                                                onClick={() => setMobileExpandedCatId(isCatOpen ? null : cat.id)}
                                                                className={`w-full flex items-center justify-between gap-3 py-3 pl-10 pr-4 border-b border-white/10 transition-colors ${isCatOpen ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 text-sm shrink-0 !text-white">
                                                                        {cat.icon ? <i className={cat.icon}></i> : <i className="fas fa-box"></i>}
                                                                    </div>
                                                                    <span className="text-[14px] font-semibold !text-white text-start leading-tight">{catName}</span>
                                                                </div>
                                                                <i className={`fas fa-chevron-down text-xs text-white/40 transition-transform duration-300 ${isCatOpen ? 'rotate-180' : ''}`}></i>
                                                            </button>

                                                            <div className={`overflow-hidden transition-all duration-300 bg-white/5 ${isCatOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                                {catProducts.length === 0 && (
                                                                    <p className="text-white/30 text-xs py-3 pl-16">{lang === 'ar' ? 'لا توجد منتجات' : 'No products'}</p>
                                                                )}
                                                                {catProducts.map(prd => {
                                                                    const title = isRtl ? prd.titleAr || prd.title : prd.title;
                                                                    return (
                                                                        <Link
                                                                            key={prd.id}
                                                                            href={`/${lang}/products/${prd.slug}`}
                                                                            onClick={() => setIsMenuOpen(false)}
                                                                            className="flex items-center gap-3 py-3 pl-16 pr-4 border-b border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                                                                        >
                                                                            <div className="w-5 h-5 flex items-center justify-center text-white/40 text-xs shrink-0 !text-white">
                                                                                {prd.cardIcon ? <i className={prd.cardIcon}></i> : prd.heroIcon ? <i className={prd.heroIcon}></i> : <i className="fas fa-circle text-[6px]"></i>}
                                                                            </div>
                                                                            <span className="text-[13px] font-medium leading-tight !text-white text-start flex-1">{title}</span>
                                                                        </Link>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                }

                                /* ── Regular link ── */
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-5 py-4 px-2 border-b-2 border-white/40 transition-colors ${pathname === link.href ? 'text-white' : 'text-white/80 hover:text-white'}`}
                                    >
                                        <i className={`fas ${link.icon} text-2xl w-8 text-center`}></i>
                                        <span className="text-[18px] font-bold">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-auto pt-8 flex justify-center w-full">
                            <Image src="/img/Banner3.svg" alt="Sharp Innovations Banner" width={400} height={200} className="w-full h-auto object-contain" />
                        </div>
                    </div>
                </div>

                {/* Desktop Mega Menus */}
                <div
                    className={`hidden lg:block absolute top-full left-0 w-full transition-all duration-300 transform origin-top ${isServicesHovered ? 'scale-y-100 opacity-100 visible' : 'scale-y-0 opacity-0 invisible'
                        }`}
                    onMouseEnter={() => setIsServicesHovered(true)}
                    onMouseLeave={() => setIsServicesHovered(false)}
                >
                    <ServicesMegaMenu lang={lang} onClose={() => setIsServicesHovered(false)} />
                </div>

                <div
                    className={`hidden lg:block absolute top-full left-0 w-full transition-all duration-300 transform origin-top ${isProductsHovered ? 'scale-y-100 opacity-100 visible' : 'scale-y-0 opacity-0 invisible'
                        }`}
                    onMouseEnter={() => setIsProductsHovered(true)}
                    onMouseLeave={() => setIsProductsHovered(false)}
                >
                    <ProductsMegaMenu lang={lang} onClose={() => setIsProductsHovered(false)} />
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
