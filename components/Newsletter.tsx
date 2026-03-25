'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Locale } from '@/lib/get-dictionary';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Newsletter({ lang, dict }: { lang: Locale; dict: any }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) return;

        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(dict.NEWSLETTER?.SUCCESS || 'Thank you for subscribing!');
                setEmail('');
                // Reset success message after 5 seconds
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
                setMessage(data.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network error. Please check your connection.');
        }
    };

    return (
        <section
            className="newsletter bg-primary relative overflow-hidden py-5"
            style={{
                backgroundColor: '#0d6efd',
            }}
        >
            <div className="container mx-auto px-4 relative">
                <div
                    className="absolute inset-0 z-0 opacity-100 pointer-events-none"
                    style={{
                        backgroundImage: 'url("/img/bg-hero.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
                <div className="row flex flex-wrap items-center">
                    {/* Image Section - col-md-5 */}
                    <div className="w-full md:w-5/12 ps-lg-0 pt-5 pt-md-0 text-start wow fadeIn" data-wow-delay="0.3s">
                        <Image
                            src="/img/our_team.svg"
                            alt="Newsletter Image"
                            width={500}
                            height={400}
                            className="img-fluid h-auto max-w-full object-contain"
                            priority
                        />
                    </div>

                    {/* Text and Form Section - col-md-7 */}
                    <div
                        className="w-full md:w-7/12 py-5 newsletter-text wow fadeIn flex flex-col items-start"
                        data-wow-delay="0.5s"
                    >
                        <div className="inline-block w-fit border rounded-full text-white px-3 py-1 mb-3 text-sm font-medium border-white/50 bg-transparent">
                            {dict.NEWSLETTER.TITLE}
                        </div>
                        <h1 className="text-white text-3xl md:text-4xl font-bold mb-4 text-left">
                            {dict.NEWSLETTER.SUBSCRIBE}
                        </h1>

                        <form className="w-full mt-3 mb-2" onSubmit={handleSubmit}>
                            <div className="relative w-full max-w-2xl">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={dict.NEWSLETTER.PLACEHOLDER}
                                    className="form-control border-0 rounded-full w-full ps-4 pe-14 bg-white text-zinc-900 focus:outline-none disabled:opacity-70"
                                    style={{ height: '48px' }}
                                    required
                                    disabled={status === 'loading'}
                                    suppressHydrationWarning={true}
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="btn shadow-none absolute top-1 end-2 p-0 flex items-center rounded-full justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white transition-all w-[40px] h-[40px]"
                                    suppressHydrationWarning={true}
                                >
                                    {status === 'loading' ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <i className="fa fa-paper-plane text-xl" />
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Feedback Messages */}
                        <div className="min-h-[24px] mt-2">
                            {status === 'success' && (
                                <div className="flex items-center gap-2 text-green-100 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                    {message}
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="flex items-center gap-2 text-red-100 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                                    <AlertCircle className="w-4 h-4" />
                                    {message}
                                </div>
                            )}
                        </div>

                        <small className="text-white opacity-70 mt-4 block italic text-left">
                            {dict.NEWSLETTER.FOOTER_TEXT}
                        </small>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (min-width: 992px) {
                    .newsletter-text {
                        padding-right: calc(((100% - 960px) / 2) + .75rem);
                    }
                }
                @media (min-width: 1200px) {
                    .newsletter-text {
                        padding-right: calc(((100% - 1140px) / 2) + .75rem);
                    }
                }
                @media (min-width: 1400px) {
                    .newsletter-text {
                        padding-right: calc(((100% - 1320px) / 2) + .75rem);
                    }
                }
            `}</style>
        </section>
    );
}
