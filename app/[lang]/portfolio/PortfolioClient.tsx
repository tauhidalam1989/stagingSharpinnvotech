'use client';

import React, { useState } from 'react';
import { PublicPortfolioResponse, getMediaUrl } from '@/lib/api';

interface PortfolioClientProps {
    portfolioData: PublicPortfolioResponse;
    lang: string;
}

export default function PortfolioClient({ portfolioData, lang }: PortfolioClientProps) {
    const { profile, items } = portfolioData;

    // Filter active items
    const activeItems = items.filter(item => item.isActive);
    const isAr = lang === 'ar';

    // Modals states
    const [cookieModalOpen, setCookieModalOpen] = useState(false);
    const [aboutModalOpen, setAboutModalOpen] = useState(false);
    const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
    const [subscribeEmail, setSubscribeEmail] = useState('');
    const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [subscribeMessage, setSubscribeMessage] = useState('');

    // Share Modal states
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareItem, setShareItem] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const handleShareClick = (item: any) => {
        setShareItem(item);
        setShareModalOpen(true);
        setCopied(false);
    };

    const handleShareProfileClick = () => {
        const profileItem = {
            id: 'profile',
            title: profile.companyName,
            image: profile.logo,
            link: typeof window !== 'undefined' ? window.location.href : '',
            isProfile: true
        };
        handleShareClick(profileItem);
    };

    const getShareUrl = (item: any) => {
        if (!item) return '';
        if (item.isProfile) {
            return item.link;
        }
        // If it's a relative URL or starts with /, prepend the current host to make it absolute for sharing
        let url = item.link || (item.attachment ? getMediaUrl(item.attachment) : '');
        if (url && (url.startsWith('/') || !url.startsWith('http'))) {
            if (typeof window !== 'undefined') {
                url = `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
            }
        }
        return url;
    };

    const handleCopyLink = () => {
        const url = getShareUrl(shareItem);
        if (url) {
            navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Cookie settings checkboxes
    const [analyticsCookies, setAnalyticsCookies] = useState(true);
    const [marketingCookies, setMarketingCookies] = useState(false);

    const handleSubscribeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subscribeEmail) return;

        setSubscribeStatus('loading');
        setSubscribeMessage('');

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: subscribeEmail }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubscribeStatus('success');
                setSubscribeMessage(data.message || (isAr ? 'تم الاشتراك بنجاح!' : 'Subscribed successfully!'));
                setSubscribeEmail('');
                // Reset / close modal after 4 seconds
                setTimeout(() => {
                    setSubscribeStatus('idle');
                    setSubscribeModalOpen(false);
                }, 4000);
            } else {
                setSubscribeStatus('error');
                setSubscribeMessage(data.message || (isAr ? 'حدث خطأ ما. يرجى المحاولة مرة أخرى.' : 'Something went wrong. Please try again.'));
            }
        } catch (error) {
            setSubscribeStatus('error');
            setSubscribeMessage(isAr ? 'خطأ في الشبكة. يرجى التحقق من الاتصال.' : 'Network error. Please check your connection.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0c5adb] flex items-center justify-center p-0 md:p-4 py-0 md:py-12 relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute -top-48 -right-48 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Central Phone Card Container */}
            <div className="w-full md:max-w-[520px] min-h-screen md:min-h-fit bg-gradient-to-b from-[#1a66ff] to-[#0114ea] rounded-none md:rounded-[48px] p-6 md:p-10 shadow-2xl relative border-0 md:border border-white/20 flex flex-col items-center overflow-hidden">
                {/* Visual Accent Waves */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[-15deg] translate-x-1/2 pointer-events-none"></div>
                <div className="absolute -bottom-32 -left-32 w-64 h-64 border-[32px] border-white/10 rounded-full pointer-events-none"></div>

                {/* Top Control Bar */}
                <div className="w-full flex justify-between items-center relative z-10 mb-8">
                    {/* Linktree emblem dot */}
                    <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                        <i className="fa-solid fa-asterisk text-sm animate-spin-slow"></i>
                    </div>
                    {/* Subscribe button & Share */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSubscribeModalOpen(true)}
                            className="bg-white/10 hover:bg-white/25 border border-white/20 text-white rounded-full px-5 py-2 text-xs font-black tracking-wide uppercase backdrop-blur-sm transition-all"
                        >
                            {isAr ? 'اشترك' : 'Subscribe'}
                        </button>
                        <button
                            onClick={handleShareProfileClick}
                            className="w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-all"
                        >
                            <i className="fa-solid fa-share-nodes text-xs"></i>
                        </button>
                    </div>
                </div>

                {/* Circular Profile Avatar */}
                <div className="relative z-10 mb-5">
                    <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-2xl border-4 border-white/30 p-4 transform hover:scale-105 transition-transform duration-300">
                        {profile.logo ? (
                            <img
                                src={getMediaUrl(profile.logo)}
                                alt={profile.companyName}
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <i className="fa-solid fa-building text-3xl text-zinc-300"></i>
                        )}
                    </div>
                </div>

                {/* Company & Subtitle Details */}
                <div className="text-center relative z-10 max-w-sm mb-6">
                    <h1 className="text-2xl font-black text-white tracking-tight uppercase leading-tight mb-2">
                        {profile.companyName}
                    </h1>
                    {profile.title && (
                        <p className="text-xl !text-white font-medium opacity-90 leading-relaxed px-4">
                            {profile.title}
                        </p>
                    )}
                </div>

                {/* Social Network Links Row */}
                <div className="flex flex-row flex-nowrap gap-3 md:gap-4.5 justify-center items-center relative z-10 mb-8 max-w-full px-2">
                    {profile.instagram && (
                        <a href={profile.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-pink-500 hover:scale-110 active:scale-95 transition-all shadow-md">
                            <i className="fab fa-instagram text-base"></i>
                        </a>
                    )}
                    {profile.facebook && (
                        <a href={profile.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-blue-600 hover:scale-110 active:scale-95 transition-all shadow-md">
                            <i className="fab fa-facebook-f text-base"></i>
                        </a>
                    )}
                    {profile.twitter && (
                        <a href={profile.twitter} target="_blank" rel="noreferrer" className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-110 active:scale-95 transition-all shadow-md">
                            <i className="fab fa-x-twitter text-base"></i>
                        </a>
                    )}
                    {profile.linkedin && (
                        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-blue-700 hover:scale-110 active:scale-95 transition-all shadow-md">
                            <i className="fab fa-linkedin-in text-base"></i>
                        </a>
                    )}
                    {profile.email && (
                        <a href={`mailto:${profile.email}`} className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-red-500 hover:scale-110 active:scale-95 transition-all shadow-md">
                            <i className="fas fa-envelope text-base"></i>
                        </a>
                    )}
                    {profile.phone && (
                        <a href={`tel:${profile.phone}`} className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-green-500 hover:scale-110 active:scale-95 transition-all shadow-md">
                            <i className="fas fa-phone text-base"></i>
                        </a>
                    )}
                </div>

                {/* Main Links Container */}
                <div className="w-full space-y-4 relative z-10 flex-grow mb-10">
                    {activeItems.length === 0 ? (
                        <div className="text-center bg-white/10 rounded-3xl p-8 border border-white/10">
                            <p className="text-xs text-blue-100 font-medium italic">No links available yet</p>
                        </div>
                    ) : (
                        activeItems.map((item) => {
                            const mainUrl = item.link || (item.attachment ? getMediaUrl(item.attachment) : '#');
                            return (
                                <a
                                    key={item.id}
                                    href={mainUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full bg-white dark:bg-zinc-900 border border-white/10 rounded-2xl md:rounded-[24px] p-3 shadow-lg flex items-center justify-center relative transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group min-h-[68px]"
                                >
                                    {/* Thumbnail Icon */}
                                    <div className="absolute start-3 w-11 h-11 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                                        {item.image ? (
                                            <img
                                                src={getMediaUrl(item.image)}
                                                alt=""
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        ) : (
                                            <i className="fa-solid fa-link text-[#1a66ff] text-base"></i>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <span className="text-sm md:text-[15px] font-black text-zinc-800 dark:text-white truncate text-center ps-14 pe-24 w-full">
                                        {item.title}
                                    </span>

                                    {/* Action button */}
                                    {/* <div className="absolute end-14 shrink-0 flex items-center text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-white transition-colors">
                                        {item.attachment ? (
                                            <i className="fas fa-arrow-down-long text-xs w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center shadow-sm"></i>
                                        ) : (
                                            <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                                        )}
                                    </div> */}

                                    {/* 3-Dots Share Button */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleShareClick(item);
                                        }}
                                        className="absolute end-4 w-8 h-8 rounded-full bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-white transition-all z-20"
                                    >
                                        <i className="fa-solid fa-ellipsis-vertical text-xs"></i>
                                    </button>
                                </a>
                            );
                        })
                    )}
                </div>

                {/* Bottom CTA Linktree Button */}
                {profile.bottomCtaText && (
                    <a
                        href={profile.bottomCtaLink || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="relative z-10 w-full bg-white text-zinc-950 text-center font-black py-4 px-6 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all text-xs tracking-wider uppercase"
                    >
                        {profile.bottomCtaText}
                    </a>
                )}

                {/* Linktree Footer */}
                <div className="mt-8 text-center text-[9px] text-blue-100/60 font-semibold tracking-wider uppercase space-x-1.5 relative z-10 select-none">
                    <span className="hover:underline cursor-pointer" onClick={() => setCookieModalOpen(true)}>
                        {isAr ? 'تفضيلات ملفات تعريف الارتباط' : 'Cookie Preferences'}
                    </span>
                    <span>•</span>
                    <a href="https://sharpinnvotech.com/en/terms-conditions" target="_blank" rel="noreferrer" className="hover:underline">
                        {isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}
                    </a>
                    <span>•</span>
                    <a href="https://sharpinnvotech.com/en/privacy" target="_blank" rel="noreferrer" className="hover:underline">
                        {isAr ? 'الخصوصية' : 'Privacy'}
                    </a>
                    <span>•</span>
                    <span className="hover:underline cursor-pointer" onClick={() => setAboutModalOpen(true)}>
                        {isAr ? 'حول هذا الحساب' : 'About this account'}
                    </span>
                </div>
            </div>

            {/* Floating Mobile QR Card (Desktop viewports only) */}
            <div className="hidden xl:flex fixed bottom-8 right-8 flex-col items-center bg-zinc-900/90 border border-zinc-800/80 p-4 rounded-3xl shadow-2xl backdrop-blur-md z-20">
                <span className="text-[9px] uppercase font-black tracking-widest text-zinc-400 mb-2.5">
                    {isAr ? 'عرض على الهاتف' : 'View on Mobile'}
                </span>
                {/* Proper generated QR code */}
                <div className="w-24 h-24 bg-white p-1 rounded-xl flex items-center justify-center overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 33 33" shapeRendering="crispEdges">
                        <path fill="#FFFFFF" d="M0 0h33v33H0z"/>
                        <path stroke="#000000" d="M2 2.5h7m1 0h2m1 0h5m2 0h1m1 0h1m1 0h7M2 3.5h1m5 0h1m1 0h2m2 0h4m1 0h1m1 0h2m1 0h1m5 0h1M2 4.5h1m1 0h3m1 0h1m1 0h1m1 0h1m2 0h2m3 0h2m2 0h1m1 0h3m1 0h1M2 5.5h1m1 0h3m1 0h1m2 0h2m3 0h2m1 0h1m1 0h2m1 0h1m1 0h3m1 0h1M2 6.5h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h2m1 0h1m1 0h3m2 0h1m1 0h3m1 0h1M2 7.5h1m5 0h1m2 0h1m1 0h1m1 0h2m3 0h1m1 0h1m1 0h1m5 0h1M2 8.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M16 9.5h1m5 0h1M2 10.5h1m2 0h6m3 0h6m1 0h1m1 0h1m2 0h1m1 0h3M3 11.5h2m1 0h1m7 0h1m1 0h1m2 0h3m1 0h1m1 0h2m1 0h2M3 12.5h3m1 0h3m2 0h1m3 0h1m6 0h1m1 0h1m2 0h1M2 13.5h2m2 0h2m1 0h3m2 0h1m1 0h2m1 0h1m2 0h1m1 0h4m2 0h1M2 14.5h1m2 0h2m1 0h1m2 0h1m1 0h1m1 0h2m4 0h2m1 0h1m5 0h1M2 15.5h1m2 0h1m1 0h1m2 0h1m2 0h1m5 0h2m3 0h7M3 16.5h1m2 0h1m1 0h4m4 0h2m3 0h1m1 0h1m1 0h2m1 0h1m1 0h1M2 17.5h1m3 0h2m1 0h1m2 0h5m1 0h1m4 0h2m1 0h1m1 0h1m1 0h1M4 18.5h1m1 0h3m4 0h1m3 0h1m2 0h1m4 0h1m1 0h1M2 19.5h1m1 0h3m2 0h2m1 0h1m7 0h3m3 0h1m1 0h2M2 20.5h2m1 0h1m1 0h5m3 0h2m1 0h1m2 0h1m3 0h3m2 0h1M2 21.5h3m1 0h1m2 0h1m2 0h1m2 0h1m1 0h2m5 0h1m2 0h2M2 22.5h2m1 0h2m1 0h3m1 0h1m1 0h2m4 0h1m1 0h8M10 23.5h1m2 0h3m2 0h3m1 0h1m3 0h2M2 24.5h7m1 0h3m2 0h1m1 0h2m2 0h2m1 0h1m1 0h2M2 25.5h1m5 0h1m1 0h2m3 0h1m2 0h1m1 0h3m3 0h1m2 0h1M2 26.5h1m1 0h3m1 0h1m1 0h4m1 0h1m1 0h3m1 0h7m1 0h1M2 27.5h1m1 0h3m1 0h1m1 0h2m3 0h2m1 0h1m1 0h2m1 0h1m5 0h1M2 28.5h1m1 0h3m1 0h1m3 0h3m3 0h1m1 0h1m2 0h1m1 0h2m1 0h3M2 29.5h1m5 0h1m3 0h1m1 0h1m1 0h2m3 0h1m1 0h1m1 0h1m1 0h2m1 0h1M2 30.5h7m1 0h1m2 0h2m3 0h10"/>
                    </svg>
                </div>
            </div>

            {/* 1. COOKIE PREFERENCES MODAL */}
            {cookieModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
                        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/30">
                            <h2 className="text-sm font-black text-zinc-950 dark:text-white uppercase tracking-wider">
                                {isAr ? 'تفضيلات ملفات تعريف الارتباط' : 'Cookie Preferences'}
                            </h2>
                            <button
                                onClick={() => setCookieModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center text-zinc-400 hover:text-zinc-655"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                                {isAr
                                    ? 'نحن نستخدم ملفات تعريف الارتباط لتحسين أداء موقعنا وتقديم تجربة مستخدم مخصصة.'
                                    : 'We use cookies to optimize your platform experience, analyze layout traffic, and support operations.'}
                            </p>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-start gap-3 bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-900">
                                    <input type="checkbox" checked disabled className="mt-1 w-4 h-4 rounded text-blue-600 border-zinc-300 focus:ring-blue-500" />
                                    <div className="flex flex-col text-start">
                                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                                            {isAr ? 'ملفات تعريف الارتباط الأساسية' : 'Essential Cookies'}
                                        </span>
                                        <span className="text-[10px] text-zinc-400">
                                            {isAr ? 'مطلوب لتشغيل الموقع بشكل صحيح.' : 'Required for core platform features.'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-900 cursor-pointer" onClick={() => setAnalyticsCookies(!analyticsCookies)}>
                                    <input type="checkbox" checked={analyticsCookies} onChange={() => { }} className="mt-1 w-4 h-4 rounded text-blue-600 border-zinc-300 focus:ring-blue-500" />
                                    <div className="flex flex-col text-start">
                                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                                            {isAr ? 'ملفات تعريف الارتباط التحليلية' : 'Analytics Cookies'}
                                        </span>
                                        <span className="text-[10px] text-zinc-400">
                                            {isAr ? 'تساعدنا في قياس حركة المرور وتحسين أداء الموقع.' : 'Helps us measure site traffic and improve performance.'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-900 cursor-pointer" onClick={() => setMarketingCookies(!marketingCookies)}>
                                    <input type="checkbox" checked={marketingCookies} onChange={() => { }} className="mt-1 w-4 h-4 rounded text-blue-600 border-zinc-300 focus:ring-blue-500" />
                                    <div className="flex flex-col text-start">
                                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                                            {isAr ? 'ملفات تعريف الارتباط التسويقية' : 'Marketing Cookies'}
                                        </span>
                                        <span className="text-[10px] text-zinc-400">
                                            {isAr ? 'تستخدم لتتبع الزوار وتخصيص الإعلانات.' : 'Used for tracking visitors to deliver relevant ads.'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    onClick={() => setCookieModalOpen(false)}
                                    className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-750 text-white font-bold text-xs shadow-lg transition-all"
                                >
                                    {isAr ? 'حفظ التفضيلات' : 'Save Preferences'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. ABOUT THIS ACCOUNT MODAL */}
            {aboutModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
                        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/30">
                            <h2 className="text-sm font-black text-zinc-950 dark:text-white uppercase tracking-wider">
                                {isAr ? 'حول هذا الحساب' : 'About This Account'}
                            </h2>
                            <button
                                onClick={() => setAboutModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-850 flex items-center justify-center text-zinc-400 hover:text-zinc-655"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                                <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center p-2.5 shrink-0 overflow-hidden shadow-inner">
                                    {profile.logo ? (
                                        <img src={getMediaUrl(profile.logo)} alt="" className="max-w-full max-h-full object-contain" />
                                    ) : (
                                        <i className="fa-solid fa-building text-xl text-zinc-300"></i>
                                    )}
                                </div>
                                <div className="flex flex-col text-start">
                                    <h4 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-1.5 uppercase tracking-tight leading-none">
                                        {profile.companyName}
                                        <i className="fas fa-check-circle text-blue-500 text-sm" title="Verified Account"></i>
                                    </h4>
                                    <span className="text-[10px] text-zinc-400 mt-1">
                                        {isAr ? 'الحساب الرسمي المعتمد' : 'Verified Official Portfolio'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3 text-start text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                                <p>
                                    {isAr
                                        ? 'هذا هو حساب المحفظة الرسمي لشركة ابتكارات حادة (Sharp Innovations).'
                                        : 'This is the official link tree index and digital asset directory managed by the administrators of Sharp Innovations.'}
                                </p>
                                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900 space-y-2">
                                    <div className="flex justify-between text-[11px]">
                                        <span className="font-bold text-zinc-400">{isAr ? 'الحالة:' : 'Status:'}</span>
                                        <span className="font-black text-emerald-600">{isAr ? 'نشط ومعتمد' : 'Active & Verified'}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                        <span className="font-bold text-zinc-400">{isAr ? 'الجهة:' : 'Publisher:'}</span>
                                        <span className="font-bold text-zinc-800 dark:text-zinc-200">Sharp Innovations Co.</span>
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                        <span className="font-bold text-zinc-400">{isAr ? 'موقع الشركة:' : 'Corporate Website:'}</span>
                                        <a href="https://sharpinnvotech.com" target="_blank" rel="noreferrer" className="font-bold text-blue-500 hover:underline">
                                            sharpinnvotech.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    onClick={() => setAboutModalOpen(false)}
                                    className="flex-1 py-3 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 font-bold text-xs transition-all"
                                >
                                    {isAr ? 'إغلاق' : 'Close'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. SUBSCRIBE MODAL */}
            {subscribeModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
                        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/30">
                            <h2 className="text-sm font-black text-zinc-950 dark:text-white uppercase tracking-wider">
                                {isAr ? 'الاشتراك في النشرة الإخبارية' : 'Subscribe to Newsletter'}
                            </h2>
                            <button
                                onClick={() => {
                                    setSubscribeModalOpen(false);
                                    setSubscribeEmail('');
                                    setSubscribeStatus('idle');
                                    setSubscribeMessage('');
                                }}
                                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-350 transition-colors"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubscribeSubmit} className="p-6 space-y-4">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal text-start">
                                {isAr
                                    ? 'اشترك في نشرتنا الإخبارية لتلقي آخر الأخبار والتحديثات والعروض الحصرية مباشرة في بريدك الإلكتروني.'
                                    : 'Subscribe to our newsletter to receive the latest updates, news, and exclusive offers directly in your inbox.'}
                            </p>

                            {subscribeStatus === 'success' ? (
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 flex items-start gap-3">
                                    <i className="fas fa-check-circle mt-0.5 text-base shrink-0"></i>
                                    <div className="text-start">
                                        <p className="text-xs font-bold">{isAr ? 'تم الاشتراك بنجاح!' : 'Subscription Successful!'}</p>
                                        <p className="text-[10px] mt-0.5 opacity-90">{subscribeMessage || (isAr ? 'شكرًا لك على الاشتراك في نشرتنا الإخبارية.' : 'Thank you for subscribing to our newsletter.')}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2 text-start">
                                        <label htmlFor="sub-email" className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                            {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                                        </label>
                                        <input
                                            id="sub-email"
                                            type="email"
                                            required
                                            value={subscribeEmail}
                                            onChange={(e) => setSubscribeEmail(e.target.value)}
                                            placeholder={isAr ? 'name@example.com' : 'name@example.com'}
                                            disabled={subscribeStatus === 'loading'}
                                            className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:opacity-50 transition-all"
                                        />
                                    </div>

                                    {subscribeStatus === 'error' && (
                                        <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-650 dark:text-red-400 rounded-2xl border border-red-100 dark:border-red-900/50 flex items-start gap-2.5">
                                            <i className="fas fa-exclamation-circle mt-0.5 text-sm shrink-0"></i>
                                            <span className="text-[11px] leading-snug text-start">{subscribeMessage}</span>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSubscribeModalOpen(false);
                                                setSubscribeEmail('');
                                                setSubscribeStatus('idle');
                                                setSubscribeMessage('');
                                            }}
                                            className="flex-1 py-3 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs transition-all"
                                            disabled={subscribeStatus === 'loading'}
                                        >
                                            {isAr ? 'إلغاء' : 'Cancel'}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={subscribeStatus === 'loading'}
                                            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {subscribeStatus === 'loading' && (
                                                <i className="fas fa-spinner animate-spin"></i>
                                            )}
                                            {isAr ? 'اشترك الآن' : 'Subscribe Now'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {/* 4. SHARE MODAL */}
            {shareModalOpen && shareItem && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
                    <div className="bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-200 dark:border-zinc-800 w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
                        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/30">
                            <h2 className="text-sm font-black text-zinc-950 dark:text-white uppercase tracking-wider">
                                {isAr ? 'مشاركة الرابط' : 'Share link'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShareModalOpen(false);
                                    setShareItem(null);
                                    setCopied(false);
                                }}
                                className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-350 transition-colors"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-6 flex flex-col items-center">
                            {/* Link Preview Card */}
                            <div className="w-full bg-zinc-900 text-white p-6 rounded-[24px] flex flex-col items-center justify-center shadow-inner mb-6 text-center border border-zinc-800">
                                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-2 mb-4 shadow-md overflow-hidden shrink-0">
                                    {shareItem.image ? (
                                        <img
                                            src={getMediaUrl(shareItem.image)}
                                            alt=""
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    ) : (
                                        <i className="fa-solid fa-link text-[#1a66ff] text-2xl"></i>
                                    )}
                                </div>
                                <h3 className="text-base font-black truncate max-w-full px-2">
                                    {shareItem.title}
                                </h3>
                                <p className="text-[10px] text-zinc-400 mt-1 truncate max-w-full px-4 select-all">
                                    {getShareUrl(shareItem)}
                                </p>
                            </div>

                            {/* Share Targets Horizontal Row */}
                            <div className="w-full overflow-x-auto no-scrollbar pb-2 pt-1">
                                <div className="flex gap-4.5 px-2 justify-start md:justify-center min-w-max">
                                    {/* Copy Link */}
                                    <button
                                        onClick={handleCopyLink}
                                        className="flex flex-col items-center gap-2 group focus:outline-none"
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-base transition-all shadow-md shrink-0 ${copied
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200'
                                            }`}>
                                            {copied ? (
                                                <i className="fas fa-check animate-scale-up"></i>
                                            ) : (
                                                <i className="fas fa-link"></i>
                                            )}
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">
                                            {copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'Copy link' : 'Copy link')}
                                        </span>
                                    </button>

                                    {/* Twitter / X */}
                                    <a
                                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl(shareItem))}&text=${encodeURIComponent(shareItem.title)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-black hover:bg-zinc-900 text-white flex items-center justify-center text-lg transition-all shadow-md shrink-0">
                                            <i className="fab fa-x-twitter"></i>
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">
                                            X
                                        </span>
                                    </a>

                                    {/* Facebook */}
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl(shareItem))}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-lg transition-all shadow-md shrink-0">
                                            <i className="fab fa-facebook-f"></i>
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">
                                            Facebook
                                        </span>
                                    </a>

                                    {/* WhatsApp */}
                                    <a
                                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareItem.title + ': ' + getShareUrl(shareItem))}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center text-lg transition-all shadow-md shrink-0">
                                            <i className="fab fa-whatsapp"></i>
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">
                                            WhatsApp
                                        </span>
                                    </a>

                                    {/* LinkedIn */}
                                    <a
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl(shareItem))}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center text-lg transition-all shadow-md shrink-0">
                                            <i className="fab fa-linkedin-in"></i>
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">
                                            LinkedIn
                                        </span>
                                    </a>

                                    {/* Email */}
                                    <a
                                        href={`mailto:?subject=${encodeURIComponent(shareItem.title)}&body=${encodeURIComponent(getShareUrl(shareItem))}`}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-lg transition-all shadow-md shrink-0">
                                            <i className="fas fa-envelope"></i>
                                        </div>
                                        <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">
                                            {isAr ? 'البريد الإلكتروني' : 'Email'}
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
