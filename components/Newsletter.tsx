'use client'

import Image from 'next/image';
import { Locale } from '@/lib/get-dictionary';

export default function Newsletter({ lang, dict }: { lang: Locale; dict: any }) {
    return (
        <section
            className="newsletter bg-primary relative overflow-hidden py-5"
            style={{
                backgroundColor: '#0d6efd',
                backgroundImage: 'url(/img/bg-hero.png)',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
            }}
        >
            <div className="container mx-auto px-4">
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

                        <form className="w-full mt-3 mb-2" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative w-full max-w-2xl">
                                <input
                                    type="email"
                                    placeholder={dict.NEWSLETTER.PLACEHOLDER}
                                    className="form-control border-0 rounded-full w-full ps-4 pe-12 bg-white text-zinc-900 focus:outline-none"
                                    style={{ height: '48px' }}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="btn shadow-none absolute top-1 end-2 p-0 flex items-center justify-center bg-white hover:scale-110 transition-transform"
                                    style={{ width: '40px', height: '40px' }}
                                >
                                    <i className="fa fa-paper-plane text-primary text-xl" />
                                </button>
                            </div>
                        </form>
                        <small className="text-white opacity-50 mt-2 block italic text-left">
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
