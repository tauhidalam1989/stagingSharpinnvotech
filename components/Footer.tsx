'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/lib/get-dictionary';
import { usePathname } from 'next/navigation';

export default function Footer({ lang, dict }: { lang: string; dict: any }) {
    const pathname = usePathname();
    const isRtl = lang === 'ar';
    const isDashboard = pathname.includes('/dashboard');
    const [isVisible, setIsVisible] = useState(false);

    if (isDashboard) return null;

    // Show/hide "Back to Top" button based on scroll position
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <footer className="relative bg-[#14183e] pt-16 pb-8 text-white/50 overflow-hidden">
            {/* World Map Background Overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'url("/img/footer.png")',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'brightness(0) invert(1)',
                    opacity: 0.8, // High visibility to match the prominent Angular version
                }}
            />

            <div className="container relative z-10 mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                    {/* Company Info */}
                    <div className="space-y-6">
                        <Link href={`/${lang}`} className="inline-block">
                            <Image
                                src={lang === 'en' ? '/img/d1.png' : '/img/d2.png'}
                                alt="Sharp Innovations"
                                width={180}
                                height={60}
                                className="h-16 w-auto"
                            />
                        </Link>
                        <p className="text-[14px] leading-relaxed">
                            {dict.FOOTER.DESCRIPTION}
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h5 className="text-xl font-bold text-white mb-4">{dict.FOOTER.GET_IN_TOUCH}</h5>
                        <ul className="space-y-3 text-[14px]">
                            <li className="flex items-start gap-4">
                                <i className="fa fa-map-marker-alt text-white mt-1 w-5"></i>
                                <span>{dict.FOOTER.ADDRESS}</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <i className="fa fa-phone-alt text-white w-5"></i>
                                <span dir="ltr">{dict.FOOTER.PHONE}</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <i className="fa fa-phone-alt text-white w-5"></i>
                                <span dir="ltr">{dict.FOOTER.PHONE1}</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <i className="fa fa-envelope text-white w-5"></i>
                                <span className="break-all" dir="ltr">{dict.FOOTER.EMAIL}</span>
                            </li>
                        </ul>
                        <div className="flex gap-3 pt-4">
                            {[
                                { href: 'https://x.com/sharpInnvo1351', icon: 'fa-twitter' },
                                { href: 'https://www.facebook.com/profile.php?id=61556338118947', icon: 'fa-facebook-f' },
                                { href: 'https://www.instagram.com/sharpinnovations2104/', icon: 'fa-instagram' },
                                { href: 'https://www.linkedin.com/company/sharp-innovations-company-for-information-technology-%D8%B4%D8%B1%D9%83%D8%A9-%D8%A7%D8%A8%D8%AA%D9%83%D8%A7%D8%B1%D8%A7%D8%AA-%D8%AD%D8%A7%D8%AF%D8%A9-%D9%84%D8%AA%D9%82%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA/', icon: 'fa-linkedin-in' }
                            ].map((social) => (
                                <a
                                    key={social.icon}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-9 w-9 flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white hover:text-[#14183e] transition-all duration-300"
                                >
                                    <i className={`fab ${social.icon} text-sm`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Popular Links */}
                    <div className="space-y-6">
                        <h5 className="text-xl font-bold text-white mb-4">{dict.FOOTER.POPULAR_LINKS}</h5>
                        <ul className="space-y-3 text-[14px]">
                            {[
                                { key: 'ABOUT_US', path: 'about' },
                                { key: 'CONTACT_US', path: 'contact' },
                                { key: 'PRIVACY_POLICY', path: 'privacy' },
                                { key: 'TERMS_CONDITIONS', path: 'terms-conditions' },
                                { key: 'CAREER', path: 'careers' }
                            ].map((item) => (
                                <li key={item.key}>
                                    <Link
                                        href={`/${lang}/${item.path}`}
                                        className="hover:translate-x-2 transition-transform duration-300 flex items-center group"
                                    >
                                        <i className={`fas fa-chevron-right text-[10px] me-3 text-white/50 group-hover:text-white ${isRtl ? 'rotate-180' : ''}`}></i>
                                        {dict.FOOTER[item.key]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="space-y-6">
                        <h5 className="text-xl font-bold text-white mb-4">{dict.FOOTER.OUR_SERVICES}</h5>
                        <ul className="space-y-3 text-[14px]">
                            {[
                                { key: 'SERVICE_1', slug: 'application-security-services' },
                                { key: 'SERVICE_2', slug: 'server-administration-services' },
                                { key: 'SERVICE_3', slug: 'cyber-security-training-services' },
                                { key: 'SERVICE_4', slug: 'process-automation-services' },
                                { key: 'SERVICE_5', slug: 'mobile-application-development' }
                            ].map((item) => (
                                <li key={item.key}>
                                    <Link
                                        href={`/${lang}/services/${item.slug}`}
                                        className="hover:translate-x-2 transition-transform duration-300 flex items-center group"
                                    >
                                        <i className={`fas fa-chevron-right text-[10px] me-3 text-white/50 group-hover:text-white ${isRtl ? 'rotate-180' : ''}`}></i>
                                        {dict.FOOTER[item.key]}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[14px]">
                        <p>© {new Date().getFullYear()} {dict.FOOTER.COPYRIGHT}</p>
                        <div className="flex items-center gap-3">
                            <Link href={`/${lang}/`} className="hover:text-white transition-colors">{dict.FOOTER.HOME}</Link>
                            <Link href={`/${lang}/privacy`} className="hover:text-white transition-colors border-l border-white/10 pl-6 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6">{dict.FOOTER.COOKIES}</Link>
                            <Link href={`/${lang}/faq`} className="hover:text-white transition-colors border-l border-white/10 pl-6 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6">{dict.FOOTER.FAQS}</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 z-[60] h-12 w-12 bg-[#007bff] text-white flex items-center justify-center rounded shadow-lg transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
                aria-label="Back to top"
            >
                <i className="fas fa-arrow-up"></i>
            </button>
        </footer>
    );
}
