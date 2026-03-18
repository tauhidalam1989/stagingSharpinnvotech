import Image from "next/image";

import { getDictionary, Locale } from "@/lib/get-dictionary";
import Breadcrumbs from "@/components/Breadcrumbs";
import Link from "next/link";

export default async function CareersPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const whyChooseUsPoints = [
        { title: dict.career.why_choose_us_points.point1_title, desc: dict.career.why_choose_us_points.point1_description, icon: 'lightbulb' },
        { title: dict.career.why_choose_us_points.point2_title, desc: dict.career.why_choose_us_points.point2_description, icon: 'graduation-cap' },
        { title: dict.career.why_choose_us_points.point3_title, desc: dict.career.why_choose_us_points.point3_description, icon: 'globe' },
        { title: dict.career.why_choose_us_points.point4_title, desc: dict.career.why_choose_us_points.point4_description, icon: 'users' },
        { title: dict.career.why_choose_us_points.point5_title, desc: dict.career.why_choose_us_points.point5_description, icon: 'home' },
    ];

    return (
        <div className="flex flex-col w-full min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Breadcrumbs lang={lang} dict={dict} items={[{ label: dict.FOOTER?.CAREER || (lang === 'ar' ? 'الوظائف' : 'Careers') }]} />
            {/* Hero */}
            <section className="py-12 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16 text-center">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 tracking-tight text-blue-600">
                        {dict.career.careers_title}
                    </h1>
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 max-w-2xl mx-auto">
                        {dict.career.careers_intro}
                    </p>
                </div>
            </section>

            {/* Intro Section */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative">
                            <div className="aspect-[16/10] lg:aspect-[4/3] rounded-[32px] overflow-hidden shadow-2xl">
                                <Image
                                    src="/img/career.png"
                                    alt="Join our team"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl -z-10" />
                        </div>
                        <div className="space-y-6">
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                                {dict.career.careers_description}
                            </p>
                            <div className="h-2 w-20 bg-blue-600 rounded-full" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-12 md:py-16 bg-zinc-100 dark:bg-zinc-900/50">
                <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4">{dict.career.why_choose_us_title}</h2>
                        <p className="text-base text-zinc-600 dark:text-zinc-400">{dict.career.why_choose_us_description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {whyChooseUsPoints.map((point, i) => (
                            <div key={i} className="bg-white dark:bg-zinc-900 p-7 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl group">
                                <div className="h-14 w-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                    <i className={`fas fa-${point.icon} text-xl`} />
                                </div>
                                <h3 className="text-lg font-bold mb-3">{point.title}</h3>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{point.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Opportunities & Offer */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Opportunities */}
                        <div>
                            <h3 className="text-2xl md:text-3xl font-black mb-6">{dict.career.opportunities_title}</h3>
                            <p className="text-base text-zinc-500 mb-8">{dict.career.opportunities_description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.values(dict.career.opportunities_list).map((role: any, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                        <i className="fas fa-check-circle text-blue-600 shrink-0" />
                                        <span className="font-bold text-xs md:text-sm tracking-tight">{role}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* What we offer */}
                        <div>
                            <h3 className="text-2xl md:text-3xl font-black mb-6">{dict.career.what_we_offer_title}</h3>
                            <div className="space-y-4 pt-2">
                                {Object.values(dict.career.what_we_offer_list).map((offer: any, i) => (
                                    <div key={i} className="flex items-center gap-4 text-base md:text-lg">
                                        <div className="h-9 w-9 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
                                            <i className="fas fa-star text-xs" />
                                        </div>
                                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">{offer}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-12 md:py-16 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
                <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16 text-center max-w-3xl">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-black mb-6 text-[#141d72] dark:text-blue-400">{dict.career.join_us_title}</h3>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                        {dict.career.join_us_description}
                    </p>
                    <div className="mb-8">
                        <a href="mailto:hr@sharpinnovations.com" className="text-xl md:text-2xl font-black text-blue-600 hover:underline">
                            hr@sharpinnovations.com
                        </a>
                    </div>

                    <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
                        <p className="text-base md:text-lg text-zinc-600 dark:text-zinc-400 font-medium italic">
                            {lang === 'ar'
                                ? 'ألا تجد الدور المناسب؟ نود أن نسمع منك. أرسل سيرتك الذاتية إلى hr@sharpinnovations.com وأخبرنا كيف يمكنك المساهمة في مهمتنا.'
                                : "Can't find the right role? We'd still love to hear from you. Send your resume to hr@sharpinnovations.com and let us know how you can contribute to our mission."
                            }
                        </p>
                    </div>
                </div>
            </section>

            {/* Closing */}
            <section className="py-12 md:py-16 bg-blue-600 text-white text-center">
                <div className="container mx-auto px-6 md:px-10 lg:px-12 xl:px-16 max-w-4xl">
                    <h3 className="text-3xl md:text-5xl font-black mb-6 rotate-[-1deg]">{dict.career.closing_statement}</h3>
                    <p className="text-lg md:text-2xl !text-white opacity-90">{dict.career.closing_description}</p>
                </div>
            </section>
        </div>
    );
}
